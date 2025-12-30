import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
  IsUrl,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for common company/organization details.
 * Shared between CompanyProfile and BdPartnerOrganizationProfile.
 */
export class CommonCompanyDetailsDto {
  @IsString({ message: 'companyName must be a string' })
  @MinLength(2, { message: 'companyName must be at least 2 characters' })
  @MaxLength(255, { message: 'companyName must not exceed 255 characters' })
  companyName: string;

  @IsString({ message: 'businessRegNumber must be a string' })
  @MinLength(1, { message: 'businessRegNumber must not be empty' })
  @MaxLength(100, { message: 'businessRegNumber must not exceed 100 characters' })
  businessRegNumber: string;

  @IsOptional()
  @IsString({ message: 'registeredBuisnessName must be a string' })
  @MaxLength(255)
  registeredBuisnessName?: string;

  @IsUUID('4', { message: 'countryOfRegistrationId must be a valid UUID' })
  countryOfRegistrationId: string;

  @IsString({ message: 'registeredAddress must be a string' })
  @MinLength(5, { message: 'registeredAddress must be at least 5 characters' })
  @MaxLength(500, { message: 'registeredAddress must not exceed 500 characters' })
  registeredAddress: string;

  @IsString({ message: 'contactPersonName must be a string' })
  @MinLength(2, { message: 'contactPersonName must be at least 2 characters' })
  @MaxLength(100, { message: 'contactPersonName must not exceed 100 characters' })
  contactPersonName: string;

  @IsString({ message: 'contactPersonDesignation must be a string' })
  @MinLength(2, { message: 'contactPersonDesignation must be at least 2 characters' })
  @MaxLength(100, { message: 'contactPersonDesignation must not exceed 100 characters' })
  contactPersonDesignation: string;

  @IsEmail({}, { message: 'contactPersonEmail must be a valid email address' })
  contactPersonEmail: string;

  @IsPhoneNumber(undefined, {
    message: 'contactPersonPhone must be a valid phone number',
  })
  contactPersonPhone: string;

  @IsOptional()
  @IsUrl({}, { message: 'websiteURL must be a valid URL' })
  websiteURL?: string;

  @IsOptional()
  @IsUrl({}, { message: 'linkedInURL must be a valid URL' })
  linkedInURL?: string;

  @IsOptional()
  @IsUrl({}, { message: 'logoURL must be a valid URL' })
  logoURL?: string;

  @IsOptional()
  @IsUrl({}, { message: 'profileDeckURL must be a valid URL' })
  profileDeckURL?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'yearOfEstablishment must be an integer' })
  @Min(1800, { message: 'yearOfEstablishment must be 1800 or later' })
  @Max(new Date().getFullYear(), {
    message: `yearOfEstablishment must not exceed ${new Date().getFullYear()}`,
  })
  yearOfEstablishment?: number;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @MaxLength(2000, { message: 'description must not exceed 2000 characters' })
  description?: string;
}
