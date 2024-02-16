import { ApiProperty } from '@nestjs/swagger';

export class GameTypeDto {
  @ApiProperty()
  gameType?: string;
}
