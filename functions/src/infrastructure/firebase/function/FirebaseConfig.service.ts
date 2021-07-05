import { ConfigSpi } from '../../../domain/ConfigSpi';
import * as functions from 'firebase-functions';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseConfigService implements ConfigSpi {
  get(key: string): string | undefined {
    return functions.config().whoisturbo[key];
  }

  require(key: string): string {
    const value = this.get(key);
    if (typeof value === 'undefined')
      throw new Error(`Firebase functions config [whoisturbo.${key}] is required`);
    return value;
  }
}
