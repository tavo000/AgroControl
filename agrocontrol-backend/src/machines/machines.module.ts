import { Module } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { MachinesGateway } from './machines.gateway';

@Module({
  providers: [
  MachinesService,
  MachinesGateway,
],
  controllers: [MachinesController]
})
export class MachinesModule {}
