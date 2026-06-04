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
        campaign: true,

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
      campaignId?: number;
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
        plotId: data.plotId,
        campaignId: data.campaignId,
        name: data.name,
        variety: data.variety,
        sowingDate: data.sowingDate,
        expectedHarvest:
          data.expectedHarvest,
        status:
          data.status ?? 'Activo',
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