import { ApiProperty } from '@nestjs/swagger';

export class MemberDto {
  @ApiProperty()
  firstName = '';
  @ApiProperty()
  lastName = '';
  @ApiProperty()
  picture = '';
  @ApiProperty()
  capability?: string = undefined;
  @ApiProperty()
  arrivalDate?: Date = undefined;
}
