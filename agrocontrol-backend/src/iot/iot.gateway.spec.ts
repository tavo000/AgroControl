import { Test, TestingModule } from '@nestjs/testing';
import { IotGateway } from './iot.gateway';

describe('IotGateway', () => {
  let gateway: IotGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IotGateway],
    }).compile();

    gateway = module.get<IotGateway>(IotGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
