export type Picture = {
  id: string;
  mediaType: MediaType;
  content: Uint8Array;
};

export enum MediaType {
  JPG,
  PNG,
}
