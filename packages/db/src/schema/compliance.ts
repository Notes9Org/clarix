import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  bigint,
  boolean,
  date,
  timestamp,
  jsonb,
  inet,
  index,
} from "drizzle-orm/pg-core";

import {
  trainingTypeEnum,
  trainingStatusEnum,
  testTypeEnum,
  labSampleStatusEnum,
  documentStatusEnum,
  documentTypeEnumPg,
  auditActionEnum,
  notificationTypeEnum,
} from "./enum";
import { organizations, users } from "./auth";

// =============================================================================
// 8.1 training_records
// =============================================================================

export const trainingRecords = pgTable(
  "training_record",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid()
      .notNull()
      .references(() => users.id),
    trainingType: trainingTypeEnum().notNull(),
    status: trainingStatusEnum().notNull().default("assigned"),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    sopReference: varchar({ length: 100 }),
    assignedDate: date().notNull(),
    dueDate: date(),
    completedDate: date(),
    expiryDate: date(),
    score: integer(),
    passingScore: integer(),
    trainerId: uuid().references(() => users.id),
    certificateUrl: text(),
    notes: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("training_org_idx").on(table.organizationId),
    index("training_user_idx").on(table.userId),
    index("training_status_idx").on(table.status),
    index("training_type_idx").on(table.trainingType),
    index("training_due_idx").on(table.dueDate),
  ]
);

// =============================================================================
// 8.2 lab_samples
// =============================================================================

export const labSamples = pgTable(
  "lab_sample",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id),
    batchId: uuid().notNull(),
    sampleNumber: varchar({ length: 50 }).notNull(),
    testType: testTypeEnum().notNull(),
    status: labSampleStatusEnum().notNull().default("sampled"),
    sampleDescription: text(),
    sampledBy: uuid()
      .notNull()
      .references(() => users.id),
    sampledAt: timestamp({ withTimezone: true }).notNull(),
    externalLabName: varchar({ length: 255 }),
    externalLabRef: varchar({ length: 100 }),
    shippedAt: timestamp({ withTimezone: true }),
    resultsReceivedAt: timestamp({ withTimezone: true }),
    resultValue: text(),
    resultPass: boolean(),
    coaUrl: text(),
    reviewedBy: uuid().references(() => users.id),
    reviewedAt: timestamp({ withTimezone: true }),
    notes: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("lab_sample_org_idx").on(table.organizationId),
    index("lab_sample_batch_idx").on(table.batchId),
    index("lab_sample_status_idx").on(table.status),
    index("lab_sample_test_type_idx").on(table.testType),
  ]
);

// =============================================================================
// 8.3 documents
// =============================================================================

export const documents = pgTable(
  "document",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    title: varchar({ length: 255 }).notNull(),
    documentNumber: varchar({ length: 50 }),
    documentType: documentTypeEnumPg().notNull(),
    version: integer().notNull().default(1),
    status: documentStatusEnum().notNull().default("draft"),
    fileUrl: text().notNull(),
    fileName: varchar({ length: 255 }).notNull(),
    fileSizeBytes: bigint({ mode: "number" }),
    mimeType: varchar({ length: 100 }),
    description: text(),
    effectiveDate: date(),
    reviewDate: date(),
    supersededById: uuid(),
    uploadedBy: uuid()
      .notNull()
      .references(() => users.id),
    approvedBy: uuid().references(() => users.id),
    approvedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("document_org_idx").on(table.organizationId),
    index("document_type_idx").on(table.documentType),
    index("document_status_idx").on(table.status),
  ]
);

// =============================================================================
// 8.4 audit_trail (INSERT-only — never update or delete)
// =============================================================================

export const auditTrail = pgTable(
  "audit_trail",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id),
    userId: uuid().references(() => users.id),
    action: auditActionEnum().notNull(),
    tableName: varchar({ length: 100 }).notNull(),
    recordId: uuid(),
    oldValues: jsonb(),
    newValues: jsonb(),
    ipAddress: inet(),
    userAgent: text(),
    sessionId: uuid(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("audit_org_idx").on(table.organizationId),
    index("audit_user_idx").on(table.userId),
    index("audit_table_record_idx").on(table.tableName, table.recordId),
    index("audit_action_idx").on(table.action),
    index("audit_created_at_idx").on(table.createdAt),
  ]
);

// =============================================================================
// 8.5 notifications
// =============================================================================

export const notifications = pgTable(
  "notification",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id),
    userId: uuid()
      .notNull()
      .references(() => users.id),
    type: notificationTypeEnum().notNull(),
    title: varchar({ length: 255 }).notNull(),
    message: text(),
    referenceTable: varchar({ length: 100 }),
    referenceId: uuid(),
    read: boolean().notNull().default(false),
    readAt: timestamp({ withTimezone: true }),
    actionUrl: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("notification_org_idx").on(table.organizationId),
    index("notification_user_idx").on(table.userId),
    index("notification_read_idx").on(table.read),
    index("notification_type_idx").on(table.type),
  ]
);
