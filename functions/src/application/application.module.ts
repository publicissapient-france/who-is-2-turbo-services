import { Module } from '@nestjs/common';
import { GameController } from './game/game.controller';

@Module({
  controllers: [GameController]
})
export class ApplicationModule {}
