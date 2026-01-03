import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean, IsDecimal } from 'class-validator';
import { ProductType, PaymentModel, ProductStatus } from '../../../generated/prisma/enums.js';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  companyProfileId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ProductType)
  @IsNotEmpty()
  type: ProductType;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  detailedDescription: string;

  @IsString()
  @IsOptional()
  imageURL?: string;

  @IsEnum(PaymentModel)
  @IsNotEmpty()
  paymentModel: PaymentModel;

  @IsString()
  @IsOptional()
  indicativeIncentive?: string;

  @IsString()
  @IsOptional()
  preferredYearsOfExperienceId?: string;

  @IsString()
  @IsOptional()
  engagementMethodId?: string;

  @IsBoolean()
  @IsOptional()
  salesTrainingAvailable?: boolean;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  detailedDescription?: string;

  @IsString()
  @IsOptional()
  imageURL?: string;

  @IsEnum(PaymentModel)
  @IsOptional()
  paymentModel?: PaymentModel;

  @IsString()
  @IsOptional()
  indicativeIncentive?: string;

  @IsString()
  @IsOptional()
  preferredYearsOfExperienceId?: string;

  @IsString()
  @IsOptional()
  engagementMethodId?: string;

  @IsBoolean()
  @IsOptional()
  salesTrainingAvailable?: boolean;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
}
