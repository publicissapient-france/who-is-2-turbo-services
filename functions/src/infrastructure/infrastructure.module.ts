import { Module } from '@nestjs/common';
import { GamesRepository } from './game/games.repository';
import { MemberRepository } from './member/member.repository';

@Module({
  providers: [
    {
      provide: 'GameRepositorySpi',
      useClass: GamesRepository,
    },
    {
      provide: 'MemberRepositorySpi',
      useClass: MemberRepository,
    },
  ],
  exports: ['GameRepositorySpi', 'MemberRepositorySpi'],
})
export class InfrastructureModule {}
