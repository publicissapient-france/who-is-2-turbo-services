import { StorageMeta } from './StorageMeta';
import { Gender } from './Gender';
import { Role } from './Role';

export type Member = StorageMeta & {
  firstName: string;
  firstName_unaccent: string;
  lastName: string;
  email: string;
  gender: Gender;
  picture?: string;
  pictureGallery?: string;
  pictureGame?: string;
  score?: Score;
  role?: Role;
  capability?: string;
  arrivalDate?: Date;
};

export type MemberWithPicture = Member & { picture: string };

export type MemberWithScore = MemberWithPicture & { score: Score };

export type MemberWithGameTypeScore = MemberWithPicture & { score: GameResult };

export type Score = { [id: string]: GameResult };

export type GameResult = {
  count: number;
  time: number;
};
