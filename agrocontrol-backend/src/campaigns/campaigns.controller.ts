import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
  constructor(
    private campaignsService: CampaignsService,
  ) {}

  @Get()
  async findAll(
    @Req() req: any,
  ) {
    return this.campaignsService.findAll(
      req.user.tenantId,
    );
  }

  @Post()
  async create(
    @Req() req: any,

    @Body()
    body: {
      name: string;
      startDate?: Date;
      endDate?: Date;
      description?: string;
      active?: boolean;
      salePricePerTon?: number;
    },
  ) {
    return this.campaignsService.create(
      req.user.tenantId,
      body,
    );
  }

  @Put(':id')
  async update(
    @Req() req: any,

    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    body: {
      name?: string;
      startDate?: Date;
      endDate?: Date;
      description?: string;
      active?: boolean;
      salePricePerTon?: number;
    },
  ) {
    return this.campaignsService.update(
      req.user.tenantId,
      id,
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
    return this.campaignsService.remove(
      req.user.tenantId,
      id,
    );
  }
}