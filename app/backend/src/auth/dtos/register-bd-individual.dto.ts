import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
  IsUUID,
  IsOptional,
  IsUrl,
  IsEnum,
  IsDecimal,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Enum for English fluency levels.
 * Mirrors the schema EnglishFluency enum.
 */
enum EnglishFluency {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  FLUENT = 'FLUENT',
}

/**
 * DTO for registering a BD Partner Individual profile.
 * Combines BDPartnerIndividualProfile personal and professional details.
 * Must be called by an authenticated user (via AuthGuard).
 */
export class RegisterBdIndividualDto {
  // ========== PERSONAL DETAILS ==========
  @IsString({ message: 'firstName must be a string' })
  @MinLength(2, { message: 'firstName must be at least 2 characters' })
  @MaxLength(100, { message: 'firstName must not exceed 100 characters' })
  firstName: string;

  @IsString({ message: 'lastName must be a string' })
  @MinLength(2, { message: 'lastName must be at least 2 characters' })
  @MaxLength(100, { message: 'lastName must not exceed 100 characters' })
  lastName: string;

  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsPhoneNumber(undefined, {
    message: 'phone must be a valid phone number',
  })
  phone: string;

  @IsUUID('4', { message: 'countryId must be a valid UUID' })
  countryId: string;

  @IsUUID('4', { message: 'stateOrProvinceId must be a valid UUID' })
  stateOrProvinceId: string;

  @IsString({ message: 'city must be a string' })
  @MinLength(2, { message: 'city must be at least 2 characters' })
  @MaxLength(100, { message: 'city must not exceed 100 characters' })
  city: string;

  @IsBoolean({ message: 'ndaAgreed must be a boolean' })
  ndaAgreed: boolean;

  // ========== PROFESSIONAL DETAILS ==========
  @IsUUID('4', { message: 'yearsOfExperienceId must be a valid UUID' })
  yearsOfExperienceId: string;

  @IsOptional()
  @IsEnum(EnglishFluency, {
    message: `fluencyInEnglish must be one of: ${Object.values(EnglishFluency).join(', ')}`,
  })
  fluencyInEnglish?: EnglishFluency;

  @IsOptional()
  @IsString({ message: 'referralNetworkDescription must be a string' })
  @MaxLength(2000, {
    message: 'referralNetworkDescription must not exceed 2000 characters',
  })
  referralNetworkDescription?: string;

  @IsOptional()
  @Type(() => Number)
  @IsDecimal({ decimal_digits: '1,2' }, {
    message: 'availabilityHoursPerWeek must be a valid decimal number',
  })
  availabilityHoursPerWeek?: number;

  @IsOptional()
  @IsUrl({}, { message: 'linkedInURL must be a valid URL' })
  linkedInURL?: string;

  @IsOptional()
  @IsUrl({}, { message: 'resumeURL must be a valid URL' })
  resumeURL?: string;

  @IsOptional()
  @IsUrl({}, { message: 'idProofURL must be a valid URL' })
  idProofURL?: string;
}
