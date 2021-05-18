import { Readable } from 'stream';

export default interface StorageSpi {
  readFile(fileName: string): Promise<Readable>;
}
