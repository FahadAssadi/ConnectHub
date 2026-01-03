import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CommonCompanyDetailsDto } from './common-company-details.dto.js';

/**
 * DTO for registering a Company profile.
 * Combines CompanyProfile and CommonCompanyDetails data.
 * Must be called by an authenticated user (via AuthGuard).
 */
export class RegisterCompanyDto {
  @ValidateNested()
  @Type(() => CommonCompanyDetailsDto)
  commonDetails: CommonCompanyDetailsDto;

  @IsBoolean({ message: 'ndaAgreed must be a boolean' })
  ndaAgreed: boolean;

  @IsOptional()
  @IsString({ message: 'headOfficeLocation must be a string' })
  @MaxLength(255, { message: 'headOfficeLocation must not exceed 255 characters' })
  headOfficeLocation?: string;
}
