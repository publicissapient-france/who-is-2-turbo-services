import { ConfigApi } from './ConfigApi';
import { ConfigSpi } from './ConfigSpi';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService implements ConfigApi {
  constructor(@Inject('ConfigSpi') private configSpi: ConfigSpi) {}

  get(key: string): string | undefined {
    return this.configSpi.get(key);
  }

  require(key: string): string {
    return this.configSpi.require(key);
  }
}
