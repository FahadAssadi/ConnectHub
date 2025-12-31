import { Injectable, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { UserType, ProfileStatus, EmployeeCount } from '../../../generated/prisma/client.js';
import { RegisterCompanyDto, RegisterBdIndividualDto, RegisterBdOrgDto } from '../dtos/index.js';

/**
 * Service for managing user profiles.
 * Handles creation and updates to UserProfile and type-specific profiles.
 */
@Injectable()
export class UserProfileService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Map employee count display value to enum value.
   * Handles both display formats (e.g., "11-50") and enum values (e.g., "ELEVEN_TO_FIFTY").
   */
  private mapEmployeeCount(value: string): EmployeeCount {
    const mappings: Record<string, EmployeeCount> = {
      '1-10': EmployeeCount.ONE_TO_TEN,
      'ONE_TO_TEN': EmployeeCount.ONE_TO_TEN,
      '11-50': EmployeeCount.ELEVEN_TO_FIFTY,
      'ELEVEN_TO_FIFTY': EmployeeCount.ELEVEN_TO_FIFTY,
      '51-200': EmployeeCount.FIFTY_ONE_TO_TWO_HUNDRED,
      'FIFTY_ONE_TO_TWO_HUNDRED': EmployeeCount.FIFTY_ONE_TO_TWO_HUNDRED,
      '201-500': EmployeeCount.TWO_HUNDRED_ONE_TO_FIVE_HUNDRED,
      'TWO_HUNDRED_ONE_TO_FIVE_HUNDRED': EmployeeCount.TWO_HUNDRED_ONE_TO_FIVE_HUNDRED,
      '501-1000': EmployeeCount.FIVE_HUNDRED_ONE_TO_THOUSAND,
      'FIVE_HUNDRED_ONE_TO_THOUSAND': EmployeeCount.FIVE_HUNDRED_ONE_TO_THOUSAND,
      '1000+': EmployeeCount.OVER_THOUSAND,
      'OVER_THOUSAND': EmployeeCount.OVER_THOUSAND,
    };
    return mappings[value] || EmployeeCount.ONE_TO_TEN;
  }

  /**
   * Create an initial UserProfile for a newly signed-up user.
   * Called from the post-signup hook.
   *
   * @param userId - The user ID from Better Auth
   * @returns The created UserProfile
   */
  async createInitialProfile(userId: string) {
    return this.db.userProfile.create({
      data: {
        userId,
        type: UserType.PENDING,
        status: ProfileStatus.DRAFT,
      },
    });
  }

  /**
   * Check if a user already has a profile.
   *
   * @param userId - The user ID to check
   * @returns The existing UserProfile with all related data or null
   */
  async getUserProfile(userId: string) {
    return this.db.userProfile.findUnique({
      where: { userId },
      include: {
        companyProfile: {
          include: {
            commonDetails: true,
            profileIndustries: {
              include: {
                industryCategory: true,
                industrySubCategory: true,
                industrySpecialisation: true,
              },
            },
            profileEngagements: {
              include: {
                engagementModel: true,
              },
            },
            profileTools: {
              include: {
                toolPlatform: true,
              },
            },
            profileCertifications: {
              include: {
                certification: true,
              },
            },
            products: true,
          },
        },
        bdpartnerIndividualProfile: {
          include: {
            yearsOfExperience: true,
            profileIndustries: {
              include: {
                industryCategory: true,
                industrySubCategory: true,
                industrySpecialisation: true,
              },
            },
            profileEngagements: {
              include: {
                engagementModel: true,
              },
            },
            profileTools: {
              include: {
                toolPlatform: true,
              },
            },
            profileCertifications: {
              include: {
                certification: true,
              },
            },
          },
        },
        bdpartnerOrganizationProfile: {
          include: {
            commonDetails: true,
            businessStructure: true,
            yearsOfExperience: true,
            profileIndustries: {
              include: {
                industryCategory: true,
                industrySubCategory: true,
                industrySpecialisation: true,
              },
            },
            profileEngagements: {
              include: {
                engagementModel: true,
              },
            },
            profileTools: {
              include: {
                toolPlatform: true,
              },
            },
            profileCertifications: {
              include: {
                certification: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Check if a user already has a profile of a specific type.
   * Prevents multiple profiles per user.
   *
   * @param userId - The user ID to check
   * @returns true if user has a non-PENDING profile, false otherwise
   */
  async hasExistingProfile(userId: string) {
    const profile = await this.db.userProfile.findUnique({
      where: { userId },
    });
    return profile && profile.type !== UserType.PENDING;
  }

  /**
   * Register a Company profile.
   * Atomically creates/updates UserProfile, CommonCompanyDetails, and CompanyProfile.
   *
   * @param userId - The authenticated user ID
   * @param dto - Company registration data
   * @returns The created/updated company profile
   * @throws ConflictException if user already has a non-PENDING profile
   * @throws BadRequestException if country ID doesn't exist
   */
  async registerCompany(userId: string, dto: RegisterCompanyDto) {
    // Check if user already has a profile of a different type
    if (await this.hasExistingProfile(userId)) {
      throw new ConflictException(
        'User already has an active profile. Only one profile per user is allowed.',
      );
    }

    // Verify businessRegNumber is unique
    const existingBiz = await this.db.commonCompanyDetails.findUnique({
      where: { businessRegNumber: dto.commonDetails.businessRegNumber },
    });
    if (existingBiz) {
      throw new ConflictException(
        'A company with this business registration number already exists.',
      );
    }

    // Verify contact email is unique
    const existingEmail = await this.db.commonCompanyDetails.findUnique({
      where: { contactPersonEmail: dto.commonDetails.contactPersonEmail },
    });
    if (existingEmail) {
      throw new ConflictException(
        'A company contact with this email already exists.',
      );
    }

    try {
      return await this.db.$transaction(async (tx) => {
        // Update or create UserProfile
        const userProfile = await tx.userProfile.upsert({
          where: { userId },
          update: { type: UserType.COMPANY },
          create: {
            userId,
            type: UserType.COMPANY,
            status: ProfileStatus.DRAFT,
          },
        });

        // Create CommonCompanyDetails
        const commonDetails = await tx.commonCompanyDetails.create({
          data: {
            companyName: dto.commonDetails.companyName,
            businessRegNumber: dto.commonDetails.businessRegNumber,
            registeredBuisnessName: dto.commonDetails.registeredBuisnessName || dto.commonDetails.companyName,
            countryOfRegistration: dto.commonDetails.countryOfRegistration || dto.commonDetails.country || 'Unknown',
            registeredAddress: dto.commonDetails.registeredAddress || dto.commonDetails.address || '',
            contactPersonName: dto.commonDetails.contactPersonName || 'N/A',
            contactPersonDesignation: dto.commonDetails.contactPersonDesignation || 'N/A',
            contactPersonEmail: dto.commonDetails.contactPersonEmail,
            contactPersonPhone: dto.commonDetails.contactPersonPhone,
            websiteURL: dto.commonDetails.websiteURL || dto.commonDetails.officialWebsite,
            linkedInURL: dto.commonDetails.linkedInURL || dto.commonDetails.linkedInProfileURL,
            logoURL: dto.commonDetails.logoURL,
            profileDeckURL: dto.commonDetails.profileDeckURL,
            yearOfEstablishment: dto.commonDetails.yearOfEstablishment,
            description: dto.commonDetails.description,
          },
        });

        // Create CompanyProfile
        const companyProfile = await tx.companyProfile.create({
          data: {
            userProfileId: userProfile.id,
            commonDetailsId: commonDetails.id,
            ndaAgreed: dto.ndaAgreed,
            headOfficeLocation: dto.headOfficeLocation,
          },
          include: {
            commonDetails: true,
            userProfile: true,
          },
        });

        return companyProfile;
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error registering company profile:', error);
      throw new InternalServerErrorException(
        'Failed to register company profile. Please try again.',
      );
    }
  }

  /**
   * Register a BD Partner Individual profile.
   * Atomically creates/updates UserProfile and BDPartnerIndividualProfile.
   *
   * @param userId - The authenticated user ID
   * @param dto - BD Partner Individual registration data
   * @returns The created/updated BD partner individual profile
   * @throws ConflictException if user already has a non-PENDING profile
   * @throws BadRequestException if referenced entities don't exist
   */
  async registerBdIndividual(userId: string, dto: RegisterBdIndividualDto) {
    // Check if user already has a profile
    if (await this.hasExistingProfile(userId)) {
      throw new ConflictException(
        'User already has an active profile. Only one profile per user is allowed.',
      );
    }

    // Verify years of experience exists
    const yearsOfExp = await this.db.yearsOfExperience.findUnique({
      where: { id: dto.yearsOfExperienceId },
    });

    if (!yearsOfExp) {
      throw new BadRequestException('Years of experience with the provided ID does not exist.');
    }

    // Verify email uniqueness
    const existingEmail = await this.db.bDPartnerIndividualProfile.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException(
        'A BD partner profile with this email already exists.',
      );
    }

    try {
      return await this.db.$transaction(async (tx) => {
        // Update or create UserProfile
        const userProfile = await tx.userProfile.upsert({
          where: { userId },
          update: { type: UserType.BD_PARTNER_INDIVIDUAL },
          create: {
            userId,
            type: UserType.BD_PARTNER_INDIVIDUAL,
            status: ProfileStatus.DRAFT,
          },
        });

        // Create BDPartnerIndividualProfile
        const bdProfile = await tx.bDPartnerIndividualProfile.create({
          data: {
            userProfileId: userProfile.id,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            country: dto.country,
            countryIso2Code: dto.countryIso2Code,
            stateOrProvince: dto.stateOrProvince,
            city: dto.city,
            ndaAgreed: dto.ndaAgreed,
            yearsOfExperienceId: dto.yearsOfExperienceId,
            fluencyInEnglish: dto.fluencyInEnglish,
            referralNetworkDescription: dto.referralNetworkDescription,
            availabilityHoursPerWeek: dto.availabilityHoursPerWeek ? parseFloat(dto.availabilityHoursPerWeek.toString()) : null,
            linkedInURL: dto.linkedInURL,
            resumeURL: dto.resumeURL,
            idProofURL: dto.idProofURL,
          },
          include: {
            userProfile: true,
          },
        });

        return bdProfile;
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error registering BD partner individual profile:', error);
      throw new InternalServerErrorException(
        'Failed to register BD partner individual profile. Please try again.',
      );
    }
  }

  /**
   * Register a BD Partner Organization profile.
   * Atomically creates/updates UserProfile, CommonCompanyDetails, and BDPartnerOrganizationProfile.
   *
   * @param userId - The authenticated user ID
   * @param dto - BD Partner Organization registration data
   * @returns The created/updated BD partner organization profile
   * @throws ConflictException if user already has a non-PENDING profile
   * @throws BadRequestException if referenced entities don't exist
   */
  async registerBdOrganization(userId: string, dto: RegisterBdOrgDto) {
    // Check if user already has a profile
    if (await this.hasExistingProfile(userId)) {
      throw new ConflictException(
        'User already has an active profile. Only one profile per user is allowed.',
      );
    }

    // Verify all required FK relationships exist
    const [businessStructure, yearsOfExp] = await Promise.all([
      this.db.businessStructure.findUnique({ where: { id: dto.businessStructureId } }),
      this.db.yearsOfExperience.findUnique({ where: { id: dto.yearsOfExperienceId } }),
    ]);

    if (!businessStructure) {
      throw new BadRequestException('Business structure with the provided ID does not exist.');
    }
    if (!yearsOfExp) {
      throw new BadRequestException('Years of experience with the provided ID does not exist.');
    }

    // Verify businessRegNumber is unique
    const existingBiz = await this.db.commonCompanyDetails.findUnique({
      where: { businessRegNumber: dto.commonDetails.businessRegNumber },
    });
    if (existingBiz) {
      throw new ConflictException(
        'A company with this business registration number already exists.',
      );
    }

    // Verify contact email is unique
    const existingEmail = await this.db.commonCompanyDetails.findUnique({
      where: { contactPersonEmail: dto.commonDetails.contactPersonEmail },
    });
    if (existingEmail) {
      throw new ConflictException(
        'A company contact with this email already exists.',
      );
    }

    try {
      return await this.db.$transaction(async (tx) => {
        // Update or create UserProfile
        const userProfile = await tx.userProfile.upsert({
          where: { userId },
          update: { type: UserType.BD_PARTNER_ORGANIZATION },
          create: {
            userId,
            type: UserType.BD_PARTNER_ORGANIZATION,
            status: ProfileStatus.DRAFT,
          },
        });

        // Create CommonCompanyDetails with field mapping
        const commonDetails = await tx.commonCompanyDetails.create({
          data: {
            companyName: dto.commonDetails.companyName,
            businessRegNumber: dto.commonDetails.businessRegNumber,
            registeredBuisnessName: dto.commonDetails.registeredBuisnessName || dto.commonDetails.companyName,
            countryOfRegistration: dto.commonDetails.countryOfRegistration || dto.commonDetails.country || 'Unknown',
            registeredAddress: dto.commonDetails.registeredAddress || dto.commonDetails.address || '',
            contactPersonName: dto.commonDetails.contactPersonName || 'N/A',
            contactPersonDesignation: dto.commonDetails.contactPersonDesignation || 'N/A',
            contactPersonEmail: dto.commonDetails.contactPersonEmail,
            contactPersonPhone: dto.commonDetails.contactPersonPhone,
            websiteURL: dto.commonDetails.websiteURL || dto.commonDetails.officialWebsite,
            linkedInURL: dto.commonDetails.linkedInURL || dto.commonDetails.linkedInProfileURL,
            logoURL: dto.commonDetails.logoURL,
            profileDeckURL: dto.commonDetails.profileDeckURL,
            yearOfEstablishment: dto.commonDetails.yearOfEstablishment,
            description: dto.commonDetails.description,
          },
        });

        // Create BDPartnerOrganizationProfile
        const bdOrgProfile = await tx.bDPartnerOrganizationProfile.create({
          data: {
            userProfileId: userProfile.id,
            commonDetailsId: commonDetails.id,
            businessStructureId: dto.businessStructureId,
            employeeCount: this.mapEmployeeCount(dto.employeeCount),
            yearsOfExperienceId: dto.yearsOfExperienceId,
            availabilityHoursPerWeek: dto.availabilityHoursPerWeek ? parseFloat(dto.availabilityHoursPerWeek.toString()) : null,
            referralNetworkDescription: dto.referralNetworkDescription,
            existingClientBase: dto.existingClientBase,
            ndaAgreed: dto.ndaAgreed,
          },
          include: {
            commonDetails: true,
            userProfile: true,
          },
        });

        return bdOrgProfile;
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error registering BD organization profile:', error);
      throw new InternalServerErrorException(
        'Failed to register BD partner organization profile. Please try again.',
      );
    }
  }
}
