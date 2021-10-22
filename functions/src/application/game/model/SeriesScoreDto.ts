import { ApiProperty } from '@nestjs/swagger';
import { ScoreResultDto } from './ScoreResultDto';

export class SeriesScoreDto {
  @ApiProperty()
  correct = 0;
  @ApiProperty()
  total = 0;
  @ApiProperty()
  solutions: number[] = [];
  @ApiProperty({ type: ScoreResultDto })
  previousBestScore: ScoreResultDto | undefined;
  @ApiProperty({ type: ScoreResultDto })
  currentScore: ScoreResultDto = new ScoreResultDto();
  @ApiProperty()
  betterScoresInLeaderboard = 0;
}
