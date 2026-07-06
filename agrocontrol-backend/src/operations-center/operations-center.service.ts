import { Injectable } from '@nestjs/common';

import {
  AlertSeverity,
  FieldOperationStatus,
  PlanningTaskStatus,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OperationsCenterService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getOverview(tenantId: number) {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      pendingPlanning,
      inProgressPlanning,
      completedTodayPlanning,
      runningOperations,
      finishedTodayOperations,
      lowStockItems,
      criticalAlerts,
      highAlerts,
      activeMachines,
      offlineMachines,
      todayCosts,
    ] = await Promise.all([
      this.prisma.planningTask.count({
        where: {
          tenantId,
          status: PlanningTaskStatus.PLANNED,
        },
      }),

      this.prisma.planningTask.count({
        where: {
          tenantId,
          status: PlanningTaskStatus.IN_PROGRESS,
        },
      }),

      this.prisma.planningTask.count({
        where: {
          tenantId,
          status: PlanningTaskStatus.COMPLETED,
          actualEndDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      this.prisma.fieldOperation.count({
        where: {
          tenantId,
          status: FieldOperationStatus.IN_PROGRESS,
        },
      }),

      this.prisma.fieldOperation.count({
        where: {
          tenantId,
          status: FieldOperationStatus.COMPLETED,
          actualEndDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      this.prisma.inventoryItem.count({
        where: {
          tenantId,
          minimumStock: {
            gt: 0,
          },
          currentStock: {
            lte: this.prisma.inventoryItem.fields.minimumStock,
          },
        },
      }),

      this.prisma.alert.count({
        where: {
          tenantId,
          severity: AlertSeverity.CRITICAL,
          resolved: false,
        },
      }),

      this.prisma.alert.count({
        where: {
          tenantId,
          severity: AlertSeverity.HIGH,
          resolved: false,
        },
      }),

      this.prisma.machine.count({
        where: {
          tenantId,
          active: true,
        },
      }),

      this.prisma.machine.count({
        where: {
          tenantId,
          active: false,
        },
      }),

      this.prisma.agriculturalCost.aggregate({
        where: {
          tenantId,
          costDate: {
            gte: today,
            lt: tomorrow,
          },
        },
        _sum: {
          totalCost: true,
        },
      }),
    ]);

    return {
      planning: {
        pending: pendingPlanning,
        inProgress: inProgressPlanning,
        completedToday: completedTodayPlanning,
      },

      fieldOperations: {
        running: runningOperations,
        finishedToday: finishedTodayOperations,
      },

      inventory: {
        lowStock: lowStockItems,
      },

      alerts: {
        critical: criticalAlerts,
        high: highAlerts,
      },

      machines: {
        active: activeMachines,
        offline: offlineMachines,
      },

      financial: {
        todayCost:
          todayCosts._sum.totalCost ?? 0,
      },
    };
  }
}