import { MemberWithPicture, MemberWithScore, GameResult } from './model/Member';
import { Profile } from './model/Profile';
import { Role } from './model/Role';

export interface MemberRepositorySpi {
  getAllWithPicture(): Promise<MemberWithPicture[]>;

  loadGalleryMembers(): Promise<MemberWithPicture[]>;

  getMemberScore(email: string, gameType: string): Promise<GameResult | undefined>;

  getRank(score: GameResult, gameType: string): Promise<number>;

  updateMemberScore(email: string, score: GameResult, gameType: string): void;

  getMembersScores(gameType: string): Promise<MemberWithScore[]>;

  addProfile(newProfile: Profile): Promise<string>;

  getMemberWithPictureByEmail(email: string): Promise<MemberWithPicture>;

  updateProfile(me: Profile): void;

  deleteScores(): Promise<number>;

  getMemberRole(email: string): Promise<Role | undefined>;

  findUserByPictureGalleryToken(token: string): Promise<MemberWithPicture | undefined>;

  findUserByGameGalleryToken(token: string): Promise<MemberWithPicture | undefined>;
}
