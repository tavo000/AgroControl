import {
  Controller,
  Get,
  Param,
  Req,
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
  async findAll(
    @Req() req: any,
  ) {
    return this.telemetryService.findAll(
      req.user.tenantId,
    );
  }

  @Get(':machineName')
  async findByMachine(
    @Req() req: any,

    @Param('machineName')
    machineName: string,
  ) {
    return this.telemetryService.findByMachine(
      req.user.tenantId,
      machineName,
    );
  }
}