import { Body, Controller, Get, Inject, Patch, Post } from '@nestjs/common';
import { MembersApi } from '../../domain/MembersApi';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { MemberDto } from './model/MemberDto';
import { MembersDto } from './model/MembersDto';
import { LeaderboardMemberDto } from './model/LeaderboardMemberDto';
import { MemberIdDto } from './model/MemberIdDto';
import { ProfileDto } from './model/ProfileDto';
import { MeDto } from './model/MeDto';

@Controller('members')
export class MembersController {
  constructor(@Inject('MembersApi') private membersApi: MembersApi) {}

  @Get()
  @ApiCreatedResponse({
    description: 'Gallery with all members',
    type: MembersDto,
  })
  @ApiResponse({ status: 200, description: 'The gallery is returned' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async loadGallery(): Promise<MemberDto[]> {
    const members = await this.membersApi.fetchAll();
    return members.map(({ firstName, lastName, picture }) => ({
      firstName,
      lastName,
      picture,
    }));
  }

  @Get('leaderboard')
  @ApiCreatedResponse({
    description: 'Leaderboard',
    type: LeaderboardMemberDto,
  })
  @ApiResponse({ status: 200, description: 'The leaderboard is returned' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async loadLeaderBoard(): Promise<LeaderboardMemberDto[]> {
    const leaderboard = await this.membersApi.fetchLeaderboard();
    return leaderboard.map(({ firstName, lastName, score }) => ({
      firstName,
      lastName,
      score,
    }));
  }

  @Post('me')
  @ApiCreatedResponse({
    description: 'Create profile member',
  })
  @ApiResponse({ status: 201, description: 'The profile is created' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async addProfile(@Body() profile: ProfileDto): Promise<MemberIdDto> {
    return {
      id: 'fakeId',
    };
  }

  @Get('me')
  @ApiCreatedResponse({
    description: 'Get profile member',
  })
  @ApiResponse({ status: 200, description: 'The profile is returned' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getProfile(@Body() me: MeDto): Promise<ProfileDto> {
    return {
      firstName: '',
      lastName: '',
      gender: 'MALE',
      picture: '',
      email: me.email,
    };
  }

  @Patch('me')
  @ApiCreatedResponse({
    description: 'Create profile member',
  })
  @ApiResponse({ status: 204, description: 'The profile is saved' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async patchProfile(@Body() me: MeDto) {
    return;
  }
}
