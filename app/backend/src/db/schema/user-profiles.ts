import { pgTable, text, timestamp, boolean, uuid, jsonb, index } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { userTypeEnum, userStatusEnum } from "./common";
import { uuidPrimaryKey, auditTimestamps, isActive, metadataFields } from "./utils";

/**
 * Extended user profiles that link Better Auth users to business entities
 * This table serves as the bridge between authentication and business logic
 */
export const userProfiles = pgTable("user_profiles", {
  id: uuidPrimaryKey(),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  userType: userTypeEnum("user_type").notNull(),
  status: userStatusEnum("status").default('pending').notNull(),
  
  // Profile completion tracking
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  profileCompleteness: text("profile_completeness").default('0').notNull(), // Percentage as string
  
  // User preferences
  preferences: jsonb("preferences"), // Theme, language, notifications, etc.
  settings: jsonb("settings"), // App-specific settings
  
  // Feature flags and permissions
  features: jsonb("features"), // Enabled features for this user
  permissions: jsonb("permissions"), // Granular permissions
  
  // Activity tracking
  lastLoginAt: timestamp("last_login_at"),
  lastActiveAt: timestamp("last_active_at"),
  loginCount: text("login_count").default('0').notNull(),
  
  // Profile visibility and privacy
  isPublicProfile: boolean("is_public_profile").default(false).notNull(),
  profileVisibility: text("profile_visibility").default('private').notNull(), // private, connections, public
  
  // Account status and verification
  isActive: isActive(),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  isPhoneVerified: boolean("is_phone_verified").default(false).notNull(),
  
  // Extensibility
  ...metadataFields(),
  
  // Audit fields
  ...auditTimestamps(),
}, (table) => ({
  // Indexes for performance
  userIdIdx: index("user_profiles_user_id_idx").on(table.userId),
  userTypeIdx: index("user_profiles_user_type_idx").on(table.userType),
  statusIdx: index("user_profiles_status_idx").on(table.status),
  lastActiveIdx: index("user_profiles_last_active_idx").on(table.lastActiveAt),
}));

/**
 * User activity log for tracking user actions
 * Useful for analytics, audit trails, and user behavior analysis
 */
export const userActivityLog = pgTable("user_activity_log", {
  id: uuidPrimaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  
  // Activity details
  action: text("action").notNull(), // login, logout, profile_update, etc.
  entityType: text("entity_type"), // Optional: what type of entity was affected
  entityId: text("entity_id"), // Optional: which specific entity was affected
  
  // Context information
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  location: jsonb("location"), // Geo-location data if available
  
  // Additional context
  metadata: jsonb("metadata"), // Any additional context data
  
  // Timestamp
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Indexes for querying activity
  userIdIdx: index("user_activity_user_id_idx").on(table.userId),
  actionIdx: index("user_activity_action_idx").on(table.action),
  createdAtIdx: index("user_activity_created_at_idx").on(table.createdAt),
  entityIdx: index("user_activity_entity_idx").on(table.entityType, table.entityId),
}));

/**
 * User notification preferences
 * Granular control over what notifications users receive and how
 */
export const userNotificationPreferences = pgTable("user_notification_preferences", {
  id: uuidPrimaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  
  // Notification categories
  emailNotifications: boolean("email_notifications").default(true).notNull(),
  smsNotifications: boolean("sms_notifications").default(false).notNull(),
  pushNotifications: boolean("push_notifications").default(true).notNull(),
  inAppNotifications: boolean("in_app_notifications").default(true).notNull(),
  
  // Specific notification types
  marketingEmails: boolean("marketing_emails").default(false).notNull(),
  securityAlerts: boolean("security_alerts").default(true).notNull(),
  partnershipUpdates: boolean("partnership_updates").default(true).notNull(),
  eoiNotifications: boolean("eoi_notifications").default(true).notNull(),
  systemAnnouncements: boolean("system_announcements").default(true).notNull(),
  
  // Frequency preferences
  digestFrequency: text("digest_frequency").default('daily').notNull(), // immediate, daily, weekly
  quietHoursStart: text("quiet_hours_start"), // HH:MM format
  quietHoursEnd: text("quiet_hours_end"), // HH:MM format
  timezone: text("timezone").default('UTC').notNull(),
  
  // Audit fields
  ...auditTimestamps(),
}, (table) => ({
  userIdIdx: index("notification_prefs_user_id_idx").on(table.userId),
}));
