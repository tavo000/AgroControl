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

import { FieldOperationType } from '@prisma/client';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { FieldOperationsService } from './field-operations.service';

@Controller('field-operations')
@UseGuards(JwtAuthGuard)
export class FieldOperationsController {
  constructor(
    private fieldOperationsService: FieldOperationsService,
  ) {}

  @Get()
  async findAll(
    @Req() req: any,
  ) {
    return this.fieldOperationsService.findAll(
      req.user.tenantId,
    );
  }

  @Post()
  async create(
    @Req() req: any,

    @Body()
    body: {
      farmId: number;
      plotId: number;
      campaignId?: number;
      type: FieldOperationType;
      title: string;
      description?: string;
      operationDate?: Date;
      areaWorked?: number;
      laborCost?: number;
      machineryCost?: number;
      otherCost?: number;
      inputs?: {
        itemId: number;
        quantity: number;
        unitCost?: number;
      }[];
    },
  ) {
    return this.fieldOperationsService.create(
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
    return this.fieldOperationsService.remove(
      req.user.tenantId,
      id,
    );
  }
}