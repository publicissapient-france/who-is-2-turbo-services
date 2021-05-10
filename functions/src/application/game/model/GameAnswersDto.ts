import { ApiProperty } from '@nestjs/swagger';

export class GameAnswersDto {
  @ApiProperty({ type: [Number] })
  answers: number[] = [];
  email: string = '';
}
