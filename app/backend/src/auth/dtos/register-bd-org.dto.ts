import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsDecimal,
  IsBoolean,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CommonCompanyDetailsDto } from './common-company-details.dto.js';

/**
 * Enum for employee count ranges.
 * Mirrors the schema EmployeeCount enum.
 */
enum EmployeeCount {
  ONE_TO_TEN = 'ONE_TO_TEN',
  ELEVEN_TO_FIFTY = 'ELEVEN_TO_FIFTY',
  FIFTY_ONE_TO_TWO_HUNDRED = 'FIFTY_ONE_TO_TWO_HUNDRED',
  TWO_HUNDRED_ONE_TO_FIVE_HUNDRED = 'TWO_HUNDRED_ONE_TO_FIVE_HUNDRED',
  FIVE_HUNDRED_ONE_TO_THOUSAND = 'FIVE_HUNDRED_ONE_TO_THOUSAND',
  OVER_THOUSAND = 'OVER_THOUSAND',
}

/**
 * DTO for registering a BD Partner Organization profile.
 * Combines BDPartnerOrganizationProfile organization and professional details.
 * Includes CommonCompanyDetailsDto for shared organization information.
 * Must be called by an authenticated user (via AuthGuard).
 */
export class RegisterBdOrgDto {
  // ========== ORGANIZATION DETAILS ==========
  @ValidateNested()
  @Type(() => CommonCompanyDetailsDto)
  commonDetails: CommonCompanyDetailsDto;

  // ========== PROFESSIONAL DETAILS ==========
  @IsUUID('4', { message: 'buisnessStructureId must be a valid UUID' })
  buisnessStructureId: string;

  @IsEnum(EmployeeCount, {
    message: `employeeCount must be one of: ${Object.values(EmployeeCount).join(', ')}`,
  })
  employeeCount: EmployeeCount;

  @IsUUID('4', { message: 'yearsOfExperienceId must be a valid UUID' })
  yearsOfExperienceId: string;

  @IsOptional()
  @Type(() => Number)
  @IsDecimal({ decimal_digits: '1,2' }, {
    message: 'availabilityHoursPerWeek must be a valid decimal number',
  })
  availabilityHoursPerWeek?: number;

  @IsOptional()
  @IsString({ message: 'referralNetworkDescription must be a string' })
  @MaxLength(2000, {
    message: 'referralNetworkDescription must not exceed 2000 characters',
  })
  referralNetworkDescription?: string;

  @IsOptional()
  @IsString({ message: 'existingClientBase must be a string' })
  @MaxLength(2000, {
    message: 'existingClientBase must not exceed 2000 characters',
  })
  existingClientBase?: string;

  @IsBoolean({ message: 'ndaAgreed must be a boolean' })
  ndaAgreed: boolean;
}
