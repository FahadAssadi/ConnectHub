import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
} from "drizzle-orm/pg-core";
import { userProfile } from "./user-profile";
import { productTypeEnum, engagementModelEnum, experienceYearsEnum } from "./enums";

// Products/Services (created by companies)
export const product = pgTable("product", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userProfileId: text("user_profile_id")
    .notNull()
    .references(() => userProfile.id, { onDelete: "cascade" }),
  
  // Stage 1: Product/Service Info
  name: text("name").notNull(),
  productImage: text("product_image"),
  productType: productTypeEnum("product_type").notNull(),
  industrySpecialization: text("industry_specialization"),
  shortDescription: text("short_description"),
  detailedDescription: text("detailed_description"),
  targetCustomersIndustryCategory: text("target_customers_industry_category"),
  targetCustomerIndustrySubCategory: text("target_customer_industry_sub_category"),
  primaryRegionsMarkets: text("primary_regions_markets"), // JSON array
  engagementMethods: text("engagement_methods"), // JSON array
  paymentModel: text("payment_model"),
  indicativeIncentive: decimal("indicative_incentive", { precision: 10, scale: 2 }),
  
  // Stage 3: BD Engagement Details
  preferredBdPartnerProfile: text("preferred_bd_partner_profile"), // JSON array
  preferredCertifications: text("preferred_certifications"), // JSON array
  preferredYearsExperienceProduct: experienceYearsEnum("preferred_years_experience_product"),
  preferredExperienceInSales: experienceYearsEnum("preferred_experience_in_sales"),
  
  // Stage 4: Connect Hub Notes
  internalNotes: text("internal_notes"),
  
  // Additional fields
  isActive: boolean("is_active").default(true).notNull(),
  salesTrainingAvailable: boolean("sales_training_available").default(false).notNull(),
  
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// BD Partner Applications (when BD partners apply to work with products)
export const bdPartnerApplication = pgTable("bd_partner_application", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  bdPartnerProfileId: text("bd_partner_profile_id")
    .notNull()
    .references(() => userProfile.id, { onDelete: "cascade" }),
  
  applicationStatus: text("application_status").default("pending").notNull(), // pending, approved, rejected
  applicationMessage: text("application_message"),
  companyResponse: text("company_response"),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const productSchema = {
  product,
  bdPartnerApplication,
};
