import { ApiProperty } from '@nestjs/swagger';

export class GalleryParametersDto {
  limit = '20';
  offset = '0';
}

export class GalleryParameters {
  @ApiProperty({ required: false })
  limit = 20;
  @ApiProperty({ required: false })
  offset = 0;
}
