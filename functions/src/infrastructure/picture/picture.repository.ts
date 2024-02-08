import { Injectable } from '@nestjs/common';
import { PictureRepositorySpi } from '../../domain/PictureRepositorySpi';
import { Readable } from 'stream';
import * as admin from 'firebase-admin';
import { storage } from 'firebase-admin';
import Storage = storage.Storage;

@Injectable()
export class PictureRepository implements PictureRepositorySpi {
  private storage: Storage;

  constructor() {
    this.storage = admin.storage();
  }

  async get(id: string): Promise<{ picture: Readable; contentType: string }> {
    const file = await this.storage.bucket().file(id);
    const metadata = await file.getMetadata();
    return {
      picture: file.createReadStream(),
      contentType: metadata[0].contentType,
    };
  }
}
