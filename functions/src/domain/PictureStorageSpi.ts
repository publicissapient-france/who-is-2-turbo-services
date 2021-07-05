import { Readable } from 'stream';

export interface PictureStorageSpi {
  readPicture(fileName: string): Promise<Readable>;
}
