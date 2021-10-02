import { ApiProperty } from '@nestjs/swagger';

export class SeriesScore {
  @ApiProperty()
  correct = 0;
  @ApiProperty()
  total = 0;
  @ApiProperty()
  time = 0;
}
