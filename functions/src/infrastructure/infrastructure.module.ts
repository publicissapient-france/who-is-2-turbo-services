import { Module } from '@nestjs/common';
import { GamesRepository } from './game/games.repository';
import { MemberRepository } from './member/member.repository';
import { CryptoService } from './crypto/Crypto.service';
import { ConfigService } from './firebase/function/Config.service';

@Module({
  providers: [
    {
      provide: 'ConfigSpi',
      useClass: ConfigService,
    },
    {
      provide: 'CryptoSpi',
      useClass: CryptoService,
    },
    {
      provide: 'GameRepositorySpi',
      useClass: GamesRepository,
    },
    {
      provide: 'MemberRepositorySpi',
      useClass: MemberRepository,
    },
  ],
  exports: ['ConfigSpi', 'CryptoSpi', 'GameRepositorySpi', 'MemberRepositorySpi', 'StorageSpi'],
})
export class InfrastructureModule {}
