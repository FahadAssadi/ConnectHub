import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { BDPartnerDashboardMetricsDto } from '../dtos/bd-partner-dashboard.dto.js';
import { EOIInitiator, EOIStatus } from '../../../generated/prisma/enums.js';

export type BDPartnerProfileType = 'individual' | 'organization';

@Injectable()
export class BDPartnerDashboardService {
  constructor(private readonly db: DatabaseService) {}

  async getBDPartnerDashboardMetrics(
    profileId: string,
    profileType: BDPartnerProfileType,
  ): Promise<BDPartnerDashboardMetricsDto> {
    const profileField =
      profileType === 'individual'
        ? 'bdPartnerIndividualProfileId'
        : 'bdPartnerOrganizationProfileId';

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Base filter for EOIs involving this profile
    const baseWhere: any = {
      [profileField]: profileId,
    };

    const [
      totalEOIs,
      sentEOIs,
      receivedEOIs,
      pendingEOIs,
      acceptedEOIs,
      rejectedEOIs,
      withdrawnEOIs,
      expiredEOIs,
      newEOIsThisWeek,
      newEOIsThisMonth,
      activePartnerships,
      pendingResponses,
      distinctProductsEngaged,
      acceptedSent,
      decidedSent,
    ] = await Promise.all([
      this.db.expressionOfInterest.count({ where: baseWhere }),
      this.db.expressionOfInterest.count({
        where: { ...baseWhere, initiator: EOIInitiator.BD_PARTNER },
      }),
      this.db.expressionOfInterest.count({
        where: { ...baseWhere, initiator: EOIInitiator.COMPANY },
      }),
      this.db.expressionOfInterest.count({
        where: { ...baseWhere, status: EOIStatus.PENDING },
      }),
      this.db.expressionOfInterest.count({
        where: { ...baseWhere, status: EOIStatus.ACCEPTED },
      }),
      this.db.expressionOfInterest.count({
        where: { ...baseWhere, status: EOIStatus.REJECTED },
      }),
      this.db.expressionOfInterest.count({
        where: { ...baseWhere, status: EOIStatus.WITHDRAWN },
      }),
      this.db.expressionOfInterest.count({
        where: { ...baseWhere, status: EOIStatus.EXPIRED },
      }),
      this.db.expressionOfInterest.count({
        where: { ...baseWhere, createdAt: { gte: startOfWeek } },
      }),
      this.db.expressionOfInterest.count({
        where: { ...baseWhere, createdAt: { gte: startOfMonth } },
      }),
      this.db.expressionOfInterest.count({
        where: { ...baseWhere, status: EOIStatus.ACCEPTED },
      }),
      this.db.expressionOfInterest.count({
        where: {
          ...baseWhere,
          status: EOIStatus.PENDING,
          initiator: EOIInitiator.COMPANY, // company initiated, BD partner should respond
        },
      }),
      this.db.expressionOfInterest
        .groupBy({
          by: ['productId'],
          where: baseWhere,
        })
        .then((rows) => rows.length),
      this.db.expressionOfInterest.count({
        where: {
          ...baseWhere,
          initiator: EOIInitiator.BD_PARTNER,
          status: EOIStatus.ACCEPTED,
        },
      }),
      this.db.expressionOfInterest.count({
        where: {
          ...baseWhere,
          initiator: EOIInitiator.BD_PARTNER,
          status: { in: [EOIStatus.ACCEPTED, EOIStatus.REJECTED] },
        },
      }),
    ]);

    const acceptanceRate = decidedSent
      ? Number((acceptedSent / decidedSent).toFixed(4))
      : 0;

    return {
      totalEOIs,
      sentEOIs,
      receivedEOIs,
      pendingEOIs,
      acceptedEOIs,
      rejectedEOIs,
      withdrawnEOIs,
      expiredEOIs,
      newEOIsThisWeek,
      newEOIsThisMonth,
      activePartnerships,
      pendingResponses,
      distinctProductsEngaged,
      acceptanceRate,
      acceptedSent,
      decidedSent,
    };
  }
}
