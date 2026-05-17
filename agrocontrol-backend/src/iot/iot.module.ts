import { Module } from '@nestjs/common';
import { IotGateway } from './iot.gateway';
import { IotService } from './iot.service';

@Module({
  providers: [IotGateway, IotService]
})
export class IotModule {}
