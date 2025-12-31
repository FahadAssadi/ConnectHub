import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { UserProfileService } from '../services/user-profile.service.js';
import {
  RegisterCompanyDto,
  RegisterBdIndividualDto,
  RegisterBdOrgDto,
} from '../dtos/index.js';

/**
 * Controller for user profile registration.
 * All endpoints require authentication via @UseGuards(AuthGuard).
 *
 * Flow:
 * 1. User signs up (Better Auth) → post-signup hook creates UserProfile with type=PENDING
 * 2. User calls one of these endpoints to complete their profile
 * 3. Service validates, creates type-specific profile atomically
 */
@UseGuards(AuthGuard)
@Controller('registration')
export class RegistrationController {
  constructor(private readonly userProfileService: UserProfileService) {}

  /**
   * POST /registration/company
   * Register as a Company.
   *
   * Request body: RegisterCompanyDto
   * - commonDetails: CommonCompanyDetailsDto (company info, contact details)
   * - ndaAgreed: boolean
   * - headOfficeLocation?: string
   *
   * Returns: Created CompanyProfile with related data
   *
   * @throws ConflictException if user already has an active profile
   * @throws BadRequestException if validation fails (FK doesn't exist, duplicate email, etc.)
   */
  @Post('company')
  async registerCompany(
    @Session() session: UserSession,
    @Body() dto: RegisterCompanyDto,
  ) {
    if (!session?.user?.id) {
      throw new BadRequestException('Invalid session or user ID not found');
    }

    const profile = await this.userProfileService.registerCompany(
      session.user.id,
      dto,
    );

    return {
      success: true,
      message: 'Company profile created successfully',
      data: profile,
    };
  }

  /**
   * POST /registration/bd-individual
   * Register as a BD Partner Individual.
   *
   * Request body: RegisterBdIndividualDto
   * - firstName, lastName, email, phone
   * - countryId, stateOrProvinceId, city
   * - yearsOfExperienceId
   * - fluencyInEnglish?: EnglishFluency enum
   * - referralNetworkDescription?: string
   * - availabilityHoursPerWeek?: number
   * - linkedInURL?, resumeURL?, idProofURL?: URL strings
   * - ndaAgreed: boolean
   *
   * Returns: Created BDPartnerIndividualProfile with related data
   *
   * @throws ConflictException if user already has an active profile
   * @throws BadRequestException if validation fails (FK doesn't exist, duplicate email, etc.)
   */
  @Post('bd-individual')
  async registerBdIndividual(
    @Session() session: UserSession,
    @Body() dto: RegisterBdIndividualDto,
  ) {
    if (!session?.user?.id) {
      throw new BadRequestException('Invalid session or user ID not found');
    }

    const profile = await this.userProfileService.registerBdIndividual(
      session.user.id,
      dto,
    );

    return {
      success: true,
      message: 'BD Partner Individual profile created successfully',
      data: profile,
    };
  }

  /**
   * POST /registration/bd-org
   * Register as a BD Partner Organization.
   *
   * Request body: RegisterBdOrgDto
   * - commonDetails: CommonCompanyDetailsDto (company info, contact details)
   * - businessStructureId: UUID
   * - employeeCount: EmployeeCount enum
   * - yearsOfExperienceId: UUID
   * - availabilityHoursPerWeek?: number
   * - referralNetworkDescription?: string
   * - existingClientBase?: string
   * - ndaAgreed: boolean
   *
   * Returns: Created BDPartnerOrganizationProfile with related data
   *
   * @throws ConflictException if user already has an active profile
   * @throws BadRequestException if validation fails (FK doesn't exist, duplicate email, etc.)
   */
  @Post('bd-org')
  async registerBdOrganization(
    @Session() session: UserSession,
    @Body() dto: RegisterBdOrgDto,
  ) {
    if (!session?.user?.id) {
      throw new BadRequestException('Invalid session or user ID not found');
    }

    const profile = await this.userProfileService.registerBdOrganization(
      session.user.id,
      dto,
    );

    return {
      success: true,
      message: 'BD Partner Organization profile created successfully',
      data: profile,
    };
  }
}
