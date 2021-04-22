import { ApiProperty } from '@nestjs/swagger';
import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

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

export class ParseGalleryParamsPipe implements PipeTransform<GalleryParametersDto> {
  async transform(value: GalleryParametersDto, metadata: ArgumentMetadata) {
    const offset = parseInt(value.offset, 10);
    const limit = parseInt(value.limit, 10);
    if (isNaN(offset) || isNaN(limit)) {
      throw new BadRequestException('Validation failed');
    }
    return {
      offset: offset,
      limit: limit,
    } as GalleryParameters;
  }
}
