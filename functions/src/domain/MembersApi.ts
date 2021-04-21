import { Member } from './model/Member';

export interface MembersApi {
  preload(): void;

  loadGallery(): Promise<Member[]>;
}
