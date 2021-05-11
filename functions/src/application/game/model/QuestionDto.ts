import { ApiProperty } from '@nestjs/swagger';

class PropositionDto {
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
}

export class QuestionDto {
  @ApiProperty()
  question?: string;
  @ApiProperty({ type: [PropositionDto] })
  propositions?: PropositionDto[];
}
