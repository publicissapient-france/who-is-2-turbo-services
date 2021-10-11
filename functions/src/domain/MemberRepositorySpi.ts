import { MemberWithPicture, MemberWithScore, ScoreResult } from './model/Member';
import { Profile } from './model/Profile';
import { GameType } from './model/GameType';
import { Role } from './model/Role';

export interface MemberRepositorySpi {
  getAllWithPicture(): Promise<MemberWithPicture[]>;
  generatePrivatePictureUrl(pictureName: string): Promise<string>;

  loadGalleryMembers(): Promise<MemberWithPicture[]>;

  getMemberScoreByGameType(email: string, gameType: GameType): Promise<ScoreResult | null>;

  getBetterScoreMembersCount(score: ScoreResult, gameType: GameType): Promise<number>;

  updateMemberScore(email: string, score: number, gameTime: number, gameType: GameType): void;

  getMembersScores(gameType: GameType): Promise<MemberWithScore[]>;

  addProfile(newProfile: Profile): Promise<string>;

  getMemberWithPictureByEmail(email: string): Promise<MemberWithPicture>;

  updateProfile(me: Profile): void;

  deleteScores(): Promise<number>;

  getMemberRole(email: string): Promise<Role | undefined>;
}
