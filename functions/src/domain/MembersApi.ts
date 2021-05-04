import { MemberWithPicture } from './model/Member';

export interface MembersApi {
  fetchAll(offset: number, limit: number): Promise<MemberWithPicture[]>;
}
