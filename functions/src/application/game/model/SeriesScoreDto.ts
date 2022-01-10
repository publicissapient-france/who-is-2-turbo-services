import { ApiProperty } from '@nestjs/swagger';
import { ScoreResultDto } from './ScoreResultDto';

export class SeriesScoreDto {
  @ApiProperty()
  correct = 0;
  @ApiProperty()
  total = 0;
  @ApiProperty()
  solutions: number[] = [];
  @ApiProperty()
  rank = 0;
  @ApiProperty({ type: ScoreResultDto })
  score: ScoreResultDto = new ScoreResultDto();
  @ApiProperty()
  bestRank?: number;
  @ApiProperty({ type: ScoreResultDto })
  bestScore?: ScoreResultDto;
}
