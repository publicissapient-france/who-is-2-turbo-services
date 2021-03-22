import { GameRepositorySpi } from '../../domain/GameRepositorySpi';
import { SeriesGameSession } from '../../domain/model/SeriesGameSession';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { firestore } from 'firebase-admin/lib/firestore';
import FirestoreDataConverter = firestore.FirestoreDataConverter;
import { ContentOf } from '../../domain/model/StorageMeta';

@Injectable()
export class GamesRepository implements GameRepositorySpi {
  gamesCollection = admin
    .firestore()
    .collection('games')
    .withConverter(new SeriesGameSessionConverter());

  async drop(id: string): Promise<void> {
    await this.gamesCollection.doc(id).delete();
  }

  async fetchSeries(id: string): Promise<SeriesGameSession> {
    const documentSnapshot = await this.gamesCollection.doc(id).get();

    if (!documentSnapshot.exists) {
      console.log('No such document!', id);
    }
    return {
      id: id,
      createdAt: documentSnapshot.get('createdAt'),
      solutions: documentSnapshot.get('solutions'),
    };
  }

  async saveSeries(game: ContentOf<SeriesGameSession>): Promise<SeriesGameSession> {
    const metadata = await this.gamesCollection.add(game);
    return { ...game, id: metadata.id };
  }
}

class SeriesGameSessionConverter implements FirestoreDataConverter<SeriesGameSession> {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): SeriesGameSession {
    return {
      id: snapshot.id,
      solutions: snapshot.get('solutions'),
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
    const { solutions } = modelObject;
    return { solutions };
  }
}
