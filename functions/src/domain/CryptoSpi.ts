export interface CryptoSpi {
  cypher(data: string): string;
  decipher(encrypted: string): string;
}
