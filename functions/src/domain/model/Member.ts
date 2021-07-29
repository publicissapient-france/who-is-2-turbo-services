import { StorageMeta } from './StorageMeta';
import { Gender } from './Gender';

export type Member = StorageMeta & {
  firstName: string;
  firstName_unaccent: string;
  lastName: string;
  email: string;
  gender: Gender;
  picture?: string;
  score?: number;
};

export type MemberWithPicture = Member & { picture: string };

export type MemberWithScore = Member & { score: number };
