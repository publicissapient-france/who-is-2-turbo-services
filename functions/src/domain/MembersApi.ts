import { Member } from './model/Member';

export interface MembersApi {
  preload(): void;

  loadGallery(offset: number, limit: number): Promise<Member[]>;
}
