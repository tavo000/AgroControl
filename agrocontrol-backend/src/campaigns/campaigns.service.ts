import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(
    tenantId: number,
  ) {
    return this.prisma.campaign.findMany({
      where: {
        tenantId,
      },

      include: {
        crops: true,
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
      startDate?: Date;
      endDate?: Date;
      description?: string;
      active?: boolean;
      salePricePerTon?: number;
    },
  ) {
    return this.prisma.campaign.create({
      data: {
        tenantId,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        active: data.active ?? true,
        salePricePerTon:
          data.salePricePerTon !== undefined
            ? Number(data.salePricePerTon)
            : 0,
      },
    });
  }

  async remove(
    tenantId: number,
    id: number,
  ) {
    return this.prisma.campaign.deleteMany({
      where: {
        id,
        tenantId,
      },
    });
  }
}