import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { CreateEOIDto } from '../dtos/create-eoi.dto.js';
import { UpdateEOIStatusDto } from '../dtos/update-eoi-status.dto.js';
import { EOIFilterDto } from '../dtos/eoi-filter.dto.js';
import { EOIListResponseDto, EOIResponseDto } from '../dtos/eoi-response.dto.js';
import { EOIInitiator, EOIStatus } from '../../../generated/prisma/enums.js';

@Injectable()
export class EOIService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Create a new Expression of Interest
   */
  async create(createEOIDto: CreateEOIDto): Promise<EOIResponseDto> {
    const {
      productId,
      bdPartnerProfileId,
      initiator,
      message,
      expiresAt,
    } = createEOIDto;

    // Validate required fields
    if (!bdPartnerProfileId) {
      throw new BadRequestException('bdPartnerProfileId is required');
    }

    // Verify product exists
    const product = await this.db.product.findUnique({
      where: { id: productId },
      select: { id: true, status: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // if (product.status !== 'APPROVED') {
    //   throw new BadRequestException(
    //     'EOI can only be created for approved products',
    //   );
    // }

    // Determine if profile is individual or organization
    let bdPartnerIndividualProfileId: string | null = null;
    let bdPartnerOrganizationProfileId: string | null = null;

    const individualProfile = await this.db.bDPartnerIndividualProfile.findUnique({
      where: { id: bdPartnerProfileId },
    });

    if (individualProfile) {
      bdPartnerIndividualProfileId = bdPartnerProfileId;
    } else {
      const orgProfile = await this.db.bDPartnerOrganizationProfile.findUnique({
        where: { id: bdPartnerProfileId },
      });
      if (orgProfile) {
        bdPartnerOrganizationProfileId = bdPartnerProfileId;
      } else {
        throw new NotFoundException(
          `BD Partner Profile with ID ${bdPartnerProfileId} not found`,
        );
      }
    }

    // Check for existing EOI
    const existingEOI = await this.db.expressionOfInterest.findFirst({
      where: {
        productId,
        bdPartnerIndividualProfileId,
        bdPartnerOrganizationProfileId,
        status: {
          in: [EOIStatus.PENDING, EOIStatus.ACCEPTED],
        },
      },
    });

    if (existingEOI) {
      throw new BadRequestException(
        'An active EOI already exists for this product and BD partner combination',
      );
    }

    // Create EOI
    const eoi = await this.db.expressionOfInterest.create({
      data: {
        productId,
        bdPartnerIndividualProfileId,
        bdPartnerOrganizationProfileId,
        initiator: initiator || EOIInitiator.BD_PARTNER,
        message,
        expiresAt,
        status: EOIStatus.PENDING,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            type: true,
            shortDescription: true,
          },
        },
        bdPartnerIndividualProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        bdPartnerOrganizationProfile: {
          select: {
            id: true,
            commonDetails: {
              select: {
                companyName: true,
                contactPersonEmail: true,
              },
            },
          },
        },
      },
    });

    return this.mapToResponseDto(eoi);
  }

  /**
   * Find EOI by ID
   */
  async findById(id: string): Promise<EOIResponseDto> {
    const eoi = await this.db.expressionOfInterest.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            type: true,
            shortDescription: true,
          },
        },
        bdPartnerIndividualProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        bdPartnerOrganizationProfile: {
          select: {
            id: true,
            commonDetails: {
              select: {
                companyName: true,
                contactPersonEmail: true,
              },
            },
          },
        },
      },
    });

    if (!eoi) {
      throw new NotFoundException(`EOI with ID ${id} not found`);
    }

    return this.mapToResponseDto(eoi);
  }

  /**
   * Find all EOIs with optional filters
   */
  async findAll(filters: EOIFilterDto): Promise<EOIListResponseDto> {
    const {
      status,
      initiator,
      productId,
      bdPartnerIndividualProfileId,
      bdPartnerOrganizationProfileId,
      page = 1,
      limit = 10,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (initiator) {
      where.initiator = initiator;
    }

    if (productId) {
      where.productId = productId;
    }

    if (bdPartnerIndividualProfileId) {
      where.bdPartnerIndividualProfileId = bdPartnerIndividualProfileId;
    }

    if (bdPartnerOrganizationProfileId) {
      where.bdPartnerOrganizationProfileId = bdPartnerOrganizationProfileId;
    }

    const [eois, total] = await Promise.all([
      this.db.expressionOfInterest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              type: true,
              shortDescription: true,
            },
          },
          bdPartnerIndividualProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          bdPartnerOrganizationProfile: {
            select: {
              id: true,
              commonDetails: {
                select: {
                  companyName: true,
                  contactPersonEmail: true,
                },
              },
            },
          },
        },
      }),
      this.db.expressionOfInterest.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: eois.map((eoi) => this.mapToResponseDto(eoi)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Update EOI status
   */
  async updateStatus(
    id: string,
    updateStatusDto: UpdateEOIStatusDto,
  ): Promise<EOIResponseDto> {
    const { status, responseMessage } = updateStatusDto;

    const existingEOI = await this.db.expressionOfInterest.findUnique({
      where: { id },
    });

    if (!existingEOI) {
      throw new NotFoundException(`EOI with ID ${id} not found`);
    }

    // Validate status transitions
    this.validateStatusTransition(existingEOI.status, status);

    const updateData: any = {
      status,
    };

    // Set respondedAt when status changes from PENDING
    if (
      existingEOI.status === EOIStatus.PENDING &&
      status !== EOIStatus.PENDING
    ) {
      updateData.respondedAt = new Date();
    }

    // Append response message to existing message if provided
    if (responseMessage) {
      updateData.message = existingEOI.message
        ? `${existingEOI.message}\n\nResponse: ${responseMessage}`
        : `Response: ${responseMessage}`;
    }

    const eoi = await this.db.expressionOfInterest.update({
      where: { id },
      data: updateData,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            type: true,
            shortDescription: true,
          },
        },
        bdPartnerIndividualProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        bdPartnerOrganizationProfile: {
          select: {
            id: true,
            commonDetails: {
              select: {
                companyName: true,
                contactPersonEmail: true,
              },
            },
          },
        },
      },
    });

    return this.mapToResponseDto(eoi);
  }

  /**
   * Accept an EOI
   */
  async accept(id: string): Promise<EOIResponseDto> {
    return this.updateStatus(id, { status: EOIStatus.ACCEPTED });
  }

  /**
   * Reject an EOI
   */
  async reject(id: string, reason?: string): Promise<EOIResponseDto> {
    return this.updateStatus(id, {
      status: EOIStatus.REJECTED,
      responseMessage: reason,
    });
  }

  /**
   * Withdraw an EOI
   */
  async withdraw(id: string): Promise<EOIResponseDto> {
    return this.updateStatus(id, { status: EOIStatus.WITHDRAWN });
  }

  /**
   * Find all EOIs for a specific product
   */
  async findByProduct(
    productId: string,
    filters?: Partial<EOIFilterDto>,
  ): Promise<EOIListResponseDto> {
    return this.findAll({
      ...filters,
      productId,
    } as EOIFilterDto);
  }

  /**
   * Find all EOIs for a specific BD partner profile
   */
  async findByBDPartnerProfile(
    profileId: string,
    profileType: 'individual' | 'organization',
    filters?: Partial<EOIFilterDto>,
  ): Promise<EOIListResponseDto> {
    const filterDto: EOIFilterDto = {
      ...filters,
    } as EOIFilterDto;

    if (profileType === 'individual') {
      filterDto.bdPartnerIndividualProfileId = profileId;
    } else {
      filterDto.bdPartnerOrganizationProfileId = profileId;
    }

    return this.findAll(filterDto);
  }

  /**
   * Mark expired EOIs
   */
  async markExpiredEOIs(): Promise<number> {
    const result = await this.db.expressionOfInterest.updateMany({
      where: {
        status: EOIStatus.PENDING,
        expiresAt: {
          lte: new Date(),
        },
      },
      data: {
        status: EOIStatus.EXPIRED,
      },
    });

    return result.count;
  }

  /**
   * Get EOI statistics for a product
   */
  async getProductEOIStats(productId: string) {
    const stats = await this.db.expressionOfInterest.groupBy({
      by: ['status'],
      where: { productId },
      _count: { status: true },
    });

    return stats.reduce(
      (acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  /**
   * Get EOI statistics for a BD partner profile
   */
  async getBDPartnerEOIStats(
    profileId: string,
    profileType: 'individual' | 'organization',
  ) {
    const where: any = {};

    if (profileType === 'individual') {
      where.bdPartnerIndividualProfileId = profileId;
    } else {
      where.bdPartnerOrganizationProfileId = profileId;
    }

    const stats = await this.db.expressionOfInterest.groupBy({
      by: ['status'],
      where,
      _count: { status: true },
    });

    return stats.reduce(
      (acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  /**
   * Validate status transitions
   */
  private validateStatusTransition(
    currentStatus: EOIStatus,
    newStatus: EOIStatus,
  ): void {
    const allowedTransitions: Record<EOIStatus, EOIStatus[]> = {
      [EOIStatus.PENDING]: [
        EOIStatus.ACCEPTED,
        EOIStatus.REJECTED,
        EOIStatus.WITHDRAWN,
        EOIStatus.EXPIRED,
      ],
      [EOIStatus.ACCEPTED]: [EOIStatus.WITHDRAWN],
      [EOIStatus.REJECTED]: [],
      [EOIStatus.WITHDRAWN]: [],
      [EOIStatus.EXPIRED]: [],
    };

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  /**
   * Map database entity to response DTO
   */
  private mapToResponseDto(eoi: any): EOIResponseDto {
    return {
      id: eoi.id,
      productId: eoi.productId,
      bdPartnerIndividualProfileId: eoi.bdPartnerIndividualProfileId,
      bdPartnerOrganizationProfileId: eoi.bdPartnerOrganizationProfileId,
      initiator: eoi.initiator,
      status: eoi.status,
      message: eoi.message,
      createdAt: eoi.createdAt,
      updatedAt: eoi.updatedAt,
      expiresAt: eoi.expiresAt,
      respondedAt: eoi.respondedAt,
      product: eoi.product,
      bdPartnerIndividualProfile: eoi.bdPartnerIndividualProfile,
      bdPartnerOrganizationProfile: eoi.bdPartnerOrganizationProfile,
    };
  }
}
