import { SeriesGameSession } from './model/SeriesGameSession';
import { ContentOf } from './model/StorageMeta';

export interface GameRepositorySpi {
  saveSeries(game: ContentOf<SeriesGameSession>): Promise<SeriesGameSession>;

  fetchSeries(id: string): Promise<SeriesGameSession>;

  drop(id: string): void;

  deleteGames(): void;
}
