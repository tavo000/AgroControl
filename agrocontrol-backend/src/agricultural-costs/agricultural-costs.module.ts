import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { AgriculturalCostsController } from './agricultural-costs.controller';

import { AgriculturalCostsService } from './agricultural-costs.service';

@Module({
  imports: [PrismaModule],
  controllers: [AgriculturalCostsController],
  providers: [AgriculturalCostsService],
})
export class AgriculturalCostsModule {}