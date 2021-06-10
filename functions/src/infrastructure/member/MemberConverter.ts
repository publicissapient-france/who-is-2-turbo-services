import { Gender, Member } from '../../domain/model/Member';
import { firestore } from 'firebase-admin/lib/firestore';
import FirestoreDataConverter = firestore.FirestoreDataConverter;

export class MemberConverter implements FirestoreDataConverter<Member> {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): Member {
    return {
      id: snapshot.id,
      createdAt: snapshot.createTime.toDate(),
      firstName: snapshot.get('firstName'),
      firstName_unaccent: snapshot.get('firstName_unaccent'),
      lastName: snapshot.get('lastName'),
      gender: Gender[snapshot.get('gender') as keyof typeof Gender],
      picture: snapshot.get('picture'),
      score: snapshot.get('score'),
      email: snapshot.get('email'),
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
    const { firstName, lastName, gender, picture, score } = modelObject;
    return {
      firstName,
      lastName,
      gender: gender ? Gender[gender] : undefined,
      picture,
      score,
    };
  }
}
