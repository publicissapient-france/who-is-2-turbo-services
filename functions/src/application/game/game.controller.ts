import { Body, Controller, Inject, Param, Post, UseFilters } from '@nestjs/common';
import { GameApi } from '../../domain/GameApi';
import { GameAnswersDto } from './model/GameAnswersDto';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { SeriesScoreDto } from './model/SeriesScoreDto';
import { SeriesGameDto } from './model/GameSerieDto';
import { GameTypeDto } from './model/GameTypeDto';
import { GameTypeExceptionFilter } from './game.http-exception.filter';

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
  @UseFilters(GameTypeExceptionFilter)
  async createNewGame(@Body() gameTypeDto: GameTypeDto): Promise<SeriesGameDto> {
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
  async validateGame(
    @Param('gameId') gameId: string,
    @Body() answers: GameAnswersDto,
  ): Promise<SeriesScoreDto> {
    const serieScore = await this.gameApi.validateSeriesGame(
      gameId,
      answers.answers,
      answers.email,
    );
    return {
      correct: serieScore.correct,
      total: serieScore.total,
    } as SeriesScoreDto;
  }
}
