import { ApiProperty } from '@nestjs/swagger';

export class MemberDto {
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty({
    nullable: true,
  })
  picture?: string;
}
