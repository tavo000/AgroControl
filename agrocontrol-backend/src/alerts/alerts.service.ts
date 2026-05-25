import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.alert.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: {
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
  }) {
    return this.prisma.alert.create({
      data,
    });
  }

  async resolve(id: number) {
    return this.prisma.alert.update({
      where: {
        id,
      },
      data: {
        resolved: true,
      },
    });
  }
}