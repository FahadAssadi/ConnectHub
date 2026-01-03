import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { EOIInitiator } from '../../../generated/prisma/enums.js';

export class CreateEOIDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsUUID()
  bdPartnerProfileId: string;

  @IsOptional()
  @IsEnum(EOIInitiator)
  initiator?: EOIInitiator = EOIInitiator.BD_PARTNER;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  expiresAt?: Date;
}
