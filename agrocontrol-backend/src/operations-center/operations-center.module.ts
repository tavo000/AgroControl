import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { OperationsCenterController } from './operations-center.controller';
import { OperationsCenterService } from './operations-center.service';

@Module({
  imports: [PrismaModule],
  controllers: [OperationsCenterController],
  providers: [OperationsCenterService],
})
export class OperationsCenterModule {}