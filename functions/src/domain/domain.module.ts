import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { GameService } from './game/game.service';
import { MembersService } from './members/members.service';
import { PictureService } from './PictureService';

@Module({
  providers: [
    {
      provide: 'GameApi',
      useClass: GameService,
    },
    {
      provide: 'MembersApi',
      useClass: MembersService,
    },
    {
      provide: 'PictureApi',
      useClass: PictureService,
    },
  ],
  exports: ['GameApi', 'MembersApi', 'PictureApi'],
  imports: [InfrastructureModule],
})
export class DomainModule {}
