import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { FieldOperationsController } from './field-operations.controller';
import { FieldOperationsService } from './field-operations.service';

@Module({
  imports: [PrismaModule],

  controllers: [FieldOperationsController],

  providers: [FieldOperationsService],
})
export class FieldOperationsModule {}