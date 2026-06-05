import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgriculturalCostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: number) {
    return this.prisma.agriculturalCost.findMany({
      where: {
        tenantId,
      },
      include: {
        campaign: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByCampaign(
    tenantId: number,
    campaignId: number,
  ) {
    return this.prisma.agriculturalCost.findMany({
      where: {
        tenantId,
        campaignId,
      },
      include: {
        campaign: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getSummary(tenantId: number) {
    const costs =
      await this.prisma.agriculturalCost.findMany({
        where: {
          tenantId,
        },
        include: {
          campaign: true,
        },
      });

    const totalInvested = costs.reduce(
      (acc, cost) => acc + cost.totalCost,
      0,
    );

    const totalRecords = costs.length;

    const byCategory = costs.reduce(
      (
        acc: Record<string, number>,
        cost,
      ) => {
        acc[cost.category] =
          (acc[cost.category] || 0) +
          cost.totalCost;

        return acc;
      },
      {},
    );

    const byCampaign = costs.reduce(
      (
        acc: Record<string, number>,
        cost,
      ) => {
        const campaignName =
          cost.campaign?.name || 'Sin campaña';

        acc[campaignName] =
          (acc[campaignName] || 0) +
          cost.totalCost;

        return acc;
      },
      {},
    );

    return {
      totalInvested,
      totalRecords,
      byCategory,
      byCampaign,
    };
  }

  async create(
    tenantId: number,
    body: {
      campaignId: number;
      category: string;
      description?: string;
      quantity?: number;
      unitCost: number;
      totalCost?: number;
      costDate?: Date;
      supplier?: string;
    },
  ) {
    const campaign =
      await this.prisma.campaign.findFirst({
        where: {
          id: Number(body.campaignId),
          tenantId,
        },
      });

    if (!campaign) {
      throw new NotFoundException(
        'La campaña no existe o no pertenece a este tenant.',
      );
    }

    const quantity = Number(body.quantity || 1);
    const unitCost = Number(body.unitCost);

    if (!body.category) {
      throw new BadRequestException(
        'La categoría del costo es obligatoria.',
      );
    }

    if (!unitCost || unitCost <= 0) {
      throw new BadRequestException(
        'El costo unitario debe ser mayor a cero.',
      );
    }

    const totalCost =
      body.totalCost !== undefined
        ? Number(body.totalCost)
        : quantity * unitCost;

    return this.prisma.agriculturalCost.create({
      data: {
        tenantId,
        campaignId: Number(body.campaignId),
        category: body.category,
        description: body.description,
        quantity,
        unitCost,
        totalCost,
        costDate: body.costDate
          ? new Date(body.costDate)
          : new Date(),
        supplier: body.supplier,
      },
    });
  }

  async remove(
    tenantId: number,
    id: number,
  ) {
    const cost =
      await this.prisma.agriculturalCost.findFirst({
        where: {
          id,
          tenantId,
        },
      });

    if (!cost) {
      throw new NotFoundException(
        'El costo agrícola no existe o no pertenece a este tenant.',
      );
    }

    return this.prisma.agriculturalCost.delete({
      where: {
        id,
      },
    });
  }
}