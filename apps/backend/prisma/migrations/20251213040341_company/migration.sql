-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('PENDING', 'COMPANY', 'BD_PARTNER_INDIVIDUAL', 'BD_PARTNER_ORGANIZATION', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'VERIFIED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "EOIStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED');

-- CreateEnum
CREATE TYPE "EOIInitiator" AS ENUM ('BD_PARTNER', 'COMPANY');

-- CreateEnum
CREATE TYPE "EnglishFluency" AS ENUM ('BASIC', 'INTERMEDIATE', 'FLUENT');

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
CREATE TABLE "company_profile" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "businessRegNumber" TEXT NOT NULL,
    "registeredBuisnessName" TEXT,
    "countryOfRegistration" TEXT NOT NULL,
    "registeredAddress" TEXT NOT NULL,
    "ndaAgreed" BOOLEAN NOT NULL DEFAULT false,
    "primaryContactName" TEXT NOT NULL,
    "primaryContactDesignation" TEXT NOT NULL,
    "primaryContactEmail" TEXT NOT NULL,
    "primaryContactPhone" TEXT NOT NULL,
    "industryCategoryId" TEXT NOT NULL,
    "industrySubCategoryId" TEXT,
    "industrySpecialisationId" TEXT,
    "description" TEXT,
    "websiteURL" TEXT,
    "logoURL" TEXT,
    "profileDeckURL" TEXT,
    "headOfficeLocation" TEXT,
    "yearOfEstablishment" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_profile_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "user_profile_userId_key" ON "user_profile"("userId");

-- CreateIndex
CREATE INDEX "user_profile_userId_idx" ON "user_profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "company_profile_userProfileId_key" ON "company_profile"("userProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "company_profile_businessRegNumber_key" ON "company_profile"("businessRegNumber");

-- CreateIndex
CREATE UNIQUE INDEX "company_profile_primaryContactEmail_key" ON "company_profile"("primaryContactEmail");

-- CreateIndex
CREATE INDEX "company_profile_userProfileId_idx" ON "company_profile"("userProfileId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_sub_category" ADD CONSTRAINT "industry_sub_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "industry_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_specialisation" ADD CONSTRAINT "industry_specialisation_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "industry_sub_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_profile" ADD CONSTRAINT "company_profile_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_profile" ADD CONSTRAINT "company_profile_industryCategoryId_fkey" FOREIGN KEY ("industryCategoryId") REFERENCES "industry_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_profile" ADD CONSTRAINT "company_profile_industrySubCategoryId_fkey" FOREIGN KEY ("industrySubCategoryId") REFERENCES "industry_sub_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_profile" ADD CONSTRAINT "company_profile_industrySpecialisationId_fkey" FOREIGN KEY ("industrySpecialisationId") REFERENCES "industry_specialisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
