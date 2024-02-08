import { Readable } from 'stream';

export interface PictureRepositorySpi {
  get(id: string): Promise<{ picture: Readable; contentType: string }>;
}
