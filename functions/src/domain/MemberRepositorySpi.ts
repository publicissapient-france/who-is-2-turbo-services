import { MemberWithPicture } from './model/Member';

export interface MemberRepositorySpi {
  getAllWithPicture(): Promise<MemberWithPicture[]>;
  generatePrivatePictureUrl(pictureName: string): Promise<string>;

  loadGalleryMembers(): Promise<MemberWithPicture[]>;

  getMemberScore(email: string): Promise<number | undefined>;
  updateMemberScore(email: string, score: number): void;
}
