import { MemberWithPicture, MemberWithScore } from './model/Member';

export interface MemberRepositorySpi {
  getAllWithPicture(): Promise<MemberWithPicture[]>;
  generatePrivatePictureUrl(pictureName: string): Promise<string>;

  loadGalleryMembers(): Promise<MemberWithPicture[]>;

  getMemberScore(email: string): Promise<number | undefined>;
  updateMemberScore(email: string, score: number): void;
  getMembersScores(): Promise<MemberWithScore[]>;

  addMember(newMember: MemberWithPicture): Promise<string>;
  getMemberWithPictureByEmail(email: string): Promise<MemberWithPicture>;
  updateMember(me: MemberWithPicture): void;
}
