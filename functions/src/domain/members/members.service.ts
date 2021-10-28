import { Inject, Injectable } from '@nestjs/common';
import { MemberRepositorySpi } from '../MemberRepositorySpi';
import { MembersApi } from '../MembersApi';
import { MemberWithGameTypeScore, MemberWithPicture, MemberWithScore } from '../model/Member';
import { ProfileDto } from '../../application/members/model/ProfileDto';
import { MeDto } from '../../application/members/model/MeDto';
import { EditableProfileDto } from '../../application/members/model/EditableProfileDto';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../../infrastructure/member/member.repository';
import { Profile } from '../model/Profile';
import { Gender } from '../model/Gender';
import { GameType } from '../model/GameType';
import { Role } from '../model/Role';
import { Capability } from "../model/Capability";

@Injectable()
export class MembersService implements MembersApi {
  constructor(@Inject('MemberRepositorySpi') private memberRepositorySpi: MemberRepositorySpi) {
  }

  async fetchAll(): Promise<MemberWithPicture[]> {
    return await this.memberRepositorySpi.loadGalleryMembers();
  }

  async fetchLeaderboard(gameType: GameType): Promise<MemberWithGameTypeScore[]> {
    const membersScore: MemberWithScore[] = await this.memberRepositorySpi.getMembersScores(
      gameType,
    );
    return membersScore.map(
      (member) =>
        ({
          ...member,
          score: member.score[gameType] || 0,
        } as MemberWithGameTypeScore),
    );
  }

  async createProfile(profileDto: ProfileDto): Promise<string> {
    try {
      const profile = MembersService.profileDtoToProfileWithPicture(profileDto);
      return await this.memberRepositorySpi.addProfile(profile);
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) {
        throw new MemberAlreadyExistsException();
      }
      throw err;
    }
  }

  async fetchProfile(meDto: MeDto): Promise<EditableProfileDto> {
    try {
      const member = await this.memberRepositorySpi.getMemberWithPictureByEmail(meDto.email);
      return {
        firstName: member.firstName,
        lastName: member.lastName,
        gender: member.gender,
        picture: await this.memberRepositorySpi.generatePrivatePictureUrl(member.picture),
        capability: member.capability && Capability[member.capability],
        arrivalDate: member.arrivalDate,
      } as EditableProfileDto;
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new MemberNotFoundException();
      }
      throw err;
    }
  }

  async updateProfile(profileDto: ProfileDto) {
    try {
      const profile = MembersService.profileDtoToProfileWithPicture(profileDto);
      await this.memberRepositorySpi.updateProfile(profile);
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new MemberNotFoundException();
      }
      throw err;
    }
  }

  async resetLeaderboard(email: string): Promise<number> {
    const role = await this.memberRepositorySpi.getMemberRole(email);
    if (role != Role.ADMIN) {
      throw new NotAllowedException();
    }
    return await this.memberRepositorySpi.deleteScores();
  }

  private static profileDtoToProfileWithPicture(profileDto: ProfileDto): Profile {
    let picture64 = undefined;
    if (!profileDto.picture.startsWith('http')) {
      picture64 = profileDto.picture;
    }
    return {
      firstName: profileDto.firstName,
      lastName: profileDto.lastName,
      email: profileDto.email,
      gender: Gender[profileDto.gender as keyof typeof Gender],
      pictureBase64: picture64,
      capability: profileDto.capability && Capability[profileDto.capability],
      arrivalDate: profileDto.arrivalDate,
    }
  }
}

export class MemberNotFoundException {
  readonly message: string;
  readonly code: string;

  constructor() {
    this.message = 'NOT FOUND';
    this.code = 'NOTFOUND';
  }
}

export class MemberAlreadyExistsException {
  readonly message: string;
  readonly code: string;

  constructor() {
    this.message = 'CONFLICT';
    this.code = 'CONFLICT';
  }
}

export class NotAllowedException {
  readonly message: string;
  readonly code: string;

  constructor() {
    this.message = 'NOT ALLOWED';
    this.code = 'NOTALLOWED';
  }
}
