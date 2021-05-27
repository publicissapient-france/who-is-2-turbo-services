import { Member, MemberWithPicture } from './model/Member';

export interface MembersApi {
  fetchAll(): Promise<MemberWithPicture[]>;
  fetchLeaderboard(): Promise<Member[]>;
}
