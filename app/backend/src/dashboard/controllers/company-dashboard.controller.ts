import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CompanyDashboardService } from '../services/company-dashboard.service.js';
import { CompanyDashboardMetricsDto } from '../dtos/company-dashboard.dto.js';

@Controller('dashboard/company')
export class CompanyDashboardController {
  constructor(
    private readonly companyDashboardService: CompanyDashboardService,
  ) {}

  @Get(':companyProfileId/summary')
  @HttpCode(HttpStatus.OK)
  async getSummary(
    @Param('companyProfileId') companyProfileId: string,
  ): Promise<CompanyDashboardMetricsDto> {
    return this.companyDashboardService.getCompanyDashboardMetrics(
      companyProfileId,
    );
  }
}
