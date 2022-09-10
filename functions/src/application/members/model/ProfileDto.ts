import { ApiProperty } from '@nestjs/swagger';

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
  capability?: string;
  @ApiProperty()
  arrivalDate?: Date;

  email = '';
}
