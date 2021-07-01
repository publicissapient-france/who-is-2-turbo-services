import { Controller, Get, Inject } from '@nestjs/common';
import { MembersApi } from '../../domain/MembersApi';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { MemberDto } from './model/MemberDto';
import { MembersDto } from './model/MembersDto';
import { LeaderboardMemberDto } from './model/LeaderboardMemberDto';

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
}
