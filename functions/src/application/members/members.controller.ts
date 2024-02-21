import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MembersApi } from '../../domain/MembersApi';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { MemberDto } from './model/MemberDto';
import { MembersDto } from './model/MembersDto';
import { LeaderboardMemberDto } from './model/LeaderboardMemberDto';
import { MemberIdDto } from './model/MemberIdDto';
import { ProfileDto } from './model/ProfileDto';
import { MeDto } from './model/MeDto';
import { EditableProfileDto } from './model/EditableProfileDto';
import {
  MemberNotFoundExceptionFilter,
  MembersAlreadyExistsExceptionFilter,
  NotAllowedExceptionFilter,
} from './members.http-exception.filter';
import { GameType } from '../../domain/model/GameType';
import { Response } from 'express';

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
    return members.map(({ firstName, lastName, picture, capability, arrivalDate }) => ({
      firstName,
      lastName,
      picture,
      capability,
      arrivalDate,
    }));
  }

  @Get('leaderboard')
  @ApiQuery({ name: 'gameType', enum: GameType })
  @ApiCreatedResponse({
    description: 'Leaderboard',
    type: LeaderboardMemberDto,
  })
  @ApiResponse({ status: 200, description: 'The leaderboard is returned' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async loadLeaderBoard(
    @Query('gameType') gameTypeQuery = GameType.SERIES_5,
  ): Promise<LeaderboardMemberDto[]> {
    const gameType = (<never>GameType)[gameTypeQuery];
    const leaderboard = await this.membersApi.fetchLeaderboard(gameType);
    return leaderboard.map(({ firstName, lastName, picture, score }) => ({
      firstName,
      lastName,
      picture,
      score,
    }));
  }

  @Post('leaderboard/reset')
  @ApiResponse({ status: 200, description: 'The score leaderboard is reset' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @UseFilters(new NotAllowedExceptionFilter())
  async resetLeaderboard(@Body() me: MeDto): Promise<number> {
    return await this.membersApi.resetLeaderboard(me.email);
  }

  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Create profile member',
  })
  @ApiResponse({ status: 201, description: 'The profile is created' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 409, description: 'Profile already exists.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @UseFilters(new MembersAlreadyExistsExceptionFilter())
  async addProfile(@Body() profile: ProfileDto): Promise<MemberIdDto> {
    return {
      id: await this.membersApi.createProfile(profile),
    };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'Get profile member',
  })
  @ApiResponse({ status: 200, description: 'The profile is returned' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: "The profile doesn't exist." })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @UseFilters(new MemberNotFoundExceptionFilter())
  async getProfile(@Body() me: MeDto): Promise<EditableProfileDto> {
    return await this.membersApi.fetchProfile(me);
  }

  @Put('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCreatedResponse({
    description: 'Create profile member',
  })
  @ApiResponse({ status: 204, description: 'The profile is saved' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @UseFilters(new MemberNotFoundExceptionFilter())
  async putProfile(@Body() me: ProfileDto) {
    this.membersApi.updateProfile(me);
  }

  @Get('pictures/:id')
  @ApiCreatedResponse({
    description: 'Get member picture by token',
  })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async getPicture(@Param() params: { id: string }, @Res() res: Response) {
    const picture = await this.membersApi.getPicture(params.id);
    if (picture) {
      res.set({
        'Content-Type': picture.params.contentType,
        ETag: picture.params.id,
        'Cache-Control': `private, max-age=${picture.params.cacheDuration}`,
        'X-Robots-Tag': 'noindex',
      });

      picture.picture.pipe(res);
    } else {
      res.status(HttpStatus.NOT_FOUND).send();
    }
  }
}
