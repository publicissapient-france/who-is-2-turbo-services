import { SeriesGame } from './model/SeriesGame';
import { SeriesScore } from './model/SeriesScore';
import { Readable } from 'stream';

export interface GameApi {
  generateSeriesGame(size: number, nbPropositionsByQuestion: number): Promise<SeriesGame>;
  validateSeriesGame(gameId: string, answers: number[], email: string): Promise<SeriesScore>;
  readPicture(cypheredPictureRef: string): Promise<Readable>;
}
