import { MemberRepositorySpi } from '../../domain/MemberRepositorySpi';
import { Injectable } from '@nestjs/common';
import { Member, MemberWithPicture } from '../../domain/model/Member';
import * as admin from 'firebase-admin';
import { MemberConverter } from './MemberConverter';

@Injectable()
export class MemberRepository implements MemberRepositorySpi {
  membersCollection = admin.firestore().collection('members').withConverter(new MemberConverter());

  async getAllWithPicture(): Promise<MemberWithPicture[]> {
    const membersWithPictures = await this.membersCollection.where('picture', '!=', '').get();
    return membersWithPictures.docs.map((member) => member.data() as MemberWithPicture);
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
        picture,
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

  private async getMemberByMailDocs(email: string) {
    return await this.membersCollection.where('email', '==', email).get();
  }
}
