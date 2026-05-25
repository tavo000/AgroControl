import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
  async findAll() {
    return this.alertsService.findAll();
  }

  @Post()
  async create(
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
      body,
    );
  }

  @Patch(':id/resolve')
  async resolve(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.alertsService.resolve(
      id,
    );
  }
}