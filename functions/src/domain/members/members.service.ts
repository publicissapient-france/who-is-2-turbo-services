import { Inject, Injectable } from '@nestjs/common';
import { MemberRepositorySpi } from '../MemberRepositorySpi';
import { MembersApi } from '../MembersApi';
import { Gender, Member, MemberWithPicture, MemberWithScore } from '../model/Member';
import { ProfileDto } from '../../application/members/model/ProfileDto';

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
    console.log('profileDto', profileDto);
    let gender;
    if (profileDto.gender === 'MALE') {
      gender = Gender.MALE;
    } else {
      gender = Gender.FEMALE;
    }
    const member = {
      firstName: profileDto.firstName,
      firstName_unaccent: profileDto.firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      lastName: profileDto.lastName,
      email: profileDto.email,
      gender: gender,
    } as Member;
    return await this.memberRepositorySpi.addMember(member, profileDto.picture);
  }
}
