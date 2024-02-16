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
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { GameApi } from '../../domain/GameApi';
import { GameTypeExceptionFilter } from './game.http-exception.filter';
import { GameAnswersDto } from './model/GameAnswersDto';
import { SeriesGameDto } from './model/GameSerieDto';
import { SeriesScoreDto } from './model/SeriesScoreDto';

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
    gameTypeDto: string,
  ): Promise<SeriesGameDto> {
    const seriesGame = await this.gameApi.generateGameFromGameType(gameTypeDto);
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
      correct: seriesScore.score.count,
      total: seriesScore.solutions.length,
      solutions: seriesScore.solutions,
      rank: seriesScore.rank,
      score: seriesScore.score,
      bestRank: seriesScore.bestRank,
      bestScore: seriesScore.bestScore,
    } as SeriesScoreDto;
  }
}
