export class BDPartnerDashboardMetricsDto {
  totalEOIs: number;
  sentEOIs: number;
  receivedEOIs: number;

  pendingEOIs: number;
  acceptedEOIs: number;
  rejectedEOIs: number;
  withdrawnEOIs: number;
  expiredEOIs: number;

  newEOIsThisWeek: number;
  newEOIsThisMonth: number;

  activePartnerships: number; // accepted EOIs involving the BD partner
  pendingResponses: number;   // EOIs where BD partner is recipient and status pending

  distinctProductsEngaged: number;

  acceptanceRate: number;     // acceptedSent / decidedSent (0 if denominator is 0)
  acceptedSent: number;       // accepted EOIs that BD partner initiated
  decidedSent: number;        // accepted + rejected EOIs that BD partner initiated
}
