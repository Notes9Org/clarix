import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  bigint,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

import { organizations, users } from "./auth";

// =============================================================================
// 9.1 import_logs — PK Software CSV import tracking
// =============================================================================

export const importLogs = pgTable(
  "import_log",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id),
    importType: varchar({ length: 50 }).notNull(),
    fileName: varchar({ length: 255 }).notNull(),
    fileSizeBytes: bigint({ mode: "number" }),
    status: varchar({ length: 20 }).notNull().default("pending"),
    totalRows: integer(),
    rowsImported: integer().default(0),
    rowsSkipped: integer().default(0),
    rowsErrored: integer().default(0),
    errorDetails: jsonb().$type<{ row: number; error: string }[]>(),
    startedAt: timestamp({ withTimezone: true }),
    completedAt: timestamp({ withTimezone: true }),
    importedBy: uuid()
      .notNull()
      .references(() => users.id),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("import_org_idx").on(table.organizationId),
    index("import_status_idx").on(table.status),
    index("import_type_idx").on(table.importType),
  ]
);
