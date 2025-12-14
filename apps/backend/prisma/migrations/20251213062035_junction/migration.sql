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
