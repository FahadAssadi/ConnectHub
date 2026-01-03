import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto.js';

@Injectable()
export class ProductService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateProductDto) {
    return this.db.product.create({
      data: {
        companyProfileId: dto.companyProfileId,
        name: dto.name,
        type: dto.type,
        shortDescription: dto.shortDescription,
        detailedDescription: dto.detailedDescription,
        imageURL: dto.imageURL,
        paymentModel: dto.paymentModel,
        indicativeIncentive: dto.indicativeIncentive,
        preferredYearsOfExperienceId: dto.preferredYearsOfExperienceId,
        engagementMethodId: dto.engagementMethodId,
        salesTrainingAvailable: dto.salesTrainingAvailable ?? false,
        status: dto.status ?? 'DRAFT',
      },
      include: {
        companyProfile: {
          select: {
            id: true,
            commonDetails: {
              select: {
                companyName: true,
              },
            },
          },
        },
        preferredYearsOfExperience: true,
        engagementMethod: true,
      },
    });
  }

async findAll() {
    return this.db.product.findMany({
        include: {
            companyProfile: {
                select: {
                    id: true,
                    commonDetails: {
                        select: {
                            companyName: true,
                        },
                    },
                },
            },
            preferredYearsOfExperience: true,
            engagementMethod: true,
            productTargetCustomerIndustries: {
                include: {
                    industryCategory: true,
                    industrySubCategory: true,
                },
            },
            productTargetRegions: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}

  async findById(id: string) {
    const product = await this.db.product.findUnique({
      where: { id },
      include: {
        companyProfile: {
          select: {
            id: true,
            commonDetails: {
              select: {
                companyName: true,
                contactPersonName: true,
                contactPersonEmail: true,
                websiteURL: true,
                logoURL: true,
              },
            },
          },
        },
        preferredYearsOfExperience: true,
        engagementMethod: true,
        productTargetCustomerIndustries: {
          include: {
            industryCategory: true,
            industrySubCategory: true,
          },
        },
        productTargetRegions: true,
        productSalesSupportMaterials: true,
        productPreferredBDProfiles: {
          include: {
            industrySpecialisation: {
              include: {
                subCategory: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
        productPreferredCertifications: {
          include: {
            certification: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    // Check if product exists
    await this.findById(id);

    return this.db.product.update({
      where: { id },
      data: {
        name: dto.name,
        type: dto.type,
        shortDescription: dto.shortDescription,
        detailedDescription: dto.detailedDescription,
        imageURL: dto.imageURL,
        paymentModel: dto.paymentModel,
        indicativeIncentive: dto.indicativeIncentive,
        preferredYearsOfExperienceId: dto.preferredYearsOfExperienceId,
        engagementMethodId: dto.engagementMethodId,
        salesTrainingAvailable: dto.salesTrainingAvailable,
        status: dto.status,
      },
      include: {
        companyProfile: {
          select: {
            id: true,
            commonDetails: {
              select: {
                companyName: true,
              },
            },
          },
        },
        preferredYearsOfExperience: true,
        engagementMethod: true,
      },
    });
  }

  async delete(id: string) {
    // Check if product exists
    await this.findById(id);

    return this.db.product.delete({
      where: { id },
    });
  }

  async findByCompanyProfile(companyProfileId: string) {
    return this.db.product.findMany({
      where: { companyProfileId },
      include: {
        companyProfile: {
          select: {
            id: true,
            commonDetails: {
              select: {
                companyName: true,
              },
            },
          },
        },
        preferredYearsOfExperience: true,
        engagementMethod: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: string) {
    return this.db.product.findMany({
      where: { status: status as any },
      include: {
        companyProfile: {
          select: {
            id: true,
            commonDetails: {
              select: {
                companyName: true,
              },
            },
          },
        },
        preferredYearsOfExperience: true,
        engagementMethod: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
