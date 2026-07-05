import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  FieldOperationType,
  PlanningTaskPriority,
  PlanningTaskStatus,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlanningService {
  constructor(
    private prisma: PrismaService,
  ) {}

  private async validatePlanningConflicts(
    tenantId: number,
    body: {
      plotId: number;
      machineId?: number;
      plannedDate: Date;
      title: string;
    },
  ) {
    const plannedDate = new Date(body.plannedDate);

    const start = new Date(plannedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(plannedDate);
    end.setHours(23, 59, 59, 999);

    const plotConflict =
      await this.prisma.planningTask.findFirst({
        where: {
          tenantId,
          plotId: Number(body.plotId),
          plannedDate: {
            gte: start,
            lte: end,
          },
          status: {
            not: PlanningTaskStatus.CANCELLED,
          },
        },
      });

    if (plotConflict) {
      throw new BadRequestException(
        `El lote ya posee una tarea planificada para esa fecha: "${plotConflict.title}".`,
      );
    }

    if (body.machineId) {
      const machineConflict =
        await this.prisma.planningTask.findFirst({
          where: {
            tenantId,
            machineId: Number(body.machineId),
            plannedDate: {
              gte: start,
              lte: end,
            },
            status: {
              not: PlanningTaskStatus.CANCELLED,
            },
          },
        });

      if (machineConflict) {
        throw new BadRequestException(
          `La maquinaria ya se encuentra asignada a "${machineConflict.title}" para esa fecha.`,
        );
      }
    }
  }

  async findAll(tenantId: number) {
    return this.prisma.planningTask.findMany({
      where: {
        tenantId,
      },
      include: {
        farm: true,
        plot: true,
        campaign: true,
        machine: true,
        fieldOperations: true,
      },
      orderBy: {
        plannedDate: 'asc',
      },
    });
  }

  async create(
    tenantId: number,
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
    if (!body.title?.trim()) {
      throw new BadRequestException(
        'El título de la tarea es obligatorio.',
      );
    }

    if (!body.plannedDate) {
      throw new BadRequestException(
        'La fecha planificada es obligatoria.',
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
        farmId: Number(body.farmId),
        tenantId,
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

    if (body.machineId) {
      const machine =
        await this.prisma.machine.findFirst({
          where: {
            id: Number(body.machineId),
            tenantId,
          },
        });

      if (!machine) {
        throw new NotFoundException(
          'La maquinaria no existe o no pertenece a este tenant.',
        );
      }
    }

    await this.validatePlanningConflicts(
      tenantId,
      body,
    );

    return this.prisma.planningTask.create({
      data: {
        tenantId,
        farmId: Number(body.farmId),
        plotId: Number(body.plotId),
        campaignId: body.campaignId
          ? Number(body.campaignId)
          : undefined,
        machineId: body.machineId
          ? Number(body.machineId)
          : undefined,
        title: body.title,
        description: body.description,
        operationType: body.operationType,
        status:
          body.status ?? PlanningTaskStatus.PLANNED,
        priority:
          body.priority ??
          PlanningTaskPriority.MEDIUM,
        plannedDate: new Date(body.plannedDate),
        estimatedArea: Number(
          body.estimatedArea || 0,
        ),
        estimatedDuration: Number(
          body.estimatedDuration || 0,
        ),
        estimatedCost: Number(
          body.estimatedCost || 0,
        ),
        assignedOperator:
          body.assignedOperator,
        notes: body.notes,
      },
      include: {
        farm: true,
        plot: true,
        campaign: true,
        machine: true,
      },
    });
  }

  async getConflicts(tenantId: number) {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tasks =
      await this.prisma.planningTask.findMany({
        where: {
          tenantId,
          status: {
            not: PlanningTaskStatus.CANCELLED,
          },
        },
        include: {
          farm: true,
          plot: true,
          machine: true,
          campaign: true,
        },
        orderBy: {
          plannedDate: 'asc',
        },
      });

    const overdueTasks = tasks.filter(
      (task) =>
        task.status !==
          PlanningTaskStatus.COMPLETED &&
        task.plannedDate < today,
    );

    const criticalTasks = tasks.filter(
      (task) =>
        task.priority ===
        PlanningTaskPriority.CRITICAL,
    );

    return {
      totalTasks: tasks.length,
      overdueTasks,
      criticalTasks,
    };
  }

  async executeTask(
    tenantId: number,
    id: number,
  ) {
    const task =
      await this.prisma.planningTask.findFirst({
        where: {
          id,
          tenantId,
        },
        include: {
          fieldOperations: true,
        },
      });

    if (!task) {
      throw new NotFoundException(
        'La tarea planificada no existe o no pertenece a este tenant.',
      );
    }

    if (task.status === PlanningTaskStatus.CANCELLED) {
      throw new BadRequestException(
        'No se puede ejecutar una tarea cancelada.',
      );
    }

    if (task.fieldOperations.length > 0) {
      throw new BadRequestException(
        'Esta planificación ya fue ejecutada como labor agrícola.',
      );
    }

    const estimatedCost = Number(
      task.estimatedCost || 0,
    );

    return this.prisma.$transaction(async (tx) => {
      const operation =
        await tx.fieldOperation.create({
          data: {
            tenantId,
            farmId: task.farmId,
            plotId: task.plotId,
            campaignId: task.campaignId ?? undefined,
            planningTaskId: task.id,
            type: task.operationType,
            title: task.title,
            description: task.description,
            operationDate: new Date(),
            areaWorked: Number(
              task.estimatedArea || 0,
            ),
            laborCost: 0,
            machineryCost: 0,
            otherCost: estimatedCost,
            totalInputCost: 0,
            totalOperationCost: estimatedCost,
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

      if (task.campaignId && estimatedCost > 0) {
        await tx.agriculturalCost.create({
          data: {
            tenantId,
            campaignId: task.campaignId,
            category: 'Labor planificada',
            description: task.title,
            quantity: 1,
            unitCost: estimatedCost,
            totalCost: estimatedCost,
            costDate: new Date(),
          },
        });
      }

      const updatedTask =
        await tx.planningTask.update({
          where: {
            id: task.id,
          },
          data: {
                status: PlanningTaskStatus.COMPLETED,

                progress: 100,

              actualStartDate: new Date(),

                actualEndDate: new Date(),

                actualDuration:
                task.estimatedDuration ?? 0,

                actualCost: estimatedCost,
              },
          include: {
            farm: true,
            plot: true,
            campaign: true,
            machine: true,
            fieldOperations: true,
          },
        });

      return {
        task: updatedTask,
        fieldOperation: operation,
      };
    });
  }

  async updateStatus(
    tenantId: number,
    id: number,
    status: PlanningTaskStatus,
  ) {
    const task =
      await this.prisma.planningTask.findFirst({
        where: {
          id,
          tenantId,
        },
      });

    if (!task) {
      throw new NotFoundException(
        'La tarea planificada no existe o no pertenece a este tenant.',
      );
    }

    return this.prisma.planningTask.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        farm: true,
        plot: true,
        campaign: true,
        machine: true,
      },
    });
  }

  async remove(
    tenantId: number,
    id: number,
  ) {
    const task =
      await this.prisma.planningTask.findFirst({
        where: {
          id,
          tenantId,
        },
        include: {
          fieldOperations: true,
        },
      });

    if (!task) {
      throw new NotFoundException(
        'La tarea planificada no existe o no pertenece a este tenant.',
      );
    }

    if (task.fieldOperations.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar una planificación que ya tiene labores ejecutadas.',
      );
    }

    return this.prisma.planningTask.delete({
      where: {
        id,
      },
    });
  }
}