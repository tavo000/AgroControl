import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlotsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(tenantId: number) {
    return this.prisma.plot.findMany({
      where: {
        tenantId,
      },
      include: {
        farm: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(
    tenantId: number,
    data: {
      farmId: number;
      name: string;
      area?: number;
      crop?: string;
      status?: string;
      soilType?: string;
      lastActivity?: string;
    },
  ) {
    return this.prisma.plot.create({
      data: {
        tenantId,
        farmId: data.farmId,
        name: data.name,
        area: data.area,
        crop: data.crop,
        status: data.status,
        soilType: data.soilType,
        lastActivity: data.lastActivity,
      },
    });
  }

  async remove(
    tenantId: number,
    id: number,
  ) {
    return this.prisma.plot.deleteMany({
      where: {
        id,
        tenantId,
      },
    });
  }
}