import { pgTable, text, timestamp, boolean, uuid, integer, pgEnum, jsonb, index, unique } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { 
  verificationStatusEnum, 
  customerTypeEnum, 
  industryEnum,
  regionEnum,
  priorityLevelEnum 
} from "./common";
import { 
  uuidPrimaryKey, 
  auditTimestamps, 
  contactFields, 
  isActive, 
  isVerified,
  fileFields,
  metadataFields,
  rating 
} from "./utils";

// BD Partner specific enums
export const availabilityEnum = pgEnum('availability', ['part_time', 'full_time', 'flexible', 'project_based']);
export const influenceLevelEnum = pgEnum('influence_level', ['low', 'medium', 'high']);
export const bdDocumentTypeEnum = pgEnum('bd_document_type', ['cv', 'portfolio', 'profile', 'certification', 'reference']);
export const expertiseLevelEnum = pgEnum('expertise_level', ['beginner', 'intermediate', 'advanced', 'expert']);

/**
 * BD Partner main profile table
 * Central repository for all BD Partner information
 */
export const bdPartners = pgTable("bd_partners", {
  id: uuidPrimaryKey(),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  
  // Basic information
  fullName: text("full_name").notNull(),
  displayName: text("display_name"), // Optional public display name
  title: text("title"), // Professional title
  bio: text("bio"), // Short professional bio
  
  // Contact information
  ...contactFields(),
  
  // Location
  country: text("country").notNull(),
  state: text("state"),
  city: text("city").notNull(),
  timezone: text("timezone"),
  
  // Professional details
  professionalBackground: text("professional_background"),
  availability: availabilityEnum("availability").notNull(),
  availabilityHours: integer("availability_hours"), // Hours per week
  hourlyRate: text("hourly_rate"), // Optional hourly rate
  
  // Languages spoken
  languages: jsonb("languages"), // Array of language codes with proficiency levels
  
  // Verification and trust
  isVerified: isVerified(),
  verificationDate: timestamp("verification_date"),
  backgroundCheckStatus: verificationStatusEnum("background_check_status").default('pending').notNull(),
  trustScore: rating("trust_score"), // Overall trust rating
  
  // Performance metrics
  totalDeals: integer("total_deals").default(0).notNull(),
  successfulDeals: integer("successful_deals").default(0).notNull(),
  totalRevenue: text("total_revenue").default('0').notNull(), // Decimal as string
  averageRating: rating("average_rating"),
  responseTime: integer("response_time_hours"), // Average response time in hours
  
  // Profile visibility and settings
  isActive: isActive(),
  isPublicProfile: boolean("is_public_profile").default(true).notNull(),
  acceptingNewPartnerships: boolean("accepting_new_partnerships").default(true).notNull(),
  
  // Extensibility
  ...metadataFields(),
  
  // Audit fields
  ...auditTimestamps(),
}, (table) => ({
  userIdIdx: index("bd_partners_user_id_idx").on(table.userId),
  countryIdx: index("bd_partners_country_idx").on(table.country),
  cityIdx: index("bd_partners_city_idx").on(table.city),
  availabilityIdx: index("bd_partners_availability_idx").on(table.availability),
  verificationIdx: index("bd_partners_verification_idx").on(table.isVerified, table.backgroundCheckStatus),
  activeIdx: index("bd_partners_active_idx").on(table.isActive, table.acceptingNewPartnerships),
}));

/**
 * BD Partner expertise and specializations
 * Tracks what industries and areas BD Partners specialize in
 */
export const bdPartnerExpertise = pgTable("bd_partner_expertise", {
  id: uuidPrimaryKey(),
  bdPartnerId: uuid("bd_partner_id").notNull().references(() => bdPartners.id, { onDelete: "cascade" }),
  
  // Industry expertise
  industry: industryEnum("industry").notNull(),
  subdomain: text("subdomain"), // Specific subdomain within industry
  expertiseArea: text("expertise_area").notNull(),
  expertiseLevel: expertiseLevelEnum("expertise_level").default('intermediate').notNull(),
  
  // Experience details
  experienceYears: integer("experience_years").notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  
  // Validation and proof
  certifications: jsonb("certifications"), // Array of certification objects
  portfolioItems: jsonb("portfolio_items"), // Array of portfolio references
  
  // Description and details
  description: text("description"),
  keyAchievements: text("key_achievements"),
  
  // Audit fields
  ...auditTimestamps(),
}, (table) => ({
  bdPartnerIdx: index("bd_expertise_partner_idx").on(table.bdPartnerId),
  industryIdx: index("bd_expertise_industry_idx").on(table.industry),
  primaryIdx: index("bd_expertise_primary_idx").on(table.isPrimary),
  experienceIdx: index("bd_expertise_experience_idx").on(table.experienceYears),
  // Unique constraint: one primary expertise per partner per industry
  uniquePrimary: unique("bd_expertise_unique_primary").on(table.bdPartnerId, table.industry, table.isPrimary),
}));

/**
 * BD Partner market access and customer reach
 * Defines what markets and customer segments BD Partners can access
 */
export const bdPartnerMarketAccess = pgTable("bd_partner_market_access", {
  id: uuidPrimaryKey(),
  bdPartnerId: uuid("bd_partner_id").notNull().references(() => bdPartners.id, { onDelete: "cascade" }),
  
  // Market definition
  customerType: customerTypeEnum("customer_type").notNull(),
  region: regionEnum("region").notNull(),
  specificMarkets: jsonb("specific_markets"), // Array of specific market details
  
  // Influence and reach
  influenceLevel: influenceLevelEnum("influence_level").default('medium').notNull(),
  networkSize: integer("network_size"), // Estimated network contacts
  reachDescription: text("reach_description"),
  
  // Success metrics in this market
  dealsInMarket: integer("deals_in_market").default(0).notNull(),
  successRate: text("success_rate").default('0').notNull(), // Percentage as string
  averageDealSize: text("average_deal_size").default('0').notNull(),
  
  // Market entry barriers and challenges
  marketChallenges: text("market_challenges"),
  competitiveAdvantages: text("competitive_advantages"),
  
  // Audit fields
  ...auditTimestamps(),
}, (table) => ({
  bdPartnerIdx: index("bd_market_partner_idx").on(table.bdPartnerId),
  customerTypeIdx: index("bd_market_customer_type_idx").on(table.customerType),
  regionIdx: index("bd_market_region_idx").on(table.region),
  influenceIdx: index("bd_market_influence_idx").on(table.influenceLevel),
}));

/**
 * BD Partner preferred product/service categories
 * What types of products/services they prefer to work with
 */
export const bdPartnerCategories = pgTable("bd_partner_categories", {
  id: uuidPrimaryKey(),
  bdPartnerId: uuid("bd_partner_id").notNull().references(() => bdPartners.id, { onDelete: "cascade" }),
  
  // Category details
  category: text("category").notNull(), // More flexible than enum
  subcategory: text("subcategory"),
  interest: priorityLevelEnum("interest").default('medium').notNull(),
  
  // Experience in this category
  experienceLevel: expertiseLevelEnum("experience_level").default('intermediate').notNull(),
  pastDeals: integer("past_deals").default(0).notNull(),
  
  // Preferences
  preferredDealSize: text("preferred_deal_size"),
  minimumCommission: text("minimum_commission"),
  notes: text("notes"),
  
  // Audit fields
  ...auditTimestamps(),
}, (table) => ({
  bdPartnerIdx: index("bd_categories_partner_idx").on(table.bdPartnerId),
  categoryIdx: index("bd_categories_category_idx").on(table.category),
  interestIdx: index("bd_categories_interest_idx").on(table.interest),
}));

/**
 * BD Partner documents and attachments
 * Stores all documents related to BD Partner profiles
 */
export const bdPartnerDocuments = pgTable("bd_partner_documents", {
  id: uuidPrimaryKey(),
  bdPartnerId: uuid("bd_partner_id").notNull().references(() => bdPartners.id, { onDelete: "cascade" }),
  
  // Document classification
  documentType: bdDocumentTypeEnum("document_type").notNull(),
  category: text("category"), // Additional categorization
  title: text("title").notNull(),
  description: text("description"),
  
  // File information
  ...fileFields(),
  
  // Document status and validation
  status: text("status").default('pending').notNull(), // pending, approved, rejected
  isPublic: boolean("is_public").default(false).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  
  // Access control
  visibilityLevel: text("visibility_level").default('private').notNull(), // private, partners, public
  
  // Metadata
  tags: jsonb("tags"), // Array of tags for searchability
  ...auditTimestamps(),
}, (table) => ({
  bdPartnerIdx: index("bd_documents_partner_idx").on(table.bdPartnerId),
  typeIdx: index("bd_documents_type_idx").on(table.documentType),
  statusIdx: index("bd_documents_status_idx").on(table.status),
  publicIdx: index("bd_documents_public_idx").on(table.isPublic),
}));

/**
 * BD Partner projects, case studies, and testimonials
 * Showcase of past work and client feedback
 */
export const bdPartnerProjects = pgTable("bd_partner_projects", {
  id: uuidPrimaryKey(),
  bdPartnerId: uuid("bd_partner_id").notNull().references(() => bdPartners.id, { onDelete: "cascade" }),
  
  // Project details
  projectTitle: text("project_title").notNull(),
  clientName: text("client_name"), // May be anonymized
  clientIndustry: industryEnum("client_industry"),
  
  // Project scope and description
  description: text("description").notNull(),
  challenges: text("challenges"),
  solution: text("solution"),
  outcome: text("outcome"),
  
  // Metrics and results
  projectValue: text("project_value"), // Deal size
  duration: text("duration"), // Project duration
  teamSize: integer("team_size"),
  clientSatisfaction: rating("client_satisfaction"),
  
  // Project timeline
  projectStartDate: timestamp("project_start_date"),
  projectEndDate: timestamp("project_end_date"),
  
  // Testimonial information
  isTestimonial: boolean("is_testimonial").default(false).notNull(),
  testimonialText: text("testimonial_text"),
  clientTitle: text("client_title"),
  clientContact: text("client_contact"), // Encrypted/hashed for privacy
  
  // Visibility and sharing
  isPublic: boolean("is_public").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  
  // Supporting materials
  attachments: jsonb("attachments"), // Array of file references
  tags: jsonb("tags"), // Array of tags
  
  // Audit fields
  ...auditTimestamps(),
}, (table) => ({
  bdPartnerIdx: index("bd_projects_partner_idx").on(table.bdPartnerId),
  industryIdx: index("bd_projects_industry_idx").on(table.clientIndustry),
  testimonialIdx: index("bd_projects_testimonial_idx").on(table.isTestimonial),
  publicIdx: index("bd_projects_public_idx").on(table.isPublic),
  featuredIdx: index("bd_projects_featured_idx").on(table.isFeatured),
}));
