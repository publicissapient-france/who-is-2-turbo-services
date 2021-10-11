import { ApiProperty } from '@nestjs/swagger';

export class ScoreResultDto {
  @ApiProperty()
  count = 0;
  @ApiProperty()
  time = 0;
}
