import { IsString, IsNotEmpty } from 'class-validator';

export class CreateYearsOfExperienceDto {
  @IsString()
  @IsNotEmpty()
  range: string;
}

export class UpdateYearsOfExperienceDto {
  @IsString()
  @IsNotEmpty()
  range: string;
}
