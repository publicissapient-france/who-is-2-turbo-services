import { MemberWithPicture } from './model/Member';

export interface MemberRepositorySpi {
  getAllWithPicture(): Promise<MemberWithPicture[]>;

  preload(): void; // TODO to be removed
  generatePrivatePictureUrl(pictureName: string): Promise<string>;
}
