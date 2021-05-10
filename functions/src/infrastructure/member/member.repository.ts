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

  async incrementScoreForMember(newPoints: number, email: string) {
    const docs = await this.membersCollection.where('email', '==', email).get();
    const { id, score } = docs.docs[0].data() as Member;

    await this.membersCollection.doc(id).update({
      score: newPoints + (score ?? 0),
    });
  }
}
