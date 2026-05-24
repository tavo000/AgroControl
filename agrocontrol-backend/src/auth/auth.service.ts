import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const hashedPassword =
      await bcrypt.hash(
        data.password,
        10,
      );

    const user =
      await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password:
            hashedPassword,
        },
      });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
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
      });

    if (!user) {
      throw new UnauthorizedException(
        'Usuario no encontrado',
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

    return {
      message: 'Login correcto',

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}