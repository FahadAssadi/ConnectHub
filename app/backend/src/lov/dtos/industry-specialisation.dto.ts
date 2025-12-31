import { IsString, IsNotEmpty } from 'class-validator';

export class CreateIndustrySpecialisationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subCategoryId: string;
}

export class UpdateIndustrySpecialisationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subCategoryId: string;
}
