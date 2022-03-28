import { MemberWithGameTypeScore, MemberWithPicture } from './model/Member';
import { ProfileDto } from '../application/members/model/ProfileDto';
import { MeDto } from '../application/members/model/MeDto';
import { EditableProfileDto } from '../application/members/model/EditableProfileDto';
import { GameType } from './model/GameType';
import { Readable } from "stream";

export interface MembersApi {
  fetchAll(): Promise<MemberWithPicture[]>;

  fetchLeaderboard(gameType: GameType): Promise<MemberWithGameTypeScore[]>;

  createProfile(profileDto: ProfileDto): Promise<string>;

  fetchProfile(meDto: MeDto): Promise<EditableProfileDto>;

  updateProfile(me: ProfileDto): void;

  resetLeaderboard(email: string): Promise<number>;

  getPicture(token: string): Promise<{ picture: Readable, params: { contentType: string, id: string, cacheDuration: number } } | undefined>
}
