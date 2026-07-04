import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InventoryMovementType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findCategories(tenantId: number) {
    return this.prisma.inventoryCategory.findMany({
      where: {
        tenantId,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createCategory(
    tenantId: number,
    body: {
      name: string;
      description?: string;
    },
  ) {
    if (!body.name?.trim()) {
      throw new BadRequestException(
        'El nombre de la categoría es obligatorio.',
      );
    }

    return this.prisma.inventoryCategory.create({
      data: {
        tenantId,
        name: body.name,
        description: body.description,
      },
    });
  }

  async findItems(tenantId: number) {
    return this.prisma.inventoryItem.findMany({
      where: {
        tenantId,
      },
      include: {
        category: true,
        movements: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createItem(
    tenantId: number,
    body: {
      categoryId: number;
      name: string;
      description?: string;
      unit?: string;
      minimumStock?: number;
      averageCost?: number;
    },
  ) {
    if (!body.name?.trim()) {
      throw new BadRequestException(
        'El nombre del insumo es obligatorio.',
      );
    }

    const category =
      await this.prisma.inventoryCategory.findFirst({
        where: {
          id: Number(body.categoryId),
          tenantId,
        },
      });

    if (!category) {
      throw new NotFoundException(
        'La categoría no existe o no pertenece a este tenant.',
      );
    }

    return this.prisma.inventoryItem.create({
      data: {
        tenantId,
        categoryId: Number(body.categoryId),
        name: body.name,
        description: body.description,
        unit: body.unit || 'unidad',
        minimumStock: Number(body.minimumStock || 0),
        averageCost: Number(body.averageCost || 0),
      },
    });
  }

  async findMovements(tenantId: number) {
    return this.prisma.inventoryMovement.findMany({
      where: {
        tenantId,
      },
      include: {
        item: {
          include: {
            category: true,
          },
        },
        campaign: true,
        agriculturalCosts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createMovement(
    tenantId: number,
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
    const item =
      await this.prisma.inventoryItem.findFirst({
        where: {
          id: Number(body.itemId),
          tenantId,
        },
      });

    if (!item) {
      throw new NotFoundException(
        'El insumo no existe o no pertenece a este tenant.',
      );
    }

    const quantity = Number(body.quantity);
    const unitCost = Number(
      body.unitCost ?? item.averageCost ?? 0,
    );

    if (!quantity || quantity <= 0) {
      throw new BadRequestException(
        'La cantidad debe ser mayor a cero.',
      );
    }

    const movementType =
      body.type as InventoryMovementType;

    let nextStock = item.currentStock;

    if (movementType === InventoryMovementType.IN) {
      nextStock = item.currentStock + quantity;
    }

    if (movementType === InventoryMovementType.OUT) {
      if (item.currentStock < quantity) {
        throw new BadRequestException(
          'Stock insuficiente para realizar la salida.',
        );
      }

      nextStock = item.currentStock - quantity;
    }

    if (
      movementType ===
      InventoryMovementType.ADJUSTMENT
    ) {
      nextStock = quantity;
    }

    const totalCost = quantity * unitCost;

    return this.prisma.$transaction(async (tx) => {
      const movement =
        await tx.inventoryMovement.create({
          data: {
            tenantId,
            itemId: item.id,
            campaignId: body.campaignId
              ? Number(body.campaignId)
              : undefined,
            type: movementType,
            quantity,
            unitCost,
            totalCost,
            reason: body.reason,
            supplier: body.supplier,
          },
        });

      await tx.inventoryItem.update({
        where: {
          id: item.id,
        },
        data: {
          currentStock: nextStock,
          averageCost:
            movementType === InventoryMovementType.IN
              ? unitCost
              : item.averageCost,
        },
      });

      if (
        body.createAgriculturalCost &&
        movementType === InventoryMovementType.OUT &&
        body.campaignId
      ) {
        await tx.agriculturalCost.create({
          data: {
            tenantId,
            campaignId: Number(body.campaignId),
            category: item.name,
            description:
              body.reason ||
              `Consumo de inventario: ${item.name}`,
            quantity,
            unitCost,
            totalCost,
            costDate: new Date(),
            supplier: body.supplier,
            inventoryMovementId: movement.id,
          },
        });
      }

      return movement;
    });
  }

  async removeCategory(
    tenantId: number,
    id: number,
  ) {
    const category =
      await this.prisma.inventoryCategory.findFirst({
        where: {
          id,
          tenantId,
        },
        include: {
          items: true,
        },
      });

    if (!category) {
      throw new NotFoundException(
        'La categoría no existe o no pertenece a este tenant.',
      );
    }

    if (category.items.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar una categoría con insumos asociados.',
      );
    }

    return this.prisma.inventoryCategory.delete({
      where: {
        id,
      },
    });
  }

  async removeItem(
    tenantId: number,
    id: number,
  ) {
    const item =
      await this.prisma.inventoryItem.findFirst({
        where: {
          id,
          tenantId,
        },
        include: {
          movements: true,
        },
      });

    if (!item) {
      throw new NotFoundException(
        'El insumo no existe o no pertenece a este tenant.',
      );
    }

    if (item.movements.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar un insumo con movimientos asociados.',
      );
    }

    return this.prisma.inventoryItem.delete({
      where: {
        id,
      },
    });
  }
}