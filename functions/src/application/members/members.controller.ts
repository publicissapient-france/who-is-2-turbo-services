import { Controller, Get, Inject, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MembersApi } from '../../domain/MembersApi';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MemberDto } from './model/MemberDto';
import { MembersDto } from './model/MembersDto';
import PictureApi from '../../domain/PictureApi';

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
    const baseUrl = MembersController.getBaseUrl(request);
    return members.map(({ firstName, lastName, picture }) => {
      return {
        firstName,
        lastName,
        picture: `${baseUrl}/members/${picture}`,
      };
    });
  }

  @Get('/:pictureName')
  @ApiOperation({
    description: 'Retrieve a cacheable picture of a member with a named file',
    tags: ['Member', 'Picture'],
  })
  @ApiResponse({ status: 200, description: 'Picture of a member' })
  @ApiResponse({ status: 404, description: 'Picture nt found' })
  async readFile(@Res() res: Response, @Param('pictureName') pictureName: string): Promise<void> {
    const stream = await this.pictureApi.readPicture(pictureName);
    res.setHeader('Cache-Control', 'private, max-age=2419200');
    stream.pipe(res);
    return;
  }

  private static getBaseUrl(request: Request): string {
    const { hostname } = request;
    return hostname === 'localhost'
      ? 'http://localhost:5001/who-is-2-turbo/europe-west1/api'
      : 'https://europe-west1-who-is-2-turbo.cloudfunctions.net/api';
  }
}
