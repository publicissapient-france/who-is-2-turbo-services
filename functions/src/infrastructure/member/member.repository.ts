import { MemberRepositorySpi } from '../../domain/MemberRepositorySpi';
import { Injectable } from '@nestjs/common';
import { MemberWithPicture } from '../../domain/model/Member';
import * as admin from 'firebase-admin';


@Injectable()
export class MemberRepository implements MemberRepositorySpi {
  membersCollection = admin.firestore().collection('members').withConverter(new MemberConverter());

  async getAllWithPicture(): Promise<MemberWithPicture[]> {
    const membersWithPictures = await this.membersCollection.where('picture', '!=', '').get();
    return membersWithPictures.docs.map((member) => member.data() as MemberWithPicture);
  }

  async loadGalleryMembers(offset: number, limit: number): Promise<MemberWithPicture[]> {
    const documents = await this.membersCollection
      .where('picture', '!=', '')
      .orderBy('picture')
      .orderBy('firstName')
      .orderBy('lastName')
      .offset(offset)
      .limit(limit)
      .get();
    const gallery: Member[] = [];
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
}

