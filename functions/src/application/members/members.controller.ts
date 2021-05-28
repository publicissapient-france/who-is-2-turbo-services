import { Controller, Get, Inject } from '@nestjs/common';
import { MembersApi } from '../../domain/MembersApi';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { MemberDto } from './model/MemberDto';
import { MembersDto } from './model/MembersDto';

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
}
