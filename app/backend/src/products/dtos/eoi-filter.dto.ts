import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { EOIInitiator, EOIStatus } from '../../../generated/prisma/enums.js';
import { Type } from 'class-transformer';

export class EOIFilterDto {
  @IsOptional()
  @IsEnum(EOIStatus)
  status?: EOIStatus;

  @IsOptional()
  @IsEnum(EOIInitiator)
  initiator?: EOIInitiator;

  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsUUID()
  bdPartnerIndividualProfileId?: string;

  @IsOptional()
  @IsUUID()
  bdPartnerOrganizationProfileId?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
