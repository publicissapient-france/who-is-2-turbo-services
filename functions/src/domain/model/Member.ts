import { StorageMeta } from './StorageMeta';

export type Member = StorageMeta & {
  firstName: string;
  lastName: string;
  gender: Gender;
  picture?: string;
  score?: number;
};

export type MemberWithPicture = Member & { picture: string };

export enum Gender {
  MALE,
  FEMALE,
}
