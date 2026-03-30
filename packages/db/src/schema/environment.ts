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
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import {
  isoClassificationEnum,
  roomTypeEnum,
  sampleTypeEnum,
  sampleStatusEnum,
  scheduleFrequencyEnum,
  excursionStatusEnum,
} from "./enum";
import { organizations, users } from "./auth";

// =============================================================================
// 5.1 rooms
// =============================================================================

export const rooms = pgTable(
  "room",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: varchar({ length: 100 }).notNull(),
    code: varchar({ length: 20 }).notNull(),
    roomType: roomTypeEnum().notNull(),
    isoClassification: isoClassificationEnum().notNull(),
    differentialPressure: decimal({ precision: 6, scale: 2 }),
    temperatureMin: decimal({ precision: 5, scale: 1 }),
    temperatureMax: decimal({ precision: 5, scale: 1 }),
    humidityMin: decimal({ precision: 5, scale: 1 }),
    humidityMax: decimal({ precision: 5, scale: 1 }),
    isActive: boolean().default(true),
    qrCode: varchar({ length: 255 }),
    notes: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("room_org_idx").on(table.organizationId),
    uniqueIndex("room_org_code_uidx").on(table.organizationId, table.code),
    index("room_iso_idx").on(table.isoClassification),
  ]
);

// =============================================================================
// 5.2 em_locations
// =============================================================================

export const emLocations = pgTable(
  "em_location",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    roomId: uuid()
      .notNull()
      .references(() => rooms.id),
    locationName: varchar({ length: 100 }).notNull(),
    locationCode: varchar({ length: 20 }).notNull(),
    sampleType: sampleTypeEnum().notNull(),
    viableAlertLimit: integer(),
    viableActionLimit: integer(),
    nonViableAlert05um: integer(),
    nonViableAction05um: integer(),
    nonViableAlert50um: integer(),
    nonViableAction50um: integer(),
    samplingFrequency: scheduleFrequencyEnum().notNull(),
    qrCode: varchar({ length: 255 }),
    isActive: boolean().default(true),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("em_loc_org_idx").on(table.organizationId),
    index("em_loc_room_idx").on(table.roomId),
    uniqueIndex("em_loc_org_code_uidx").on(
      table.organizationId,
      table.locationCode
    ),
  ]
);

// =============================================================================
// 5.3 em_samples
// =============================================================================

export const emSamples = pgTable(
  "em_sample",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id),
    emLocationId: uuid()
      .notNull()
      .references(() => emLocations.id),
    sampleDate: date().notNull(),
    status: sampleStatusEnum().notNull().default("scheduled"),
    viableCount: integer(),
    nonViableCount05um: integer(),
    nonViableCount50um: integer(),
    incubationStartedAt: timestamp({ withTimezone: true }),
    incubationEndedAt: timestamp({ withTimezone: true }),
    resultsEnteredAt: timestamp({ withTimezone: true }),
    collectedBy: uuid().references(() => users.id),
    collectedAt: timestamp({ withTimezone: true }),
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
    index("em_sample_org_idx").on(table.organizationId),
    index("em_sample_location_idx").on(table.emLocationId),
    index("em_sample_date_idx").on(table.sampleDate),
    index("em_sample_status_idx").on(table.status),
  ]
);

// =============================================================================
// 5.4 em_excursions
// =============================================================================

export const emExcursions = pgTable(
  "em_excursion",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id),
    emSampleId: uuid()
      .notNull()
      .references(() => emSamples.id),
    roomId: uuid()
      .notNull()
      .references(() => rooms.id),
    excursionType: varchar({ length: 20 }).notNull(),
    status: excursionStatusEnum().notNull().default("open"),
    excursionStart: timestamp({ withTimezone: true }).notNull(),
    excursionEnd: timestamp({ withTimezone: true }),
    affectedBatches: uuid().array(),
    impactAssessment: text(),
    correctiveAction: text(),
    investigatedBy: uuid().references(() => users.id),
    closedBy: uuid().references(() => users.id),
    closedAt: timestamp({ withTimezone: true }),
    deviationId: uuid(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("em_excursion_org_idx").on(table.organizationId),
    index("em_excursion_sample_idx").on(table.emSampleId),
    index("em_excursion_room_idx").on(table.roomId),
    index("em_excursion_status_idx").on(table.status),
  ]
);
