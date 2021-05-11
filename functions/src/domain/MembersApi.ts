import { MemberWithPicture } from './model/Member';

export interface MembersApi {
  fetchAll(): Promise<MemberWithPicture[]>;
}
