import { pgTable, text, timestamp, boolean, integer, varchar } from "drizzle-orm/pg-core";
import { userProfiles } from "./userProfile-schema";
import { companyTypes, countries, industryCategories, industrySpecializations, industrySubCategories } from "./LOV-schema";

export const companies = pgTable("companies", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .unique()
    .references(() => userProfiles.id, { onDelete: "cascade" }),
  
  // Basic Company Info
  companyName: varchar("company_name", { length: 200 }).notNull(),
  registeredCompanyName: varchar("registered_company_name", { length: 200 }),
  abn: varchar("abn", { length: 50 }),
  registrationNumber: varchar("registration_number", { length: 100 }),
  companyTypeId: integer("company_type_id")
    .references(() => companyTypes.id),
  
  // Industry Classification
  industryCategoryId: text("industry_category_id")
    .references(() => industryCategories.id),
  industrySubCategoryId: integer("industry_sub_category_id")
    .references(() => industrySubCategories.id),
  industrySpecializationId: integer("industry_specialization_id")
    .references(() => industrySpecializations.id),
  
  // Location Info
  countryOfRegistrationId: integer("country_of_registration_id")
    .references(() => countries.id),
  registeredAddress: text("registered_address"),
  headOfficeLocation: text("head_office_location"),
  
  // Company Details
  yearEstablished: integer("year_established"),
  websiteUrl: varchar("website_url", { length: 500 }),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  companyDescription: text("company_description"),
  logoUrl: varchar("logo_url", { length: 500 }),
  
  // Status
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

export const companyContacts = pgTable("company_contacts", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  
  fullName: varchar("full_name", { length: 200 }).notNull(),
  designation: varchar("designation", { length: 100 }),
  email: varchar("email", { length: 250 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 50 }),
  linkedinProfile: varchar("linkedin_profile", { length: 500 }),
  
  isPrimary: boolean("is_primary").default(false),
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

export const companyDocuments = pgTable("company_documents", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  
  documentType: varchar("document_type", { length: 100 }).notNull(), // 'profile_deck', 'business_license', 'nda'
  fileName: varchar("file_name", { length: 500 }).notNull(),
  fileUrl: varchar("file_url", { length: 1000 }).notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  isVerified: boolean("is_verified").default(false),
});