import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  index,
  uniqueIndex,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

import {
  userRoleEnum,
  userStatusEnum,
  qualificationStatusEnum,
} from "./enum";
import { idFields, auditAtFields, softDeleteFields } from "./column";

// =============================================================================
// 2.1 organizations
// =============================================================================

export const organizations = pgTable(
  "organization",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 100 }).notNull().unique(),
    licenseNumber: varchar({ length: 100 }),
    deaNumber: varchar({ length: 20 }),
    statePermit: varchar({ length: 50 }),
    address: text(),
    phone: varchar({ length: 20 }),
    logo: text(),
    settings: jsonb().$type<Record<string, unknown>>().default({}),
    metadata: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("organization_slug_uidx").on(table.slug)]
);

// =============================================================================
// 2.2 users
// =============================================================================

export const users = pgTable(
  "user",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: text().notNull().unique(),
    name: text().notNull(),
    emailVerified: boolean().default(false).notNull(),
    image: text(),
    role: userRoleEnum().notNull().default("read_only"),
    status: userStatusEnum().notNull().default("pending_activation"),
    qualificationStatus: qualificationStatusEnum()
      .notNull()
      .default("not_applicable"),
    title: varchar({ length: 100 }),
    department: varchar({ length: 100 }),
    employeeId: varchar({ length: 50 }),
    pin: text(), // hashed PIN for e-signatures
    biometricEnabled: boolean().default(false),
    lastLoginAt: timestamp({ withTimezone: true }),
    lastLoginMethod: text(),
    lang: text().default("en"),
    banned: boolean().default(false),
    banReason: text(),
    banExpires: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp({ withTimezone: true }),
  },
  (table) => [
    index("user_org_idx").on(table.organizationId),
    index("user_email_idx").on(table.email),
    index("user_role_idx").on(table.role),
    index("user_status_idx").on(table.status),
  ]
);

// =============================================================================
// Better-Auth managed tables (session, account, verification, etc.)
// These are created/managed by Better-Auth — we define them here so Drizzle
// is aware of them for relations and type safety.
// =============================================================================

export const session = pgTable(
  "session",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    token: text().notNull().unique(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    activeOrganizationId: text(),
    impersonatedBy: text(),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true }),
    scope: text(),
    password: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);
