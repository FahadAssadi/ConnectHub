import { IsString, IsNotEmpty } from 'class-validator';

export class CreateIndustryCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateIndustryCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
