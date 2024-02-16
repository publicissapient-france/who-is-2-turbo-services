import { GameType } from './GameType';
import { StorageMeta } from './StorageMeta';

export type SeriesGameSession = Partial<StorageMeta> & {
  solutions: number[];
  gameType: GameType;
};
