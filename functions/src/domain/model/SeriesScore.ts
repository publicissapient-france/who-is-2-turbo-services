import { ScoreResult } from './Member';

export type SeriesScore = {
  solutions: number[];
  score: ScoreResult;
  rank: number;
  bestScore?: ScoreResult;
  bestRank?: number;
};
