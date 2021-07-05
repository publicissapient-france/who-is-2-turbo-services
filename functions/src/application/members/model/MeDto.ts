import { ApiProperty } from '@nestjs/swagger';

export class MeDto {
  @ApiProperty()
  email = '';
}
