import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { GameService } from './game/game.service';
import { MembersService } from './members/members.service';
import { ConfigService } from './Config.service';

@Module({
  providers: [
    {
      provide: 'ConfigApi',
      useClass: ConfigService,
    },
    {
      provide: 'GameApi',
      useClass: GameService,
    },
    {
      provide: 'MembersApi',
      useClass: MembersService,
    },
  ],
  exports: ['ConfigApi', 'GameApi', 'MembersApi'],
  imports: [InfrastructureModule],
})
export class DomainModule {}
