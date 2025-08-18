import { pgEnum } from "drizzle-orm/pg-core";

// User Types
export const userTypeEnum = pgEnum("user_type", [
  "company",
  "bd_partner_individual", 
  "bd_partner_company"
]);

// Registration Status
export const registrationStatusEnum = pgEnum("registration_status", [
  "incomplete",
  "pending_review", 
  "approved",
  "rejected"
]);

// Company Types
export const companyTypeEnum = pgEnum("company_type", [
  "sole_trader",
  "partnership", 
  "company_private",
  "company_public",
  "trust",
  "joint_venture",
  "cooperative",
  "association",
  "franchise"
]);

// Employee Size
export const employeeSizeEnum = pgEnum("employee_size", [
  "1-10",
  "11-50", 
  "51-200",
  "201-500",
  "500+"
]);

// Years of Experience
export const experienceYearsEnum = pgEnum("experience_years", [
  "0-3",
  "4-7",
  "8-14", 
  "15-20",
  "21+"
]);

// Product Types
export const productTypeEnum = pgEnum("product_type", [
  "product",
  "service"
]);

// Engagement Models
export const engagementModelEnum = pgEnum("engagement_model", [
  "referral_partner",
  "lead_generation_partner",
  "sales_agent_reseller",
  "value_added_reseller", 
  "affiliate_partner",
  "channel_partner",
  "implementation_partner",
  "strategic_alliance",
  "distributor",
  "licensing_partner"
]);

// English Fluency
export const englishFluencyEnum = pgEnum("english_fluency", [
  "basic",
  "intermediate", 
  "fluent"
]);

// Document Types
export const documentTypeEnum = pgEnum("document_type", [
  "company_profile",
  "business_license",
  "resume",
  "id_proof",
  "product_brochure",
  "demo_video",
  "business_usecases",
  "pitch_deck",
  "email_templates",
  "cold_call_scripts",
  "objection_handling_guide",
  "competitor_comparison",
  "pricing_sheet"
]);
