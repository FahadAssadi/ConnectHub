import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';
import { EOIInitiator } from '../../../generated/prisma/enums.js';

export class CreateEOIDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ValidateIf((o) => !o.bdPartnerOrganizationProfileId)
  @IsNotEmpty()
  @IsUUID()
  bdPartnerIndividualProfileId?: string;

  @ValidateIf((o) => !o.bdPartnerIndividualProfileId)
  @IsNotEmpty()
  @IsUUID()
  bdPartnerOrganizationProfileId?: string;

  @IsNotEmpty()
  @IsEnum(EOIInitiator)
  initiator: EOIInitiator;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  expiresAt?: Date;
}
