import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateIncentiveMethodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateIncentiveMethodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
