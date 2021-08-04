import { SeriesGame } from './model/SeriesGame';
import { SeriesScore } from './model/SeriesScore';
import { GameTypeDto } from '../application/game/model/GameTypeDto';

export interface GameApi {
  generateGameFromGameType(gameTypeDto: GameTypeDto): Promise<SeriesGame>;

  validateSeriesGame(gameId: string, answers: number[], email: string): Promise<SeriesScore>;
}
