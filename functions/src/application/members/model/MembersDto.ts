import { ApiProperty } from '@nestjs/swagger';
import { MemberDto } from './MemberDto';

export class MembersDto {
  @ApiProperty({ type: [MemberDto] })
  members: MemberDto[] = [];
}
