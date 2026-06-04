import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor() {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'AGROCONTROL_SECRET',
    });
  }

  async validate(payload: {
    sub: number;
    userId: number;
    tenantId: number;
    email: string;
    role: string;
  }) {
    return {
      id: payload.sub,
      userId: payload.userId,
      tenantId: payload.tenantId,
      email: payload.email,
      role: payload.role,
    };
  }
}