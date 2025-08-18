import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { userTypeEnum, registrationStatusEnum } from "./enums";

// User Profile - extends the auth user with registration tracking
export const userProfile = pgTable("user_profile", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  userType: userTypeEnum("user_type").notNull(),
  registrationStatus: registrationStatusEnum("registration_status")
    .default("incomplete")
    .notNull(),
  currentStage: integer("current_stage").default(1).notNull(),
  totalStages: integer("total_stages").default(4).notNull(),
  profileCompletedAt: timestamp("profile_completed_at"),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  rejectionReason: text("rejection_reason"),
  canAccessMarketplace: boolean("can_access_marketplace").default(false).notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Registration Stage Tracking
export const registrationStage = pgTable("registration_stage", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userProfileId: text("user_profile_id")
    .notNull()
    .references(() => userProfile.id, { onDelete: "cascade" }),
  stageNumber: integer("stage_number").notNull(),
  stageName: text("stage_name").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  stageData: text("stage_data"), // JSON string for storing stage-specific data
  validationErrors: text("validation_errors"), // JSON array of validation errors
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const userProfileSchema = {
  userProfile,
  registrationStage,
};
