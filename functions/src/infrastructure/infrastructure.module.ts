import { Module } from '@nestjs/common';
import { GamesRepository } from './game/games.repository';
import { MemberRepository } from './member/member.repository';
import { FirebaseStorageService } from './storage/FirebaseStorage.service';

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
      provide: 'StorageSpi',
      useClass: FirebaseStorageService,
    },
  ],
  exports: ['GameRepositorySpi', 'MemberRepositorySpi', 'StorageSpi'],
})
export class InfrastructureModule {}
