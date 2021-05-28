import { ApiProperty } from '@nestjs/swagger';

export class MemberDto {
  @ApiProperty()
  firstName = '';
  @ApiProperty()
  lastName = '';
  @ApiProperty()
  picture = '';
}
