import { Inject, Injectable } from '@nestjs/common';
import { MemberRepositorySpi } from '../MemberRepositorySpi';
import { MembersApi } from '../MembersApi';
import { MemberWithPicture } from '../model/Member';

@Injectable()
export class MembersService implements MembersApi {
  constructor(@Inject('MemberRepositorySpi') private memberRepositorySpi: MemberRepositorySpi) {}

  async fetchAll(offset: number, limit: number): Promise<MemberWithPicture[]> {
    return await this.memberRepositorySpi.loadGalleryMembers(offset, limit);
  }
}
