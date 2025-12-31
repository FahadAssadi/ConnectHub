/*
  Warnings:

  - You are about to drop the column `countryId` on the `bd_partner_individual_profile` table. All the data in the column will be lost.
  - You are about to drop the column `stateOrProvinceId` on the `bd_partner_individual_profile` table. All the data in the column will be lost.
  - You are about to drop the column `countryOfRegistrationId` on the `common_organisation_details` table. All the data in the column will be lost.
  - You are about to drop the column `countryId` on the `product_target_region` table. All the data in the column will be lost.
  - You are about to drop the column `stateOrProvinceId` on the `product_target_region` table. All the data in the column will be lost.
  - You are about to drop the `country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `state_or_province` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productId,countryIso2Code]` on the table `product_target_region` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `country` to the `bd_partner_individual_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryIso2Code` to the `bd_partner_individual_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateOrProvince` to the `bd_partner_individual_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryOfRegistration` to the `common_organisation_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `product_target_region` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryIso2Code` to the `product_target_region` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bd_partner_individual_profile" DROP CONSTRAINT "bd_partner_individual_profile_countryId_fkey";

-- DropForeignKey
ALTER TABLE "bd_partner_individual_profile" DROP CONSTRAINT "bd_partner_individual_profile_stateOrProvinceId_fkey";

-- DropForeignKey
ALTER TABLE "common_organisation_details" DROP CONSTRAINT "common_organisation_details_countryOfRegistrationId_fkey";

-- DropForeignKey
ALTER TABLE "product_target_region" DROP CONSTRAINT "product_target_region_countryId_fkey";

-- DropForeignKey
ALTER TABLE "product_target_region" DROP CONSTRAINT "product_target_region_stateOrProvinceId_fkey";

-- DropForeignKey
ALTER TABLE "state_or_province" DROP CONSTRAINT "state_or_province_countryId_fkey";

-- DropIndex
DROP INDEX "product_target_region_productId_countryId_key";

-- AlterTable
ALTER TABLE "bd_partner_individual_profile" DROP COLUMN "countryId",
DROP COLUMN "stateOrProvinceId",
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "countryIso2Code" TEXT NOT NULL,
ADD COLUMN     "stateOrProvince" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "common_organisation_details" DROP COLUMN "countryOfRegistrationId",
ADD COLUMN     "countryOfRegistration" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_target_region" DROP COLUMN "countryId",
DROP COLUMN "stateOrProvinceId",
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "countryIso2Code" TEXT NOT NULL,
ADD COLUMN     "stateOrProvince" TEXT;

-- DropTable
DROP TABLE "country";

-- DropTable
DROP TABLE "state_or_province";

-- CreateIndex
CREATE UNIQUE INDEX "product_target_region_productId_countryIso2Code_key" ON "product_target_region"("productId", "countryIso2Code");
