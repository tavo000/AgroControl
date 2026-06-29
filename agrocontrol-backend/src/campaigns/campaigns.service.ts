import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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
        startDate: data.startDate
          ? new Date(data.startDate)
          : undefined,
        endDate: data.endDate
          ? new Date(data.endDate)
          : undefined,
        description: data.description,
        active: data.active ?? true,
        salePricePerTon:
          data.salePricePerTon !== undefined
            ? Number(data.salePricePerTon)
            : 0,
      },
    });
  }

  async update(
    tenantId: number,
    id: number,
    data: {
      name?: string;
      startDate?: Date;
      endDate?: Date;
      description?: string;
      active?: boolean;
      salePricePerTon?: number;
    },
  ) {
    const campaign =
      await this.prisma.campaign.findFirst({
        where: {
          id,
          tenantId,
        },
      });

    if (!campaign) {
      throw new NotFoundException(
        'La campaña no existe o no pertenece a este tenant.',
      );
    }

    return this.prisma.campaign.update({
      where: {
        id,
      },
      data: {
        name: data.name ?? campaign.name,
        startDate:
          data.startDate !== undefined
            ? new Date(data.startDate)
            : campaign.startDate,
        endDate:
          data.endDate !== undefined
            ? new Date(data.endDate)
            : campaign.endDate,
        description:
          data.description !== undefined
            ? data.description
            : campaign.description,
        active:
          data.active !== undefined
            ? data.active
            : campaign.active,
        salePricePerTon:
          data.salePricePerTon !== undefined
            ? Number(data.salePricePerTon)
            : campaign.salePricePerTon,
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