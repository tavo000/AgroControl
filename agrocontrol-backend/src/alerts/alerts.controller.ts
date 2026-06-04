import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { AlertsService } from './alerts.service';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(
    private alertsService: AlertsService,
  ) {}

  @Get()
  async findAll(
    @Req() req: any,
  ) {
    return this.alertsService.findAll(
      req.user.tenantId,
    );
  }

  @Get('open')
  async findOpen(
    @Req() req: any,
  ) {
    return this.alertsService.findOpen(
      req.user.tenantId,
    );
  }

  @Post()
  async create(
    @Req() req: any,

    @Body()
    body: {
      machineName: string;
      type:
        | 'LOW_FUEL'
        | 'HIGH_TEMPERATURE'
        | 'HIGH_SPEED'
        | 'OFFLINE';
      severity:
        | 'LOW'
        | 'MEDIUM'
        | 'HIGH'
        | 'CRITICAL';
      message: string;
    },
  ) {
    return this.alertsService.create(
      req.user.tenantId,
      body,
    );
  }

  @Patch(':id/resolve')
  async resolve(
    @Req() req: any,

    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.alertsService.resolve(
      req.user.tenantId,
      id,
    );
  }
}