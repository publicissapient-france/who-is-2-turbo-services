import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameApi } from 'src/domain/GameApi';
import { Provider } from '@nestjs/common';

describe('GameController', () => {
  let controller: GameController;

  const mockGameService: GameApi = {
    generateGameFromGameType: jest.fn(),
    validateSeriesGame: jest.fn(),
  };
  const gameService: Provider<GameApi> = {
    provide: 'GameApi',
    useValue: mockGameService,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [gameService],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
