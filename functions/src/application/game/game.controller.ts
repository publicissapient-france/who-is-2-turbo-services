import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { GameApi } from '../../domain/GameApi';
import { GameAnswersDto } from './model/GameAnswersDto';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { SeriesScoreDto } from './model/SeriesScoreDto';
import { SeriesGameDto } from './model/GameSerieDto';

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
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createNewGame(): Promise<SeriesGameDto> {
    const seriesGame = await this.gameApi.generateSeriesGame(5, 4);
    return {
      id: seriesGame.id,
      questions: seriesGame.questions,
    } as SeriesGameDto;
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
    const serieScore = await this.gameApi.validateSeriesGame(gameId, answers.answers);
    return {
      correct: serieScore.correct,
      total: serieScore.total,
    } as SeriesScoreDto;
  }
}
