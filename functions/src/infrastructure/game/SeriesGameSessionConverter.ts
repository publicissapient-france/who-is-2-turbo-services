import { FirestoreDataConverter } from 'firebase-admin/firestore';
import { SeriesGameSession } from '../../domain/model/SeriesGameSession';

export class SeriesGameSessionConverter implements FirestoreDataConverter<SeriesGameSession> {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): SeriesGameSession {
    return {
      id: snapshot.id,
      solutions: snapshot.get('solutions'),
      gameType: snapshot.get('gameType'),
      createdAt: snapshot.createTime.toDate(),
    };
  }

  toFirestore(modelObject: SeriesGameSession): FirebaseFirestore.DocumentData;
  toFirestore(
    modelObject: Partial<SeriesGameSession>,
    options: FirebaseFirestore.SetOptions,
  ): FirebaseFirestore.DocumentData;
  toFirestore(
    modelObject: SeriesGameSession | Partial<SeriesGameSession>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: FirebaseFirestore.SetOptions,
  ): FirebaseFirestore.DocumentData {
    const { solutions, gameType } = modelObject;
    return { solutions, gameType };
  }
}
