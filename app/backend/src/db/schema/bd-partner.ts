import {
  pgTable,
  text,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";
import { userProfile } from "./user-profile";
import { companyDetails } from "./company";
import { experienceYearsEnum, employeeSizeEnum, englishFluencyEnum } from "./enums";

// BD Partner Individual Profile
export const bdPartnerIndividual = pgTable("bd_partner_individual", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userProfileId: text("user_profile_id")
    .notNull()
    .references(() => userProfile.id, { onDelete: "cascade" })
    .unique(),
  
  // Stage 1: Personal Details
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  mobileNumber: text("mobile_number"),
  country: text("country"),
  stateProvince: text("state_province"),
  city: text("city"),
  linkedinProfile: text("linkedin_profile"),
  
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// BD Partner Company Profile (references existing company details)
export const bdPartnerCompany = pgTable("bd_partner_company", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userProfileId: text("user_profile_id")
    .notNull()
    .references(() => userProfile.id, { onDelete: "cascade" })
    .unique(),
  companyDetailsId: text("company_details_id")
    .notNull()
    .references(() => companyDetails.id, { onDelete: "cascade" }),
  
  // Contact Person for BD Partner Company
  contactPersonName: text("contact_person_name").notNull(),
  contactPersonDesignation: text("contact_person_designation"),
  contactPersonEmail: text("contact_person_email").notNull(),
  contactPersonPhone: text("contact_person_phone"),
  
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Professional Background (for both individual and company BD partners)
export const professionalBackground = pgTable("professional_background", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userProfileId: text("user_profile_id")
    .notNull()
    .references(() => userProfile.id, { onDelete: "cascade" })
    .unique(),
  
  // Stage 2: Professional Background
  industriesExperienced: text("industries_experienced"), // JSON array
  domainExpertise: text("domain_expertise"), // JSON array
  specialization: text("specialization"), // JSON array
  industriesSpecialised: text("industries_specialised"), // JSON array
  toolsPlatforms: text("tools_platforms"), // JSON array
  certifications: text("certifications"), // JSON array
  yearsOfBdExperience: experienceYearsEnum("years_of_bd_experience"),
  englishFluency: englishFluencyEnum("english_fluency"),
  referralNetworkBase: text("referral_network_base"),
  
  // For BD Partner Companies
  numberOfEmployees: employeeSizeEnum("number_of_employees"),
  yearsOfExperience: experienceYearsEnum("years_of_experience"),
  existingClientBase: text("existing_client_base"),
  targetRegions: text("target_regions"), // JSON array
  
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Engagement Preferences (Stage 3)
export const engagementPreferences = pgTable("engagement_preferences", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userProfileId: text("user_profile_id")
    .notNull()
    .references(() => userProfile.id, { onDelete: "cascade" })
    .unique(),
  
  // Stage 3: Engagement Preferences
  preferredEngagementTypes: text("preferred_engagement_types"), // JSON array
  availabilityHoursPerWeek: decimal("availability_hours_per_week", { precision: 5, scale: 2 }),
  capacityCommitment: decimal("capacity_commitment", { precision: 5, scale: 2 }),
  
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const bdPartnerSchema = {
  bdPartnerIndividual,
  bdPartnerCompany,
  professionalBackground,
  engagementPreferences,
};
