import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { GalleryParametersDto } from '../model/GalleryParametersDto';

export class ParseGalleryParamsPipe implements PipeTransform<GalleryParametersDto> {
  async transform(value: GalleryParametersDto, metadata: ArgumentMetadata) {
    const offset = +value.offset;
    const limit = +value.limit;
    if (isNaN(offset) || isNaN(limit)) {
      throw new BadRequestException('Validation failed');
    }
    return {
      offset: offset,
      limit: limit,
    };
  }
}
