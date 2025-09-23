import { pgTable, text, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { nanoid } from "nanoid";

export const userProfiles = pgTable("user_profiles", {
  id: text("id")
    .primaryKey()
    .default(nanoid()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  userType: varchar("user_type", { length: 20 }).notNull(), // 'company', 'bd_partner'
  registrationStage: varchar("registration_stage", { length: 50 }).default("initial"), // 'initial', 'complete', 'verified'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
});

