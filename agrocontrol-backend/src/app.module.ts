import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { IotModule } from './iot/iot.module';

import { DashboardModule } from './dashboard/dashboard.module';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MachinesModule } from './machines/machines.module';
import { FarmsModule } from './farms/farms.module';
import { AlertsModule } from './alerts/alerts.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { TenantsModule } from './tenants/tenants.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,

    IotModule,

    AuthModule,

    MachinesModule,

    FarmsModule,

    AlertsModule,

    TelemetryModule,

    TenantsModule,

    DashboardModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}