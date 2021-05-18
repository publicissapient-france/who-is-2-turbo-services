import { Readable } from 'stream';

export default interface PictureApi {
  readPicture(fileName: string): Promise<Readable>;
}
