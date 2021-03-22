import { SeriesGame } from './model/SeriesGame';
import { SeriesScore } from './model/SeriesScore';

export interface GameApi {
  generateSeriesGame(size: number, nbPropositionsByQuestion: number): Promise<SeriesGame>;

  validateSeriesGame(gameId: string, answers: number[]): Promise<SeriesScore>;

  preload(): void;
}
