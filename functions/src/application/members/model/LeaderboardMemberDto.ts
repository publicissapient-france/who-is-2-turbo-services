import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardMemberDto {
  @ApiProperty()
  firstName = '';
  @ApiProperty()
  lastName = '';
  @ApiProperty()
  score: Map<string, number> | undefined;
}
