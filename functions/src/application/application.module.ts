import { Module } from '@nestjs/common';
import { GameController } from './game/game.controller';
import { DomainModule } from '../domain/domain.module';
import { GameAnswersDto } from './game/model/GameAnswersDto';
import { MembersController } from './members/members.controller';
import { AdminController } from "./admin/admin.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  controllers: [GameController, MembersController, AdminController],
  imports: [DomainModule, GameAnswersDto, ConfigModule.forRoot()],
})
export class ApplicationModule {}
