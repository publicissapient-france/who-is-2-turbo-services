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

export type MemberWithGameTypeScore = Member & { score: GameResult };

export type Score = { [id: string]: GameResult };

export type GameResult = {
  count: number;
  time: number;
};
