import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getKpis(tenantId: number) {
    const [
      totalMachines,
      activeMachines,
      openAlerts,
      criticalAlerts,
      telemetryAvg,
    ] = await Promise.all([
      this.prisma.machine.count({
        where: { tenantId },
      }),

      this.prisma.machine.count({
        where: {
          tenantId,
          active: true,
        },
      }),

      this.prisma.alert.count({
        where: {
          tenantId,
          resolved: false,
        },
      }),

      this.prisma.alert.count({
        where: {
          tenantId,
          resolved: false,
          severity: 'CRITICAL',
        },
      }),

      this.prisma.telemetry.aggregate({
        where: { tenantId },
        _avg: {
          fuel: true,
          temperature: true,
          speed: true,
        },
      }),
    ]);

    return {
      totalMachines,
      activeMachines,
      openAlerts,
      criticalAlerts,
      avgFuel:
        telemetryAvg._avg.fuel ?? 0,
      avgTemperature:
        telemetryAvg._avg.temperature ?? 0,
      avgSpeed:
        telemetryAvg._avg.speed ?? 0,
    };
  }
}