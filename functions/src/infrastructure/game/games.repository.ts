import { GameRepositorySpi } from '../../domain/GameRepositorySpi';
import { SeriesGameSession } from '../../domain/model/SeriesGameSession';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ContentOf } from '../../domain/model/StorageMeta';
import { SeriesGameSessionConverter } from './SeriesGameSessionConverter';

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
