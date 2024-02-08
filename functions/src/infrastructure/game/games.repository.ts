import { GameRepositorySpi } from '../../domain/GameRepositorySpi';
import { SeriesGameSession } from '../../domain/model/SeriesGameSession';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SeriesGameSessionConverter } from './SeriesGameSessionConverter';
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
    console.log(documentSnapshot);
    if (!documentSnapshot.exists) {
      console.log('No such document!', id);
    }
    return {
      id: id,
      createdAt: documentSnapshot.createTime?.toDate(),
      readAt: documentSnapshot.readTime?.toDate(),
      solutions: documentSnapshot.get('solutions'),
    };
  }

  async saveSeries(game: ContentOf<SeriesGameSession>): Promise<SeriesGameSession> {
    const metadata = await this.gamesCollection.add(game);
    const documentSnapshot = await metadata.get();
    return {
      id: metadata.id,
      createdAt: documentSnapshot.createTime?.toDate(),
      readAt: documentSnapshot.readTime?.toDate(),
      solutions: documentSnapshot.get('solutions'),
    };
  }
}
