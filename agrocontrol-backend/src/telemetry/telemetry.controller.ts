import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { TelemetryService } from './telemetry.service';

@Controller('telemetry')
@UseGuards(JwtAuthGuard)
export class TelemetryController {
  constructor(
    private telemetryService: TelemetryService,
  ) {}

  @Get()
  async findAll() {
    return this.telemetryService.findAll();
  }

  @Get(':machineName')
  async findByMachine(
    @Param('machineName')
    machineName: string,
  ) {
    return this.telemetryService.findByMachine(
      machineName,
    );
  }
}