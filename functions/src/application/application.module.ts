import { Module } from '@nestjs/common';
import { GameController } from './game/game.controller';
import { DomainModule } from '../domain/domain.module';
import { GameAnswersDto } from './game/model/GameAnswersDto';
import { MembersController } from './members/members.controller';

@Module({
  controllers: [GameController, MembersController],
  imports: [DomainModule, GameAnswersDto],
})
export class ApplicationModule {}
