import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
    tenantId?: number;
  }) {
    const hashedPassword = await bcrypt.hash(
      data.password,
      10,
    );

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        tenantId: data.tenantId ?? 1,
      },
    });

    return {
      id: user.id,
      tenantId: user.tenantId,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(data: {
    email: string;
    password: string;
  }) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
        include: {
          tenant: true,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Usuario no encontrado',
      );
    }

    if (!user.active) {
      throw new UnauthorizedException(
        'Usuario inactivo',
      );
    }

    if (!user.tenant.active) {
      throw new UnauthorizedException(
        'Empresa inactiva',
      );
    }

    const passwordMatch =
      await bcrypt.compare(
        data.password,
        user.password,
      );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Contraseña incorrecta',
      );
    }

    const payload = {
      sub: user.id,
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    };

    const accessToken =
      await this.jwtService.signAsync(
        payload,
      );

    return {
      message: 'Login correcto',
      access_token: accessToken,
      user: {
        id: user.id,
        tenantId: user.tenantId,
        tenantName: user.tenant.name,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}