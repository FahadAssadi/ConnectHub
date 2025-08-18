import {
  pgTable,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { userProfile } from "./user-profile";
import { companyTypeEnum } from "./enums";

// Company Details (for both company users and BD partner companies)
export const companyDetails = pgTable("company_details", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userProfileId: text("user_profile_id")
    .notNull()
    .references(() => userProfile.id, { onDelete: "cascade" })
    .unique(),
  
  // Stage 1: Basic Company Details
  companyName: text("company_name").notNull(),
  abnBusinessNumber: text("abn_business_number"),
  registeredBusinessName: text("registered_business_name"),
  industryCategory: text("industry_category"),
  industrySubCategory: text("industry_sub_category"),
  industrySpecialization: text("industry_specialization"),
  countryOfRegistration: text("country_of_registration"),
  headOfficeLocation: text("head_office_location"),
  registeredAddress: text("registered_address"),
  yearOfIncorporation: integer("year_of_incorporation"),
  
  // Company Type and Additional Details
  companyType: companyTypeEnum("company_type"),
  website: text("website"),
  linkedinUrl: text("linkedin_url"),
  socialLinks: text("social_links"), // JSON array
  
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Primary Contact Person (for companies)
export const primaryContact = pgTable("primary_contact", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyDetailsId: text("company_details_id")
    .notNull()
    .references(() => companyDetails.id, { onDelete: "cascade" })
    .unique(),
  
  // Stage 2: Primary Contact Details
  fullName: text("full_name").notNull(),
  jobTitle: text("job_title"),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  linkedinProfile: text("linkedin_profile"),
  
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Company Overview (Stage 3)
export const companyOverview = pgTable("company_overview", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyDetailsId: text("company_details_id")
    .notNull()
    .references(() => companyDetails.id, { onDelete: "cascade" })
    .unique(),
  
  // Stage 3: Company Overview
  briefDescription: text("brief_description"),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const companySchema = {
  companyDetails,
  primaryContact,
  companyOverview,
};
