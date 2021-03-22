import { QuestionDto } from './QuestionDto';
import { ApiProperty } from '@nestjs/swagger';

export class SeriesGameDto {
  @ApiProperty()
  id?: string;
  @ApiProperty({ type: [QuestionDto] })
  questions: QuestionDto[] = [];
}
