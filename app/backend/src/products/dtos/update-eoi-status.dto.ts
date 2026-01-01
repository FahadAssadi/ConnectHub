import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EOIStatus } from '../../../generated/prisma/enums.js';

export class UpdateEOIStatusDto {
  @IsNotEmpty()
  @IsEnum(EOIStatus)
  status: EOIStatus;

  @IsOptional()
  @IsString()
  responseMessage?: string;
}
