import { MemberWithPicture, MemberWithScore } from './model/Member';
import { ProfileDto } from '../application/members/model/ProfileDto';
import { MeDto } from '../application/members/model/MeDto';
import { EditableProfileDto } from '../application/members/model/EditableProfileDto';

export interface MembersApi {
  fetchAll(): Promise<MemberWithPicture[]>;

  fetchLeaderboard(): Promise<MemberWithScore[]>;

  createProfile(profileDto: ProfileDto): Promise<string>;
  fetchProfile(meDto: MeDto): Promise<EditableProfileDto>;
  updateProfile(me: ProfileDto): void;
}
