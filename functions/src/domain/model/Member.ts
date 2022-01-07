import { StorageMeta } from './StorageMeta';
import { Gender } from './Gender';
import { Role } from './Role';
import { Capability } from './Capability';

export type Member = StorageMeta & {
  firstName: string;
  firstName_unaccent: string;
  lastName: string;
  email: string;
  gender: Gender;
  picture?: string;
  score?: Score;
  role?: Role;
  capability?: Capability;
  arrivalDate?: Date;
};

export type MemberWithPicture = Member & { picture: string };

export type MemberWithScore = Member & { score: Score };

export type MemberWithGameTypeScore = Member & { score: ScoreResult };

export type Score = { [id: string]: ScoreResult };

export type ScoreResult = {
  count: number;
  time: number;
};

export function isScoreBetter(score: ScoreResult, other: ScoreResult): boolean {
  const hasBetterCount = score.count > other.count;
  const hasSameCountButBetterTime = score.count === other.count && score.time < other.time;
  return hasBetterCount || hasSameCountButBetterTime;
}
