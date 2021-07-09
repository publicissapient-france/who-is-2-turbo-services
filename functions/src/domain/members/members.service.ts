import { Inject, Injectable } from '@nestjs/common';
import { MemberRepositorySpi } from '../MemberRepositorySpi';
import { MembersApi } from '../MembersApi';
import { Gender, MemberWithPicture, MemberWithScore } from '../model/Member';
import { ProfileDto } from '../../application/members/model/ProfileDto';
import { MeDto } from '../../application/members/model/MeDto';
import { EditableProfileDto } from '../../application/members/model/EditableProfileDto';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../../infrastructure/member/member.repository';

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
      const member = MembersService.profileDtoToMemberWithPicture(profileDto);
      return await this.memberRepositorySpi.addMember(member);
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
        gender: Gender[member.gender.valueOf()],
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
      const member = MembersService.profileDtoToMemberWithPicture(profileDto);
      await this.memberRepositorySpi.updateMember(member);
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new MemberNotFoundException();
      }
      throw err;
    }
  }

  private static profileDtoToMemberWithPicture(profileDto: ProfileDto): MemberWithPicture {
    return {
      firstName: profileDto.firstName,
      firstName_unaccent: profileDto.firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      lastName: profileDto.lastName,
      email: profileDto.email,
      gender: (<any>Gender)[profileDto.gender],
      picture: profileDto.picture,
    } as MemberWithPicture;
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
