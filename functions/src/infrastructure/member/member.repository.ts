import { MemberRepositorySpi } from '../../domain/MemberRepositorySpi';
import { Injectable } from '@nestjs/common';
import { Gender, Member, MemberWithPicture } from '../../domain/model/Member';
import * as fs from 'fs';
import { firestore } from 'firebase-admin/lib/firestore';
import FirestoreDataConverter = firestore.FirestoreDataConverter;
import * as admin from 'firebase-admin';

@Injectable()
export class MemberRepository implements MemberRepositorySpi {
  membersCollection = admin.firestore().collection('members').withConverter(new MemberConverter());

  async getAllWithPicture(): Promise<MemberWithPicture[]> {
    const membersWithPictures = await this.membersCollection.where('picture', '!=', '').get();
    return membersWithPictures.docs.map((member) => member.data() as MemberWithPicture);
  }

  preload(): void {
    const membersCollection = admin.firestore().collection('members');
    fs.readFile('src/infrastructure/member/members.json', 'utf8', (err, fileContent) => {
      if (err) {
      } else {
        const data = JSON.parse(fileContent.toString());
        data.forEach((item: Member) => {
          membersCollection.add(item);
        });
      }
    });
  }

  async generatePrivatePictureUrl(pictureFile: string): Promise<string> {
    const file = await admin.storage().bucket().file(pictureFile);
    //return file.publicUrl();
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000,
    });
    return url;
  }
}

class MemberConverter implements FirestoreDataConverter<Member> {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): Member {
    return {
      id: snapshot.id,
      createdAt: snapshot.createTime.toDate(),
      firstName: snapshot.get('firstName'),
      lastName: snapshot.get('lastName'),
      gender: Gender[snapshot.get('gender') as keyof typeof Gender],
      picture: snapshot.get('picture'),
    };
  }

  toFirestore(modelObject: Member): FirebaseFirestore.DocumentData;
  toFirestore(
    modelObject: Partial<Member>,
    options: FirebaseFirestore.SetOptions,
  ): FirebaseFirestore.DocumentData;
  toFirestore(
    modelObject: Member | Partial<Member>,
    options?: FirebaseFirestore.SetOptions,
  ): FirebaseFirestore.DocumentData {
    const { firstName, lastName, gender, picture } = modelObject;
    return {
      firstName,
      lastName,
      gender: gender ? Gender[gender] : undefined,
      picture,
    };
  }
}
