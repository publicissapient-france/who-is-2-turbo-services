import { ApiProperty } from '@nestjs/swagger';
import { Capability } from "../../../domain/model/Capability";

export class MemberDto {
  @ApiProperty()
  firstName = '';
  @ApiProperty()
  lastName = '';
  @ApiProperty()
  picture = '';
  @ApiProperty()
  capability?: Capability = undefined;
  @ApiProperty()
  arrivalDate?: Date = undefined;
}
