import { Inject, Injectable } from '@nestjs/common';
import { MemberRepositorySpi } from '../MemberRepositorySpi';
import { MembersApi } from '../MembersApi';
import { Member } from '../model/Member';

@Injectable()
export class MembersService implements MembersApi {
  constructor(@Inject('MemberRepositorySpi') private memberRepositorySpi: MemberRepositorySpi) {}

  preload(): void {
    this.memberRepositorySpi.preload();
  }

  async loadGallery(): Promise<Member[]> {
    return await this.memberRepositorySpi.loadGalleryMembers();
  }
}
