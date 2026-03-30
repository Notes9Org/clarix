import { sql } from "drizzle-orm";
import { jsonb, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Shared column field sets for Clarix tables.
 * Following Astra's composable column pattern.
 *
 * Usage:
 *   export const myTable = pgTable("my_table", {
 *     ...idFields,
 *     ...orgFields,
 *     ...auditAtFields,
 *     myColumn: text(),
 *   });
 */

/** Primary key — UUIDv7 for time-sorted ordering */
export const idFields = {
  id: uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
};

/** Organization FK — every tenant-scoped table needs this for RLS */
export const orgFields = {
  organizationId: uuid().notNull(),
};

/** Created/updated timestamps */
export const auditAtFields = {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

/** Soft delete support */
export const softDeleteFields = {
  deletedAt: timestamp({ withTimezone: true }),
};

/** Audit authorship */
export const auditByFields = {
  createdBy: uuid().notNull(),
};

/** Full base fields for most tables */
export const baseFields = {
  ...idFields,
  ...orgFields,
  ...auditAtFields,
};
