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

import { InventoryService } from './inventory.service';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(
    private inventoryService: InventoryService,
  ) {}

  @Get('categories')
  async findCategories(@Req() req: any) {
    return this.inventoryService.findCategories(
      req.user.tenantId,
    );
  }

  @Post('categories')
  async createCategory(
    @Req() req: any,
    @Body()
    body: {
      name: string;
      description?: string;
    },
  ) {
    return this.inventoryService.createCategory(
      req.user.tenantId,
      body,
    );
  }

  @Get('items')
  async findItems(@Req() req: any) {
    return this.inventoryService.findItems(
      req.user.tenantId,
    );
  }

  @Post('items')
  async createItem(
    @Req() req: any,
    @Body()
    body: {
      categoryId: number;
      name: string;
      description?: string;
      unit?: string;
      minimumStock?: number;
      averageCost?: number;
    },
  ) {
    return this.inventoryService.createItem(
      req.user.tenantId,
      body,
    );
  }

  @Get('movements')
  async findMovements(@Req() req: any) {
    return this.inventoryService.findMovements(
      req.user.tenantId,
    );
  }

  @Post('movements')
  async createMovement(
    @Req() req: any,
    @Body()
    body: {
      itemId: number;
      campaignId?: number;
      type: 'IN' | 'OUT' | 'ADJUSTMENT';
      quantity: number;
      unitCost?: number;
      reason?: string;
      supplier?: string;
      createAgriculturalCost?: boolean;
    },
  ) {
    return this.inventoryService.createMovement(
      req.user.tenantId,
      body,
    );
  }

  @Delete('categories/:id')
  async removeCategory(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.inventoryService.removeCategory(
      req.user.tenantId,
      id,
    );
  }

  @Delete('items/:id')
  async removeItem(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.inventoryService.removeItem(
      req.user.tenantId,
      id,
    );
  }
}