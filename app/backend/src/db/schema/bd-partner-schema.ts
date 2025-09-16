import { pgTable, text, timestamp, boolean, integer, varchar } from "drizzle-orm/pg-core";
import { userProfiles } from "./userProfile-schema";
import { cities, countries, engagementModels, industrySpecializations, states } from "./LOV-schema";

export const bdPartners = pgTable("bd_partners", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .unique()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  
  // Individual BD Partner fields
  fullName: varchar("full_name", { length: 200 }),
  email: varchar("email", { length: 250 }),
  mobileNumber: varchar("mobile_number", { length: 50 }),
  linkedinProfile: varchar("linkedin_profile", { length: 500 }),
  
  // Company BD Partner fields (when profileType is 'company')
  companyName: varchar("company_name", { length: 200 }),
  registrationNumber: varchar("registration_number", { length: 100 }),
  websiteUrl: varchar("website_url", { length: 500 }),
  numberOfEmployees: integer("number_of_employees"),
  
  // Location
  countryId: integer("country_id")
    .references(() => countries.id),
  stateId: integer("state_id")
    .references(() => states.id),
  cityId: integer("city_id")
    .references(() => cities.id),
  
  // Experience & Skills
  yearsOfExperience: integer("years_of_experience"),
  englishFluency: varchar("english_fluency", { length: 20 }), // 'basic', 'intermediate', 'fluent'
  referralNetworkDescription: text("referral_network_description"),
  existingClientBase: text("existing_client_base"),
  
  // Engagement
  weeklyCommitmentHours: integer("weekly_commitment_hours"),
  
  // Status
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

export const bdPartnerIndustries = pgTable("bd_partner_industries", {
  id: text("id").primaryKey(),
  bdPartnerId: text("bd_partner_id")
    .notNull()
    .references(() => bdPartners.id, { onDelete: "cascade" }),
  industrySpecializationId: integer("industry_specialization_id")
    .notNull()
    .references(() => industrySpecializations.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bdPartnerEngagements = pgTable("bd_partner_engagements", {
  id: text("id").primaryKey(),
  bdPartnerId: text("bd_partner_id")
    .notNull()
    .references(() => bdPartners.id, { onDelete: "cascade" }),
  engagementModelId: integer("engagement_model_id")
    .notNull()
    .references(() => engagementModels.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bdPartnerToolsPlatforms = pgTable("bd_partner_tools_platforms", {
  id: text("id").primaryKey(),
  bdPartnerId: text("bd_partner_id")
    .notNull()
    .references(() => bdPartners.id, { onDelete: "cascade" }),
  toolName: varchar("tool_name", { length: 100 }).notNull(),
  proficiencyLevel: varchar("proficiency_level", { length: 20 }), // 'basic', 'intermediate', 'advanced'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bdPartnerTargetRegions = pgTable("bd_partner_target_regions", {
  id: text("id").primaryKey(),
  bdPartnerId: text("bd_partner_id")
    .notNull()
    .references(() => bdPartners.id, { onDelete: "cascade" }),
  countryId: integer("country_id")
    .notNull()
    .references(() => countries.id),
  stateId: integer("state_id")
    .references(() => states.id),
  cityId: integer("city_id")
    .references(() => cities.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bdPartnerDocuments = pgTable("bd_partner_documents", {
  id: text("id").primaryKey(),
  bdPartnerId: text("bd_partner_id")
    .notNull()
    .references(() => bdPartners.id, { onDelete: "cascade" }),
  
  documentType: varchar("document_type", { length: 100 }).notNull(), // 'resume', 'id_proof', 'business_license'
  fileName: varchar("file_name", { length: 500 }).notNull(),
  fileUrl: varchar("file_url", { length: 1000 }).notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  isVerified: boolean("is_verified").default(false),
});