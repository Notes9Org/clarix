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
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import {
  equipmentStatusEnum,
  equipmentTypeEnum,
  cleaningStatusEnum,
  scheduleFrequencyEnum,
} from "./enum";
import { organizations, users } from "./auth";
import { rooms } from "./environment";

// =============================================================================
// 7.1 equipment
// =============================================================================

export const equipment = pgTable(
  "equipment",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: varchar({ length: 255 }).notNull(),
    assetTag: varchar({ length: 50 }),
    equipmentType: equipmentTypeEnum().notNull(),
    status: equipmentStatusEnum().notNull().default("qualified"),
    manufacturer: varchar({ length: 255 }),
    model: varchar({ length: 255 }),
    serialNumber: varchar({ length: 100 }),
    roomId: uuid().references(() => rooms.id),
    calibrationIntervalDays: integer(),
    lastCalibrationDate: date(),
    nextCalibrationDate: date(),
    qualificationDate: date(),
    qualificationExpiry: date(),
    sopReference: varchar({ length: 100 }),
    notes: text(),
    isActive: boolean().default(true),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("equipment_org_idx").on(table.organizationId),
    uniqueIndex("equipment_org_asset_uidx").on(
      table.organizationId,
      table.assetTag
    ),
    index("equipment_type_idx").on(table.equipmentType),
    index("equipment_status_idx").on(table.status),
    index("equipment_next_cal_idx").on(table.nextCalibrationDate),
  ]
);

// =============================================================================
// 7.2 calibration_records
// =============================================================================

export const calibrationRecords = pgTable(
  "calibration_record",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id),
    equipmentId: uuid()
      .notNull()
      .references(() => equipment.id),
    calibrationDate: date().notNull(),
    nextDueDate: date().notNull(),
    standardUsed: varchar({ length: 255 }),
    standardCertificate: text(),
    resultPass: boolean().notNull(),
    readingBefore: decimal({ precision: 15, scale: 5 }),
    readingAfter: decimal({ precision: 15, scale: 5 }),
    acceptanceCriteria: text(),
    adjustmentMade: boolean().default(false),
    notes: text(),
    performedBy: uuid()
      .notNull()
      .references(() => users.id),
    verifiedBy: uuid().references(() => users.id),
    verifiedAt: timestamp({ withTimezone: true }),
    certificateUrl: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("cal_record_org_idx").on(table.organizationId),
    index("cal_record_equipment_idx").on(table.equipmentId),
    index("cal_record_date_idx").on(table.calibrationDate),
  ]
);

// =============================================================================
// 7.3 cleaning_logs
// =============================================================================

export const cleaningLogs = pgTable(
  "cleaning_log",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id),
    roomId: uuid()
      .notNull()
      .references(() => rooms.id),
    cleaningDate: date().notNull(),
    frequency: scheduleFrequencyEnum().notNull(),
    status: cleaningStatusEnum().notNull().default("scheduled"),
    agentName: varchar({ length: 100 }).notNull(),
    agentLot: varchar({ length: 100 }),
    agentExpiry: date(),
    contactTimeMinutes: integer(),
    contactTimeVerified: boolean().default(false),
    sporicidal: boolean().default(false),
    residueCheckPassed: boolean(),
    performedBy: uuid().references(() => users.id),
    performedAt: timestamp({ withTimezone: true }),
    verifiedBy: uuid().references(() => users.id),
    verifiedAt: timestamp({ withTimezone: true }),
    notes: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("cleaning_org_idx").on(table.organizationId),
    index("cleaning_room_idx").on(table.roomId),
    index("cleaning_date_idx").on(table.cleaningDate),
    index("cleaning_status_idx").on(table.status),
  ]
);
