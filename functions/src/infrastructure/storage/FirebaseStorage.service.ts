import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Readable } from 'stream';
import StorageSpi from '../../domain/StorageSpi';

@Injectable()
export class FirebaseStorageService implements StorageSpi {
  public async readFile(fileName: string): Promise<Readable> {
    const file = await admin.storage().bucket().file(fileName);
    return file.createReadStream();
  }
}
