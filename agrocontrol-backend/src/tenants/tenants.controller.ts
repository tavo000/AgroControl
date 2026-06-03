import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(
    private tenantsService: TenantsService,
  ) {}

  @Get()
  async findAll() {
    return this.tenantsService.findAll();
  }

  @Post()
  async create(
    @Body()
    body: {
      name: string;
    },
  ) {
    return this.tenantsService.create(
      body.name,
    );
  }

  @Patch(':id/toggle')
  async toggle(
    @Param('id')
    id: string,
  ) {
    return this.tenantsService.toggleActive(
      Number(id),
    );
  }
}