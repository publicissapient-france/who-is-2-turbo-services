import { MemberRepositorySpi } from '../../domain/MemberRepositorySpi';
import { Injectable } from '@nestjs/common';
import { Member, MemberWithPicture, MemberWithScore } from '../../domain/model/Member';
import * as admin from 'firebase-admin';
import { MemberConverter } from './MemberConverter';
import { firestore } from 'firebase-admin/lib/firestore';
import QuerySnapshot = firestore.QuerySnapshot;
import Firestore = firestore.Firestore;
import CollectionReference = firestore.CollectionReference;

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

  async updateMember(member: MemberWithPicture) {
    const memberWithPictureDocs = await this.getMemberWithPictureByEmail(member.email);
    await this.deleteImage(member.picture);
    await this.addImage(member.id, member.picture);
    await this.membersCollection.doc(memberWithPictureDocs.id).update(member);
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

  async getMemberScore(email: string): Promise<number | undefined> {
    const docs = await this.getMemberByMailDocs(email);
    if (docs.docs.length != 0) {
      const { score } = docs.docs[0].data() as Member;
      return score ?? 0;
    } else return undefined;
  }

  async updateMemberScore(email: string, score: number) {
    const docs = await this.getMemberByMailDocs(email);
    if (docs.docs.length != 0) {
      const { id } = docs.docs[0].data() as Member;
      await this.membersCollection.doc(id).update({
        score: score,
      });
    }
  }

  private async getMemberByMailDocs(email: string): Promise<QuerySnapshot<Member>> {
    return await this.membersCollection.where('email', '==', email).get();
  }

  async getMembersScores(): Promise<MemberWithScore[]> {
    const members = await this.membersCollection.orderBy('score', 'desc').get();
    return members.docs.map((member) => member.data() as MemberWithScore);
  }

  async addMember(newMember: MemberWithPicture): Promise<string> {
    const memberWithPictureDocs = await this.membersCollection
      .where('email', '==', newMember.email)
      .get();
    if (memberWithPictureDocs.docs.length) {
      throw new UserAlreadyExistsError();
    }
    const { id } = await this.membersCollection.add(newMember);
    if (newMember.picture != undefined) {
      await this.addImage(id, newMember.picture);
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
