import { ApiProperty } from '@nestjs/swagger';
import { Capability } from "../../../domain/model/Capability";

export class ProfileDto {
  @ApiProperty()
  firstName = '';
  @ApiProperty()
  lastName = '';
  @ApiProperty()
  gender = 'MALE';
  @ApiProperty()
  picture = '';
  @ApiProperty()
  capability?: keyof typeof Capability;
  @ApiProperty()
  arrivalDate?: Date;

  email = '';
}
