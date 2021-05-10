import { MemberWithPicture } from './model/Member';

export interface MemberRepositorySpi {
  getAllWithPicture(): Promise<MemberWithPicture[]>;
  generatePrivatePictureUrl(pictureName: string): Promise<string>;

  loadGalleryMembers(): Promise<MemberWithPicture[]>;

  incrementScoreForMember(newPoints: number, email: string): void;
}
