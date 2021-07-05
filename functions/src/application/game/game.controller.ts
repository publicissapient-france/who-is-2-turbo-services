import { Body, Controller, Get, Inject, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GameApi } from '../../domain/GameApi';
import { GameAnswersDto } from './model/GameAnswersDto';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { SeriesScoreDto } from './model/SeriesScoreDto';
import { SeriesGameDto } from './model/GameSerieDto';
import { ConfigApi } from '../../domain/ConfigApi';

@Controller('games')
export class GameController {
  private readonly baseUrl: string;

  constructor(
    @Inject('ConfigApi') configApi: ConfigApi,
    @Inject('GameApi') private gameApi: GameApi,
  ) {
    this.baseUrl = configApi.require('baseurl');
  }

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
      questions: seriesGame.questions.map(({ question, propositions }) => ({
        question: this.getImageUrl(question),
        propositions,
      })),
    } as SeriesGameDto;
  }

  private getImageUrl(imageName: string): string {
    return `${this.baseUrl}/games/picture/${imageName}`;
  }

  @Get('picture/:cypheredPictureName')
  @ApiResponse({ status: 200, description: 'Picture webp is returned' })
  async getPicture(
    @Res() res: Response,
    @Param('cypheredPictureName') pictureName: string,
  ): Promise<void> {
    const stream = await this.gameApi.readPicture(pictureName);
    res.setHeader('Cache-Control', 'private, no-cache, no-store');
    res.setHeader('Content-Type', 'image/webp');
    stream.pipe(res);
    return;
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
