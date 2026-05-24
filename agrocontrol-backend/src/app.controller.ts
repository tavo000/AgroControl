import {
  Controller,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';

import type { Request } from 'express';

import { AppService } from './app.service';

import { JwtAuthGuard } from './auth/jwt-auth.guard';

import { RolesGuard } from './auth/roles.guard';

import { Roles } from './auth/roles.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(
    @Req() req: Request,
  ) {
    return req.user;
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  @Get('admin')
  getAdminPanel() {
    return {
      message:
        'Bienvenido al panel ADMIN',
    };
  }
}