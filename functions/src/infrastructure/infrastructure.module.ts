import { Module } from '@nestjs/common';
import { GamesRepository } from './game/games.repository';
import { MemberRepository } from './member/member.repository';
import { PictureRepository } from './picture/picture.repository';

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
    {
      provide: 'PictureRepositorySpi',
      useClass: PictureRepository,
    },
  ],
  exports: ['GameRepositorySpi', 'MemberRepositorySpi', 'PictureRepositorySpi'],
})
export class InfrastructureModule {}
