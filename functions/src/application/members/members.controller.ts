import { Controller, Get, Inject, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MembersApi } from '../../domain/MembersApi';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MemberDto } from './model/MemberDto';
import { MembersDto } from './model/MembersDto';
import PictureApi from '../../domain/PictureApi';
import * as functions from 'firebase-functions';

@Controller('members')
export class MembersController {
  constructor(
    @Inject('MembersApi') private membersApi: MembersApi,
    @Inject('PictureApi') private pictureApi: PictureApi,
  ) {}

  @Get()
  @ApiCreatedResponse({
    description: 'Gallery with all members',
    type: MembersDto,
  })
  @ApiResponse({ status: 200, description: 'The gallery is returned' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async loadGallery(@Req() request: Request): Promise<MemberDto[]> {
    const members = await this.membersApi.fetchAll();
    const baseUrl = functions.config().whoisturbo.baseurl as string;
    if (!baseUrl) {
      throw new Error('Missing environment parameter: whoisturbo.baseurl');
    }

    return members.map(({ firstName, lastName, picture }) => ({
      firstName,
      lastName,
      picture: `${baseUrl}/members/${picture}`,
    }));
  }

  @Get('/:pictureName')
  @ApiOperation({
    description: 'Retrieve a cacheable picture of a member with a named file',
    tags: ['Member', 'Picture'],
  })
  @ApiResponse({ status: 200, description: 'Picture of a member' })
  @ApiResponse({ status: 404, description: 'Picture not found' })
  async readFile(@Res() res: Response, @Param('pictureName') pictureName: string): Promise<void> {
    const stream = await this.pictureApi.readPicture(pictureName);
    res.setHeader('Cache-Control', 'private, max-age=2419200');
    stream.pipe(res);
    return;
  }
}
