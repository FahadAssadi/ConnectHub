import { EOIInitiator, EOIStatus } from '../../../generated/prisma/enums.js';

export class EOIResponseDto {
  id: string;
  productId: string;
  bdPartnerIndividualProfileId?: string | null;
  bdPartnerOrganizationProfileId?: string | null;
  initiator: EOIInitiator;
  status: EOIStatus;
  message?: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date | null;
  respondedAt?: Date | null;
  product?: {
    id: string;
    name: string;
    type: string;
    shortDescription: string;
  };
  bdPartnerIndividualProfile?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  bdPartnerOrganizationProfile?: {
    id: string;
    commonDetails: {
      companyName: string;
      contactPersonEmail: string;
    };
  };
}

export class EOIListResponseDto {
  data: EOIResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
