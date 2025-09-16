import { pgTable, text, timestamp, boolean, integer, varchar, decimal } from "drizzle-orm/pg-core";
import { companies } from "./company-schema";
import { bdPartners } from "./bd-partner-schema";
import { products } from "./product-schema";
import { user } from "./auth-schema";
import { engagementModels, incentiveMethods } from "./LOV-schema";

export const bdPartnerProductInterests = pgTable("bd_partner_product_interests", {
  id: text("id").primaryKey(),
  bdPartnerId: text("bd_partner_id")
    .notNull()
    .references(() => bdPartners.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  
  interestLevel: varchar("interest_level", { length: 20 }).default("interested"), // 'interested', 'highly_interested', 'applied'
  applicationStatus: varchar("application_status", { length: 50 }), // 'pending', 'approved', 'rejected', 'under_review'
  notes: text("notes"),
  
  appliedAt: timestamp("applied_at"),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: text("reviewed_by").references(() => user.id),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

export const partnerships = pgTable("partnerships", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  bdPartnerId: text("bd_partner_id")
    .notNull()
    .references(() => bdPartners.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .references(() => products.id),
  
  partnershipType: varchar("partnership_type", { length: 50 }).notNull(), // 'general', 'product_specific'
  status: varchar("status", { length: 50 }).default("active"), // 'active', 'suspended', 'terminated'
  engagementModelId: integer("engagement_model_id")
    .notNull()
    .references(() => engagementModels.id),
  incentiveMethodId: integer("incentive_method_id")
    .notNull()
    .references(() => incentiveMethods.id),
  
  // Agreement Terms
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }),
  fixedFeeAmount: decimal("fixed_fee_amount", { precision: 10, scale: 2 }),
  minimumCommitment: integer("minimum_commitment"), // e.g., minimum leads per month
  
  // Dates
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  
  // Agreement
  agreementSigned: boolean("agreement_signed").default(false),
  agreementSignedDate: timestamp("agreement_signed_date"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});