import { Controller, Inject, Post } from '@nestjs/common';
import { GameApi } from '../../domain/GameApi';

@Controller('members')
export class MembersController {
  constructor(@Inject('GameApi') private gameApi: GameApi) {}

  @Post()
  preloadMembers(): void {
    this.gameApi.preload();
  }
}
