import { MemberRepositorySpi } from '../../domain/MemberRepositorySpi';
import { Injectable } from '@nestjs/common';
import { Member, MemberWithPicture, MemberWithScore, Score } from '../../domain/model/Member';
import * as admin from 'firebase-admin';
import { MemberConverter } from './MemberConverter';
import { firestore } from 'firebase-admin/lib/firestore';
import { Profile } from '../../domain/model/Profile';
import { GameType } from '../../domain/model/GameType';
import QuerySnapshot = firestore.QuerySnapshot;
import Firestore = firestore.Firestore;
import CollectionReference = firestore.CollectionReference;
import FieldValue = firestore.FieldValue;

export class UserNotFoundError {
  readonly message: string;
  readonly code: string;

  constructor() {
    this.message = 'NOT FOUND';
    this.code = 'NOTFOUND';
  }
}

export class UserAlreadyExistsError {
  readonly message: string;
  readonly code: string;

  constructor() {
    this.message = 'ALREADY EXISTS';
    this.code = 'CONFLICT';
  }
}

@Injectable()
export class MemberRepository implements MemberRepositorySpi {
  constructor() {
    this.firebase = admin.firestore();
    this.firebase.settings({ ignoreUndefinedProperties: true });
    this.membersCollection = this.firebase
      .collection('members')
      .withConverter(new MemberConverter());
  }

  readonly firebase: Firestore;
  readonly membersCollection: CollectionReference<Member>;

  async getAllWithPicture(): Promise<MemberWithPicture[]> {
    const membersWithPictures = await this.membersCollection.where('picture', '!=', '').get();
    return membersWithPictures.docs.map((member) => member.data() as MemberWithPicture);
  }

  async getMemberWithPictureByEmail(email: string): Promise<MemberWithPicture> {
    const memberWithPictureDocs = await this.membersCollection.where('email', '==', email).get();
    if (!memberWithPictureDocs.docs.length) {
      throw new UserNotFoundError();
    }
    return memberWithPictureDocs.docs[0].data() as MemberWithPicture;
  }

  async updateProfile(profile: Profile) {
    const memberWithPictureDocs = await this.getMemberWithPictureByEmail(profile.email);

    await this.membersCollection.doc(memberWithPictureDocs.id).update({
      id: memberWithPictureDocs.id,
      firstName: profile.firstName,
      firstName_unaccent: profile.firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      lastName: profile.lastName,
      gender: profile.gender,
      picture: memberWithPictureDocs.picture,
    });
    await this.updatePicture(
      memberWithPictureDocs.id,
      memberWithPictureDocs.picture,
      profile.pictureBase64,
    );
  }

  private async updatePicture(id: string, fileName: string, pictureBase64: string) {
    if (pictureBase64 != undefined) {
      await this.deleteImage(fileName);
      await this.addImage(id, pictureBase64);
      await this.membersCollection.doc(id).update({ picture: id });
    }
  }

  async loadGalleryMembers(): Promise<MemberWithPicture[]> {
    const documents = await this.membersCollection
      .orderBy('firstName_unaccent')
      .orderBy('lastName')
      .orderBy('picture')
      .get();

    const gallery = [];
    for (const doc of documents.docs) {
      const { picture, firstName, lastName } = doc.data() as MemberWithPicture;
      gallery.push({
        firstName,
        lastName,
        picture: await this.generatePrivatePictureUrl(picture),
      } as MemberWithPicture);
    }
    return gallery;
  }

  async generatePrivatePictureUrl(pictureFile: string): Promise<string> {
    const file = await admin.storage().bucket().file(pictureFile);
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000,
    });
    return url;
  }

  async getMemberScoreByGameType(email: string, gameType: GameType): Promise<number> {
    const docs = await this.getMemberByMailDocs(email);
    if (docs.docs.length != 0) {
      const { score } = docs.docs[0].data() as Member;
      return score ? score[gameType.valueOf()] : 0;
    } else return 0;
  }

  async updateMemberScore(email: string, gameScore: number, gameType: GameType) {
    const docs = await this.getMemberByMailDocs(email);
    if (docs.docs.length != 0) {
      const { id, score } = docs.docs[0].data() as Member;
      const updatedScore: Score = score ? { ...score } : {};
      updatedScore[gameType.valueOf()] = gameScore;
      await this.membersCollection.doc(id).update({
        score: updatedScore,
      });
    }
  }

  private async getMemberByMailDocs(email: string): Promise<QuerySnapshot<Member>> {
    return await this.membersCollection.where('email', '==', email).get();
  }

  async getMembersScores(gameType: GameType): Promise<MemberWithScore[]> {
    const members = await this.membersCollection.where('score', '!=', '').get();
    const membersScore = members.docs.map((member) => member.data() as MemberWithScore);
    return membersScore.filter((member) => member.score[gameType] != undefined);
  }

  async deleteScores(): Promise<number> {
    const members = await this.membersCollection.where('score', '!=', '').get();
    await this.deleteScoreBatch(members);
    return members.size;
  }

  async deleteScoreBatch(members: FirebaseFirestore.QuerySnapshot<Member>): Promise<void> {
    const batchSize = members.size;
    if (batchSize === 0) {
      return;
    }

    const batch = this.firebase.batch();
    members.docs.forEach((doc) => {
      batch.update(doc.ref, { score: FieldValue.delete() });
    });
    await batch.commit();

    process.nextTick(() => {
      this.deleteScoreBatch(members);
    });
  }

  async addProfile(newProfile: Profile): Promise<string> {
    const memberWithPictureDocs = await this.membersCollection
      .where('email', '==', newProfile.email)
      .get();
    if (memberWithPictureDocs.docs.length) {
      throw new UserAlreadyExistsError();
    }

    const member = {
      firstName: newProfile.firstName,
      firstName_unaccent: newProfile.firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      lastName: newProfile.lastName,
      email: newProfile.email,
      gender: newProfile.gender,
    } as MemberWithPicture;

    const { id } = await this.membersCollection.add(member);
    if (newProfile.pictureBase64 != undefined) {
      await this.addImage(id, newProfile.pictureBase64);
      await this.membersCollection.doc(id).update({ picture: id });
    }
    return id;
  }

  async addImage(fileName: string, picture: string) {
    const file = await admin.storage().bucket().file(fileName);
    const fileOptions = {
      metadata: { contentType: MemberRepository.base64MimeType(picture) || 'image/webp' },
      validation: 'md5',
    };

    const base64EncodedString = picture.replace(/^data:\w+\/\w+;base64,/, '');
    const fileBuffer = Buffer.from(base64EncodedString, 'base64');
    await file.save(fileBuffer, fileOptions);
  }

  async deleteImage(fileName: string) {
    const file = await admin.storage().bucket().file(fileName);
    file.delete();
  }

  private static base64MimeType(encoded: string): string | undefined {
    let result;
    const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
      result = mime[1];
    }
    return result;
  }
}
