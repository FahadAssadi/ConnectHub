import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCertificationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateCertificationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
