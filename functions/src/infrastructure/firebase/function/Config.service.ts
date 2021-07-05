import { ConfigSpi } from '../../../domain/ConfigSpi';
import * as functions from 'firebase-functions';

export class ConfigService implements ConfigSpi {
  get(key: string): string | undefined {
    return functions.config().whoisturbo.get(key);
  }

  require(key: string): string {
    const value = this.get(key);
    if (typeof value === 'undefined')
      throw new Error(`Firebase functions config [whoisturbo.${key}] is required`);
    return value;
  }
}
