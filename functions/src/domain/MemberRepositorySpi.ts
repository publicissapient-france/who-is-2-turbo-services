import { MemberWithPicture, MemberWithScore } from './model/Member';
import { Profile } from './model/Profile';

export interface MemberRepositorySpi {
  getAllWithPicture(): Promise<MemberWithPicture[]>;
  generatePrivatePictureUrl(pictureName: string): Promise<string>;

  loadGalleryMembers(): Promise<MemberWithPicture[]>;

  getMemberScore(email: string): Promise<number | undefined>;
  updateMemberScore(email: string, score: number): void;
  getMembersScores(): Promise<MemberWithScore[]>;

  addProfile(newProfile: Profile): Promise<string>;
  getMemberWithPictureByEmail(email: string): Promise<MemberWithPicture>;
  updateProfile(me: Profile): void;
}
