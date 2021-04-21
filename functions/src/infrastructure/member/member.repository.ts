import { MemberRepositorySpi } from '../../domain/MemberRepositorySpi';
import { Injectable } from '@nestjs/common';
import { Member, MemberWithPicture } from '../../domain/model/Member';
import * as admin from 'firebase-admin';


@Injectable()
export class MemberRepository implements MemberRepositorySpi {
  membersCollection = admin.firestore().collection('members').withConverter(new MemberConverter());

  async getAllWithPicture(): Promise<MemberWithPicture[]> {
    const membersWithPictures = await this.membersCollection.where('picture', '!=', '').get();
    return membersWithPictures.docs.map((member) => member.data() as MemberWithPicture);
  }

  async loadGalleryMembers(): Promise<Member[]> {
    const documents = await this.membersCollection.limit(10).get();
    const gallery: Member[] = [];
    for (const doc of documents.docs) {
      const member = doc.data() as Member;
      let image = undefined;
      if (member.picture != undefined) {
        image = await this.generatePrivatePictureUrl(member.picture);
      }
      gallery.push({
        firstName: member.firstName,
        lastName: member.lastName,
        picture: image,
      } as Member);
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

