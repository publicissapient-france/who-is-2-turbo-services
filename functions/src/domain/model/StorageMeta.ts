export type StorageMeta = {
  id: string;
  createdAt: Date;
  readAt: Date;
};

export type ContentOf<T> = Omit<T, 'id' | 'createdAt'>;
