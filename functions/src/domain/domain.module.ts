import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { GameService } from './game/game.service';

@Module({
  providers: [
    {
      provide: 'GameApi',
      useClass: GameService,
    },
  ],
  exports: ['GameApi'],
  imports: [InfrastructureModule],
})
export class DomainModule {}
