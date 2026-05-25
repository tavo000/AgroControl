import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { IotModule } from './iot/iot.module';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MachinesModule } from './machines/machines.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,

    IotModule,

    AuthModule,

    MachinesModule,

    AlertsModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}