import { IsString, IsNotEmpty } from 'class-validator';

export class CreateToolPlatformDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateToolPlatformDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
