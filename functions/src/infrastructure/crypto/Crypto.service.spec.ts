import { Test, TestingModule } from '@nestjs/testing';
import { CryptoSpi } from '../../domain/CryptoSpi';
import { CryptoService } from './Crypto.service';
import { ConfigSpi } from '../../domain/ConfigSpi';
import { Provider } from '@nestjs/common';
import Mock = jest.Mock;

describe('CryptoService', () => {
  let service: CryptoSpi;

  const mockedConfig: ConfigSpi = {
    get: jest.fn(),
    require: jest.fn(),
  };
  const mockedConfigSpi: Provider<ConfigSpi> = {
    provide: 'ConfigSpi',
    useValue: mockedConfig,
  };

  beforeEach(async () => {
    (mockedConfig.require as Mock).mockImplementation((key: string) => key);

    const module: TestingModule = await Test.createTestingModule({
      providers: [mockedConfigSpi, CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be effective', () => {
    const test = 'lorem ipsum 123 !';
    expect(service.cypher(test)).not.toBe(test);
  });

  it('should be reversible', () => {
    const test = 'lorem ipsum 123 !';
    const cyphered = service.cypher(test);
    expect(service.decipher(cyphered)).toBe(test);
  });

  it('should not be determinist', () => {
    const test = 'lorem ipsum 123 !';
    expect(service.cypher(test)).not.toBe(service.cypher(test));
  });

  it('should depends on key', async () => {
    // GIVEN
    (mockedConfig.require as Mock).mockImplementation((key: string) => key + '2');
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockedConfigSpi, CryptoService],
    }).compile();
    const serviceWithDifferentKey = module.get<CryptoService>(CryptoService);

    // WHEN
    const cyphered = service.cypher('lorem ipsum 123 !');

    // THEN
    expect(() => serviceWithDifferentKey.decipher(cyphered)).toThrowError();
  });

  it('should not be sensible to instantiation', async () => {
    // GIVEN
    const test = 'lorem ipsum 123 !';
    const module: TestingModule = await Test.createTestingModule({
      providers: [mockedConfigSpi, CryptoService],
    }).compile();
    const service2 = module.get<CryptoService>(CryptoService);

    // WHEN
    const cyphered = service.cypher(test);

    // THEN
    expect(service2.decipher(cyphered)).toBe(test);
  });
});
