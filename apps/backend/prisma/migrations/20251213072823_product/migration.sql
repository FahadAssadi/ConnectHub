-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PRODUCT', 'SERVICE');

-- CreateEnum
CREATE TYPE "PaymentModel" AS ENUM ('COMMISSION_BASED', 'FIXED_FEE', 'REVENUE_SHARE', 'HYBRID', 'RETAINER');

-- CreateEnum
CREATE TYPE "SalesSupportMaterialType" AS ENUM ('BROCHURE_DATASHEET', 'DEMO_VIDEO', 'BUSINESS_USECASE', 'PITCH_DECK', 'EMAIL_TEMPLATE', 'COLD_CALL_SCRIPT', 'OBJECTION_HANDLING_GUIDE', 'COMPETITOR_COMPARISON', 'PRICING_SHEET');

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "companyProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ProductType" NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "shortDescription" TEXT NOT NULL,
    "detailedDescription" TEXT NOT NULL,
    "imageURL" TEXT,
    "paymentModel" "PaymentModel" NOT NULL,
    "indicativeIncentive" TEXT,
    "preferredYearsOfExperienceId" TEXT,
    "engagementMethodId" TEXT,
    "salesTrainingAvailable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_target_customer_industry" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "industryCategoryId" TEXT,
    "industrySubCategoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_target_customer_industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_target_region" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "stateOrProvinceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_target_region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_sales_support_material" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "materialType" "SalesSupportMaterialType" NOT NULL,
    "title" TEXT NOT NULL,
    "fileURL" TEXT,
    "linkURL" TEXT,
    "description" TEXT,
    "visibleAfterEOI" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_sales_support_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_preferred_bd_profile" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "industrySpecialisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_preferred_bd_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_preferred_certification" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_preferred_certification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_companyProfileId_idx" ON "product"("companyProfileId");

-- CreateIndex
CREATE INDEX "product_status_idx" ON "product"("status");

-- CreateIndex
CREATE INDEX "product_target_customer_industry_productId_idx" ON "product_target_customer_industry"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "product_target_customer_industry_productId_industryCategory_key" ON "product_target_customer_industry"("productId", "industryCategoryId", "industrySubCategoryId");

-- CreateIndex
CREATE INDEX "product_target_region_productId_idx" ON "product_target_region"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "product_target_region_productId_countryId_key" ON "product_target_region"("productId", "countryId");

-- CreateIndex
CREATE INDEX "product_sales_support_material_productId_idx" ON "product_sales_support_material"("productId");

-- CreateIndex
CREATE INDEX "product_sales_support_material_materialType_idx" ON "product_sales_support_material"("materialType");

-- CreateIndex
CREATE INDEX "product_preferred_bd_profile_productId_idx" ON "product_preferred_bd_profile"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "product_preferred_bd_profile_productId_industrySpecialisati_key" ON "product_preferred_bd_profile"("productId", "industrySpecialisationId");

-- CreateIndex
CREATE INDEX "product_preferred_certification_productId_idx" ON "product_preferred_certification"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "product_preferred_certification_productId_certificationId_key" ON "product_preferred_certification"("productId", "certificationId");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "company_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_preferredYearsOfExperienceId_fkey" FOREIGN KEY ("preferredYearsOfExperienceId") REFERENCES "years_of_experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_engagementMethodId_fkey" FOREIGN KEY ("engagementMethodId") REFERENCES "engagement_model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_target_customer_industry" ADD CONSTRAINT "product_target_customer_industry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_target_customer_industry" ADD CONSTRAINT "product_target_customer_industry_industryCategoryId_fkey" FOREIGN KEY ("industryCategoryId") REFERENCES "industry_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_target_customer_industry" ADD CONSTRAINT "product_target_customer_industry_industrySubCategoryId_fkey" FOREIGN KEY ("industrySubCategoryId") REFERENCES "industry_sub_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_target_region" ADD CONSTRAINT "product_target_region_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_target_region" ADD CONSTRAINT "product_target_region_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_target_region" ADD CONSTRAINT "product_target_region_stateOrProvinceId_fkey" FOREIGN KEY ("stateOrProvinceId") REFERENCES "state_or_province"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sales_support_material" ADD CONSTRAINT "product_sales_support_material_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_preferred_bd_profile" ADD CONSTRAINT "product_preferred_bd_profile_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_preferred_bd_profile" ADD CONSTRAINT "product_preferred_bd_profile_industrySpecialisationId_fkey" FOREIGN KEY ("industrySpecialisationId") REFERENCES "industry_specialisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_preferred_certification" ADD CONSTRAINT "product_preferred_certification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_preferred_certification" ADD CONSTRAINT "product_preferred_certification_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "certification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
