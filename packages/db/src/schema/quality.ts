import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  date,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

import {
  deviationSourceEnum,
  deviationSeverityEnum,
  deviationStatusEnum,
  capaTypeEnum,
  capaStatusEnum,
} from "./enum";
import { organizations, users } from "./auth";

// =============================================================================
// 6.1 deviations
// =============================================================================

export const deviations = pgTable(
  "deviation",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    deviationNumber: varchar({ length: 50 }).notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    source: deviationSourceEnum().notNull(),
    severity: deviationSeverityEnum().notNull(),
    status: deviationStatusEnum().notNull().default("open"),
    batchId: uuid(),
    emExcursionId: uuid(),
    equipmentId: uuid(),
    rootCause: text(),
    impactAssessment: text(),
    immediateAction: text(),
    reportedBy: uuid()
      .notNull()
      .references(() => users.id),
    reportedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    assignedTo: uuid().references(() => users.id),
    investigatedBy: uuid().references(() => users.id),
    closedBy: uuid().references(() => users.id),
    closedAt: timestamp({ withTimezone: true }),
    dueDate: date(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("deviation_org_idx").on(table.organizationId),
    index("deviation_status_idx").on(table.status),
    index("deviation_severity_idx").on(table.severity),
    index("deviation_batch_idx").on(table.batchId),
    index("deviation_assigned_idx").on(table.assignedTo),
  ]
);

// =============================================================================
// 6.2 capas
// =============================================================================

export const capas = pgTable(
  "capa",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    deviationId: uuid()
      .notNull()
      .references(() => deviations.id),
    capaNumber: varchar({ length: 50 }).notNull(),
    capaType: capaTypeEnum().notNull(),
    status: capaStatusEnum().notNull().default("open"),
    description: text().notNull(),
    actionPlan: text(),
    effectivenessCheck: text(),
    effectivenessResult: text(),
    assignedTo: uuid()
      .notNull()
      .references(() => users.id),
    dueDate: date().notNull(),
    completedAt: timestamp({ withTimezone: true }),
    verifiedBy: uuid().references(() => users.id),
    verifiedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("capa_org_idx").on(table.organizationId),
    index("capa_deviation_idx").on(table.deviationId),
    index("capa_status_idx").on(table.status),
    index("capa_assigned_idx").on(table.assignedTo),
    index("capa_due_date_idx").on(table.dueDate),
  ]
);
