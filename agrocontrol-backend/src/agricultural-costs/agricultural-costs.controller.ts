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

import { AgriculturalCostsService } from './agricultural-costs.service';

@Controller('agricultural-costs')
@UseGuards(JwtAuthGuard)
export class AgriculturalCostsController {
  constructor(
    private agriculturalCostsService: AgriculturalCostsService,
  ) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.agriculturalCostsService.findAll(
      req.user.tenantId,
    );
  }

  @Get('summary')
  async getSummary(@Req() req: any) {
    return this.agriculturalCostsService.getSummary(
      req.user.tenantId,
    );
  }

  @Get('campaign/:campaignId')
  async findByCampaign(
    @Req() req: any,

    @Param(
      'campaignId',
      ParseIntPipe,
    )
    campaignId: number,
  ) {
    return this.agriculturalCostsService.findByCampaign(
      req.user.tenantId,
      campaignId,
    );
  }

  @Post()
  async create(
    @Req() req: any,

    @Body()
    body: {
      campaignId: number;
      category: string;
      description?: string;
      quantity?: number;
      unitCost: number;
      totalCost?: number;
      costDate?: Date;
      supplier?: string;
    },
  ) {
    return this.agriculturalCostsService.create(
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
    return this.agriculturalCostsService.remove(
      req.user.tenantId,
      id,
    );
  }
}