import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GameApi } from '../../domain/GameApi';
import { GameAnswersDto } from './model/GameAnswersDto';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { SeriesScoreDto } from './model/SeriesScoreDto';
import { SeriesGameDto } from './model/GameSerieDto';
import { GameTypeDto } from './model/GameTypeDto';
import { GameTypeExceptionFilter } from './game.http-exception.filter';
import { GameType } from '../../domain/model/GameType';

@Controller('games')
export class GameController {
  constructor(@Inject('GameApi') private gameApi: GameApi) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The new game was created successfully.',
    type: SeriesGameDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The new game was created successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 412, description: 'GameType not found' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseFilters(GameTypeExceptionFilter)
  async createNewGame(
    @Body()
    gameTypeDto: GameTypeDto,
  ): Promise<SeriesGameDto> {
    const gameType = GameType[gameTypeDto.gameType as keyof typeof GameType];
    const seriesGame = await this.gameApi.generateGameFromGameType(gameType);
    return {
      id: seriesGame.id,
      questions: seriesGame.questions,
    };
  }

  @ApiCreatedResponse({
    description: 'Validate a game.',
    type: SeriesScoreDto,
  })
  @ApiResponse({ status: 200, description: 'The game score is returned' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Post(':gameId/score')
  @UseFilters(GameTypeExceptionFilter)
  async validateGame(
    @Param('gameId') gameId: string,
    @Body() answers: GameAnswersDto,
  ): Promise<SeriesScoreDto> {
    const seriesScore = await this.gameApi.validateSeriesGame(
      gameId,
      answers.answers,
      answers.email,
    );
    return {
      correct: seriesScore.currentScore.count,
      total: seriesScore.solutions.length,
      solutions: seriesScore.solutions,
      previousBestScore: seriesScore.previousBestScore,
      currentScore: seriesScore.currentScore,
      betterScoresInLeaderboard: seriesScore.betterScoresInLeaderboard,
    } as SeriesScoreDto;
  }
}
