import { pgTable, text, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const userProfiles = pgTable("user_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  userType: varchar("user_type", { length: 20 }).notNull(), // 'company', 'bd_partner'
  profileType: varchar("profile_type", { length: 20 }), // 'individual', 'company' (for BD partners)
  registrationStage: varchar("registration_stage", { length: 50 }).default("initial"), // 'initial', 'complete', 'verified'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

