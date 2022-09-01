import { Member } from '../../domain/model/Member';
import { firestore } from 'firebase-admin/lib/firestore';
import { Gender } from '../../domain/model/Gender';
import FirestoreDataConverter = firestore.FirestoreDataConverter;

export class MemberConverter implements FirestoreDataConverter<Member> {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): Member {
    return {
      id: snapshot.id,
      createdAt: snapshot.createTime.toDate(),
      firstName: snapshot.get('firstName'),
      lastName: snapshot.get('lastName'),
      gender: Gender[snapshot.get('gender') as keyof typeof Gender],
      picture: snapshot.get('picture'),
      pictureGallery: snapshot.get('pictureGallery'),
      pictureGame: snapshot.get('pictureGame'),
      score: snapshot.get('score'),
      role: snapshot.get('role'),
      capability: snapshot.get('capability'),
      arrivalDate: snapshot.get('arrivalDate'),
    } as unknown as Member;
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
    const {
      firstName,
      lastName,
      gender,
      picture,
      score,
      email,
      firstName_unaccent,
      role,
      capability,
      arrivalDate,
    } = modelObject;
    return {
      firstName,
      lastName,
      gender: gender ? Gender[gender] : undefined,
      picture,
      score,
      email,
      firstName_unaccent,
      role,
      capability,
      arrivalDate,
    };
  }
}
