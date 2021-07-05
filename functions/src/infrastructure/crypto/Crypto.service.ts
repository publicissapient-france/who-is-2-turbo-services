import { CryptoSpi } from '../../domain/CryptoSpi';
import { Inject, Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { Buffer } from 'buffer';
import { ConfigSpi } from '../../domain/ConfigSpi';

const IV_SIZE = 16;
const HEX_CHAR_BY_BYTE = 2;
const IV_HEX_SIZE = IV_SIZE * HEX_CHAR_BY_BYTE;

@Injectable()
export class CryptoService implements CryptoSpi {
  private readonly key: Buffer;

  constructor(@Inject('ConfigSpi') configSpi: ConfigSpi) {
    this.key = crypto.scryptSync(
      configSpi.require('keypassword'),
      configSpi.require('keysalt'),
      24,
    );
  }

  cypher(data: string): string {
    const iv = crypto.randomFillSync(Buffer.alloc(16, 0), 0, IV_SIZE);
    const cipher = crypto.createCipheriv('aes-192-cbc', this.key, iv);
    let cypheredData = cipher.update(data, 'utf8', 'hex');
    cypheredData += cipher.final('hex');
    return iv.toString('hex') + cypheredData;
  }

  decipher(ciphered: string): string {
    if (ciphered.length <= IV_HEX_SIZE || ciphered.length % 2 !== 0) {
      throw new Error('wrong cyphered input');
    }
    const iv = ciphered.slice(0, IV_HEX_SIZE);
    const data = ciphered.slice(IV_HEX_SIZE);

    const decipher = crypto.createDecipheriv('aes-192-cbc', this.key, Buffer.from(iv, 'hex'));
    let deciphered = decipher.update(data, 'hex', 'utf8');
    deciphered += decipher.final('utf8');
    return deciphered;
  }
}
