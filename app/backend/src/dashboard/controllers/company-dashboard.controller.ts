import { Controller, Get, HttpCode, HttpStatus, Request as NestRequest } from '@nestjs/common';
import { CompanyDashboardService } from '../services/company-dashboard.service.js';
import { CompanyDashboardMetricsDto } from '../dtos/company-dashboard.dto.js';

@Controller('dashboard/company')
export class CompanyDashboardController {
  constructor(
    private readonly companyDashboardService: CompanyDashboardService,
  ) {}

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  async getSummary(@NestRequest() req: any): Promise<CompanyDashboardMetricsDto> {
    const companyProfileId = req.user?.companyProfile?.id;

    return this.companyDashboardService.getCompanyDashboardMetrics(
      companyProfileId,
    );
  }
}
