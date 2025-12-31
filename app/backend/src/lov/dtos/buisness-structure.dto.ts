import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBuisnessStructureDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateBuisnessStructureDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
