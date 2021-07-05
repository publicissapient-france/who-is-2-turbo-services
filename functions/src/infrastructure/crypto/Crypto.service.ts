import { CryptoSpi } from '../../domain/CryptoSpi';
import { Inject, Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { Buffer } from 'buffer';
import { ConfigSpi } from '../../domain/ConfigSpi';

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
    const iv = crypto.randomFillSync(Buffer.alloc(16, 0), 0, 16);
    const cipher = crypto.createCipheriv('aes-192-cbc', this.key, iv);
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return iv.toString('hex') + '-' + crypted;
  }

  decipher(encrypted: string): string {
    const [iv, crypted] = encrypted.split('-');
    const decipher = crypto.createDecipheriv('aes-192-cbc', this.key, Buffer.from(iv, 'hex'));
    let dec = decipher.update(crypted, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}
