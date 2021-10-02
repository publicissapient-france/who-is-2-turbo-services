import { SeriesGame } from './model/SeriesGame';
import { SeriesScore } from './model/SeriesScore';
import { GameType } from './model/GameType';

export interface GameApi {
  generateGameFromGameType(gameType: GameType): Promise<SeriesGame>;

  validateSeriesGame(
    gameId: string,
    answers: number[],
    email: string,
    resultDate: Date,
  ): Promise<SeriesScore>;
}
