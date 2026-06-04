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

import { MachinesService } from './machines.service';

@Controller('machines')
@UseGuards(JwtAuthGuard)
export class MachinesController {
  constructor(
    private machinesService: MachinesService,
  ) {}

  @Get()
  async findAll(
    @Req() req: any,
  ) {
    return this.machinesService.findAll(
      req.user.tenantId,
    );
  }

  @Get('map')
  async findForMap(
    @Req() req: any,
  ) {
    return this.machinesService.findForMap(
      req.user.tenantId,
    );
  }

  @Post()
  async create(
    @Req() req: any,

    @Body()
    body: {
      name: string;
      lat: number;
      lng: number;
      fuel: number;
      temperature: number;
      speed: number;
      active: boolean;
    },
  ) {
    return this.machinesService.create(
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
    return this.machinesService.remove(
      req.user.tenantId,
      id,
    );
  }
}