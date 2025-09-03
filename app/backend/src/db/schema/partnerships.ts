import { pgTable, text, timestamp, uuid, decimal, pgEnum, jsonb, integer, index, unique } from "drizzle-orm/pg-core";
import { bdPartners } from "./bd-partners";
import { products } from "./products";
import { companies } from "./companies";

// Partnership-specific enums
export const applicationStatusEnum = pgEnum('application_status', ['applied', 'under_review', 'approved', 'rejected', 'withdrawn']);
export const partnershipStatusEnum = pgEnum('partnership_status', ['active', 'paused', 'terminated']);
export const performanceMetricEnum = pgEnum('performance_metric', ['leads_generated', 'sales_closed', 'revenue_generated', 'customer_satisfaction']);

// BD Partner applications for products
export const bdpProductApplications = pgTable("bdp_product_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  bdPartnerId: uuid("bd_partner_id").notNull().references(() => bdPartners.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  applicationStatus: applicationStatusEnum("application_status").default('applied'),
  applicationMessage: text("application_message"),
  companyResponse: text("company_response"),
  reviewedBy: uuid("reviewed_by").references(() => companies.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewed_at"),
  rejectionReason: text("rejection_reason"),
  applicationData: jsonb("application_data"), // Additional application details
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  bdPartnerIdx: index("bdp_applications_partner_idx").on(table.bdPartnerId),
  productIdx: index("bdp_applications_product_idx").on(table.productId),
  statusIdx: index("bdp_applications_status_idx").on(table.applicationStatus),
  uniqueApplication: unique("unique_partner_product_application").on(table.bdPartnerId, table.productId),
}));

// Active BD Partner-Product relationships
export const bdpProductPartnerships = pgTable("bdp_product_partnerships", {
  id: uuid("id").primaryKey().defaultRandom(),
  bdPartnerId: uuid("bd_partner_id").notNull().references(() => bdPartners.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  partnershipStatus: partnershipStatusEnum("partnership_status").default('active'),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(), // percentage
  contractTerms: jsonb("contract_terms"), // Structured contract details
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  performanceRating: decimal("performance_rating", { precision: 3, scale: 2 }), // 0.00 to 5.00
  leadQuota: integer("lead_quota"), // Monthly/quarterly lead expectations
  salesTarget: decimal("sales_target", { precision: 12, scale: 2 }), // Revenue targets
  lastReviewDate: timestamp("last_review_date"),
  nextReviewDate: timestamp("next_review_date"),
  metadata: jsonb("metadata"), // Extensible partnership data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  bdPartnerIdx: index("bdp_partnerships_partner_idx").on(table.bdPartnerId),
  productIdx: index("bdp_partnerships_product_idx").on(table.productId),
  statusIdx: index("bdp_partnerships_status_idx").on(table.partnershipStatus),
  uniquePartnership: unique("unique_partner_product_partnership").on(table.bdPartnerId, table.productId),
}));

// Partnership performance tracking
export const partnershipPerformance = pgTable("partnership_performance", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnershipId: uuid("partnership_id").notNull().references(() => bdpProductPartnerships.id, { onDelete: "cascade" }),
  reportingPeriod: text("reporting_period").notNull(), // e.g., "2024-Q1", "2024-01"
  metric: performanceMetricEnum("metric").notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  target: decimal("target", { precision: 12, scale: 2 }),
  notes: text("notes"),
  reportedAt: timestamp("reported_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  partnershipIdx: index("partnership_performance_partnership_idx").on(table.partnershipId),
  periodIdx: index("partnership_performance_period_idx").on(table.reportingPeriod),
  metricIdx: index("partnership_performance_metric_idx").on(table.metric),
}));
