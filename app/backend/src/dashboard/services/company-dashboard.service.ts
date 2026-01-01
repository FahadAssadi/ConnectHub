import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { CompanyDashboardMetricsDto } from '../dtos/company-dashboard.dto.js';
import { EOIStatus, ProductStatus } from '../../../generated/prisma/enums.js';

@Injectable()
export class CompanyDashboardService {
  constructor(private readonly db: DatabaseService) {}

  async getCompanyDashboardMetrics(
    companyProfileId: string,
  ): Promise<CompanyDashboardMetricsDto> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalProducts,
      activeProducts,
      pendingApprovalProducts,
      totalEOIs,
      newEOIsThisWeek,
      newEOIsThisMonth,
      activePartnerships,
    ] = await Promise.all([
      this.db.product.count({ where: { companyProfileId } }),
      this.db.product.count({
        where: { companyProfileId, status: ProductStatus.APPROVED },
      }),
      this.db.product.count({
        where: { companyProfileId, status: ProductStatus.PENDING_APPROVAL },
      }),
      this.db.expressionOfInterest.count({
        where: { product: { companyProfileId } },
      }),
      this.db.expressionOfInterest.count({
        where: {
          product: { companyProfileId },
          createdAt: { gte: startOfWeek },
        },
      }),
      this.db.expressionOfInterest.count({
        where: {
          product: { companyProfileId },
          createdAt: { gte: startOfMonth },
        },
      }),
      this.db.expressionOfInterest.count({
        where: {
          product: { companyProfileId },
          status: EOIStatus.ACCEPTED,
        },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      pendingApprovalProducts,
      totalEOIs,
      newEOIsThisWeek,
      newEOIsThisMonth,
      activePartnerships,
    };
  }
}
