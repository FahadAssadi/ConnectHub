import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBusinessStructureDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateBusinessStructureDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
