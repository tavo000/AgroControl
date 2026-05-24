import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
  async findAll() {
    return this.machinesService.findAll();
  }

  @Post()
  async create(
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
      body,
    );
  }

  @Delete(':id')
  async remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.machinesService.remove(
      id,
    );
  }
}