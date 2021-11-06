import { ScoreResult } from './Member';

export type SeriesScore = {
  solutions: number[];
  previousBestScore?: ScoreResult;
  currentScore: ScoreResult;
  betterScoresInLeaderboard: number;
};
