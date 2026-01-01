import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { BDPartnerDashboardService, BDPartnerProfileType } from '../services/bd-partner-dashboard.service.js';
import { BDPartnerDashboardMetricsDto } from '../dtos/bd-partner-dashboard.dto.js';

@Controller('dashboard/bd-partner')
export class BDPartnerDashboardController {
  constructor(
    private readonly bdPartnerDashboardService: BDPartnerDashboardService,
  ) {}

  @Get(':profileType/:profileId/summary')
  @HttpCode(HttpStatus.OK)
  async getSummary(
    @Param('profileType') profileType: BDPartnerProfileType,
    @Param('profileId') profileId: string,
  ): Promise<BDPartnerDashboardMetricsDto> {
    return this.bdPartnerDashboardService.getBDPartnerDashboardMetrics(
      profileId,
      profileType,
    );
  }
}
