import { ApiProperty } from '@nestjs/swagger';

export class EditableProfileDto {
  @ApiProperty()
  firstName = '';
  @ApiProperty()
  lastName = '';
  @ApiProperty()
  gender = 'MALE';
  @ApiProperty()
  picture = '';
}
