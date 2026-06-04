import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(tenantId: number) {
    return this.prisma.alert.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOpen(tenantId: number) {
    return this.prisma.alert.findMany({
      where: {
        tenantId,
        resolved: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(
    tenantId: number,
    data: {
      machineName: string;
      type:
        | 'LOW_FUEL'
        | 'HIGH_TEMPERATURE'
        | 'HIGH_SPEED'
        | 'OFFLINE';
      severity:
        | 'LOW'
        | 'MEDIUM'
        | 'HIGH'
        | 'CRITICAL';
      message: string;
    },
  ) {
    return this.prisma.alert.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async resolve(
    tenantId: number,
    id: number,
  ) {
    return this.prisma.alert.updateMany({
      where: {
        id,
        tenantId,
      },
      data: {
        resolved: true,
      },
    });
  }
}