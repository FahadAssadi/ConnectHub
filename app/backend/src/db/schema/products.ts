import { pgTable, text, timestamp, boolean, uuid, integer, pgEnum, jsonb, index } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { industryEnum, regionEnum } from "./common";

// Product-specific enums
export const productTypeEnum = pgEnum('product_type', ['product', 'service']);
export const productStatusEnum = pgEnum('product_status', ['draft', 'active', 'inactive', 'archived']);
export const materialTypeEnum = pgEnum('material_type', ['brochure', 'datasheet', 'demo_video', 'pricing', 'training', 'collateral']);
export const accessLevelEnum = pgEnum('access_level', ['public', 'bdp_only', 'private']);
export const engagementTypeEnum = pgEnum('engagement_type', ['lead_generation', 'reseller', 'referral', 'consultant']);

// Products and services
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: productTypeEnum("type").notNull(),
  shortDescription: text("short_description").notNull(),
  detailedDescription: text("detailed_description"),
  industryCategories: jsonb("industry_categories").notNull(), // Array of industry enums
  targetCustomers: jsonb("target_customers"), // Structured customer segment data
  primaryRegions: jsonb("primary_regions"), // Array of region enums
  isVisibleToBdps: boolean("is_visible_to_bdps").default(true),
  status: productStatusEnum("status").default('draft'),
  internalNotes: text("internal_notes"),
  metadata: jsonb("metadata"), // Extensible product metadata
  tags: jsonb("tags"), // Product tags for better searchability
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  companyIdx: index("products_company_idx").on(table.companyId),
  statusIdx: index("products_status_idx").on(table.status),
  typeIdx: index("products_type_idx").on(table.type),
  visibilityIdx: index("products_visibility_idx").on(table.isVisibleToBdps),
}));

// Product sales materials
export const productMaterials = pgTable("product_materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  materialType: materialTypeEnum("material_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  filePath: text("file_path"),
  fileSize: integer("file_size"),
  fileType: text("file_type"),
  externalUrl: text("external_url"),
  accessLevel: accessLevelEnum("access_level").default('bdp_only'),
  downloadCount: integer("download_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  productIdx: index("product_materials_product_idx").on(table.productId),
  materialTypeIdx: index("product_materials_type_idx").on(table.materialType),
  accessLevelIdx: index("product_materials_access_idx").on(table.accessLevel),
}));

// BD Partner preferences for products
export const productBdpPreferences = pgTable("product_bdp_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  preferredExpertise: jsonb("preferred_expertise"), // Array of expertise areas
  engagementType: engagementTypeEnum("engagement_type").notNull(),
  commissionStructure: jsonb("commission_structure"), // Structured commission details
  requiresTraining: boolean("requires_training").default(false),
  providesCollateral: boolean("provides_collateral").default(true),
  minExperienceYears: integer("min_experience_years").default(0),
  targetRegions: jsonb("target_regions"), // Preferred BD partner regions
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  productIdx: index("product_bdp_preferences_product_idx").on(table.productId),
  engagementTypeIdx: index("product_bdp_preferences_engagement_idx").on(table.engagementType),
}));
