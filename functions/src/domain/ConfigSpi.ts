export interface ConfigSpi {
  require(key: string): string;
  get(key: string): string | undefined;
}
