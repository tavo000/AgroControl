import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  FieldOperationType,
  PlanningTaskPriority,
  PlanningTaskStatus,
} from '@prisma/client';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { PlanningService } from './planning.service';

@Controller('planning-tasks')
@UseGuards(JwtAuthGuard)
export class PlanningController {
  constructor(
    private planningService: PlanningService,
  ) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.planningService.findAll(
      req.user.tenantId,
    );
  }

  @Get('conflicts')
async getConflicts(
  @Req() req: any,
) {
  return this.planningService.getConflicts(
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
      machineId?: number;
      title: string;
      description?: string;
      operationType: FieldOperationType;
      status?: PlanningTaskStatus;
      priority?: PlanningTaskPriority;
      plannedDate: Date;
      estimatedArea?: number;
      estimatedDuration?: number;
      estimatedCost?: number;
      assignedOperator?: string;
      notes?: string;
    },
  ) {
    return this.planningService.create(
      req.user.tenantId,
      body,
    );
  }

  @Patch(':id/status')
  async updateStatus(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      status: PlanningTaskStatus;
    },
  ) {
    return this.planningService.updateStatus(
      req.user.tenantId,
      id,
      body.status,
    );
  }

  @Delete(':id')
  async remove(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.planningService.remove(
      req.user.tenantId,
      id,
    );
  }
}