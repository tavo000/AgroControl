import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.tenant.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async create(name: string) {
    return this.prisma.tenant.create({
      data: {
        name,
      },
    });
  }

  async toggleActive(id: number) {
    const tenant =
      await this.prisma.tenant.findUnique({
        where: {
          id,
        },
      });

    if (!tenant) {
      throw new Error(
        'Tenant no encontrado',
      );
    }

    return this.prisma.tenant.update({
      where: {
        id,
      },

      data: {
        active: !tenant.active,
      },
    });
  }
}