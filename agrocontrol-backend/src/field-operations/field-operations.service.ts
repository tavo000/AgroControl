import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  FieldOperationType,
  InventoryMovementType,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FieldOperationsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(tenantId: number) {
    return this.prisma.fieldOperation.findMany({
      where: {
        tenantId,
      },
      include: {
        farm: true,
        plot: true,
        campaign: true,
        inputs: {
          include: {
            item: true,
            inventoryMovement: true,
          },
        },
      },
      orderBy: {
        operationDate: 'desc',
      },
    });
  }

  async create(
    tenantId: number,
    body: {
      farmId: number;
      plotId: number;
      campaignId?: number;
      planningTaskId?: number;
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
    if (!body.title?.trim()) {
      throw new BadRequestException(
        'El título de la labor es obligatorio.',
      );
    }

    const farm = await this.prisma.farm.findFirst({
      where: {
        id: Number(body.farmId),
        tenantId,
      },
    });

    if (!farm) {
      throw new NotFoundException(
        'El campo no existe o no pertenece a este tenant.',
      );
    }

    const plot = await this.prisma.plot.findFirst({
      where: {
        id: Number(body.plotId),
        tenantId,
        farmId: Number(body.farmId),
      },
    });

    if (!plot) {
      throw new NotFoundException(
        'El lote no existe o no pertenece al campo seleccionado.',
      );
    }

    if (body.campaignId) {
      const campaign =
        await this.prisma.campaign.findFirst({
          where: {
            id: Number(body.campaignId),
            tenantId,
          },
        });

      if (!campaign) {
        throw new NotFoundException(
          'La campaña no existe o no pertenece a este tenant.',
        );
      }
    }

    const inputs = body.inputs || [];

    for (const input of inputs) {
      const item =
        await this.prisma.inventoryItem.findFirst({
          where: {
            id: Number(input.itemId),
            tenantId,
          },
        });

      if (!item) {
        throw new NotFoundException(
          'Uno de los insumos no existe o no pertenece a este tenant.',
        );
      }

      if (item.currentStock < Number(input.quantity)) {
        throw new BadRequestException(
          `Stock insuficiente para el insumo ${item.name}.`,
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      let totalInputCost = 0;

      const operation =
        await tx.fieldOperation.create({
          data: {
            tenantId,
            farmId: Number(body.farmId),
            plotId: Number(body.plotId),
            campaignId: body.campaignId
              ? Number(body.campaignId)
                : undefined,
              planningTaskId: body.planningTaskId
              ? Number(body.planningTaskId)
                : undefined,
                type: body.type,
            title: body.title,
            description: body.description,
            operationDate: body.operationDate
              ? new Date(body.operationDate)
              : new Date(),
            areaWorked: Number(body.areaWorked || 0),
            laborCost: Number(body.laborCost || 0),
            machineryCost: Number(
              body.machineryCost || 0,
            ),
            otherCost: Number(body.otherCost || 0),
            totalInputCost: 0,
            totalOperationCost: 0,
          },
        });

      for (const input of inputs) {
        const item =
          await tx.inventoryItem.findFirst({
            where: {
              id: Number(input.itemId),
              tenantId,
            },
          });

        if (!item) {
          throw new NotFoundException(
            'Uno de los insumos no existe o no pertenece a este tenant.',
          );
        }

        const quantity = Number(input.quantity);
        const unitCost = Number(
          input.unitCost ?? item.averageCost ?? 0,
        );
        const totalCost = quantity * unitCost;

        totalInputCost += totalCost;

        const movement =
          await tx.inventoryMovement.create({
            data: {
              tenantId,
              itemId: item.id,
              campaignId: body.campaignId
                ? Number(body.campaignId)
                : undefined,
              type: InventoryMovementType.OUT,
              quantity,
              unitCost,
              totalCost,
              reason: `Labor agrícola: ${body.title}`,
              movementDate: body.operationDate
                ? new Date(body.operationDate)
                : new Date(),
            },
          });

        await tx.inventoryItem.update({
          where: {
            id: item.id,
          },
          data: {
            currentStock:
              item.currentStock - quantity,
          },
        });

        await tx.fieldOperationInput.create({
          data: {
            tenantId,
            operationId: operation.id,
            itemId: item.id,
            inventoryMovementId: movement.id,
            quantity,
            unitCost,
            totalCost,
          },
        });
      }

      const laborCost = Number(
        body.laborCost || 0,
      );
      const machineryCost = Number(
        body.machineryCost || 0,
      );
      const otherCost = Number(
        body.otherCost || 0,
      );

      const totalOperationCost =
        totalInputCost +
        laborCost +
        machineryCost +
        otherCost;

      const updatedOperation =
        await tx.fieldOperation.update({
          where: {
            id: operation.id,
          },
          data: {
            totalInputCost,
            totalOperationCost,
          },
          include: {
            farm: true,
            plot: true,
            campaign: true,
            inputs: {
              include: {
                item: true,
                inventoryMovement: true,
              },
            },
          },
        });

        if (body.planningTaskId) {
  await tx.planningTask.update({
    where: {
      id: Number(body.planningTaskId),
    },
    data: {
      status: 'COMPLETED',
      progress: 100,
      actualStartDate: body.operationDate
        ? new Date(body.operationDate)
        : new Date(),
      actualEndDate: new Date(),
      actualCost: totalOperationCost,
    },
  });
}

      if (body.campaignId && totalOperationCost > 0) {
        await tx.agriculturalCost.create({
          data: {
            tenantId,
            campaignId: Number(body.campaignId),
            category: 'Labor agrícola',
            description: body.title,
            quantity: 1,
            unitCost: totalOperationCost,
            totalCost: totalOperationCost,
            costDate: body.operationDate
              ? new Date(body.operationDate)
              : new Date(),
          },
        });
      }

      return updatedOperation;
    });
  }

  async remove(
    tenantId: number,
    id: number,
  ) {
    const operation =
      await this.prisma.fieldOperation.findFirst({
        where: {
          id,
          tenantId,
        },
        include: {
          inputs: true,
        },
      });

    if (!operation) {
      throw new NotFoundException(
        'La labor agrícola no existe o no pertenece a este tenant.',
      );
    }

    if (operation.inputs.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar una labor con insumos descontados. Primero se debe implementar reversión de stock.',
      );
    }

    return this.prisma.fieldOperation.delete({
      where: {
        id,
      },
    });
  }
}