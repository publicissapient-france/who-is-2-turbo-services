import { Module } from '@nestjs/common';
import { GameController } from './game/game.controller';
import { DomainModule } from '../domain/domain.module';
import { GameAnswersDto } from './game/model/GameAnswersDto';

@Module({
  controllers: [GameController],
  imports: [DomainModule, GameAnswersDto],
})
export class ApplicationModule {}
