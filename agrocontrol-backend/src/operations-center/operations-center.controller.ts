import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { OperationsCenterService } from './operations-center.service';

@Controller('operations-center')
@UseGuards(JwtAuthGuard)
export class OperationsCenterController {
  constructor(
    private operationsCenterService: OperationsCenterService,
  ) {}

  @Get('overview')
  async getOverview(@Req() req: any) {
    return this.operationsCenterService.getOverview(
      req.user.tenantId,
    );
  }
}