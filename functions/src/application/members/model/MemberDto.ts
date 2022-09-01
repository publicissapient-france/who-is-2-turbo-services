import { ApiProperty } from '@nestjs/swagger';

export class MemberDto {
  @ApiProperty()
  firstName = '';
  @ApiProperty()
  lastName = '';
  @ApiProperty()
  picture = '';
  @ApiProperty()
  capability?: String = undefined;
  @ApiProperty()
  arrivalDate?: Date = undefined;
}
