import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardMemberDto {
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty()
  score?: number;
}
