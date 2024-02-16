import { GameRepositorySpi } from '../../domain/GameRepositorySpi';
import { SeriesGameSession } from '../../domain/model/SeriesGameSession';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SeriesGameSessionConverter } from './SeriesGameSessionConverter';
import { ContentOf } from '../../domain/model/StorageMeta';
import { DocumentReference } from 'firebase-admin/firestore';

@Injectable()
export class GamesRepository implements GameRepositorySpi {
  firebase = admin.firestore();
  gamesCollection = admin
    .firestore()
    .collection('games')
    .withConverter(new SeriesGameSessionConverter());

  async drop(id: string): Promise<void> {
    await this.gamesCollection.doc(id).delete();
  }

  async fetchSeries(id: string): Promise<SeriesGameSession> {
    const updatedTime = (await this.gamesCollection.doc(id).update({ FINISHED: true })).writeTime;
    const documentSnapshot = await this.gamesCollection.doc(id).get();
    if (!documentSnapshot.exists) {
      console.log('No such document!', id);
    }
    return {
      id: id,
      createdAt: documentSnapshot.createTime?.toDate(),
      readAt: updatedTime.toDate(),
      solutions: documentSnapshot.get('solutions'),
      gameType: documentSnapshot.get('gameType'),
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
      gameType: documentSnapshot.get('gameType'),
    };
  }

  async deleteGames(): Promise<void> {
    const games = await this.gamesCollection.listDocuments();
    return this.deleteGamesBatch(games);
  }

  async deleteGamesBatch(
    games: DocumentReference<SeriesGameSession, admin.firestore.DocumentData>[],
  ): Promise<void> {
    const batchSize = games.length;
    if (batchSize === 0) {
      return;
    }

    const batch = this.firebase.batch();
    games.forEach((doc) => {
      batch.delete(doc);
    });
    await batch.commit();

    process.nextTick(() => {
      this.deleteGamesBatch(games);
    });
  }
}
