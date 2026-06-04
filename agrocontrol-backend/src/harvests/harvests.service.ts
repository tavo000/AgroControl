import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HarvestsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(
    tenantId: number,
  ) {
    return this.prisma.harvest.findMany({
      where: {
        tenantId,
      },

      include: {
        crop: {
          include: {
            plot: {
              include: {
                farm: true,
              },
            },
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
      cropId: number;
      harvestDate?: Date;
      totalProduction: number;
      harvestedArea: number;
      yieldPerHectare: number;
      unit?: string;
      campaign?: string;
      observations?: string;
    },
  ) {
    return this.prisma.harvest.create({
      data: {
        tenantId,
        cropId: data.cropId,
        harvestDate: data.harvestDate,
        totalProduction:
          data.totalProduction,
        harvestedArea:
          data.harvestedArea,
        yieldPerHectare:
          data.yieldPerHectare,
        unit: data.unit ?? 'tn',
        campaign: data.campaign,
        observations: data.observations,
      },
    });
  }

  async remove(
    tenantId: number,
    id: number,
  ) {
    return this.prisma.harvest.deleteMany({
      where: {
        id,
        tenantId,
      },
    });
  }
}