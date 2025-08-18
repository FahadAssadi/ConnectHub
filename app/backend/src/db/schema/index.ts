// Export all schemas and types
export * from "./auth-schema";
export * from "./enums";
export * from "./user-profile";
export * from "./company";
export * from "./bd-partner";
export * from "./product";
export * from "./documents";

// Import all schemas for the main schema object
import { authSchema } from "./auth-schema";
import { userProfileSchema } from "./user-profile";
import { companySchema } from "./company";
import { bdPartnerSchema } from "./bd-partner";
import { productSchema } from "./product";
import { documentSchema } from "./documents";

// Combined schema for Drizzle
export const schema = {
  ...authSchema,
  ...userProfileSchema,
  ...companySchema,
  ...bdPartnerSchema,
  ...productSchema,
  ...documentSchema,
};

// Export types for better TypeScript support
export type UserType = "company" | "bd_partner_individual" | "bd_partner_company";
export type RegistrationStatus = "incomplete" | "pending_review" | "approved" | "rejected";
export type CompanyType = "sole_trader" | "partnership" | "company_private" | "company_public" | "trust" | "joint_venture" | "cooperative" | "association" | "franchise";
export type EmployeeSize = "1-10" | "11-50" | "51-200" | "201-500" | "500+";
export type ExperienceYears = "0-3" | "4-7" | "8-14" | "15-20" | "21+";
export type ProductType = "product" | "service";
export type EngagementModel = "referral_partner" | "lead_generation_partner" | "sales_agent_reseller" | "value_added_reseller" | "affiliate_partner" | "channel_partner" | "implementation_partner" | "strategic_alliance" | "distributor" | "licensing_partner";
export type EnglishFluency = "basic" | "intermediate" | "fluent";
export type DocumentType = "company_profile" | "business_license" | "resume" | "id_proof" | "product_brochure" | "demo_video" | "business_usecases" | "pitch_deck" | "email_templates" | "cold_call_scripts" | "objection_handling_guide" | "competitor_comparison" | "pricing_sheet";
