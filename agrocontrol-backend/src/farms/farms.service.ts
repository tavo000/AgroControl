import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FarmsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(
    tenantId: number,
  ) {
    return this.prisma.farm.findMany({
      where: {
        tenantId,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(
    tenantId: number,
    data: {
      name: string;
      location?: string;
      area?: number;
    },
  ) {
    return this.prisma.farm.create({
      data: {
        tenantId,
        name: data.name,
        location: data.location,
        area: data.area,
      },
    });
  }

  async remove(
    tenantId: number,
    id: number,
  ) {
    return this.prisma.farm.deleteMany({
      where: {
        id,
        tenantId,
      },
    });
  }
}