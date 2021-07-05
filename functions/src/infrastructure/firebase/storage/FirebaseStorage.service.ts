import { PictureStorageSpi } from '../../../domain/PictureStorageSpi';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseStorageService implements PictureStorageSpi {
  public async readPicture(fileName: string): Promise<Readable> {
    const file = await admin.storage().bucket().file(fileName);
    return file.createReadStream();
  }
}
