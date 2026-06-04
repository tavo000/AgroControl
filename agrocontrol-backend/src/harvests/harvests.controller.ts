import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { HarvestsService } from './harvests.service';

@Controller('harvests')
@UseGuards(JwtAuthGuard)
export class HarvestsController {
  constructor(
    private harvestsService: HarvestsService,
  ) {}

  @Get()
  async findAll(
    @Req() req: any,
  ) {
    return this.harvestsService.findAll(
      req.user.tenantId,
    );
  }

  @Post()
  async create(
    @Req() req: any,

    @Body()
    body: {
      cropId: number;
      harvestDate?: Date;
      totalProduction: number;
      harvestedArea: number;
      yieldPerHectare: number;
      unit?: string;
      campaign?: string;
      observations?: string;
    },
  ) {
    return this.harvestsService.create(
      req.user.tenantId,
      body,
    );
  }

  @Delete(':id')
  async remove(
    @Req() req: any,

    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.harvestsService.remove(
      req.user.tenantId,
      id,
    );
  }
}