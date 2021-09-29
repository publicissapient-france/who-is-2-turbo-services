import { StorageMeta } from './StorageMeta';
import { Gender } from './Gender';

export type Member = StorageMeta & {
  firstName: string;
  firstName_unaccent: string;
  lastName: string;
  email: string;
  gender: Gender;
  picture?: string;
  score?: Score;
};

export type MemberWithPicture = Member & { picture: string };

export type MemberWithScore = Member & { score: Score };

export type MemberWithGameTypeScore = Member & { score: number };

export type Score = { [id: string]: number };
