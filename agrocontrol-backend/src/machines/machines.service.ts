import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MachinesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.machine.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: {
    name: string;
    lat: number;
    lng: number;
    fuel: number;
    temperature: number;
    speed: number;
    active: boolean;
  }) {
    return this.prisma.machine.create({
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.machine.delete({
      where: {
        id,
      },
    });
  }
}