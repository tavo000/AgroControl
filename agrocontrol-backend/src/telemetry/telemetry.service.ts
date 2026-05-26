import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelemetryService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.telemetry.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      take: 200,
    });
  }

  async findByMachine(
    machineName: string,
  ) {
    return this.prisma.telemetry.findMany({
      where: {
        machineName,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 200,
    });
  }
}