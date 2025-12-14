/*
  Warnings:

  - You are about to drop the column `businessRegNumber` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `countryOfRegistration` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `industryCategoryId` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `industrySpecialisationId` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `industrySubCategoryId` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `logoURL` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `primaryContactDesignation` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `primaryContactEmail` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `primaryContactName` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `primaryContactPhone` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `profileDeckURL` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `registeredAddress` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `registeredBuisnessName` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `websiteURL` on the `company_profile` table. All the data in the column will be lost.
  - You are about to drop the column `yearOfEstablishment` on the `company_profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[commonDetailsId]` on the table `company_profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commonDetailsId` to the `company_profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmployeeCount" AS ENUM ('ONE_TO_TEN', 'ELEVEN_TO_FIFTY', 'FIFTY_ONE_TO_TWO_HUNDRED', 'TWO_HUNDRED_ONE_TO_FIVE_HUNDRED', 'FIVE_HUNDRED_ONE_TO_THOUSAND', 'OVER_THOUSAND');

-- DropForeignKey
ALTER TABLE "company_profile" DROP CONSTRAINT "company_profile_industryCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "company_profile" DROP CONSTRAINT "company_profile_industrySpecialisationId_fkey";

-- DropForeignKey
ALTER TABLE "company_profile" DROP CONSTRAINT "company_profile_industrySubCategoryId_fkey";

-- DropIndex
DROP INDEX "company_profile_businessRegNumber_key";

-- DropIndex
DROP INDEX "company_profile_primaryContactEmail_key";

-- AlterTable
ALTER TABLE "company_profile" DROP COLUMN "businessRegNumber",
DROP COLUMN "companyName",
DROP COLUMN "countryOfRegistration",
DROP COLUMN "description",
DROP COLUMN "industryCategoryId",
DROP COLUMN "industrySpecialisationId",
DROP COLUMN "industrySubCategoryId",
DROP COLUMN "logoURL",
DROP COLUMN "primaryContactDesignation",
DROP COLUMN "primaryContactEmail",
DROP COLUMN "primaryContactName",
DROP COLUMN "primaryContactPhone",
DROP COLUMN "profileDeckURL",
DROP COLUMN "registeredAddress",
DROP COLUMN "registeredBuisnessName",
DROP COLUMN "websiteURL",
DROP COLUMN "yearOfEstablishment",
ADD COLUMN     "commonDetailsId" TEXT NOT NULL;

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
CREATE UNIQUE INDEX "common_organisation_details_businessRegNumber_key" ON "common_organisation_details"("businessRegNumber");

-- CreateIndex
CREATE UNIQUE INDEX "common_organisation_details_contactPersonEmail_key" ON "common_organisation_details"("contactPersonEmail");

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
CREATE UNIQUE INDEX "company_profile_commonDetailsId_key" ON "company_profile"("commonDetailsId");

-- CreateIndex
CREATE INDEX "company_profile_commonDetailsId_idx" ON "company_profile"("commonDetailsId");

-- AddForeignKey
ALTER TABLE "state_or_province" ADD CONSTRAINT "state_or_province_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "common_organisation_details" ADD CONSTRAINT "common_organisation_details_countryOfRegistrationId_fkey" FOREIGN KEY ("countryOfRegistrationId") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
