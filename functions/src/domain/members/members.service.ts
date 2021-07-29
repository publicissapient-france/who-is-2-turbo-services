import { Inject, Injectable } from '@nestjs/common';
import { MemberRepositorySpi } from '../MemberRepositorySpi';
import { MembersApi } from '../MembersApi';
import { MemberWithPicture, MemberWithScore } from '../model/Member';
import { ProfileDto } from '../../application/members/model/ProfileDto';
import { MeDto } from '../../application/members/model/MeDto';
import { EditableProfileDto } from '../../application/members/model/EditableProfileDto';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../../infrastructure/member/member.repository';
import { Profile } from '../model/Profile';

@Injectable()
export class MembersService implements MembersApi {
  constructor(@Inject('MemberRepositorySpi') private memberRepositorySpi: MemberRepositorySpi) {}

  async fetchAll(): Promise<MemberWithPicture[]> {
    return await this.memberRepositorySpi.loadGalleryMembers();
  }

  async fetchLeaderboard(): Promise<MemberWithScore[]> {
    return await this.memberRepositorySpi.getMembersScores();
  }

  async createProfile(profileDto: ProfileDto): Promise<string> {
    try {
      const profile = this.profileDtoToProfileWithPicture(profileDto);
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
      const profile = this.profileDtoToProfileWithPicture(profileDto);
      await this.memberRepositorySpi.updateProfile(profile);
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new MemberNotFoundException();
      }
      throw err;
    }
  }

  private profileDtoToProfileWithPicture(profileDto: ProfileDto): Profile {
    return {
      firstName: profileDto.firstName,
      lastName: profileDto.lastName,
      email: profileDto.email,
      gender: profileDto.gender,
      pictureBase64: profileDto.picture,
    } as Profile;
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
