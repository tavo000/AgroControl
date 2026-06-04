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

import { CropsService } from './crops.service';

@Controller('crops')
@UseGuards(JwtAuthGuard)
export class CropsController {
  constructor(
    private cropsService: CropsService,
  ) {}

  @Get()
  async findAll(
    @Req() req: any,
  ) {
    return this.cropsService.findAll(
      req.user.tenantId,
    );
  }

  @Post()
  async create(
    @Req() req: any,

    @Body()
    body: {
      plotId: number;
      campaignId?: number;
      name: string;
      variety?: string;
      sowingDate?: Date;
      expectedHarvest?: Date;
      status?: string;
    },
  ) {
    return this.cropsService.create(
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
    return this.cropsService.remove(
      req.user.tenantId,
      id,
    );
  }
}
