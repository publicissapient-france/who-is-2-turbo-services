import { ApiProperty } from '@nestjs/swagger';

export class GameTypeDto {
  @ApiProperty()
  type: GameType = GameType.SERIES_5;
}

export enum GameType {
  SERIES_5 = 5,
  SERIES_20 = 20,
}
