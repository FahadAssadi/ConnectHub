import { pgTable, text, timestamp, boolean, uuid, integer, pgEnum, jsonb, index } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { 
  businessTypeEnum, 
  companySizeEnum, 
  industryEnum,
  regionEnum,
  currencyEnum 
} from "./common";
import { 
  uuidPrimaryKey, 
  auditTimestamps, 
  contactFields, 
  addressFields,
  isActive, 
  fileFields,
  metadataFields,
  money 
} from "./utils";

// Company specific enums
export const subscriptionStatusEnum = pgEnum('subscription_status', ['trial', 'active', 'suspended', 'expired', 'cancelled']);
export const subscriptionTierEnum = pgEnum('subscription_tier', ['basic', 'professional', 'enterprise', 'custom']);
export const companyDocumentTypeEnum = pgEnum('company_document_type', [
  'logo', 'profile', 'deck', 'brochure', 'certification', 'agreement', 'financial', 'legal'
]);

/**
 * Company main profile table
 * Central repository for all company information
 */
export const companies = pgTable("companies", {
  id: uuidPrimaryKey(),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  
  // Basic company information
  companyName: text("company_name").notNull(),
  legalName: text("legal_name"), // Full legal business name
  displayName: text("display_name"), // Public display name
  tagline: text("tagline"), // Company tagline/slogan
  description: text("description"), // Company description
  
  // Business details
  industry: industryEnum("industry").notNull(),
  businessType: businessTypeEnum("business_type").notNull(),
  companySize: companySizeEnum("company_size"),
  
  // Registration and legal
  registrationCountry: regionEnum("registration_country").notNull(),
  incorporationYear: integer("incorporation_year"),
  businessRegistrationNumber: text("business_registration_number"),
  taxId: text("tax_id"), // VAT/Tax identification
  abnNumber: text("abn_number"), // Australia specific
  einNumber: text("ein_number"), // US specific
  
  // Contact and location
  ...contactFields(),
  ...addressFields("head_office"),
  
  // Financial information
  baseCurrency: currencyEnum("base_currency").default('USD').notNull(),
  annualRevenue: text("annual_revenue"), // Decimal as string
  fundingStage: text("funding_stage"), // seed, series_a, etc.
  fundingAmount: text("funding_amount"), // Decimal as string
  
  // Company metrics
  employeeCount: integer("employee_count"),
  foundedYear: integer("founded_year"),
  customerCount: integer("customer_count"),
  
  // Subscription and billing
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default('trial').notNull(),
  subscriptionTier: subscriptionTierEnum("subscription_tier").default('basic').notNull(),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  billingCycle: text("billing_cycle").default('monthly').notNull(), // monthly, yearly
  
  // Profile and visibility
  isActive: isActive(),
  isPublicProfile: boolean("is_public_profile").default(true).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  verificationDate: timestamp("verification_date"),
  
  // Company features and settings
  features: jsonb("features"), // Enabled features
  settings: jsonb("settings"), // Company-specific settings
  
  // Social and digital presence
  socialMedia: jsonb("social_media"), // Object with platform URLs
  
  // Extensibility
  ...metadataFields(),
  
  // Audit fields
  ...auditTimestamps(),
}, (table) => ({
  userIdIdx: index("companies_user_id_idx").on(table.userId),
  industryIdx: index("companies_industry_idx").on(table.industry),
  businessTypeIdx: index("companies_business_type_idx").on(table.businessType),
  sizeIdx: index("companies_size_idx").on(table.companySize),
  countryIdx: index("companies_country_idx").on(table.registrationCountry),
  subscriptionIdx: index("companies_subscription_idx").on(table.subscriptionStatus, table.subscriptionTier),
  verificationIdx: index("companies_verification_idx").on(table.isVerified),
  activeIdx: index("companies_active_idx").on(table.isActive),
}));

/**
 * Company contacts and team members
 * Tracks key personnel and their roles within the company
 */
export const companyContacts = pgTable("company_contacts", {
  id: uuidPrimaryKey(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  
  // Contact information
  fullName: text("full_name").notNull(),
  jobTitle: text("job_title").notNull(),
  department: text("department"),
  ...contactFields(),
  
  // Role and permissions
  isPrimary: boolean("is_primary").default(false).notNull(),
  isActive: isActive(),
  isBillingContact: boolean("is_billing_contact").default(false).notNull(),
  isTechnicalContact: boolean("is_technical_contact").default(false).notNull(),
  
  // Access and responsibilities
  canManagePartners: boolean("can_manage_partners").default(false).notNull(),
  canApproveEois: boolean("can_approve_eois").default(false).notNull(),
  canAccessBilling: boolean("can_access_billing").default(false).notNull(),
  
  // Additional information
  bio: text("bio"),
  profileImage: text("profile_image"),
  
  // Audit fields
  ...auditTimestamps(),
}, (table) => ({
  companyIdx: index("company_contacts_company_idx").on(table.companyId),
  primaryIdx: index("company_contacts_primary_idx").on(table.isPrimary),
  activeIdx: index("company_contacts_active_idx").on(table.isActive),
  roleIdx: index("company_contacts_role_idx").on(table.canManagePartners, table.canApproveEois),
}));

/**
 * Company documents and assets
 * Stores all documents related to company profiles
 */
export const companyDocuments = pgTable("company_documents", {
  id: uuidPrimaryKey(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  
  // Document classification
  documentType: companyDocumentTypeEnum("document_type").notNull(),
  category: text("category"), // Additional categorization
  title: text("title").notNull(),
  description: text("description"),
  
  // File information
  ...fileFields(),
  
  // Document status and validation
  status: text("status").default('pending').notNull(), // pending, approved, rejected
  isPublic: boolean("is_public").default(false).notNull(),
  isConfidential: boolean("is_confidential").default(false).notNull(),
  
  // Access control
  visibilityLevel: text("visibility_level").default('private').notNull(), // private, partners, public
  accessRestrictions: jsonb("access_restrictions"), // Array of access rules
  
  // Version control
  version: text("version").default('1.0').notNull(),
  parentDocumentId: uuid("parent_document_id"), // For document versions
  
  // Approval workflow
  requiresApproval: boolean("requires_approval").default(false).notNull(),
  approvedBy: text("approved_by"), // User ID
  approvedAt: timestamp("approved_at"),
  
  // Expiry and validity
  expiresAt: timestamp("expires_at"),
  
  // Metadata
  tags: jsonb("tags"), // Array of tags
  
  // Audit fields
  ...auditTimestamps(),
}, (table) => ({
  companyIdx: index("company_documents_company_idx").on(table.companyId),
  typeIdx: index("company_documents_type_idx").on(table.documentType),
  statusIdx: index("company_documents_status_idx").on(table.status),
  publicIdx: index("company_documents_public_idx").on(table.isPublic),
  confidentialIdx: index("company_documents_confidential_idx").on(table.isConfidential),
  expiryIdx: index("company_documents_expiry_idx").on(table.expiresAt),
}));

/**
 * Company locations and offices
 * Tracks multiple company locations for international companies
 */
export const companyLocations = pgTable("company_locations", {
  id: uuidPrimaryKey(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  
  // Location details
  locationName: text("location_name").notNull(), // e.g., "New York Office", "APAC HQ"
  locationType: text("location_type").notNull(), // headquarters, office, warehouse, etc.
  
  // Address information
  ...addressFields(),
  region: regionEnum("region").notNull(),
  timezone: text("timezone"),
  
  // Contact information for this location
  ...contactFields("location"),
  
  // Location metadata
  isHeadquarters: boolean("is_headquarters").default(false).notNull(),
  isActive: isActive(),
  employeeCount: integer("employee_count"),
  
  // Operating details
  operatingHours: jsonb("operating_hours"), // JSON with business hours
  supportedLanguages: jsonb("supported_languages"), // Array of language codes
  
  // Audit fields
  ...auditTimestamps(),
}, (table) => ({
  companyIdx: index("company_locations_company_idx").on(table.companyId),
  regionIdx: index("company_locations_region_idx").on(table.region),
  typeIdx: index("company_locations_type_idx").on(table.locationType),
  hqIdx: index("company_locations_hq_idx").on(table.isHeadquarters),
}));

/**
 * Company billing and subscription details
 * Manages billing information and subscription lifecycle
 */
export const companyBilling = pgTable("company_billing", {
  id: uuidPrimaryKey(),
  companyId: uuid("company_id").notNull().unique().references(() => companies.id, { onDelete: "cascade" }),
  
  // Billing information
  billingEmail: text("billing_email").notNull(),
  billingContactName: text("billing_contact_name"),
  billingPhone: text("billing_phone"),
  
  // Billing address
  ...addressFields("billing"),
  
  // Payment information (encrypted/tokenized)
  paymentMethodId: text("payment_method_id"), // Stripe/payment provider ID
  defaultPaymentMethod: text("default_payment_method"), // card, bank_transfer, etc.
  
  // Subscription metrics
  totalSpent: money("total_spent").default('0').notNull(),
  outstandingBalance: money("outstanding_balance").default('0').notNull(),
  creditBalance: money("credit_balance").default('0').notNull(),
  
  // Billing preferences
  invoiceDelivery: text("invoice_delivery").default('email').notNull(), // email, postal, both
  billingCurrency: currencyEnum("billing_currency").default('USD').notNull(),
  autoRenewal: boolean("auto_renewal").default(true).notNull(),
  
  // Tax information
  taxExempt: boolean("tax_exempt").default(false).notNull(),
  taxRate: text("tax_rate").default('0').notNull(), // Percentage as string
  taxId: text("tax_id"), // VAT/Tax number
  
  // Audit fields
  ...auditTimestamps(),
}, (table) => ({
  companyIdx: index("company_billing_company_idx").on(table.companyId),
  emailIdx: index("company_billing_email_idx").on(table.billingEmail),
  paymentMethodIdx: index("company_billing_payment_idx").on(table.paymentMethodId),
}));
