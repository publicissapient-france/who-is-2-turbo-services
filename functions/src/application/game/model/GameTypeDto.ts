import { ApiProperty } from '@nestjs/swagger';
import { GameType } from '../../../domain/model/GameType';
import { IsString } from 'class-validator';

export class GameTypeDto {
  @ApiProperty({ enum: GameType, enumName: 'gameType' })
  @IsString()
  gameType: string = 'SERIES_5';
}
