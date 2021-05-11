import { ApiProperty } from '@nestjs/swagger';

export class SeriesScoreDto {
  @ApiProperty()
  correct = 0;
  @ApiProperty()
  total = 0;
}
