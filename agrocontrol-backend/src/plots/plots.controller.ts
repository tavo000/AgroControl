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

import { PlotsService } from './plots.service';

@Controller('plots')
@UseGuards(JwtAuthGuard)
export class PlotsController {
  constructor(
    private plotsService: PlotsService,
  ) {}

  @Get()
  async findAll(
    @Req() req: any,
  ) {
    return this.plotsService.findAll(
      req.user.tenantId,
    );
  }

  @Post()
  async create(
    @Req() req: any,

    @Body()
    body: {
      farmId: number;
      name: string;
      area?: number;
      crop?: string;
      status?: string;
      soilType?: string;
      lastActivity?: string;
    },
  ) {
    return this.plotsService.create(
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
    return this.plotsService.remove(
      req.user.tenantId,
      id,
    );
  }
}