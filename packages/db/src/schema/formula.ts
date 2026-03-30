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
  formulaStatusEnum,
  dosageFormEnum,
  fillMethodEnum,
  stepTypeEnum,
  stepDataTypeEnum,
  unitOfMeasureEnum,
  signatureMeaningEnum,
} from "./enum";
import { organizations, users } from "./auth";

// =============================================================================
// 3.1 master_formulas
// =============================================================================

export const masterFormulas = pgTable(
  "master_formula",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    productCode: varchar({ length: 50 }).notNull(),
    productName: varchar({ length: 255 }).notNull(),
    genericName: varchar({ length: 255 }),
    strength: varchar({ length: 100 }),
    dosageForm: dosageFormEnum().notNull(),
    fillMethod: fillMethodEnum().notNull().default("manual"),
    routeOfAdministration: varchar({ length: 100 }),
    version: integer().notNull().default(1),
    status: formulaStatusEnum().notNull().default("draft"),
    batchSizeQuantity: decimal({ precision: 15, scale: 5 }),
    batchSizeUnit: unitOfMeasureEnum(),
    targetYieldUnits: integer(),
    unitSize: varchar({ length: 50 }),
    budDays: integer(),
    budConditions: varchar({ length: 255 }),
    storageConditions: varchar({ length: 255 }),
    hazardousDrug: boolean().notNull().default(false),
    sterile: boolean().notNull().default(true),
    preservativeFree: boolean().notNull().default(false),
    pkSoftwareRef: varchar({ length: 100 }),
    masterFormulaDocUrl: text(),
    changeReason: text(),
    effectiveDate: date(),
    supersededBy: uuid(),
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
    index("formulas_org_idx").on(table.organizationId),
    uniqueIndex("formulas_org_product_version_uidx").on(
      table.organizationId,
      table.productCode,
      table.version
    ),
    index("formulas_status_idx").on(table.status),
    index("formulas_dosage_form_idx").on(table.dosageForm),
  ]
);

// =============================================================================
// 3.2 formula_steps
// =============================================================================

export const formulaSteps = pgTable(
  "formula_step",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    formulaId: uuid()
      .notNull()
      .references(() => masterFormulas.id, { onDelete: "cascade" }),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id),
    stepNumber: integer().notNull(),
    section: varchar({ length: 100 }),
    stepType: stepTypeEnum().notNull(),
    instruction: text().notNull(),
    shortLabel: varchar({ length: 100 }),
    dataType: stepDataTypeEnum(),
    unit: unitOfMeasureEnum(),
    targetValue: decimal({ precision: 15, scale: 5 }),
    toleranceLow: decimal({ precision: 15, scale: 5 }),
    toleranceHigh: decimal({ precision: 15, scale: 5 }),
    selectOptions: jsonb().$type<string[]>(),
    required: boolean().notNull().default(true),
    requiresSignature: boolean().notNull().default(false),
    signatureMeaning: signatureMeaningEnum(),
    requiresWitness: boolean().notNull().default(false),
    requiresBarcodeScan: boolean().notNull().default(false),
    expectedBarcodePattern: varchar({ length: 255 }),
    requiresPhoto: boolean().notNull().default(false),
    timerDurationSeconds: integer(),
    calculationFormula: text(),
    checklistItems: jsonb().$type<
      { label: string; required: boolean }[]
    >(),
    equipmentId: uuid(),
    componentId: uuid(),
    criticalStep: boolean().notNull().default(false),
    helpText: text(),
    imageUrl: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("formula_steps_org_idx").on(table.organizationId),
    index("formula_steps_formula_idx").on(table.formulaId),
    uniqueIndex("formula_steps_order_uidx").on(
      table.formulaId,
      table.stepNumber
    ),
    index("formula_steps_type_idx").on(table.stepType),
  ]
);

// =============================================================================
// 3.3 formula_components
// =============================================================================

export const formulaComponents = pgTable(
  "formula_component",
  {
    id: uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    formulaId: uuid()
      .notNull()
      .references(() => masterFormulas.id, { onDelete: "cascade" }),
    organizationId: uuid()
      .notNull()
      .references(() => organizations.id),
    inventoryItemId: uuid().notNull(),
    sortOrder: integer().notNull(),
    quantityPerBatch: decimal({ precision: 15, scale: 5 }).notNull(),
    unit: unitOfMeasureEnum().notNull(),
    quantityPerUnit: decimal({ precision: 15, scale: 5 }),
    isActiveIngredient: boolean().notNull().default(false),
    isCritical: boolean().notNull().default(false),
    overagePercentage: decimal({ precision: 5, scale: 2 }).default("0"),
    substitutesAllowed: boolean().default(false),
    notes: text(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("formula_components_org_idx").on(table.organizationId),
    index("formula_components_formula_idx").on(table.formulaId),
    index("formula_components_item_idx").on(table.inventoryItemId),
  ]
);
