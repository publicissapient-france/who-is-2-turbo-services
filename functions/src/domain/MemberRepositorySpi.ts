import { Member, MemberWithPicture } from './model/Member';

export interface MemberRepositorySpi {
  getAllWithPicture(): Promise<MemberWithPicture[]>;
  generatePrivatePictureUrl(pictureName: string): Promise<string>;

  loadGalleryMembers(offset: number, limit: number): Promise<Member[]>;
}
