import { Inject, Injectable } from '@nestjs/common';
import PictureApi from './PictureApi';
import { Readable } from 'stream';
import StorageSpi from './StorageSpi';

@Injectable()
export class PictureService implements PictureApi {
  constructor(@Inject('StorageSpi') private storageSpi: StorageSpi) {}

  async readPicture(fileName: string): Promise<Readable> {
    return this.storageSpi.readFile(fileName);
  }
}
