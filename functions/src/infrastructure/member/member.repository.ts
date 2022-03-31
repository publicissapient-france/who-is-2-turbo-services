import { MemberRepositorySpi } from '../../domain/MemberRepositorySpi';
import { Injectable } from '@nestjs/common';
import {
  Member,
  MemberWithPicture,
  MemberWithScore,
  Score,
  GameResult,
} from '../../domain/model/Member';
import * as admin from 'firebase-admin';
import { MemberConverter } from './MemberConverter';
import { firestore } from 'firebase-admin/lib/firestore';
import { Profile } from '../../domain/model/Profile';
import { GameType } from '../../domain/model/GameType';
import { Role } from '../../domain/model/Role';
import QuerySnapshot = firestore.QuerySnapshot;
import Firestore = firestore.Firestore;
import CollectionReference = firestore.CollectionReference;
import FieldValue = firestore.FieldValue;
import sharp from 'sharp';
import { Capability } from '../../domain/model/Capability';
import uuid from "short-uuid";

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

  async updateProfile(profile: Profile): Promise<void> {
    const memberWithPictureDocs = await this.getMemberWithPictureByEmail(profile.email);

    await this.membersCollection.doc(memberWithPictureDocs.id).update({
      id: memberWithPictureDocs.id,
      firstName: profile.firstName,
      firstName_unaccent: profile.firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      lastName: profile.lastName,
      gender: profile.gender,
      capability: profile.capability && Capability[profile.capability],
      picture: memberWithPictureDocs.picture,
      arrivalDate: profile.arrivalDate,
    });
    await this.updatePicture(
      memberWithPictureDocs.id,
      memberWithPictureDocs.picture,
      profile.pictureBase64,
    );
  }

  private async updatePicture(id: string, fileName: string, pictureBase64?: string) {
    if (pictureBase64 != undefined) {
      await this.deleteImage(fileName);
      const newFileName = await this.addImage(fileName, pictureBase64);
      await this.membersCollection.doc(id).update({
        picture: newFileName,
        pictureGallery: uuid.generate(),
        pictureGame: uuid.generate(),
      });
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
      const {
        pictureGallery,
        firstName,
        lastName,
        capability,
        arrivalDate
      } = doc.data() as MemberWithPicture;
      gallery.push({
        firstName,
        lastName,
        picture: `/members/pictures/${pictureGallery}`,
        capability: capability && Capability[capability],
        arrivalDate,
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

  async getMemberScore(email: string, gameType: GameType): Promise<GameResult | undefined> {
    const docs = await this.membersCollection
      .where('email', '==', email)
      .where(`score.${gameType}`, '!=', '')
      .get();

    if (docs.docs.length != 0) {
      const { score } = docs.docs[0].data() as Member;
      return score ? score[`${gameType}`] : undefined;
    } else return undefined;
  }

  async getRank(gameResult: GameResult, gameType: GameType): Promise<number> {
    const membersWithMorePoints = await this.membersCollection
      .where(`score.${gameType}.count`, '>', gameResult.count)
      .get();
    const membersWithBetterTime = await this.membersCollection
      .where(`score.${gameType}.count`, '==', gameResult.count)
      .where(`score.${gameType}.time`, '<', gameResult.time)
      .get();

    return membersWithMorePoints.docs.length + membersWithBetterTime.docs.length + 1;
  }

  async updateMemberScore(
    email: string,
    gameResult: GameResult,
    gameType: GameType,
  ): Promise<void> {
    const docs = await this.getMemberByMailDocs(email);
    if (docs.docs.length != 0) {
      const { id, score } = docs.docs[0].data() as Member;
      const updatedScore: Score = score ? { ...score } : {};
      updatedScore[`${gameType}`] = {
        count: gameResult.count,
        time: gameResult.time,
      };
      await this.membersCollection.doc(id).update({
        score: updatedScore,
      });
    }
  }

  private async getMemberByMailDocs(email: string): Promise<QuerySnapshot<Member>> {
    return await this.membersCollection.where('email', '==', email).get();
  }

  async getMembersScores(gameType: GameType): Promise<MemberWithScore[]> {
    const members = await this.membersCollection
      .orderBy(`score.${gameType}.count`, 'desc')
      .orderBy(`score.${gameType}.time`, 'asc')
      .get();
    const membersScore = members.docs
      .map((member) => member.data() as MemberWithScore)
      .filter((member) => member.score[`${gameType}`] != undefined);
    const leaderboard = [];
    for (const member of membersScore) {
      const { firstName, lastName, pictureGallery, score } = member as MemberWithScore;
      leaderboard.push({
        firstName,
        lastName,
        picture: pictureGallery ? `/members/pictures/${pictureGallery}` : undefined,
        score,
      } as MemberWithScore);
    }
    return leaderboard;
  }

  async deleteScores(): Promise<number> {
    const members = await this.membersCollection.where('score', '!=', '').get();
    await this.deleteScoreBatch(members);
    return members.size;
  }

  async getMemberRole(email: string): Promise<Role | undefined> {
    const docs = await this.getMemberByMailDocs(email);
    if (docs.docs.length != 0) {
      const { role } = docs.docs[0].data() as Member;
      return role;
    } else return undefined;
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
      capability: newProfile.capability && Capability[newProfile.capability],
      arrivalDate: newProfile.arrivalDate,
    } as MemberWithPicture;

    const { id } = await this.membersCollection.add(member);
    if (newProfile.pictureBase64 != undefined) {
      const fileName = await this.addImage(id, newProfile.pictureBase64);
      await this.membersCollection.doc(id).update({
        picture: fileName,
        pictureGallery: uuid.generate(),
        pictureGame: uuid.generate(),
      });
    }
    return id;
  }

  async addImage(id: string, picture: string): Promise<string> {
    const contentType = MemberRepository.base64MimeType(picture) || 'image/webp';
    const fileName = `${id}.${contentType.split('/')[1]}`;
    const file = await admin.storage().bucket().file(fileName);
    const fileOptions = {
      metadata: { contentType: contentType },
      validation: 'md5',
    };
    const pictureBase64 = picture.replace(/^data:\w+\/\w+;base64,/, '');
    const pictureBuffered = Buffer.from(pictureBase64, 'base64');
    const pictureResized = await sharp(pictureBuffered).resize(450, 600).webp().toBuffer();
    await file.save(pictureResized, fileOptions);
    return fileName;
  }

  async deleteImage(fileName: string) {
    const file = await admin.storage().bucket().file(fileName);
    await file.delete();
  }

  private static base64MimeType(encoded: string): string | undefined {
    let result;
    const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
      result = mime[1];
    }
    return result;
  }

  async findUserByGameGalleryToken(token: string): Promise<MemberWithPicture | undefined> {
    return this.findUserByPictureToken('pictureGame', token);
  }

  async findUserByPictureGalleryToken(token: string): Promise<MemberWithPicture | undefined> {
    return this.findUserByPictureToken('pictureGallery', token);
  }

  private async findUserByPictureToken(tokenName: string, token: string) {
    const members = (await this.membersCollection.where(tokenName, '==', token).limit(1).get())
      .docs
      .map((member) => member.data() as MemberWithPicture);
    if (members.length) {
      return members[0];
    }
    return undefined;
  }
}
