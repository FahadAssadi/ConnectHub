import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { BDPartnerDashboardService } from '../services/bd-partner-dashboard.service.js';
import { BDPartnerDashboardMetricsDto } from '../dtos/bd-partner-dashboard.dto.js';

type ProfileType = 'individual' | 'organization';

@Controller('dashboard/bd-partner')
export class BDPartnerDashboardController {
  constructor(
    private readonly bdPartnerDashboardService: BDPartnerDashboardService,
  ) {}

  @Get(':profileType/:profileId/summary')
  @HttpCode(HttpStatus.OK)
  async getSummary(
    @Param('profileType') profileType: ProfileType,
    @Param('profileId') profileId: string,
  ): Promise<BDPartnerDashboardMetricsDto> {
    return this.bdPartnerDashboardService.getBDPartnerDashboardMetrics(
      profileId,
      profileType,
    );
  }
}
