import { Controller, Get, Inject, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { MembersApi } from '../../domain/MembersApi';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { MemberDto } from './model/MemberDto';
import { MembersDto } from './model/MembersDto';
import { GalleryParameters, ParseGalleryParamsPipe } from './model/GalleryParametersDto';

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
  @UsePipes(new ValidationPipe({ transform: true }), new ParseGalleryParamsPipe())
  async loadGallery(@Query() params: GalleryParameters): Promise<MemberDto[]> {
    const members = await this.membersApi.loadGallery(params.offset, params.limit);
    return members.map((value) => {
      return {
        firstName: value.firstName,
        lastName: value.lastName,
        picture: value.picture,
      };
    });
  }
}
