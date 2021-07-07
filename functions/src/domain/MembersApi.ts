import { MemberWithPicture, MemberWithScore } from './model/Member';
import { ProfileDto } from '../application/members/model/ProfileDto';

export interface MembersApi {
  fetchAll(): Promise<MemberWithPicture[]>;

  fetchLeaderboard(): Promise<MemberWithScore[]>;

  createProfile(profileDto: ProfileDto): Promise<string>;
}
