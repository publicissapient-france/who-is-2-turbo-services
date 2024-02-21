import { GameType } from './model/GameType';
import { SeriesGame } from './model/SeriesGame';
import { SeriesScore } from './model/SeriesScore';

export interface GameApi {
  generateGameFromGameType(gameType: GameType): Promise<SeriesGame>;

  validateSeriesGame(gameId: string, answers: number[], email: string): Promise<SeriesScore>;
}
