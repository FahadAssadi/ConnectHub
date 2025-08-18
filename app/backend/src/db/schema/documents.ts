import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { userProfile } from "./user-profile";
import { product } from "./product";
import { documentTypeEnum } from "./enums";

// Documents uploaded by users
export const userDocument = pgTable("user_document", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userProfileId: text("user_profile_id")
    .notNull()
    .references(() => userProfile.id, { onDelete: "cascade" }),
  
  documentType: documentTypeEnum("document_type").notNull(),
  fileName: text("file_name").notNull(),
  originalFileName: text("original_file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  fileUrl: text("file_url"),
  
  // For stage tracking
  registrationStage: integer("registration_stage"),
  
  // Verification status
  isVerified: boolean("is_verified").default(false).notNull(),
  verifiedAt: timestamp("verified_at"),
  verificationNotes: text("verification_notes"),
  
  uploadedAt: timestamp("uploaded_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Product Documents (sales materials)
export const productDocument = pgTable("product_document", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  
  documentType: documentTypeEnum("document_type").notNull(),
  fileName: text("file_name").notNull(),
  originalFileName: text("original_file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  fileUrl: text("file_url"),
  
  // For demo videos and external links
  externalUrl: text("external_url"),
  description: text("description"),
  
  uploadedAt: timestamp("uploaded_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Legal Agreements and Declarations
export const legalAgreement = pgTable("legal_agreement", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userProfileId: text("user_profile_id")
    .notNull()
    .references(() => userProfile.id, { onDelete: "cascade" }),
  
  agreementType: text("agreement_type").notNull(), // 'nda', 'partnership_agreement', 'declaration'
  agreementText: text("agreement_text").notNull(),
  isAccepted: boolean("is_accepted").default(false).notNull(),
  acceptedAt: timestamp("accepted_at"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const documentSchema = {
  userDocument,
  productDocument,
  legalAgreement,
};
