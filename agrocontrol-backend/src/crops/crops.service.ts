import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CropsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(
    tenantId: number,
  ) {
    return this.prisma.crop.findMany({
      where: {
        tenantId,
      },

      include: {
        plot: {
          include: {
            farm: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(
    tenantId: number,
    data: {
      plotId: number;
      name: string;
      variety?: string;
      sowingDate?: Date;
      expectedHarvest?: Date;
      status?: string;
    },
  ) {
    return this.prisma.crop.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  async remove(
    tenantId: number,
    id: number,
  ) {
    return this.prisma.crop.deleteMany({
      where: {
        id,
        tenantId,
      },
    });
  }
}