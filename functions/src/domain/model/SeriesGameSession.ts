import { StorageMeta } from './StorageMeta';

export type SeriesGameSession = Partial<StorageMeta> & {
  solutions: number[];
};
