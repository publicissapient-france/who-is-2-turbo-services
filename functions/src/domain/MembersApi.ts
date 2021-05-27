import { MemberWithPicture, MemberWithScore } from './model/Member';

export interface MembersApi {
  fetchAll(): Promise<MemberWithPicture[]>;
  fetchLeaderboard(): Promise<MemberWithScore[]>;
}
