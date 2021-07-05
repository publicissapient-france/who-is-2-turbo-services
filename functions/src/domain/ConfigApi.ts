export interface ConfigApi {
  require(key: string): string;
  get(key: string): string | undefined;
}
