import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  date,
  timestamp,
  jsonb,
  inet,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import {
  batchStatusEnum,
  stepStatusEnum,
  unitOfMeasureEnum,
  signatureMeaningEnum,
} from "./enum";
import { organizations, users } from "./auth";
import { masterFormulas, formulaSteps, formulaComponents } from "./formula";

// =============================================================================
// 3.4 batches
// =============================================================================

export const batches = pgTable(
  "batch",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    formulaId: uuid()
      .notNull()
      .references(() => masterFormulas.id),
    batchNumber: varchar({ length: 50 }).notNull(),
    status: batchStatusEnum().notNull().default("draft"),
    roomId: uuid(),
    scheduledDate: date(),
    startedAt: timestamp({ withTimezone: true }),
    completedAt: timestamp({ withTimezone: true }),
    reviewedAt: timestamp({ withTimezone: true }),
    reviewedBy: uuid().references(() => users.id),
    releasedAt: timestamp({ withTimezone: true }),
    releasedBy: uuid().references(() => users.id),
    batchSizeQuantity: decimal({ precision: 15, scale: 5 }),
    batchSizeUnit: unitOfMeasureEnum(),
    targetYieldUnits: integer(),
    actualYieldUnits: integer(),
    yieldPercentage: decimal({ precision: 5, scale: 2 }),
    budDate: date(),
    manufactureDate: date(),
    expiryDate: date(),
    storageConditions: varchar({ length: 100 }),
    pkSoftwareBatchRef: varchar({ length: 100 }),
    deviationCount: integer().default(0),
    hasOpenDeviation: boolean().default(false),
    currentStepNumber: integer().default(0),
    totalSteps: integer().notNull(),
    assignedTechnicians: uuid().array(),
    notes: text(),
    createdBy: uuid()
      .notNull()
      .references(() => users.id),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (table) => [
    index("batches_org_idx").on(table.organizationId),
    uniqueIndex("batches_org_number_uidx").on(
      table.organizationId,
      table.batchNumber
    ),
    index("batches_status_idx").on(table.status),
    index("batches_formula_idx").on(table.formulaId),
    index("batches_room_idx").on(table.roomId),
    index("batches_scheduled_date_idx").on(table.scheduledDate),
  ]
);

// =============================================================================
// 3.5 batch_step_records
// =============================================================================

export const batchStepRecords = pgTable(
  "batch_step_record",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    batchId: uuid()
      .notNull()
      .references(() => batches.id, { onDelete: "cascade" }),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id),
    formulaStepId: uuid()
      .notNull()
      .references(() => formulaSteps.id),
    stepNumber: integer().notNull(),
    status: stepStatusEnum().notNull().default("pending"),
    enteredValue: text(),
    enteredNumeric: decimal({ precision: 15, scale: 5 }),
    enteredUnit: unitOfMeasureEnum(),
    withinTolerance: boolean(),
    calculatedValue: decimal({ precision: 15, scale: 5 }),
    barcodeScanned: varchar({ length: 255 }),
    barcodeMatched: boolean(),
    photoUrl: text(),
    photoCaption: varchar({ length: 255 }),
    checklistResponses: jsonb().$type<
      { label: string; checked: boolean }[]
    >(),
    timerStartedAt: timestamp({ withTimezone: true }),
    timerEndedAt: timestamp({ withTimezone: true }),
    timerActualSeconds: integer(),
    deviationId: uuid(),
    performedBy: uuid().references(() => users.id),
    performedAt: timestamp({ withTimezone: true }),
    signedBy: uuid().references(() => users.id),
    signedAt: timestamp({ withTimezone: true }),
    signatureMeaning: signatureMeaningEnum(),
    witnessedBy: uuid().references(() => users.id),
    witnessedAt: timestamp({ withTimezone: true }),
    notes: text(),
    ipAddress: inet(),
    deviceId: varchar({ length: 255 }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("batch_steps_org_idx").on(table.organizationId),
    index("batch_steps_batch_idx").on(table.batchId),
    uniqueIndex("batch_steps_order_uidx").on(table.batchId, table.stepNumber),
    index("batch_steps_status_idx").on(table.status),
    index("batch_steps_performed_by_idx").on(table.performedBy),
  ]
);

// =============================================================================
// 3.6 batch_components_used
// =============================================================================

export const batchComponentsUsed = pgTable(
  "batch_component_used",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    batchId: uuid()
      .notNull()
      .references(() => batches.id),
    formulaComponentId: uuid()
      .notNull()
      .references(() => formulaComponents.id),
    inventoryLotId: uuid().notNull(),
    quantityRequired: decimal({ precision: 15, scale: 5 }).notNull(),
    quantityUsed: decimal({ precision: 15, scale: 5 }).notNull(),
    unit: unitOfMeasureEnum().notNull(),
    barcodeVerified: boolean().notNull().default(false),
    barcodeValue: varchar({ length: 255 }),
    scannedBy: uuid().references(() => users.id),
    scannedAt: timestamp({ withTimezone: true }),
    batchStepRecordId: uuid(),
    notes: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("batch_components_batch_idx").on(table.batchId),
    index("batch_components_lot_idx").on(table.inventoryLotId),
  ]
);

// =============================================================================
// 3.7 e_signatures (INSERT-only audit table)
// =============================================================================

export const eSignatures = pgTable(
  "e_signature",
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
    meaning: signatureMeaningEnum().notNull(),
    tableName: varchar({ length: 100 }).notNull(),
    recordId: uuid().notNull(),
    fieldName: varchar({ length: 100 }),
    reason: text(),
    signedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .notNull(),
    ipAddress: inet(),
    deviceId: varchar({ length: 255 }),
    userAgent: text(),
    authMethod: varchar({ length: 50 }).notNull(),
    pinVerified: boolean().default(false),
    biometricVerified: boolean().default(false),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("esig_org_idx").on(table.organizationId),
    index("esig_user_idx").on(table.userId),
    index("esig_record_idx").on(table.tableName, table.recordId),
    index("esig_signed_at_idx").on(table.signedAt),
  ]
);
