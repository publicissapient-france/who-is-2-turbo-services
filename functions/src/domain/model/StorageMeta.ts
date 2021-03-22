export type StorageMeta = {
  id: string;
  createdAt: Date;
};

export type ContentOf<T> = Omit<T, 'id' | 'createdAt'>;
