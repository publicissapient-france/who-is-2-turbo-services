import { GameResult } from './Member';

export type SeriesScore = {
  solutions: number[];
  score: GameResult;
  rank: number;
  bestScore?: GameResult;
  bestRank?: number;
};
