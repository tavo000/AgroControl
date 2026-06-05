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
import { PlotsModule } from './plots/plots.module';
import { CropsModule } from './crops/crops.module';
import { HarvestsModule } from './harvests/harvests.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AgriculturalCostsModule } from './agricultural-costs/agricultural-costs.module';


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

    PlotsModule,

    CropsModule,

    HarvestsModule,

    CampaignsModule,

    AgriculturalCostsModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}