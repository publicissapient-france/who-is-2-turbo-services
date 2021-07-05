import { Module } from '@nestjs/common';
import { GamesRepository } from './game/games.repository';
import { MemberRepository } from './member/member.repository';
import { CryptoService } from './crypto/Crypto.service';
import { FirebaseConfigService } from './firebase/function/FirebaseConfig.service';
import { FirebaseStorageService } from './firebase/storage/FirebaseStorage.service';

@Module({
  providers: [
    {
      provide: 'ConfigSpi',
      useClass: FirebaseConfigService,
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
    {
      provide: 'PictureStorageSpi',
      useClass: FirebaseStorageService,
    },
  ],
  exports: [
    'ConfigSpi',
    'CryptoSpi',
    'GameRepositorySpi',
    'MemberRepositorySpi',
    'PictureStorageSpi',
  ],
})
export class InfrastructureModule {}
