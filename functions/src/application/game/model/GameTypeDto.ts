import { ApiProperty } from '@nestjs/swagger';
import { GameType } from '../../../domain/model/GameType';

export class GameTypeDto {
  @ApiProperty({ enum: GameType, enumName: 'gameType' })
  gameType: GameType = GameType.SERIES_5;
}
