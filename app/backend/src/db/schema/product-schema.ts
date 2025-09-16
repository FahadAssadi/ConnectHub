import { pgTable, text, timestamp, boolean, integer, varchar } from "drizzle-orm/pg-core";
import { companies } from "./company-schema";
import { industrySpecializations, industryCategories, industrySubCategories, countries, states, cities, engagementModels } from "./LOV-schema";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  
  // Basic Product Info
  name: varchar("name", { length: 300 }).notNull(),
  productType: varchar("product_type", { length: 20 }).notNull(), // 'product', 'service'
  shortDescription: varchar("short_description", { length: 500 }),
  detailedDescription: text("detailed_description"),
  productImageUrl: varchar("product_image_url", { length: 1000 }),
  
  // Classification
  industrySpecializationId: integer("industry_specialization_id")
    .references(() => industrySpecializations.id),
  targetCustomerCategoryId: text("target_customer_category_id")
    .references(() => industryCategories.id),
  targetCustomerSubCategoryId: integer("target_customer_sub_category_id")
    .references(() => industrySubCategories.id),
  
  // Engagement & Incentives
  paymentModel: varchar("payment_model", { length: 100 }),
  indicativeIncentive: varchar("indicative_incentive", { length: 200 }),
  
  // Training & Support
  salesTrainingAvailable: boolean("sales_training_available").default(false),
  
  // Status
  isActive: boolean("is_active").default(true),
  isPublished: boolean("is_published").default(false),
  
  // ConnectHub Notes
  internalNotes: text("internal_notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

export const productPrimaryRegions = pgTable("product_primary_regions", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  countryId: integer("country_id")
    .notNull()
    .references(() => countries.id),
  stateId: integer("state_id")
    .references(() => states.id),
  cityId: integer("city_id")
    .references(() => cities.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productEngagementMethods = pgTable("product_engagement_methods", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  engagementModelId: integer("engagement_model_id")
    .notNull()
    .references(() => engagementModels.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productPreferredBdPartners = pgTable("product_preferred_bd_partners", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  industrySpecializationId: integer("industry_specialization_id")
    .references(() => industrySpecializations.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productDocuments = pgTable("product_documents", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  
  documentType: varchar("document_type", { length: 100 }).notNull(), 
  // 'brochure', 'demo_video', 'business_usecases', 'pitch_deck', 'email_templates', 'cold_call_scripts', 'objection_handling', 'competitor_comparison', 'pricing_sheet'
  fileName: varchar("file_name", { length: 500 }).notNull(),
  fileUrl: varchar("file_url", { length: 1000 }).notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true),
});