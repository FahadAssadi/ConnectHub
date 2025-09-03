import { text, timestamp, boolean, uuid, integer, decimal } from "drizzle-orm/pg-core";

// === COMMON COLUMN PATTERNS ===

// Primary key patterns
export const uuidPrimaryKey = () => uuid("id").primaryKey().defaultRandom();
export const textPrimaryKey = () => text("id").primaryKey();

// Foreign key patterns
export const userIdFK = (tableName: string = "user") => 
  text("user_id").notNull().references(() => require("./auth-schema").user.id, { onDelete: "cascade" });

export const optionalUserIdFK = (tableName: string = "user") => 
  text("user_id").references(() => require("./auth-schema").user.id, { onDelete: "set null" });

// Timestamp patterns
export const createdAt = () => timestamp("created_at").defaultNow().notNull();
export const updatedAt = () => timestamp("updated_at").defaultNow().notNull();
export const deletedAt = () => timestamp("deleted_at");

export const auditTimestamps = () => ({
  createdAt: createdAt(),
  updatedAt: updatedAt()
});

export const softDeleteTimestamps = () => ({
  ...auditTimestamps(),
  deletedAt: deletedAt()
});

// Common text field patterns
export const shortText = (name: string, required: boolean = true) => {
  const field = text(name);
  return required ? field.notNull() : field;
};

export const mediumText = (name: string, required: boolean = false) => {
  const field = text(name);
  return required ? field.notNull() : field;
};

export const longText = (name: string, required: boolean = false) => {
  const field = text(name);
  return required ? field.notNull() : field;
};

export const email = (name: string = "email", required: boolean = true) => {
  const field = text(name);
  return required ? field.notNull() : field;
};

export const phone = (name: string = "phone", required: boolean = true) => {
  const field = text(name);
  return required ? field.notNull() : field;
};

export const url = (name: string, required: boolean = false) => {
  const field = text(name);
  return required ? field.notNull() : field;
};

// Common boolean patterns
export const isActive = () => boolean("is_active").default(true);
export const isVerified = () => boolean("is_verified").default(false);
export const isDeleted = () => boolean("is_deleted").default(false);
export const isPublic = () => boolean("is_public").default(false);

// Common numeric patterns
export const percentage = (name: string, required: boolean = true) => {
  const field = decimal(name, { precision: 5, scale: 2 });
  return required ? field.notNull() : field;
};

export const rating = (name: string = "rating") => 
  decimal(name, { precision: 3, scale: 2 }); // 0.00 to 5.00

export const money = (name: string, required: boolean = true) => {
  const field = decimal(name, { precision: 12, scale: 2 });
  return required ? field.notNull() : field;
};

// File and document patterns
export const fileFields = (prefix: string = "file") => ({
  fileName: shortText(`${prefix}_name`),
  filePath: text(`${prefix}_path`).notNull(),
  fileSize: integer(`${prefix}_size`),
  mimeType: shortText(`${prefix}_mime_type`, false)
});

// Address patterns
export const addressFields = (prefix: string = "") => {
  const p = prefix ? `${prefix}_` : "";
  return {
    country: shortText(`${p}country`),
    state: shortText(`${p}state`, false),
    city: shortText(`${p}city`),
    postalCode: shortText(`${p}postal_code`, false),
    addressLine1: shortText(`${p}address_line_1`, false),
    addressLine2: shortText(`${p}address_line_2`, false)
  };
};

// Contact information patterns
export const contactFields = (prefix: string = "") => {
  const p = prefix ? `${prefix}_` : "";
  return {
    email: email(`${p}email`),
    phone: phone(`${p}phone`),
    website: url(`${p}website`, false),
    linkedinProfile: url(`${p}linkedin_profile`, false)
  };
};

// Metadata patterns
export const metadataFields = () => ({
  tags: text("tags"), // JSON array of tags
  metadata: text("metadata"), // JSON object for additional data
  notes: longText("notes", false)
});

// Version control patterns
export const versionFields = () => ({
  version: integer("version").default(1).notNull(),
  isLatest: boolean("is_latest").default(true).notNull(),
  parentVersion: uuid("parent_version")
});

// Approval workflow patterns
export const approvalFields = () => ({
  status: text("status").notNull(),
  approvedBy: optionalUserIdFK("approved_by"),
  approvedAt: timestamp("approved_at"),
  rejectedBy: optionalUserIdFK("rejected_by"),
  rejectedAt: timestamp("rejected_at"),
  rejectionReason: longText("rejection_reason", false)
});
