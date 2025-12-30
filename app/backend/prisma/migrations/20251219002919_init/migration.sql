-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('PENDING', 'COMPANY', 'BD_PARTNER_INDIVIDUAL', 'BD_PARTNER_ORGANIZATION', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'VERIFIED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PRODUCT', 'SERVICE');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PaymentModel" AS ENUM ('COMMISSION_BASED', 'FIXED_FEE', 'REVENUE_SHARE', 'HYBRID', 'RETAINER');

-- CreateEnum
CREATE TYPE "SalesSupportMaterialType" AS ENUM ('BROCHURE_DATASHEET', 'DEMO_VIDEO', 'BUSINESS_USECASE', 'PITCH_DECK', 'EMAIL_TEMPLATE', 'COLD_CALL_SCRIPT', 'OBJECTION_HANDLING_GUIDE', 'COMPETITOR_COMPARISON', 'PRICING_SHEET');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "EOIStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED');

-- CreateEnum
CREATE TYPE "EOIInitiator" AS ENUM ('BD_PARTNER', 'COMPANY');

-- CreateEnum
CREATE TYPE "EnglishFluency" AS ENUM ('BASIC', 'INTERMEDIATE', 'FLUENT');

-- CreateEnum
CREATE TYPE "EmployeeCount" AS ENUM ('ONE_TO_TEN', 'ELEVEN_TO_FIFTY', 'FIFTY_ONE_TO_TWO_HUNDRED', 'TWO_HUNDRED_ONE_TO_FIVE_HUNDRED', 'FIVE_HUNDRED_ONE_TO_THOUSAND', 'OVER_THOUSAND');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_sub_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_sub_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_specialisation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_specialisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engagement_model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engagement_model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incentive_method" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incentive_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "years_of_experience" (
    "id" TEXT NOT NULL,
    "range" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "years_of_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buisness_structure" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buisness_structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool_platform" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tool_platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iso2Code" TEXT NOT NULL,
    "iso3Code" TEXT NOT NULL,
    "numericCode" TEXT,
    "phoneCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state_or_province" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "state_or_province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "UserType" NOT NULL,
    "status" "ProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_organisation_details" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "businessRegNumber" TEXT NOT NULL,
    "registeredBuisnessName" TEXT,
    "countryOfRegistrationId" TEXT NOT NULL,
    "registeredAddress" TEXT NOT NULL,
    "contactPersonName" TEXT NOT NULL,
    "contactPersonDesignation" TEXT NOT NULL,
    "contactPersonEmail" TEXT NOT NULL,
    "contactPersonPhone" TEXT NOT NULL,
    "websiteURL" TEXT,
    "linkedInURL" TEXT,
    "logoURL" TEXT,
    "profileDeckURL" TEXT,
    "yearOfEstablishment" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "common_organisation_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_profile" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "commonDetailsId" TEXT NOT NULL,
    "ndaAgreed" BOOLEAN NOT NULL DEFAULT false,
    "headOfficeLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bd_partner_individual_profile" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "stateOrProvinceId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "ndaAgreed" BOOLEAN NOT NULL DEFAULT false,
    "yearsOfExperienceId" TEXT NOT NULL,
    "fluencyInEnglish" "EnglishFluency",
    "referralNetworkDescription" TEXT,
    "availabilityHoursPerWeek" DECIMAL(65,30),
    "linkedInURL" TEXT,
    "resumeURL" TEXT,
    "idProofURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bd_partner_individual_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bd_partner_organization_profile" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "commonDetailsId" TEXT NOT NULL,
    "buisnessStructureId" TEXT NOT NULL,
    "employeeCount" "EmployeeCount" NOT NULL,
    "yearsOfExperienceId" TEXT NOT NULL,
    "availabilityHoursPerWeek" DECIMAL(65,30),
    "referralNetworkDescription" TEXT,
    "existingClientBase" TEXT,
    "ndaAgreed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bd_partner_organization_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_industry" (
    "id" TEXT NOT NULL,
    "companyProfileId" TEXT,
    "bdpartnerIndividualProfileId" TEXT,
    "bdpartnerOrganizationProfileId" TEXT,
    "industryCategoryId" TEXT,
    "industrySubCategoryId" TEXT,
    "industrySpecialisationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_engagement" (
    "id" TEXT NOT NULL,
    "companyProfileId" TEXT,
    "bdpartnerIndividualProfileId" TEXT,
    "bdpartnerOrganizationProfileId" TEXT,
    "engagementModelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_engagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_tool" (
    "id" TEXT NOT NULL,
    "companyProfileId" TEXT,
    "bdpartnerIndividualProfileId" TEXT,
    "bdpartnerOrganizationProfileId" TEXT,
    "toolPlatformId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_certification" (
    "id" TEXT NOT NULL,
    "companyProfileId" TEXT,
    "bdpartnerIndividualProfileId" TEXT,
    "bdpartnerOrganizationProfileId" TEXT,
    "certificationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_certification_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "industry_category_name_key" ON "industry_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "industry_sub_category_name_categoryId_key" ON "industry_sub_category"("name", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "industry_specialisation_name_subCategoryId_key" ON "industry_specialisation"("name", "subCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "engagement_model_name_key" ON "engagement_model"("name");

-- CreateIndex
CREATE UNIQUE INDEX "incentive_method_name_key" ON "incentive_method"("name");

-- CreateIndex
CREATE UNIQUE INDEX "years_of_experience_range_key" ON "years_of_experience"("range");

-- CreateIndex
CREATE UNIQUE INDEX "buisness_structure_name_key" ON "buisness_structure"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tool_platform_name_key" ON "tool_platform"("name");

-- CreateIndex
CREATE UNIQUE INDEX "certification_name_key" ON "certification"("name");

-- CreateIndex
CREATE UNIQUE INDEX "country_name_key" ON "country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "country_iso2Code_key" ON "country"("iso2Code");

-- CreateIndex
CREATE UNIQUE INDEX "country_iso3Code_key" ON "country"("iso3Code");

-- CreateIndex
CREATE UNIQUE INDEX "country_numericCode_key" ON "country"("numericCode");

-- CreateIndex
CREATE UNIQUE INDEX "country_phoneCode_key" ON "country"("phoneCode");

-- CreateIndex
CREATE UNIQUE INDEX "state_or_province_name_countryId_key" ON "state_or_province"("name", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_userId_key" ON "user_profile"("userId");

-- CreateIndex
CREATE INDEX "user_profile_userId_idx" ON "user_profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "common_organisation_details_businessRegNumber_key" ON "common_organisation_details"("businessRegNumber");

-- CreateIndex
CREATE UNIQUE INDEX "common_organisation_details_contactPersonEmail_key" ON "common_organisation_details"("contactPersonEmail");

-- CreateIndex
CREATE UNIQUE INDEX "company_profile_userProfileId_key" ON "company_profile"("userProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "company_profile_commonDetailsId_key" ON "company_profile"("commonDetailsId");

-- CreateIndex
CREATE INDEX "company_profile_commonDetailsId_idx" ON "company_profile"("commonDetailsId");

-- CreateIndex
CREATE INDEX "company_profile_userProfileId_idx" ON "company_profile"("userProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "bd_partner_individual_profile_userProfileId_key" ON "bd_partner_individual_profile"("userProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "bd_partner_individual_profile_email_key" ON "bd_partner_individual_profile"("email");

-- CreateIndex
CREATE INDEX "bd_partner_individual_profile_userProfileId_idx" ON "bd_partner_individual_profile"("userProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "bd_partner_organization_profile_userProfileId_key" ON "bd_partner_organization_profile"("userProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "bd_partner_organization_profile_commonDetailsId_key" ON "bd_partner_organization_profile"("commonDetailsId");

-- CreateIndex
CREATE INDEX "bd_partner_organization_profile_commonDetailsId_idx" ON "bd_partner_organization_profile"("commonDetailsId");

-- CreateIndex
CREATE INDEX "bd_partner_organization_profile_userProfileId_idx" ON "bd_partner_organization_profile"("userProfileId");

-- CreateIndex
CREATE INDEX "profile_industry_companyProfileId_idx" ON "profile_industry"("companyProfileId");

-- CreateIndex
CREATE INDEX "profile_industry_bdpartnerIndividualProfileId_idx" ON "profile_industry"("bdpartnerIndividualProfileId");

-- CreateIndex
CREATE INDEX "profile_industry_bdpartnerOrganizationProfileId_idx" ON "profile_industry"("bdpartnerOrganizationProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_industry_companyProfileId_industryCategoryId_indust_key" ON "profile_industry"("companyProfileId", "industryCategoryId", "industrySubCategoryId", "industrySpecialisationId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_industry_bdpartnerIndividualProfileId_industryCateg_key" ON "profile_industry"("bdpartnerIndividualProfileId", "industryCategoryId", "industrySubCategoryId", "industrySpecialisationId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_industry_bdpartnerOrganizationProfileId_industryCat_key" ON "profile_industry"("bdpartnerOrganizationProfileId", "industryCategoryId", "industrySubCategoryId", "industrySpecialisationId");

-- CreateIndex
CREATE INDEX "profile_engagement_companyProfileId_idx" ON "profile_engagement"("companyProfileId");

-- CreateIndex
CREATE INDEX "profile_engagement_bdpartnerIndividualProfileId_idx" ON "profile_engagement"("bdpartnerIndividualProfileId");

-- CreateIndex
CREATE INDEX "profile_engagement_bdpartnerOrganizationProfileId_idx" ON "profile_engagement"("bdpartnerOrganizationProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_engagement_companyProfileId_engagementModelId_key" ON "profile_engagement"("companyProfileId", "engagementModelId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_engagement_bdpartnerIndividualProfileId_engagementM_key" ON "profile_engagement"("bdpartnerIndividualProfileId", "engagementModelId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_engagement_bdpartnerOrganizationProfileId_engagemen_key" ON "profile_engagement"("bdpartnerOrganizationProfileId", "engagementModelId");

-- CreateIndex
CREATE INDEX "profile_tool_companyProfileId_idx" ON "profile_tool"("companyProfileId");

-- CreateIndex
CREATE INDEX "profile_tool_bdpartnerIndividualProfileId_idx" ON "profile_tool"("bdpartnerIndividualProfileId");

-- CreateIndex
CREATE INDEX "profile_tool_bdpartnerOrganizationProfileId_idx" ON "profile_tool"("bdpartnerOrganizationProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_tool_companyProfileId_toolPlatformId_key" ON "profile_tool"("companyProfileId", "toolPlatformId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_tool_bdpartnerIndividualProfileId_toolPlatformId_key" ON "profile_tool"("bdpartnerIndividualProfileId", "toolPlatformId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_tool_bdpartnerOrganizationProfileId_toolPlatformId_key" ON "profile_tool"("bdpartnerOrganizationProfileId", "toolPlatformId");

-- CreateIndex
CREATE INDEX "profile_certification_companyProfileId_idx" ON "profile_certification"("companyProfileId");

-- CreateIndex
CREATE INDEX "profile_certification_bdpartnerIndividualProfileId_idx" ON "profile_certification"("bdpartnerIndividualProfileId");

-- CreateIndex
CREATE INDEX "profile_certification_bdpartnerOrganizationProfileId_idx" ON "profile_certification"("bdpartnerOrganizationProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_certification_companyProfileId_certificationId_key" ON "profile_certification"("companyProfileId", "certificationId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_certification_bdpartnerIndividualProfileId_certific_key" ON "profile_certification"("bdpartnerIndividualProfileId", "certificationId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_certification_bdpartnerOrganizationProfileId_certif_key" ON "profile_certification"("bdpartnerOrganizationProfileId", "certificationId");

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
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_sub_category" ADD CONSTRAINT "industry_sub_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "industry_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_specialisation" ADD CONSTRAINT "industry_specialisation_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "industry_sub_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state_or_province" ADD CONSTRAINT "state_or_province_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "common_organisation_details" ADD CONSTRAINT "common_organisation_details_countryOfRegistrationId_fkey" FOREIGN KEY ("countryOfRegistrationId") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_profile" ADD CONSTRAINT "company_profile_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_profile" ADD CONSTRAINT "company_profile_commonDetailsId_fkey" FOREIGN KEY ("commonDetailsId") REFERENCES "common_organisation_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bd_partner_individual_profile" ADD CONSTRAINT "bd_partner_individual_profile_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bd_partner_individual_profile" ADD CONSTRAINT "bd_partner_individual_profile_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bd_partner_individual_profile" ADD CONSTRAINT "bd_partner_individual_profile_stateOrProvinceId_fkey" FOREIGN KEY ("stateOrProvinceId") REFERENCES "state_or_province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bd_partner_individual_profile" ADD CONSTRAINT "bd_partner_individual_profile_yearsOfExperienceId_fkey" FOREIGN KEY ("yearsOfExperienceId") REFERENCES "years_of_experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bd_partner_organization_profile" ADD CONSTRAINT "bd_partner_organization_profile_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bd_partner_organization_profile" ADD CONSTRAINT "bd_partner_organization_profile_commonDetailsId_fkey" FOREIGN KEY ("commonDetailsId") REFERENCES "common_organisation_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bd_partner_organization_profile" ADD CONSTRAINT "bd_partner_organization_profile_buisnessStructureId_fkey" FOREIGN KEY ("buisnessStructureId") REFERENCES "buisness_structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bd_partner_organization_profile" ADD CONSTRAINT "bd_partner_organization_profile_yearsOfExperienceId_fkey" FOREIGN KEY ("yearsOfExperienceId") REFERENCES "years_of_experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_industry" ADD CONSTRAINT "profile_industry_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "company_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_industry" ADD CONSTRAINT "profile_industry_bdpartnerIndividualProfileId_fkey" FOREIGN KEY ("bdpartnerIndividualProfileId") REFERENCES "bd_partner_individual_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_industry" ADD CONSTRAINT "profile_industry_bdpartnerOrganizationProfileId_fkey" FOREIGN KEY ("bdpartnerOrganizationProfileId") REFERENCES "bd_partner_organization_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_industry" ADD CONSTRAINT "profile_industry_industryCategoryId_fkey" FOREIGN KEY ("industryCategoryId") REFERENCES "industry_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_industry" ADD CONSTRAINT "profile_industry_industrySubCategoryId_fkey" FOREIGN KEY ("industrySubCategoryId") REFERENCES "industry_sub_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_industry" ADD CONSTRAINT "profile_industry_industrySpecialisationId_fkey" FOREIGN KEY ("industrySpecialisationId") REFERENCES "industry_specialisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_engagement" ADD CONSTRAINT "profile_engagement_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "company_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_engagement" ADD CONSTRAINT "profile_engagement_bdpartnerIndividualProfileId_fkey" FOREIGN KEY ("bdpartnerIndividualProfileId") REFERENCES "bd_partner_individual_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_engagement" ADD CONSTRAINT "profile_engagement_bdpartnerOrganizationProfileId_fkey" FOREIGN KEY ("bdpartnerOrganizationProfileId") REFERENCES "bd_partner_organization_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_engagement" ADD CONSTRAINT "profile_engagement_engagementModelId_fkey" FOREIGN KEY ("engagementModelId") REFERENCES "engagement_model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_tool" ADD CONSTRAINT "profile_tool_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "company_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_tool" ADD CONSTRAINT "profile_tool_bdpartnerIndividualProfileId_fkey" FOREIGN KEY ("bdpartnerIndividualProfileId") REFERENCES "bd_partner_individual_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_tool" ADD CONSTRAINT "profile_tool_bdpartnerOrganizationProfileId_fkey" FOREIGN KEY ("bdpartnerOrganizationProfileId") REFERENCES "bd_partner_organization_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_tool" ADD CONSTRAINT "profile_tool_toolPlatformId_fkey" FOREIGN KEY ("toolPlatformId") REFERENCES "tool_platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_certification" ADD CONSTRAINT "profile_certification_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "company_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_certification" ADD CONSTRAINT "profile_certification_bdpartnerIndividualProfileId_fkey" FOREIGN KEY ("bdpartnerIndividualProfileId") REFERENCES "bd_partner_individual_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_certification" ADD CONSTRAINT "profile_certification_bdpartnerOrganizationProfileId_fkey" FOREIGN KEY ("bdpartnerOrganizationProfileId") REFERENCES "bd_partner_organization_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_certification" ADD CONSTRAINT "profile_certification_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "certification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
