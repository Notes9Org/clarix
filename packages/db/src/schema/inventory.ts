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
  itemCategoryEnum,
  lotStatusEnum,
  transactionTypeEnum,
  unitOfMeasureEnum,
} from "./enum";
import { organizations, users } from "./auth";

// =============================================================================
// 4.1 vendors
// =============================================================================

export const vendors = pgTable(
  "vendor",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 50 }),
    contactName: varchar({ length: 255 }),
    contactEmail: varchar({ length: 255 }),
    contactPhone: varchar({ length: 50 }),
    address: text(),
    qualifiedSupplier: boolean().notNull().default(false),
    qualificationDate: date(),
    qualificationExpiry: date(),
    notes: text(),
    isActive: boolean().default(true),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("vendor_org_idx").on(table.organizationId),
    uniqueIndex("vendor_org_code_uidx").on(table.organizationId, table.code),
  ]
);

// =============================================================================
// 4.2 inventory_items
// =============================================================================

export const inventoryItems = pgTable(
  "inventory_item",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: varchar({ length: 255 }).notNull(),
    sku: varchar({ length: 100 }),
    category: itemCategoryEnum().notNull(),
    description: text(),
    defaultUnit: unitOfMeasureEnum().notNull(),
    ndcNumber: varchar({ length: 20 }),
    casNumber: varchar({ length: 20 }),
    preferredVendorId: uuid().references(() => vendors.id),
    safetyStockLevel: decimal({ precision: 15, scale: 5 }),
    reorderPoint: decimal({ precision: 15, scale: 5 }),
    reorderQuantity: decimal({ precision: 15, scale: 5 }),
    hazardous: boolean().notNull().default(false),
    controlled: boolean().notNull().default(false),
    requiresColdChain: boolean().notNull().default(false),
    storageConditions: varchar({ length: 255 }),
    isActive: boolean().default(true),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("inv_item_org_idx").on(table.organizationId),
    uniqueIndex("inv_item_org_sku_uidx").on(table.organizationId, table.sku),
    index("inv_item_category_idx").on(table.category),
  ]
);

// =============================================================================
// 4.3 inventory_lots
// =============================================================================

export const inventoryLots = pgTable(
  "inventory_lot",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    inventoryItemId: uuid()
      .notNull()
      .references(() => inventoryItems.id),
    vendorId: uuid().references(() => vendors.id),
    lotNumber: varchar({ length: 100 }).notNull(),
    status: lotStatusEnum().notNull().default("quarantined"),
    quantityReceived: decimal({ precision: 15, scale: 5 }).notNull(),
    quantityRemaining: decimal({ precision: 15, scale: 5 }).notNull(),
    unit: unitOfMeasureEnum().notNull(),
    receivedDate: date().notNull(),
    expiryDate: date(),
    manufacturerLot: varchar({ length: 100 }),
    coaUrl: text(),
    coaVerified: boolean().default(false),
    coaVerifiedBy: uuid().references(() => users.id),
    coaVerifiedAt: timestamp({ withTimezone: true }),
    releasedBy: uuid().references(() => users.id),
    releasedAt: timestamp({ withTimezone: true }),
    barcode: varchar({ length: 255 }),
    storageLocation: varchar({ length: 100 }),
    notes: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("inv_lot_org_idx").on(table.organizationId),
    index("inv_lot_item_idx").on(table.inventoryItemId),
    uniqueIndex("inv_lot_org_item_lot_uidx").on(
      table.organizationId,
      table.inventoryItemId,
      table.lotNumber
    ),
    index("inv_lot_status_idx").on(table.status),
    index("inv_lot_expiry_idx").on(table.expiryDate),
  ]
);

// =============================================================================
// 4.4 inventory_transactions
// =============================================================================

export const inventoryTransactions = pgTable(
  "inventory_transaction",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id),
    inventoryLotId: uuid()
      .notNull()
      .references(() => inventoryLots.id),
    transactionType: transactionTypeEnum().notNull(),
    quantity: decimal({ precision: 15, scale: 5 }).notNull(),
    unit: unitOfMeasureEnum().notNull(),
    batchId: uuid(),
    referenceNumber: varchar({ length: 100 }),
    reason: text(),
    performedBy: uuid()
      .notNull()
      .references(() => users.id),
    performedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("inv_txn_org_idx").on(table.organizationId),
    index("inv_txn_lot_idx").on(table.inventoryLotId),
    index("inv_txn_type_idx").on(table.transactionType),
    index("inv_txn_batch_idx").on(table.batchId),
  ]
);
