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

import { FarmsService } from './farms.service';

@Controller('farms')
@UseGuards(JwtAuthGuard)
export class FarmsController {
  constructor(
    private farmsService: FarmsService,
  ) {}

  @Get()
  async findAll(
    @Req() req: any,
  ) {
    return this.farmsService.findAll(
      req.user.tenantId,
    );
  }

  @Post()
  async create(
    @Req() req: any,

    @Body()
    body: {
      name: string;
      location?: string;
      area?: number;
    },
  ) {
    return this.farmsService.create(
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
    return this.farmsService.remove(
      req.user.tenantId,
      id,
    );
  }
}