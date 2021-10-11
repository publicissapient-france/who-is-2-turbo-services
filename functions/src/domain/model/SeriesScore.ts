import { ScoreResult } from '../../../lib/domain/model/Member';

export type SeriesScore = {
  solutions: number[];
  previousBestScore?: ScoreResult;
  currentScore: ScoreResult;
  betterScoresInLeaderboard: number;
};
