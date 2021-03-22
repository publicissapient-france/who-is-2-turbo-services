import { Picture } from './model/Picture';

export interface PictureSpi {
  save(picture: Picture): void;

  get(id: string): Picture;
}
