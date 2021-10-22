import { ScoreResult } from '../../../lib/domain/model/Member';

export type SeriesScore = {
  solutions: number[];
  previousBestScore: ScoreResult | undefined;
  currentScore: ScoreResult;
  betterScoresInLeaderboard: number;
};
