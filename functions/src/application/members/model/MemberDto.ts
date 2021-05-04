import { ApiProperty } from '@nestjs/swagger';

export class MemberDto {
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty()
  picture?: string;
}
