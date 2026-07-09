import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MachinesGateway } from './machines.gateway';

@Injectable()
export class MachinesService {
  constructor(
  private prisma: PrismaService,
  private gateway: MachinesGateway,
) {}

  async findAll(tenantId: number) {
    return this.prisma.machine.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findForMap(tenantId: number) {
  return this.prisma.machine.findMany({
    where: {
      tenantId,
    },
    select: {
      id: true,
      name: true,
      lat: true,
      lng: true,
      fuel: true,
      temperature: true,
      speed: true,
      active: true,
      updatedAt: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

  async create(
    tenantId: number,
    data: {
      name: string;
      lat: number;
      lng: number;
      fuel: number;
      temperature: number;
      speed: number;
      active: boolean;
    },
  ) {
    const machine =
  await this.prisma.machine.create({
    data: {
      ...data,
      tenantId,
    },
  });

this.gateway.emitMachinesUpdate({
  type: 'created',
  machine,
});

return machine;
  }

  async remove(
    tenantId: number,
    id: number,
  ) {
    return this.prisma.machine.delete({
      where: {
        id,
        tenantId,
      },
    });
  }
}