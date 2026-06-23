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
      where: { tenantId },
      include: { campaign: true },
      orderBy: { createdAt: 'desc' },
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
      include: { campaign: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSummary(tenantId: number) {
    const costs =
      await this.prisma.agriculturalCost.findMany({
        where: { tenantId },
        include: { campaign: true },
      });

    const totalInvested = costs.reduce(
      (acc, cost) => acc + cost.totalCost,
      0,
    );

    const totalRecords = costs.length;

    const byCategory = costs.reduce(
      (acc: Record<string, number>, cost) => {
        acc[cost.category] =
          (acc[cost.category] || 0) +
          cost.totalCost;

        return acc;
      },
      {},
    );

    const byCampaign = costs.reduce(
      (acc: Record<string, number>, cost) => {
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

  async getProfitability(tenantId: number) {
    const campaigns =
      await this.prisma.campaign.findMany({
        where: { tenantId },
        include: {
          costs: true,
          crops: {
            include: {
              harvests: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    const data = campaigns.map((campaign) => {
      const totalCosts = campaign.costs.reduce(
        (acc, cost) => acc + cost.totalCost,
        0,
      );

      const harvests = campaign.crops.flatMap(
        (crop) => crop.harvests,
      );

      const totalProduction = harvests.reduce(
        (acc, harvest) =>
          acc + harvest.totalProduction,
        0,
      );

      const harvestedArea = harvests.reduce(
        (acc, harvest) =>
          acc + harvest.harvestedArea,
        0,
      );

      const estimatedPricePerTon = 250000;

      const estimatedIncome =
        totalProduction * estimatedPricePerTon;

      const grossMargin =
        estimatedIncome - totalCosts;

      const profitabilityRate =
        totalCosts > 0
          ? (grossMargin / totalCosts) * 100
          : 0;

      const averageYield =
        harvestedArea > 0
          ? totalProduction / harvestedArea
          : 0;

      return {
        campaignId: campaign.id,
        campaignName: campaign.name,
        totalCosts,
        totalProduction,
        harvestedArea,
        averageYield,
        estimatedPricePerTon,
        estimatedIncome,
        grossMargin,
        profitabilityRate,
        status:
          profitabilityRate >= 30
            ? 'Rentable'
            : profitabilityRate >= 0
              ? 'Ajustada'
              : 'Negativa',
      };
    });

    const totalCosts = data.reduce(
      (acc, item) => acc + item.totalCosts,
      0,
    );

    const totalProduction = data.reduce(
      (acc, item) => acc + item.totalProduction,
      0,
    );

    const estimatedIncome = data.reduce(
      (acc, item) => acc + item.estimatedIncome,
      0,
    );

    const grossMargin =
      estimatedIncome - totalCosts;

    const profitabilityRate =
      totalCosts > 0
        ? (grossMargin / totalCosts) * 100
        : 0;

    return {
      summary: {
        totalCosts,
        totalProduction,
        estimatedIncome,
        grossMargin,
        profitabilityRate,
      },
      campaigns: data.sort(
        (a, b) =>
          b.profitabilityRate -
          a.profitabilityRate,
      ),
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

  async remove(tenantId: number, id: number) {
    const cost =
      await this.prisma.agriculturalCost.findFirst({
        where: { id, tenantId },
      });

    if (!cost) {
      throw new NotFoundException(
        'El costo agrícola no existe o no pertenece a este tenant.',
      );
    }

    return this.prisma.agriculturalCost.delete({
      where: { id },
    });
  }
}