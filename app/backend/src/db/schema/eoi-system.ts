import { pgTable, text, timestamp, boolean, uuid, integer, decimal, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { bdPartners } from "./bd-partners";
import { companies } from "./companies";
import { products } from "./products";
import { priorityLevelEnum, dealSizeRangeEnum } from "./common";

// EOI specific enums
export const eoiTypeEnum = pgEnum('eoi_type', ['general_partnership', 'specific_product', 'industry_expertise', 'regional_expansion']);
export const eoiStatusEnum = pgEnum('eoi_status', ['draft', 'sent', 'under_review', 'accepted', 'rejected', 'withdrawn', 'expired']);
export const initiatorTypeEnum = pgEnum('initiator_type', ['bd_partner', 'company']);

// Core EOI table - bidirectional expressions of interest
export const expressionsOfInterest = pgTable("expressions_of_interest", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Relationship fields
  bdPartnerId: uuid("bd_partner_id").references(() => bdPartners.id, { onDelete: "cascade" }),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }), // Optional for specific product EOIs
  
  // EOI metadata
  initiatorType: initiatorTypeEnum("initiator_type").notNull(),
  eoiType: eoiTypeEnum("eoi_type").notNull(),
  status: eoiStatusEnum("status").default('draft').notNull(),
  priority: priorityLevelEnum("priority").default('medium'),
  
  // Core content
  title: text("title").notNull(),
  description: text("description").notNull(),
  objectives: text("objectives"), // What they hope to achieve
  
  // Commercial terms
  proposedCommissionRate: decimal("proposed_commission_rate", { precision: 5, scale: 2 }),
  expectedDealSize: dealSizeRangeEnum("expected_deal_size"),
  timeline: text("timeline"), // Expected timeline for partnership
  exclusivity: boolean("exclusivity").default(false),
  
  // Geographic and industry focus
  targetRegions: jsonb("target_regions"), // Array of regions
  targetIndustries: jsonb("target_industries"), // Array of industries
  targetCustomerTypes: jsonb("target_customer_types"), // Array of customer types
  
  // Attachments and resources
  attachments: jsonb("attachments"), // Array of file paths/URLs
  additionalRequirements: text("additional_requirements"),
  
  // Response and tracking
  responseMessage: text("response_message"), // Response from the recipient
  responseDate: timestamp("response_date"),
  reviewedBy: text("reviewed_by"), // User ID who reviewed
  
  // Expiry and timing
  expiresAt: timestamp("expires_at"),
  validFrom: timestamp("valid_from").defaultNow(),
  validUntil: timestamp("valid_until"),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Company requirements for BD Partners - smart matching criteria
export const companyBdpRequirements = pgTable("company_bdp_requirements", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  
  // Requirement details
  title: text("title").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true),
  
  // Matching criteria
  requiredIndustries: jsonb("required_industries"), // Array of required industries
  preferredIndustries: jsonb("preferred_industries"), // Array of preferred industries
  requiredRegions: jsonb("required_regions"), // Array of required regions
  preferredRegions: jsonb("preferred_regions"), // Array of preferred regions
  requiredCustomerTypes: jsonb("required_customer_types"), // Array of customer types
  
  // Experience and qualifications
  minExperienceYears: integer("min_experience_years").default(0),
  requiredAvailability: text("required_availability"), // part_time, full_time, etc.
  requiredCertifications: jsonb("required_certifications"), // Array of certifications
  
  // Commercial terms
  commissionRateMin: decimal("commission_rate_min", { precision: 5, scale: 2 }),
  commissionRateMax: decimal("commission_rate_max", { precision: 5, scale: 2 }),
  expectedDealSizeMin: dealSizeRangeEnum("expected_deal_size_min"),
  expectedDealSizeMax: dealSizeRangeEnum("expected_deal_size_max"),
  
  // Performance criteria
  requiredPerformanceRating: decimal("required_performance_rating", { precision: 3, scale: 2 }),
  maxActivePartnerships: integer("max_active_partnerships"), // Limit concurrent partnerships
  
  // Auto-matching settings
  enableAutoMatching: boolean("enable_auto_matching").default(true),
  autoMatchingScore: integer("auto_matching_score").default(75), // Minimum score for auto-match
  
  // Template EOI for bulk outreach
  templateEoiTitle: text("template_eoi_title"),
  templateEoiDescription: text("template_eoi_description"),
  templateCommissionRate: decimal("template_commission_rate", { precision: 5, scale: 2 }),
  
  // Metadata
  priority: priorityLevelEnum("priority").default('medium'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// BD Partner opportunity preferences - what they're looking for
export const bdpOpportunityPreferences = pgTable("bdp_opportunity_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  bdPartnerId: uuid("bd_partner_id").notNull().references(() => bdPartners.id, { onDelete: "cascade" }),
  
  // Preference details
  title: text("title").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  
  // Industry and sector preferences
  preferredIndustries: jsonb("preferred_industries"), // Array of preferred industries
  excludedIndustries: jsonb("excluded_industries"), // Array of industries to avoid
  preferredCompanyTypes: jsonb("preferred_company_types"), // startup, sme, enterprise, etc.
  
  // Geographic preferences
  preferredRegions: jsonb("preferred_regions"), // Array of preferred regions
  canWorkRemotely: boolean("can_work_remotely").default(true),
  willingToTravel: boolean("willing_to_travel").default(false),
  travelRadius: integer("travel_radius"), // In kilometers
  
  // Deal and commission preferences
  minCommissionRate: decimal("min_commission_rate", { precision: 5, scale: 2 }),
  preferredDealSizeMin: dealSizeRangeEnum("preferred_deal_size_min"),
  preferredDealSizeMax: dealSizeRangeEnum("preferred_deal_size_max"),
  maxConcurrentDeals: integer("max_concurrent_deals").default(5),
  
  // Engagement preferences
  preferredEngagementTypes: jsonb("preferred_engagement_types"), // lead_generation, reseller, etc.
  requiresTraining: boolean("requires_training").default(false),
  requiresCollateral: boolean("requires_collateral").default(true),
  exclusivityRequired: boolean("exclusivity_required").default(false),
  
  // Timeline and availability
  availabilityHours: integer("availability_hours"), // Hours per week
  preferredProjectDuration: text("preferred_project_duration"), // 1-3 months, 3-6 months, etc.
  canStartImmediately: boolean("can_start_immediately").default(true),
  noticeRequired: integer("notice_required"), // Days notice required
  
  // Auto-discovery settings
  enableAutoDiscovery: boolean("enable_auto_discovery").default(true),
  notificationFrequency: text("notification_frequency").default('daily'), // daily, weekly, monthly
  minMatchingScore: integer("min_matching_score").default(70), // Minimum score for notifications
  
  // Metadata
  priority: priorityLevelEnum("priority").default('medium'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// EOI matching scores - for tracking match quality
export const eoiMatchingScores = pgTable("eoi_matching_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Relationships
  eoiId: uuid("eoi_id").references(() => expressionsOfInterest.id, { onDelete: "cascade" }),
  bdPartnerId: uuid("bd_partner_id").references(() => bdPartners.id, { onDelete: "cascade" }),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  requirementId: uuid("requirement_id").references(() => companyBdpRequirements.id, { onDelete: "cascade" }),
  preferenceId: uuid("preference_id").references(() => bdpOpportunityPreferences.id, { onDelete: "cascade" }),
  
  // Scoring details
  overallScore: integer("overall_score").notNull(), // 0-100
  industryScore: integer("industry_score").default(0),
  regionScore: integer("region_score").default(0),
  experienceScore: integer("experience_score").default(0),
  availabilityScore: integer("availability_score").default(0),
  commissionScore: integer("commission_score").default(0),
  
  // Match details
  matchType: text("match_type").notNull(), // auto, manual, partial
  isRecommended: boolean("is_recommended").default(false),
  isViewed: boolean("is_viewed").default(false),
  isContacted: boolean("is_contacted").default(false),
  
  // Metadata
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"), // When this score expires and needs recalculation
});

// EOI communications - track all messages and interactions
export const eoiCommunications = pgTable("eoi_communications", {
  id: uuid("id").primaryKey().defaultRandom(),
  eoiId: uuid("eoi_id").notNull().references(() => expressionsOfInterest.id, { onDelete: "cascade" }),
  
  // Communication details
  fromUserId: text("from_user_id").notNull(), // Better Auth user ID
  toUserId: text("to_user_id").notNull(), // Better Auth user ID
  messageType: text("message_type").notNull(), // initial_eoi, response, follow_up, clarification, etc.
  
  // Content
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  attachments: jsonb("attachments"), // Array of file paths/URLs
  
  // Status
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  responseRequired: boolean("response_required").default(false),
  priority: priorityLevelEnum("priority").default('medium'),
  
  // Metadata
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
