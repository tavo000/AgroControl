import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelemetryService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(tenantId: number) {
    return this.prisma.telemetry.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 200,
    });
  }

  async findByMachine(
    tenantId: number,
    machineName: string,
  ) {
    return this.prisma.telemetry.findMany({
      where: {
        tenantId,
        machineName,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 200,
    });
  }
}