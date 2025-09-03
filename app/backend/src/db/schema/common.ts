import { pgEnum } from "drizzle-orm/pg-core";

// === SHARED ENUMS ACROSS MULTIPLE SCHEMAS ===

// User and profile related enums
export const userTypeEnum = pgEnum('user_type', ['bd_partner', 'company', 'admin']);
export const userStatusEnum = pgEnum('user_status', ['pending', 'active', 'suspended', 'inactive']);
export const priorityLevelEnum = pgEnum('priority_level', ['low', 'medium', 'high', 'urgent']);

// Geographic and demographic enums
export const customerTypeEnum = pgEnum('customer_type', ['sme', 'enterprise', 'government', 'retailers', 'startups', 'consumers']);
export const regionEnum = pgEnum('region', [
  'north_america', 'south_america', 'europe', 'asia_pacific', 'middle_east', 'africa', 'oceania'
]);

// Industry classification (expanded for better coverage)
export const industryEnum = pgEnum('industry', [
  'technology', 'healthcare', 'finance', 'retail', 'manufacturing', 'education',
  'real_estate', 'automotive', 'energy', 'telecommunications', 'media',
  'hospitality', 'agriculture', 'construction', 'logistics', 'professional_services',
  'government', 'non_profit', 'other'
]);

// Business type and size
export const businessTypeEnum = pgEnum('business_type', [
  'startup', 'sme', 'enterprise', 'corporation', 'non_profit', 'government'
]);

export const companySizeEnum = pgEnum('company_size', [
  'micro', 'small', 'medium', 'large', 'enterprise'
]);

// Deal and financial enums
export const dealSizeRangeEnum = pgEnum('deal_size_range', [
  'under_10k', '10k_50k', '50k_100k', '100k_500k', '500k_1m', 'over_1m'
]);

export const currencyEnum = pgEnum('currency', [
  'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CNY', 'INR'
]);

// Status enums used across multiple entities
export const genericStatusEnum = pgEnum('generic_status', [
  'draft', 'active', 'inactive', 'archived', 'deleted'
]);

export const verificationStatusEnum = pgEnum('verification_status', [
  'pending', 'in_review', 'approved', 'rejected', 'expired'
]);

// Document and file related enums
export const documentStatusEnum = pgEnum('document_status', [
  'pending', 'processing', 'approved', 'rejected', 'expired'
]);

export const fileTypeEnum = pgEnum('file_type', [
  'image', 'document', 'video', 'audio', 'spreadsheet', 'presentation', 'other'
]);

// Communication and notification enums
export const notificationFrequencyEnum = pgEnum('notification_frequency', [
  'immediate', 'daily', 'weekly', 'monthly', 'never'
]);

export const communicationChannelEnum = pgEnum('communication_channel', [
  'email', 'sms', 'in_app', 'phone', 'video_call'
]);

// === UTILITY CONSTANTS ===

// Common field lengths
export const FIELD_LENGTHS = {
  SHORT_TEXT: 255,
  MEDIUM_TEXT: 500,
  LONG_TEXT: 2000,
  URL: 500,
  EMAIL: 320,
  PHONE: 50,
  NAME: 255,
  SLUG: 100,
  CODE: 50
} as const;

// Default values
export const DEFAULT_VALUES = {
  COMMISSION_RATE: '10.00',
  MATCH_SCORE_THRESHOLD: 70,
  TOKEN_EXPIRY_HOURS: 24,
  SESSION_EXPIRY_DAYS: 30,
  DOCUMENT_SIZE_LIMIT_MB: 10
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9-]+$/
} as const;
