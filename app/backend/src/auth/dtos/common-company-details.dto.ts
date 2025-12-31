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

  @IsOptional()
  @IsString({ message: 'countryOfRegistration must be a string' })
  @MinLength(2, { message: 'countryOfRegistration must be at least 2 characters' })
  @MaxLength(100, { message: 'countryOfRegistration must not exceed 100 characters' })
  countryOfRegistration?: string;

  @IsOptional()
  @IsString({ message: 'country must be a string' })
  @MinLength(2, { message: 'country must be at least 2 characters' })
  @MaxLength(100, { message: 'country must not exceed 100 characters' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'countryIso2Code must be a string' })
  @MaxLength(2, { message: 'countryIso2Code must not exceed 2 characters' })
  countryIso2Code?: string;

  @IsOptional()
  @IsString({ message: 'stateOrProvince must be a string' })
  @MaxLength(100, { message: 'stateOrProvince must not exceed 100 characters' })
  stateOrProvince?: string;

  @IsOptional()
  @IsString({ message: 'registeredAddress must be a string' })
  @MinLength(5, { message: 'registeredAddress must be at least 5 characters' })
  @MaxLength(500, { message: 'registeredAddress must not exceed 500 characters' })
  registeredAddress?: string;

  @IsOptional()
  @IsString({ message: 'address must be a string' })
  @MinLength(5, { message: 'address must be at least 5 characters' })
  @MaxLength(500, { message: 'address must not exceed 500 characters' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'contactPersonName must be a string' })
  @MinLength(2, { message: 'contactPersonName must be at least 2 characters' })
  @MaxLength(100, { message: 'contactPersonName must not exceed 100 characters' })
  contactPersonName?: string;

  @IsOptional()
  @IsString({ message: 'contactPersonDesignation must be a string' })
  @MinLength(2, { message: 'contactPersonDesignation must be at least 2 characters' })
  @MaxLength(100, { message: 'contactPersonDesignation must not exceed 100 characters' })
  contactPersonDesignation?: string;

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
  @IsUrl({}, { message: 'officialWebsite must be a valid URL' })
  officialWebsite?: string;

  @IsOptional()
  @IsUrl({}, { message: 'linkedInURL must be a valid URL' })
  linkedInURL?: string;

  @IsOptional()
  @IsUrl({}, { message: 'linkedInProfileURL must be a valid URL' })
  linkedInProfileURL?: string;

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
