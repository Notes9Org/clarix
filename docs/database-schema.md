# Clarix — Database Schema (Granular Deep Dive)

## Overview

All tables use Drizzle ORM `pgTable` definitions in `packages/db/src/schema/`.
PostgreSQL is the database engine. Multi-tenancy is enforced via `organizationId` on every data table.

### Conventions

- **Primary Keys**: `id` — UUID v7 (time-sortable), generated via `gen_random_uuid()`
- **Timestamps**: `createdAt` (default `now()`), `updatedAt` (auto-updated via trigger)
- **Soft Delete**: `deletedAt` nullable timestamp on tables that support soft delete
- **Organization Scoping**: Every data table has `organizationId` FK for multi-tenant isolation
- **Audit Trail**: All mutations logged to `auditTrail` table via Drizzle hooks
- **Naming**: snake_case for DB columns, camelCase in Drizzle schema TypeScript

---

## 1. Enums (`pgEnum`)

### 1.1 User & Auth Enums

```sql
-- User roles within the organization
CREATE TYPE user_role AS ENUM (
  'admin',            -- IT administrator, full system access
  'vp',               -- Vice President / facility owner, read-only dashboards + approvals
  'production_manager', -- Production scheduling, technician assignments
  'pic',              -- Pharmacist-in-Charge, formula approval, final batch release
  'pharmacist',       -- Staff pharmacist, batch verification, clinical oversight
  'technician',       -- Compounding technician, batch execution in cleanroom
  'visual_inspector', -- Visual inspection, packaging, labeling
  'qa_manager',       -- QA oversight, deviation/CAPA management, audit prep
  'qa_specialist',    -- Document control, batch record review
  'qc_tech',          -- Lab testing (potency, endotoxin, sterility)
  'microbiologist',   -- Environmental monitoring, media fills
  'warehouse',        -- Receiving, barcode scanning, stock counts
  'procurement',      -- Vendor management, purchase orders
  'maintenance',      -- Equipment calibration, cleaning logs
  'training_coord'    -- Personnel qualification, SOP training
);

-- User account status
CREATE TYPE user_status AS ENUM (
  'active',
  'inactive',
  'suspended',
  'pending_activation'
);

-- Qualification status for personnel
CREATE TYPE qualification_status AS ENUM (
  'not_started',
  'in_progress',
  'qualified',
  'expired',
  'failed',
  'requalification_due'
);

-- E-signature meaning (21 CFR Part 11)
CREATE TYPE signature_meaning AS ENUM (
  'authored',         -- "I created this record"
  'verified',         -- "I verified this data"
  'reviewed',         -- "I reviewed this record"
  'approved',         -- "I approve this record"
  'released',         -- "I release this batch for distribution"
  'witnessed',        -- "I witnessed this action"
  'performed',        -- "I performed this step"
  'rejected'          -- "I reject this record"
);
```

### 1.2 Batch & Formula Enums

```sql
-- Master formula status
CREATE TYPE formula_status AS ENUM (
  'draft',
  'pending_review',
  'approved',
  'superseded',       -- replaced by newer version
  'retired'
);

-- Batch lifecycle status
CREATE TYPE batch_status AS ENUM (
  'draft',            -- created but not started
  'in_progress',      -- actively being compounded
  'on_hold',          -- paused (deviation, supply issue)
  'pending_review',   -- completed, awaiting QA review
  'under_review',     -- QA reviewing
  'pending_release',  -- QA approved, awaiting PIC release
  'released',         -- PIC signed off, ready for distribution
  'rejected',         -- failed QA review
  'recalled',         -- post-release recall
  'archived'          -- historical record
);

-- Batch step type
CREATE TYPE step_type AS ENUM (
  'instruction',      -- read-only instruction, no data entry
  'data_entry',       -- numeric or text input required
  'measurement',      -- measurement with tolerance (pH, weight, volume)
  'calculation',      -- auto-calculated value (yield, concentration)
  'verification',     -- barcode scan or visual check
  'signature',        -- e-signature only (witness, approval)
  'timer',            -- timed step (mixing duration, incubation)
  'photo_capture',    -- camera capture required (visual inspection)
  'checklist'         -- multi-item checklist
);

-- Data type for step input
CREATE TYPE step_data_type AS ENUM (
  'text',
  'number',
  'decimal',
  'boolean',
  'date',
  'time',
  'datetime',
  'select',           -- dropdown from predefined options
  'multi_select',
  'barcode',
  'photo',
  'temperature',      -- °C or °F with unit
  'weight',           -- g, mg, kg with unit
  'volume',           -- mL, L with unit
  'ph',               -- pH value 0-14
  'pressure',         -- differential pressure
  'percentage'
);

-- Batch step completion status
CREATE TYPE step_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'skipped_approved', -- skipped with QA approval
  'failed',           -- out of spec
  'deviation_raised'
);

-- Product dosage form
CREATE TYPE dosage_form AS ENUM (
  'injectable',
  'ophthalmic',
  'topical',
  'oral_solution',
  'nasal',
  'inhalation',
  'suppository',
  'other'
);

-- Fill method
CREATE TYPE fill_method AS ENUM (
  'manual',           -- manual filling and stoppering
  'colonnar_auto',    -- Colonnar automatic filling line
  'peristaltic_pump',
  'other'
);
```

### 1.3 Inventory Enums

```sql
-- Inventory item category
CREATE TYPE item_category AS ENUM (
  'api',              -- Active Pharmaceutical Ingredient
  'excipient',        -- Inactive ingredient (WFI, NaCl, etc.)
  'container',        -- Vials, syringes, bags
  'closure',          -- Stoppers, caps, seals
  'label',            -- Labels, packaging materials
  'consumable',       -- Alcohol wipes, gloves, gowns, syringes
  'chemical_reagent', -- Lab reagents for QC testing
  'filter',           -- Sterilizing filters
  'packaging',        -- Boxes, trays, shipping materials
  'other'
);

-- Inventory lot status
CREATE TYPE lot_status AS ENUM (
  'quarantined',      -- received, awaiting QC release
  'released',         -- QC approved for use
  'in_use',           -- partially consumed in production
  'depleted',         -- fully consumed
  'expired',          -- past expiry date
  'rejected',         -- failed QC testing
  'recalled',         -- vendor recall
  'returned'          -- returned to vendor
);

-- Inventory transaction type
CREATE TYPE transaction_type AS ENUM (
  'received',         -- incoming from vendor
  'released_by_qc',   -- QC releases from quarantine
  'issued_to_batch',  -- consumed in a batch
  'returned_to_stock',-- returned from production
  'adjusted',         -- manual adjustment (count correction)
  'disposed',         -- waste disposal
  'expired',          -- auto-expired by system
  'transferred'       -- moved between locations
);

-- Unit of measure
CREATE TYPE unit_of_measure AS ENUM (
  'g', 'mg', 'kg', 'mcg',
  'mL', 'L', 'uL',
  'units', 'IU',
  'each', 'pack', 'box', 'case',
  'vial', 'ampoule', 'bag', 'syringe',
  'roll', 'sheet'
);
```

### 1.4 Quality & Compliance Enums

```sql
-- Deviation source type
CREATE TYPE deviation_source AS ENUM (
  'batch_oos',        -- out of specification during batch
  'em_excursion',     -- environmental monitoring excursion
  'equipment_failure',
  'document_error',
  'process_deviation',
  'customer_complaint',
  'supplier_issue',
  'audit_finding',
  'other'
);

-- Deviation severity
CREATE TYPE deviation_severity AS ENUM (
  'critical',         -- patient safety risk, potential recall
  'major',            -- significant quality impact
  'minor'             -- documentation or procedural
);

-- Deviation / CAPA status
CREATE TYPE deviation_status AS ENUM (
  'open',
  'under_investigation',
  'root_cause_identified',
  'capa_assigned',
  'capa_in_progress',
  'pending_effectiveness',
  'closed',
  'closed_no_action'
);

CREATE TYPE capa_type AS ENUM (
  'corrective',
  'preventive',
  'both'
);

CREATE TYPE capa_status AS ENUM (
  'open',
  'in_progress',
  'pending_verification',
  'effective',
  'not_effective',
  'closed'
);

-- Environmental monitoring
CREATE TYPE iso_classification AS ENUM (
  'iso_5',            -- laminar flow hoods, isolators
  'iso_7',            -- buffer/cleanroom
  'iso_8',            -- ante room
  'unclassified'
);

CREATE TYPE room_type AS ENUM (
  'compounding',
  'ante_room',
  'warehouse',
  'dock',
  'lab',
  'office',
  'storage'
);

CREATE TYPE sample_type AS ENUM (
  'viable_air',       -- settle plates, active air
  'non_viable_air',   -- particle counter
  'surface',          -- contact plates, swabs
  'personnel_glove',  -- gloved fingertip
  'personnel_gown'    -- gown sampling
);

CREATE TYPE sample_status AS ENUM (
  'scheduled',
  'collected',
  'incubating',       -- 7-day incubation for viable
  'results_entered',
  'within_limits',
  'alert_limit',
  'action_limit',
  'excursion_opened'
);

-- Equipment
CREATE TYPE equipment_status AS ENUM (
  'qualified',        -- IQ/OQ/PQ complete, in validated state
  'in_use',
  'calibration_due',
  'out_of_calibration',
  'under_maintenance',
  'out_of_service',
  'retired'
);

CREATE TYPE equipment_type AS ENUM (
  'ph_meter',
  'balance',
  'autoclave',
  'laminar_flow_hood',
  'isolator',
  'colonnar_filler',
  'peristaltic_pump',
  'particle_counter',
  'pressure_gauge',
  'temperature_probe',
  'humidity_sensor',
  'refrigerator',
  'freezer',
  'mixer',
  'sonicator',
  'other'
);

-- Cleaning
CREATE TYPE cleaning_status AS ENUM (
  'scheduled',
  'in_progress',
  'completed',
  'overdue',
  'skipped_approved'
);

-- Shared schedule frequency (used for both cleaning and EM sampling)
CREATE TYPE schedule_frequency AS ENUM (
  'after_each_batch',
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'annually'
);

-- Training
CREATE TYPE training_type AS ENUM (
  'initial',
  'annual_requalification',
  'media_fill',
  'garbing_qualification',
  'aseptic_technique',
  'sop_specific',
  'gmp_general',
  'safety',
  'equipment_specific',
  'hazardous_drug'
);

CREATE TYPE training_status AS ENUM (
  'assigned',
  'in_progress',
  'completed',
  'failed',
  'expired',
  'waived'
);

-- Lab / LIMS
CREATE TYPE test_type AS ENUM (
  'potency',
  'sterility',
  'endotoxin',
  'particulate_matter',
  'ph',
  'osmolality',
  'visual_inspection',
  'container_closure',
  'stability',
  'other'
);

CREATE TYPE lab_sample_status AS ENUM (
  'sampled',
  'awaiting_shipment',
  'shipped',
  'received_by_lab',
  'in_testing',
  'results_received',
  'pass',
  'fail',
  'retest_required'
);

-- Audit trail action
CREATE TYPE audit_action AS ENUM (
  'create',
  'update',
  'delete',
  'soft_delete',
  'restore',
  'sign',
  'login',
  'logout',
  'login_failed',
  'role_change',
  'permission_change',
  'export',
  'print'
);

-- Notification
CREATE TYPE notification_type AS ENUM (
  'batch_assigned',
  'batch_pending_review',
  'batch_released',
  'batch_rejected',
  'deviation_opened',
  'capa_assigned',
  'capa_due_soon',
  'capa_overdue',
  'calibration_due',
  'calibration_overdue',
  'em_alert_limit',
  'em_action_limit',
  'inventory_low_stock',
  'inventory_expired',
  'training_due',
  'training_overdue',
  'cleaning_overdue',
  'document_approval_needed',
  'signature_required'
);

-- Document management
CREATE TYPE document_status AS ENUM (
  'draft',
  'pending_approval',
  'approved',
  'superseded',
  'retired'
);

CREATE TYPE document_type_enum AS ENUM (
  'sop',
  'coa',
  'protocol',
  'report',
  'certificate',
  'policy'
);

-- EM excursion lifecycle
CREATE TYPE excursion_status AS ENUM (
  'open',
  'under_investigation',
  'pending_closure',
  'closed'
);
```

---

## 2. Core Tables

### 2.1 `organizations`

Multi-tenant facility isolation. Each 503B facility is one organization.

| Column                      | Type             | Constraints                              | Description                             |
| --------------------------- | ---------------- | ---------------------------------------- | --------------------------------------- |
| `id`                      | `uuid`         | PK, default `gen_random_uuid()`        | Organization ID                         |
| `name`                    | `varchar(255)` | NOT NULL                                 | Facility legal name                     |
| `fda_registration_number` | `varchar(50)`  | UNIQUE, nullable                         | FDA FEI number                          |
| `dea_number`              | `varchar(50)`  | nullable                                 | DEA registration                        |
| `state_license_number`    | `varchar(100)` | nullable                                 | State board of pharmacy license         |
| `address_line_1`          | `varchar(255)` | NOT NULL                                 | Street address                          |
| `address_line_2`          | `varchar(255)` | nullable                                 | Suite, unit                             |
| `city`                    | `varchar(100)` | NOT NULL                                 | City                                    |
| `state`                   | `varchar(2)`   | NOT NULL                                 | 2-letter state code                     |
| `zip_code`                | `varchar(10)`  | NOT NULL                                 | ZIP code                                |
| `phone`                   | `varchar(20)`  | nullable                                 | Main phone                              |
| `email`                   | `varchar(255)` | nullable                                 | Main email                              |
| `timezone`                | `varchar(50)`  | NOT NULL, default `'America/New_York'` | Facility timezone                       |
| `logo_url`                | `text`         | nullable                                 | Organization logo                       |
| `pk_software_version`     | `varchar(50)`  | nullable                                 | PK Software version in use              |
| `master_control_enabled`  | `boolean`      | default `false`                        | Whether MasterControl is also in use    |
| `iso_classifications`     | `jsonb`        | nullable                                 | Room ISO classification config          |
| `subscription_tier`       | `varchar(50)`  | default `'pilot'`                      | `pilot`, `standard`, `enterprise` |
| `created_at`              | `timestamptz`  | NOT NULL, default `now()`              | Created timestamp                       |
| `updated_at`              | `timestamptz`  | NOT NULL, default `now()`              | Last updated                            |
| `deleted_at`              | `timestamptz`  | nullable                                 | Soft delete                             |

**Indexes:**

- `idx_organizations_fda_reg` ON `fda_registration_number`
- `idx_organizations_state` ON `state`

---

### 2.2 `users`

All personnel in the facility.

| Column                       | Type                     | Constraints                                | Description                             |
| ---------------------------- | ------------------------ | ------------------------------------------ | --------------------------------------- |
| `id`                       | `uuid`                 | PK                                         | User ID                                 |
| `organization_id`          | `uuid`                 | FK →`organizations.id`, NOT NULL        | Tenant scope                            |
| `email`                    | `varchar(255)`         | NOT NULL, UNIQUE per org                   | Login email                             |
| `password_hash`            | `text`                 | NOT NULL                                   | Bcrypt hash                             |
| `first_name`               | `varchar(100)`         | NOT NULL                                   | First name                              |
| `last_name`                | `varchar(100)`         | NOT NULL                                   | Last name                               |
| `role`                     | `user_role`            | NOT NULL                                   | Primary role enum                       |
| `status`                   | `user_status`          | NOT NULL, default `'pending_activation'` | Account status                          |
| `phone`                    | `varchar(20)`          | nullable                                   | Mobile for notifications                |
| `employee_id`              | `varchar(50)`          | nullable, UNIQUE per org                   | Internal employee number                |
| `title`                    | `varchar(100)`         | nullable                                   | Job title                               |
| `department`               | `varchar(100)`         | nullable                                   | Department name                         |
| `license_number`           | `varchar(100)`         | nullable                                   | Pharmacist license (for PIC/pharmacist) |
| `license_state`            | `varchar(2)`           | nullable                                   | License issuing state                   |
| `license_expiry`           | `date`                 | nullable                                   | License expiration                      |
| `qualification_status`     | `qualification_status` | default `'not_started'`                  | Overall qualification                   |
| `media_fill_qualified`     | `boolean`              | default `false`                          | Media fill current?                     |
| `media_fill_expiry`        | `date`                 | nullable                                   | Next media fill due                     |
| `garbing_qualified`        | `boolean`              | default `false`                          | Garbing qualification current?          |
| `garbing_expiry`           | `date`                 | nullable                                   | Next garbing qual due                   |
| `hd_trained`               | `boolean`              | default `false`                          | Hazardous drug trained (USP 800)        |
| `pin_hash`                 | `text`                 | nullable                                   | Hashed PIN for e-signatures             |
| `biometric_enabled`        | `boolean`              | default `false`                          | FaceID/TouchID enabled                  |
| `last_login_at`            | `timestamptz`          | nullable                                   | Last successful login                   |
| `failed_login_count`       | `integer`              | default `0`                              | Consecutive failed logins               |
| `locked_until`             | `timestamptz`          | nullable                                   | Account lock (after N failures)         |
| `avatar_url`               | `text`                 | nullable                                   | Profile picture                         |
| `notification_preferences` | `jsonb`                | default `'{}'`                           | Email/push/in-app prefs                 |
| `created_at`               | `timestamptz`          | NOT NULL, default `now()`                | Created                                 |
| `updated_at`               | `timestamptz`          | NOT NULL, default `now()`                | Updated                                 |
| `deleted_at`               | `timestamptz`          | nullable                                   | Soft delete                             |

**Indexes:**

- `idx_users_org_id` ON `organization_id`
- `idx_users_org_email` UNIQUE ON (`organization_id`, `email`)
- `idx_users_org_employee_id` UNIQUE ON (`organization_id`, `employee_id`) WHERE `employee_id IS NOT NULL`
- `idx_users_role` ON `role`
- `idx_users_status` ON `status`
- `idx_users_media_fill_expiry` ON `media_fill_expiry` WHERE `media_fill_expiry IS NOT NULL`

**RLS Policy:** Users can only see users within their own `organization_id`.

---

## 3. Formula & Batch Tables

### 3.1 `master_formulas`

Versioned compounding formulas. Each product has a master formula with version control.

| Column                        | Type               | Constraints                           | Description                                     |
| ----------------------------- | ------------------ | ------------------------------------- | ----------------------------------------------- |
| `id`                        | `uuid`           | PK                                    | Formula ID                                      |
| `organization_id`           | `uuid`           | FK →`organizations.id`, NOT NULL   | Tenant scope                                    |
| `product_name`              | `varchar(255)`   | NOT NULL                              | e.g., "Famotidine 20mg/mL Injection"            |
| `product_code`              | `varchar(50)`    | NOT NULL, UNIQUE per org              | Internal product code (e.g., "FAM-20-INJ")      |
| `ndc_number`                | `varchar(20)`    | nullable                              | National Drug Code if assigned                  |
| `version`                   | `integer`        | NOT NULL, default `1`               | Version number (1, 2, 3...)                     |
| `version_reason`            | `text`           | nullable                              | Reason for version change                       |
| `status`                    | `formula_status` | NOT NULL, default `'draft'`         | Lifecycle status                                |
| `dosage_form`               | `dosage_form`    | NOT NULL                              | Injectable, ophthalmic, etc.                    |
| `fill_method`               | `fill_method`    | NOT NULL, default `'manual'`        | How it's filled                                 |
| `route_of_administration`   | `varchar(100)`   | NOT NULL                              | IV, IM, SC, topical, etc.                       |
| `strength`                  | `varchar(100)`   | NOT NULL                              | "20mg/mL", "0.5%", etc.                         |
| `fill_volume_ml`            | `decimal(10,3)`  | NOT NULL                              | Target fill volume per unit                     |
| `overfill_percentage`       | `decimal(5,2)`   | default `0`                         | Overfill % for loss during filling              |
| `container_type`            | `varchar(100)`   | NOT NULL                              | "10mL Clear Glass Vial", "50mL Bag"             |
| `closure_type`              | `varchar(100)`   | NOT NULL                              | "20mm Gray Butyl Stopper + Flip-Off Seal"       |
| `batch_size_units`          | `integer`        | NOT NULL                              | Number of units per batch                       |
| `batch_size_volume_ml`      | `decimal(12,3)`  | NOT NULL                              | Total volume per batch                          |
| `target_ph`                 | `decimal(4,2)`   | nullable                              | Target pH value                                 |
| `ph_tolerance_low`          | `decimal(4,2)`   | nullable                              | pH lower limit                                  |
| `ph_tolerance_high`         | `decimal(4,2)`   | nullable                              | pH upper limit                                  |
| `target_osmolality`         | `integer`        | nullable                              | mOsm/kg target                                  |
| `osmolality_tolerance_low`  | `integer`        | nullable                              | Lower limit                                     |
| `osmolality_tolerance_high` | `integer`        | nullable                              | Upper limit                                     |
| `sterile`                   | `boolean`        | NOT NULL, default `true`            | Requires sterile processing?                    |
| `preservative_free`         | `boolean`        | NOT NULL, default `false`           | Preservative-free formulation?                  |
| `hazardous_drug`            | `boolean`        | NOT NULL, default `false`           | USP <800> applies?                              |
| `bud_category`              | `varchar(50)`    | NOT NULL                              | USP <797> BUD category                          |
| `bud_days`                  | `integer`        | NOT NULL                              | Beyond-use date in days                         |
| `bud_storage_conditions`    | `varchar(100)`   | NOT NULL                              | "Refrigerated (2-8°C)", "Room Temp (20-25°C)" |
| `stability_study_ref`       | `varchar(255)`   | nullable                              | Reference to stability study supporting BUD     |
| `special_instructions`      | `text`           | nullable                              | Additional compounding notes                    |
| `pk_software_formula_id`    | `varchar(100)`   | nullable                              | PK Software formula reference                   |
| `approved_by`               | `uuid`           | FK →`users.id`, nullable           | PIC who approved this version                   |
| `approved_at`               | `timestamptz`    | nullable                              | Approval timestamp                              |
| `effective_date`            | `date`           | nullable                              | Date this version becomes active                |
| `superseded_by`             | `uuid`           | FK →`master_formulas.id`, nullable | Pointer to newer version                        |
| `created_by`                | `uuid`           | FK →`users.id`, NOT NULL           | Author                                          |
| `created_at`                | `timestamptz`    | NOT NULL, default `now()`           | Created                                         |
| `updated_at`                | `timestamptz`    | NOT NULL, default `now()`           | Updated                                         |
| `deleted_at`                | `timestamptz`    | nullable                              | Soft delete                                     |

**Indexes:**

- `idx_formulas_org` ON `organization_id`
- `idx_formulas_org_product_code` UNIQUE ON (`organization_id`, `product_code`, `version`)
- `idx_formulas_status` ON `status`
- `idx_formulas_dosage_form` ON `dosage_form`
- `idx_formulas_hazardous` ON `hazardous_drug` WHERE `hazardous_drug = true`

---

### 3.2 `formula_steps`

Ordered steps within a master formula. Each step defines what the technician must do.

| Column                       | Type                  | Constraints                                              | Description                                                                          |
| ---------------------------- | --------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `id`                       | `uuid`              | PK                                                       | Step ID                                                                              |
| `formula_id`               | `uuid`              | FK →`master_formulas.id`, NOT NULL, ON DELETE CASCADE | Parent formula                                                                       |
| `organization_id`          | `uuid`              | FK →`organizations.id`, NOT NULL                      | Tenant scope (denormalized for RLS)                                                  |
| `step_number`              | `integer`           | NOT NULL                                                 | Ordering (1, 2, 3...)                                                                |
| `section`                  | `varchar(100)`      | nullable                                                 | Grouping label ("Preparation", "Admixing", "pH Adjustment", "Filtration", "Filling") |
| `step_type`                | `step_type`         | NOT NULL                                                 | Type of step                                                                         |
| `instruction`              | `text`              | NOT NULL                                                 | Full step instruction text                                                           |
| `short_label`              | `varchar(100)`      | nullable                                                 | Short label for dashboard display                                                    |
| `data_type`                | `step_data_type`    | nullable                                                 | Expected input type (for data_entry/measurement steps)                               |
| `unit`                     | `unit_of_measure`   | nullable                                                 | Unit for the value                                                                   |
| `target_value`             | `decimal(15,5)`     | nullable                                                 | Expected value (for measurement steps)                                               |
| `tolerance_low`            | `decimal(15,5)`     | nullable                                                 | Lower acceptable limit                                                               |
| `tolerance_high`           | `decimal(15,5)`     | nullable                                                 | Upper acceptable limit                                                               |
| `select_options`           | `jsonb`             | nullable                                                 | Options for select/multi_select data type `["Option A", "Option B"]`               |
| `required`                 | `boolean`           | NOT NULL, default `true`                               | Must be completed?                                                                   |
| `requires_signature`       | `boolean`           | NOT NULL, default `false`                              | E-signature required after step?                                                     |
| `signature_meaning`        | `signature_meaning` | nullable                                                 | What does the signature mean?                                                        |
| `requires_witness`         | `boolean`           | NOT NULL, default `false`                              | Second person witness needed?                                                        |
| `requires_barcode_scan`    | `boolean`           | NOT NULL, default `false`                              | Barcode verification step?                                                           |
| `expected_barcode_pattern` | `varchar(255)`      | nullable                                                 | Regex or prefix to validate barcode                                                  |
| `requires_photo`           | `boolean`           | NOT NULL, default `false`                              | Photo capture required?                                                              |
| `timer_duration_seconds`   | `integer`           | nullable                                                 | Duration for timer-type steps                                                        |
| `calculation_formula`      | `text`              | nullable                                                 | JS expression for calculated fields, e.g.,`"{step_3_value} * 0.01"`                |
| `checklist_items`          | `jsonb`             | nullable                                                 | For checklist type:`[{"label": "Verified label", "required": true}]`               |
| `equipment_id`             | `uuid`              | FK →`equipment.id`, nullable                          | Equipment required for this step                                                     |
| `component_id`             | `uuid`              | FK →`formula_components.id`, nullable                 | Linked ingredient for this step                                                      |
| `critical_step`            | `boolean`           | NOT NULL, default `false`                              | Regulatory critical step (highlighted in review)                                     |
| `help_text`                | `text`              | nullable                                                 | Additional guidance for technician                                                   |
| `image_url`                | `text`              | nullable                                                 | Visual reference image                                                               |
| `created_at`               | `timestamptz`       | NOT NULL, default `now()`                              | Created                                                                              |
| `updated_at`               | `timestamptz`       | NOT NULL, default `now()`                              | Updated                                                                              |

**Indexes:**

- `idx_formula_steps_org` ON `organization_id`
- `idx_formula_steps_formula` ON `formula_id`
- `idx_formula_steps_order` UNIQUE ON (`formula_id`, `step_number`)
- `idx_formula_steps_type` ON `step_type`

---

### 3.3 `formula_components`

Bill of materials — ingredients required for a formula.

| Column                   | Type                | Constraints                                              | Description                                     |
| ------------------------ | ------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| `id`                   | `uuid`            | PK                                                       | Component link ID                               |
| `formula_id`           | `uuid`            | FK →`master_formulas.id`, NOT NULL, ON DELETE CASCADE | Parent formula                                  |
| `organization_id`      | `uuid`            | FK →`organizations.id`, NOT NULL                      | Tenant scope (denormalized for RLS)             |
| `inventory_item_id`    | `uuid`            | FK →`inventory_items.id`, NOT NULL                    | Which supply item                               |
| `sort_order`           | `integer`         | NOT NULL                                                 | Display order                                   |
| `quantity_per_batch`   | `decimal(15,5)`   | NOT NULL                                                 | Amount needed per batch                         |
| `unit`                 | `unit_of_measure` | NOT NULL                                                 | Unit of measure                                 |
| `quantity_per_unit`    | `decimal(15,5)`   | nullable                                                 | Amount per individual unit (vial)               |
| `is_active_ingredient` | `boolean`         | NOT NULL, default `false`                              | API vs excipient                                |
| `is_critical`          | `boolean`         | NOT NULL, default `false`                              | Critical material (requires extra verification) |
| `overage_percentage`   | `decimal(5,2)`    | default `0`                                            | Standard overage %                              |
| `substitutes_allowed`  | `boolean`         | default `false`                                        | Can use alternate vendor lot?                   |
| `notes`                | `text`            | nullable                                                 | Special handling notes                          |
| `created_at`           | `timestamptz`     | NOT NULL, default `now()`                              | Created                                         |

**Indexes:**

- `idx_formula_components_org` ON `organization_id`
- `idx_formula_components_formula` ON `formula_id`
- `idx_formula_components_item` ON `inventory_item_id`

---

### 3.4 `batches`

Active and completed batch records. The core transactional table.

| Column                       | Type              | Constraints                           | Description                                            |
| ---------------------------- | ----------------- | ------------------------------------- | ------------------------------------------------------ |
| `id`                       | `uuid`          | PK                                    | Batch record ID                                        |
| `organization_id`          | `uuid`          | FK →`organizations.id`, NOT NULL   | Tenant scope                                           |
| `formula_id`               | `uuid`          | FK →`master_formulas.id`, NOT NULL | Which formula version                                  |
| `batch_number`             | `varchar(50)`   | NOT NULL, UNIQUE per org              | e.g., "2026-0847"                                      |
| `status`                   | `batch_status`  | NOT NULL, default `'draft'`         | Lifecycle status                                       |
| `priority`                 | `integer`       | default `0`                         | 0=normal, 1=high, 2=urgent                             |
| `scheduled_date`           | `date`          | nullable                              | When batch is planned                                  |
| `batch_size_units`         | `integer`       | NOT NULL                              | Actual planned units (may differ from formula default) |
| `batch_size_volume_ml`     | `decimal(12,3)` | NOT NULL                              | Total planned volume                                   |
| `actual_yield_units`       | `integer`       | nullable                              | Actual units produced                                  |
| `actual_yield_volume_ml`   | `decimal(12,3)` | nullable                              | Actual total volume                                    |
| `yield_percentage`         | `decimal(5,2)`  | nullable                              | Calculated yield %                                     |
| `room_id`                  | `uuid`          | FK →`rooms.id`, nullable           | Cleanroom where compounded                             |
| `hood_id`                  | `uuid`          | FK →`equipment.id`, nullable       | Specific ISO 5 hood used                               |
| `compounding_started_at`   | `timestamptz`   | nullable                              | When first step was started                            |
| `compounding_completed_at` | `timestamptz`   | nullable                              | When last step was completed                           |
| `filling_started_at`       | `timestamptz`   | nullable                              | Filling operation start                                |
| `filling_completed_at`     | `timestamptz`   | nullable                              | Filling operation end                                  |
| `visual_inspection_at`     | `timestamptz`   | nullable                              | Visual inspection completion                           |
| `labeling_completed_at`    | `timestamptz`   | nullable                              | Labeling completion                                    |
| `submitted_for_review_at`  | `timestamptz`   | nullable                              | When sent to QA                                        |
| `review_started_at`        | `timestamptz`   | nullable                              | When QA started reviewing                              |
| `reviewed_at`              | `timestamptz`   | nullable                              | QA review completion                                   |
| `reviewed_by`              | `uuid`          | FK →`users.id`, nullable           | QA reviewer                                            |
| `review_notes`             | `text`          | nullable                              | QA reviewer notes                                      |
| `released_at`              | `timestamptz`   | nullable                              | PIC final release timestamp                            |
| `released_by`              | `uuid`          | FK →`users.id`, nullable           | PIC who released                                       |
| `rejected_at`              | `timestamptz`   | nullable                              | If rejected                                            |
| `rejected_by`              | `uuid`          | FK →`users.id`, nullable           | Who rejected                                           |
| `rejection_reason`         | `text`          | nullable                              | Reason for rejection                                   |
| `bud_date`                 | `date`          | nullable                              | Calculated Beyond-Use Date                             |
| `manufacture_date`         | `date`          | nullable                              | Date of manufacture                                    |
| `expiry_date`              | `date`          | nullable                              | Expiry date (if different from BUD)                    |
| `storage_conditions`       | `varchar(100)`  | nullable                              | "Refrigerated (2-8°C)"                                |
| `pk_software_batch_ref`    | `varchar(100)`  | nullable                              | PK Software batch reference                            |
| `deviation_count`          | `integer`       | default `0`                         | Number of deviations raised                            |
| `has_open_deviation`       | `boolean`       | default `false`                     | Quick filter flag                                      |
| `current_step_number`      | `integer`       | default `0`                         | Progress tracking                                      |
| `total_steps`              | `integer`       | NOT NULL                              | Total steps from formula                               |
| `assigned_technicians`     | `uuid[]`        | nullable                              | Array of assigned technician user IDs                  |
| `notes`                    | `text`          | nullable                              | General batch notes                                    |
| `created_by`               | `uuid`          | FK →`users.id`, NOT NULL           | Who created the batch                                  |
| `created_at`               | `timestamptz`   | NOT NULL, default `now()`           | Created                                                |
| `updated_at`               | `timestamptz`   | NOT NULL, default `now()`           | Updated                                                |
| `deleted_at`               | `timestamptz`   | nullable                              | Soft delete                                            |

**Indexes:**

- `idx_batches_org` ON `organization_id`
- `idx_batches_org_number` UNIQUE ON (`organization_id`, `batch_number`)
- `idx_batches_status` ON `status`
- `idx_batches_formula` ON `formula_id`
- `idx_batches_room` ON `room_id`
- `idx_batches_scheduled_date` ON `scheduled_date`
- `idx_batches_has_deviation` ON `has_open_deviation` WHERE `has_open_deviation = true`
- `idx_batches_released_at` ON `released_at` WHERE `released_at IS NOT NULL`
- `idx_batches_bud_date` ON `bud_date`

---

### 3.5 `batch_step_records`

Execution data for each step in a batch. One row per formula step per batch.

| Column                   | Type                  | Constraints                                      | Description                                                         |
| ------------------------ | --------------------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| `id`                   | `uuid`              | PK                                               | Record ID                                                           |
| `batch_id`             | `uuid`              | FK →`batches.id`, NOT NULL, ON DELETE CASCADE | Parent batch                                                        |
| `organization_id`      | `uuid`              | FK →`organizations.id`, NOT NULL              | Tenant scope (denormalized for RLS)                                 |
| `formula_step_id`      | `uuid`              | FK →`formula_steps.id`, NOT NULL              | Which formula step                                                  |
| `step_number`          | `integer`           | NOT NULL                                         | Denormalized for quick ordering                                     |
| `status`               | `step_status`       | NOT NULL, default `'pending'`                  | Completion status                                                   |
| `entered_value`        | `text`              | nullable                                         | Raw entered value (stored as text, parsed by data_type)             |
| `entered_numeric`      | `decimal(15,5)`     | nullable                                         | Parsed numeric value (for tolerance checks)                         |
| `entered_unit`         | `unit_of_measure`   | nullable                                         | Unit of the entered value                                           |
| `within_tolerance`     | `boolean`           | nullable                                         | `true` if value is within spec, `false` if OOS, `null` if N/A |
| `calculated_value`     | `decimal(15,5)`     | nullable                                         | Auto-calculated result                                              |
| `barcode_scanned`      | `varchar(255)`      | nullable                                         | Barcode value scanned                                               |
| `barcode_matched`      | `boolean`           | nullable                                         | Did barcode match expected?                                         |
| `photo_url`            | `text`              | nullable                                         | Uploaded photo path                                                 |
| `photo_caption`        | `varchar(255)`      | nullable                                         | Photo description                                                   |
| `checklist_responses`  | `jsonb`             | nullable                                         | `[{"label": "...", "checked": true}]`                             |
| `timer_started_at`     | `timestamptz`       | nullable                                         | Timer start                                                         |
| `timer_ended_at`       | `timestamptz`       | nullable                                         | Timer end                                                           |
| `timer_actual_seconds` | `integer`           | nullable                                         | Actual duration                                                     |
| `deviation_id`         | `uuid`              | FK →`deviations.id`, nullable                 | If a deviation was raised                                           |
| `performed_by`         | `uuid`              | FK →`users.id`, nullable                      | Who performed this step                                             |
| `performed_at`         | `timestamptz`       | nullable                                         | When step was completed                                             |
| `signed_by`            | `uuid`              | FK →`users.id`, nullable                      | Who signed (if signature required)                                  |
| `signed_at`            | `timestamptz`       | nullable                                         | Signature timestamp                                                 |
| `signature_meaning`    | `signature_meaning` | nullable                                         | Meaning of signature                                                |
| `witnessed_by`         | `uuid`              | FK →`users.id`, nullable                      | Witness (if required)                                               |
| `witnessed_at`         | `timestamptz`       | nullable                                         | Witness timestamp                                                   |
| `notes`                | `text`              | nullable                                         | Step-level notes                                                    |
| `ip_address`           | `inet`              | nullable                                         | Device IP (for audit)                                               |
| `device_id`            | `varchar(255)`      | nullable                                         | iPad/device identifier                                              |
| `created_at`           | `timestamptz`       | NOT NULL, default `now()`                      | Created                                                             |
| `updated_at`           | `timestamptz`       | NOT NULL, default `now()`                      | Updated                                                             |

**Indexes:**

- `idx_batch_steps_org` ON `organization_id`
- `idx_batch_steps_batch` ON `batch_id`
- `idx_batch_steps_order` UNIQUE ON (`batch_id`, `step_number`)
- `idx_batch_steps_status` ON `status`
- `idx_batch_steps_deviation` ON `deviation_id` WHERE `deviation_id IS NOT NULL`
- `idx_batch_steps_performed_by` ON `performed_by`

---

### 3.6 `batch_components_used`

Actual materials consumed per batch. Links batch → inventory lot with exact quantities.

| Column                   | Type                | Constraints                              | Description                          |
| ------------------------ | ------------------- | ---------------------------------------- | ------------------------------------ |
| `id`                   | `uuid`            | PK                                       | Usage record ID                      |
| `batch_id`             | `uuid`            | FK →`batches.id`, NOT NULL            | Parent batch                         |
| `formula_component_id` | `uuid`            | FK →`formula_components.id`, NOT NULL | Expected component                   |
| `inventory_lot_id`     | `uuid`            | FK →`inventory_lots.id`, NOT NULL     | Actual lot used                      |
| `quantity_required`    | `decimal(15,5)`   | NOT NULL                                 | Required per formula                 |
| `quantity_used`        | `decimal(15,5)`   | NOT NULL                                 | Actually used                        |
| `unit`                 | `unit_of_measure` | NOT NULL                                 | Unit                                 |
| `barcode_verified`     | `boolean`         | NOT NULL, default `false`              | Was barcode scanned & verified?      |
| `barcode_value`        | `varchar(255)`    | nullable                                 | Scanned barcode                      |
| `scanned_by`           | `uuid`            | FK →`users.id`, nullable              | Who scanned                          |
| `scanned_at`           | `timestamptz`     | nullable                                 | When scanned                         |
| `batch_step_record_id` | `uuid`            | FK →`batch_step_records.id`, nullable | Which step consumed this             |
| `notes`                | `text`            | nullable                                 | Any notes (e.g., "used partial lot") |
| `created_at`           | `timestamptz`     | NOT NULL, default `now()`              | Created                              |

**Indexes:**

- `idx_batch_components_batch` ON `batch_id`
- `idx_batch_components_lot` ON `inventory_lot_id`

---

### 3.7 `e_signatures`

21 CFR Part 11 compliant electronic signatures. Immutable log.

| Column                 | Type                  | Constraints                         | Description                                                     |
| ---------------------- | --------------------- | ----------------------------------- | --------------------------------------------------------------- |
| `id`                 | `uuid`              | PK                                  | Signature ID                                                    |
| `organization_id`    | `uuid`              | FK →`organizations.id`, NOT NULL | Tenant scope                                                    |
| `signer_id`          | `uuid`              | FK →`users.id`, NOT NULL         | Who signed                                                      |
| `signer_name`        | `varchar(255)`      | NOT NULL                            | Full name at time of signing (denormalized for immutability)    |
| `signer_role`        | `user_role`         | NOT NULL                            | Role at time of signing                                         |
| `signer_title`       | `varchar(100)`      | nullable                            | Job title at time of signing                                    |
| `meaning`            | `signature_meaning` | NOT NULL                            | What this signature means                                       |
| `table_name`         | `varchar(100)`      | NOT NULL                            | Which table this signature applies to                           |
| `record_id`          | `uuid`              | NOT NULL                            | PK of the signed record                                         |
| `field_name`         | `varchar(100)`      | nullable                            | Specific field signed (if applicable)                           |
| `auth_method`        | `varchar(20)`       | NOT NULL                            | `'pin'`, `'biometric'`, `'pin+biometric'`, `'password'` |
| `ip_address`         | `inet`              | NOT NULL                            | Device IP address                                               |
| `device_id`          | `varchar(255)`      | nullable                            | iPad or browser identifier                                      |
| `user_agent`         | `text`              | nullable                            | Browser/app user agent                                          |
| `timestamp`          | `timestamptz`       | NOT NULL, default `now()`         | Exact moment of signature                                       |
| `is_valid`           | `boolean`           | NOT NULL, default `true`          | If invalidated by admin                                         |
| `invalidated_reason` | `text`              | nullable                            | Why invalidated                                                 |

**Indexes:**

- `idx_esig_org` ON `organization_id`
- `idx_esig_signer` ON `signer_id`
- `idx_esig_record` ON (`table_name`, `record_id`)
- `idx_esig_timestamp` ON `timestamp`

**Immutability:** No UPDATE or DELETE allowed. Invalidation sets `is_valid = false` with reason.

---

## 4. Inventory Tables

### 4.1 `vendors`

| Column                  | Type             | Constraints                         | Description               |
| ----------------------- | ---------------- | ----------------------------------- | ------------------------- |
| `id`                  | `uuid`         | PK                                  | Vendor ID                 |
| `organization_id`     | `uuid`         | FK →`organizations.id`, NOT NULL | Tenant scope              |
| `name`                | `varchar(255)` | NOT NULL                            | Vendor company name       |
| `vendor_code`         | `varchar(50)`  | UNIQUE per org                      | Internal vendor code      |
| `contact_name`        | `varchar(255)` | nullable                            | Primary contact           |
| `contact_email`       | `varchar(255)` | nullable                            | Contact email             |
| `contact_phone`       | `varchar(20)`  | nullable                            | Contact phone             |
| `address`             | `text`         | nullable                            | Full address              |
| `website`             | `varchar(255)` | nullable                            | Vendor website            |
| `is_approved`         | `boolean`      | default `false`                   | QA-approved vendor?       |
| `approved_by`         | `uuid`         | FK →`users.id`, nullable         | Who approved              |
| `approved_at`         | `timestamptz`  | nullable                            | When approved             |
| `qualification_date`  | `date`         | nullable                            | Last vendor qualification |
| `requalification_due` | `date`         | nullable                            | Next requalification      |
| `notes`               | `text`         | nullable                            | Vendor notes              |
| `created_at`          | `timestamptz`  | NOT NULL, default `now()`         | Created                   |
| `updated_at`          | `timestamptz`  | NOT NULL, default `now()`         | Updated                   |
| `deleted_at`          | `timestamptz`  | nullable                            | Soft delete               |

**Indexes:** `idx_vendors_org` ON `organization_id`, `idx_vendors_approved` ON `is_approved`

---

### 4.2 `inventory_items`

Master catalog of all components and supplies.

| Column                   | Type                | Constraints                         | Description                                      |
| ------------------------ | ------------------- | ----------------------------------- | ------------------------------------------------ |
| `id`                   | `uuid`            | PK                                  | Item ID                                          |
| `organization_id`      | `uuid`            | FK →`organizations.id`, NOT NULL | Tenant scope                                     |
| `name`                 | `varchar(255)`    | NOT NULL                            | "Famotidine USP Powder", "10mL Clear Glass Vial" |
| `item_code`            | `varchar(50)`     | NOT NULL, UNIQUE per org            | Internal SKU                                     |
| `category`             | `item_category`   | NOT NULL                            | API, excipient, container, etc.                  |
| `description`          | `text`            | nullable                            | Detailed description                             |
| `default_unit`         | `unit_of_measure` | NOT NULL                            | Default UOM                                      |
| `cas_number`           | `varchar(50)`     | nullable                            | CAS registry number (for chemicals)              |
| `barcode_prefix`       | `varchar(50)`     | nullable                            | Expected barcode format                          |
| `preferred_vendor_id`  | `uuid`            | FK →`vendors.id`, nullable       | Default vendor                                   |
| `safety_stock_level`   | `decimal(15,5)`   | nullable                            | Minimum stock before alert                       |
| `reorder_point`        | `decimal(15,5)`   | nullable                            | When to trigger reorder                          |
| `reorder_quantity`     | `decimal(15,5)`   | nullable                            | Standard reorder amount                          |
| `lead_time_days`       | `integer`         | nullable                            | Vendor lead time                                 |
| `storage_conditions`   | `varchar(100)`    | nullable                            | "Room Temp", "Refrigerated", "Freezer"           |
| `storage_location`     | `varchar(100)`    | nullable                            | Default shelf/bin location                       |
| `requires_coa`         | `boolean`         | default `true`                    | Requires Certificate of Analysis?                |
| `requires_qc_testing`  | `boolean`         | default `false`                   | Requires in-house testing before release?        |
| `hazardous`            | `boolean`         | default `false`                   | Hazardous material (USP <800>)                   |
| `controlled_substance` | `boolean`         | default `false`                   | DEA scheduled?                                   |
| `dea_schedule`         | `varchar(10)`     | nullable                            | "II", "III", "IV", "V"                           |
| `unit_cost`            | `decimal(10,2)`   | nullable                            | Last known unit cost                             |
| `is_active`            | `boolean`         | default `true`                    | Currently in use?                                |
| `created_at`           | `timestamptz`     | NOT NULL, default `now()`         | Created                                          |
| `updated_at`           | `timestamptz`     | NOT NULL, default `now()`         | Updated                                          |
| `deleted_at`           | `timestamptz`     | nullable                            | Soft delete                                      |

**Indexes:** `idx_inv_items_org` ON `organization_id`, `idx_inv_items_code` UNIQUE ON (`organization_id`, `item_code`), `idx_inv_items_category` ON `category`, `idx_inv_items_vendor` ON `preferred_vendor_id`

---

### 4.3 `inventory_lots`

Specific received lots with tracking.

| Column                 | Type                | Constraints                           | Description                  |
| ---------------------- | ------------------- | ------------------------------------- | ---------------------------- |
| `id`                 | `uuid`            | PK                                    | Lot ID                       |
| `inventory_item_id`  | `uuid`            | FK →`inventory_items.id`, NOT NULL | Parent item                  |
| `organization_id`    | `uuid`            | FK →`organizations.id`, NOT NULL   | Tenant scope                 |
| `lot_number`         | `varchar(100)`    | NOT NULL                              | Vendor lot number            |
| `vendor_id`          | `uuid`            | FK →`vendors.id`, nullable         | Vendor for this lot          |
| `status`             | `lot_status`      | NOT NULL, default `'quarantined'`   | Lifecycle status             |
| `quantity_received`  | `decimal(15,5)`   | NOT NULL                              | Original received qty        |
| `quantity_available` | `decimal(15,5)`   | NOT NULL                              | Current available qty        |
| `quantity_consumed`  | `decimal(15,5)`   | default `0`                         | Total consumed               |
| `quantity_wasted`    | `decimal(15,5)`   | default `0`                         | Waste/disposal qty           |
| `unit`               | `unit_of_measure` | NOT NULL                              | UOM                          |
| `manufacture_date`   | `date`            | nullable                              | Vendor manufacture date      |
| `expiry_date`        | `date`            | NOT NULL                              | Expiration date              |
| `retest_date`        | `date`            | nullable                              | Retest date (if applicable)  |
| `received_date`      | `date`            | NOT NULL                              | Date received at facility    |
| `received_by`        | `uuid`            | FK →`users.id`, NOT NULL           | Who received                 |
| `po_number`          | `varchar(50)`     | nullable                              | Purchase order reference     |
| `coa_document_id`    | `uuid`            | FK →`documents.id`, nullable       | Certificate of Analysis      |
| `coa_verified`       | `boolean`         | default `false`                     | COA reviewed and accepted?   |
| `coa_verified_by`    | `uuid`            | FK →`users.id`, nullable           | Who verified COA             |
| `qc_released`        | `boolean`         | default `false`                     | QC testing passed?           |
| `qc_released_by`     | `uuid`            | FK →`users.id`, nullable           | Who released from QC         |
| `qc_released_at`     | `timestamptz`     | nullable                              | When QC released             |
| `storage_location`   | `varchar(100)`    | nullable                              | Shelf/bin/rack location      |
| `barcode`            | `varchar(255)`    | nullable                              | Barcode on this specific lot |
| `unit_cost`          | `decimal(10,2)`   | nullable                              | Cost per unit for this lot   |
| `notes`              | `text`            | nullable                              | Lot-specific notes           |
| `created_at`         | `timestamptz`     | NOT NULL, default `now()`           | Created                      |
| `updated_at`         | `timestamptz`     | NOT NULL, default `now()`           | Updated                      |

**Indexes:** `idx_inv_lots_item` ON `inventory_item_id`, `idx_inv_lots_org` ON `organization_id`, `idx_inv_lots_status` ON `status`, `idx_inv_lots_expiry` ON `expiry_date`, `idx_inv_lots_barcode` ON `barcode`

---

### 4.4 `inventory_transactions`

Immutable ledger of every inventory movement.

| Column               | Type                 | Constraints                          | Description                                |
| -------------------- | -------------------- | ------------------------------------ | ------------------------------------------ |
| `id`               | `uuid`             | PK                                   | Transaction ID                             |
| `organization_id`  | `uuid`             | FK →`organizations.id`, NOT NULL  | Tenant scope                               |
| `inventory_lot_id` | `uuid`             | FK →`inventory_lots.id`, NOT NULL | Which lot                                  |
| `transaction_type` | `transaction_type` | NOT NULL                             | Type of movement                           |
| `quantity`         | `decimal(15,5)`    | NOT NULL                             | Amount (positive for in, negative for out) |
| `unit`             | `unit_of_measure`  | NOT NULL                             | UOM                                        |
| `balance_after`    | `decimal(15,5)`    | NOT NULL                             | Running balance after this txn             |
| `batch_id`         | `uuid`             | FK →`batches.id`, nullable        | If issued to a batch                       |
| `reference_type`   | `varchar(50)`      | nullable                             | "batch", "disposal", "count_adjustment"    |
| `reference_id`     | `uuid`             | nullable                             | ID of related record                       |
| `reason`           | `text`             | nullable                             | Reason (required for adjustments)          |
| `performed_by`     | `uuid`             | FK →`users.id`, NOT NULL          | Who performed                              |
| `performed_at`     | `timestamptz`      | NOT NULL, default `now()`          | When                                       |
| `created_at`       | `timestamptz`      | NOT NULL, default `now()`          | Created                                    |

**Indexes:** `idx_inv_txn_lot` ON `inventory_lot_id`, `idx_inv_txn_org` ON `organization_id`, `idx_inv_txn_type` ON `transaction_type`, `idx_inv_txn_batch` ON `batch_id`

**Immutability:** INSERT only. No UPDATE or DELETE.

---

## 5. Facility & Environmental Monitoring Tables

### 5.1 `rooms`

Cleanroom and facility room registry.

| Column                     | Type                   | Constraints                         | Description                                    |
| -------------------------- | ---------------------- | ----------------------------------- | ---------------------------------------------- |
| `id`                     | `uuid`               | PK                                  | Room ID                                        |
| `organization_id`        | `uuid`               | FK →`organizations.id`, NOT NULL | Tenant scope                                   |
| `name`                   | `varchar(100)`       | NOT NULL                            | "Buffer Room A", "Ante Room 1", "ISO 5 Hood A" |
| `room_code`              | `varchar(20)`        | UNIQUE per org                      | Short code (e.g., "BR-A")                      |
| `room_type`              | `room_type`          | NOT NULL                            | Compounding, ante, warehouse, etc.             |
| `iso_classification`     | `iso_classification` | NOT NULL                            | ISO 5, 7, 8, unclassified                      |
| `parent_room_id`         | `uuid`               | FK →`rooms.id`, nullable         | e.g., ISO 5 hood inside ISO 7 room             |
| `pressure_type`          | `varchar(20)`        | nullable                            | "positive", "negative" (for HD rooms)          |
| `target_temperature_c`   | `decimal(4,1)`       | nullable                            | Target temp                                    |
| `temperature_range_low`  | `decimal(4,1)`       | nullable                            | Low limit                                      |
| `temperature_range_high` | `decimal(4,1)`       | nullable                            | High limit                                     |
| `target_humidity_pct`    | `decimal(4,1)`       | nullable                            | Target humidity %                              |
| `humidity_range_low`     | `decimal(4,1)`       | nullable                            | Low limit                                      |
| `humidity_range_high`    | `decimal(4,1)`       | nullable                            | High limit                                     |
| `target_pressure_pa`     | `decimal(6,1)`       | nullable                            | Target differential pressure (Pa)              |
| `pressure_range_low`     | `decimal(6,1)`       | nullable                            | Low limit                                      |
| `pressure_range_high`    | `decimal(6,1)`       | nullable                            | High limit                                     |
| `hazardous_drug_room`    | `boolean`            | default `false`                   | USP <800> HD room?                             |
| `qr_code`                | `varchar(255)`       | nullable                            | QR code for room scanning                      |
| `is_active`              | `boolean`            | default `true`                    | Currently in use?                              |
| `notes`                  | `text`               | nullable                            | Room notes                                     |
| `created_at`             | `timestamptz`        | NOT NULL, default `now()`         | Created                                        |
| `updated_at`             | `timestamptz`        | NOT NULL, default `now()`         | Updated                                        |

**Indexes:** `idx_rooms_org` ON `organization_id`, `idx_rooms_iso` ON `iso_classification`, `idx_rooms_type` ON `room_type`

---

### 5.2 `em_locations`

Specific sampling points within rooms.

| Column                      | Type                   | Constraints                         | Description                     |
| --------------------------- | ---------------------- | ----------------------------------- | ------------------------------- |
| `id`                      | `uuid`               | PK                                  | Location ID                     |
| `room_id`                 | `uuid`               | FK →`rooms.id`, NOT NULL         | Parent room                     |
| `organization_id`         | `uuid`               | FK →`organizations.id`, NOT NULL | Tenant scope                    |
| `name`                    | `varchar(100)`       | NOT NULL                            | "Hood A - Left", "Wall B - 3ft" |
| `location_code`           | `varchar(20)`        | UNIQUE per org                      | "EM-BR-A-01"                    |
| `sample_type`             | `sample_type`        | NOT NULL                            | viable_air, surface, etc.       |
| `alert_limit`             | `integer`            | NOT NULL                            | Alert CFU threshold             |
| `action_limit`            | `integer`            | NOT NULL                            | Action CFU threshold            |
| `non_viable_alert_0_5um`  | `integer`            | nullable                            | Non-viable ≥0.5μm alert       |
| `non_viable_action_0_5um` | `integer`            | nullable                            | Non-viable ≥0.5μm action      |
| `non_viable_alert_5_0um`  | `integer`            | nullable                            | Non-viable ≥5.0μm alert       |
| `non_viable_action_5_0um` | `integer`            | nullable                            | Non-viable ≥5.0μm action      |
| `sampling_frequency`      | `schedule_frequency` | NOT NULL                            | How often sampled               |
| `qr_code`                 | `varchar(255)`       | nullable                            | QR code at location             |
| `is_active`               | `boolean`            | default `true`                    | Currently monitored?            |
| `created_at`              | `timestamptz`        | NOT NULL, default `now()`         | Created                         |
| `updated_at`              | `timestamptz`        | NOT NULL, default `now()`         | Updated                         |

**Indexes:** `idx_em_loc_room` ON `room_id`, `idx_em_loc_org` ON `organization_id`, `idx_em_loc_type` ON `sample_type`

---

### 5.3 `em_samples`

Environmental monitoring sample results.

| Column                      | Type              | Constraints                         | Description                             |
| --------------------------- | ----------------- | ----------------------------------- | --------------------------------------- |
| `id`                      | `uuid`          | PK                                  | Sample ID                               |
| `organization_id`         | `uuid`          | FK →`organizations.id`, NOT NULL | Tenant scope                            |
| `em_location_id`          | `uuid`          | FK →`em_locations.id`, NOT NULL  | Sampling point                          |
| `room_id`                 | `uuid`          | FK →`rooms.id`, NOT NULL         | Room (denormalized for queries)         |
| `sample_date`             | `date`          | NOT NULL                            | Date sampled                            |
| `sample_time`             | `time`          | NOT NULL                            | Time sampled                            |
| `sample_type`             | `sample_type`   | NOT NULL                            | Denormalized from location              |
| `status`                  | `sample_status` | NOT NULL, default `'scheduled'`   | Lifecycle                               |
| `collected_by`            | `uuid`          | FK →`users.id`, nullable         | Who collected                           |
| `collected_at`            | `timestamptz`   | nullable                            | When collected                          |
| `media_type`              | `varchar(100)`  | nullable                            | "TSA Settle Plate", "SDA Contact Plate" |
| `media_lot`               | `varchar(100)`  | nullable                            | Media lot number                        |
| `incubation_start`        | `timestamptz`   | nullable                            | Incubation period start                 |
| `incubation_end_expected` | `timestamptz`   | nullable                            | Expected read date (7/14 days)          |
| `viable_count_cfu`        | `integer`       | nullable                            | Colony forming units                    |
| `non_viable_0_5um`        | `integer`       | nullable                            | Particles ≥0.5μm per m³              |
| `non_viable_5_0um`        | `integer`       | nullable                            | Particles ≥5.0μm per m³              |
| `organism_identified`     | `varchar(255)`  | nullable                            | Organism ID if positive                 |
| `results_entered_by`      | `uuid`          | FK →`users.id`, nullable         | Who entered results                     |
| `results_entered_at`      | `timestamptz`   | nullable                            | When results entered                    |
| `exceeds_alert`           | `boolean`       | default `false`                   | Alert limit breached?                   |
| `exceeds_action`          | `boolean`       | default `false`                   | Action limit breached?                  |
| `excursion_id`            | `uuid`          | FK →`em_excursions.id`, nullable | Linked excursion                        |
| `deviation_id`            | `uuid`          | FK →`deviations.id`, nullable    | Linked deviation                        |
| `notes`                   | `text`          | nullable                            | Sample notes                            |
| `created_at`              | `timestamptz`   | NOT NULL, default `now()`         | Created                                 |
| `updated_at`              | `timestamptz`   | NOT NULL, default `now()`         | Updated                                 |

**Indexes:** `idx_em_samples_org` ON `organization_id`, `idx_em_samples_location` ON `em_location_id`, `idx_em_samples_date` ON `sample_date`, `idx_em_samples_status` ON `status`, `idx_em_samples_exceeds` ON `exceeds_action` WHERE `exceeds_action = true`

---

### 5.4 `em_excursions`

Investigation records when EM limits are breached.

| Column                | Type                 | Constraints                         | Description                         |
| --------------------- | -------------------- | ----------------------------------- | ----------------------------------- |
| `id`                | `uuid`             | PK                                  | Excursion ID                        |
| `organization_id`   | `uuid`             | FK →`organizations.id`, NOT NULL | Tenant scope                        |
| `em_sample_id`      | `uuid`             | FK →`em_samples.id`, NOT NULL    | Triggering sample                   |
| `room_id`           | `uuid`             | FK →`rooms.id`, NOT NULL         | Affected room                       |
| `excursion_type`    | `varchar(20)`      | NOT NULL                            | "alert" or "action"                 |
| `status`            | `excursion_status` | NOT NULL, default `'open'`        | Lifecycle status                    |
| `excursion_start`   | `timestamptz`      | NOT NULL                            | When detected                       |
| `excursion_end`     | `timestamptz`      | nullable                            | When resolved                       |
| `affected_batches`  | `uuid[]`           | nullable                            | Batch IDs in the room during window |
| `impact_assessment` | `text`             | nullable                            | Assessment of product impact        |
| `root_cause`        | `text`             | nullable                            | Root cause determination            |
| `corrective_action` | `text`             | nullable                            | Actions taken                       |
| `investigated_by`   | `uuid`             | FK →`users.id`, nullable         | Investigator                        |
| `closed_by`         | `uuid`             | FK →`users.id`, nullable         | Who closed                          |
| `closed_at`         | `timestamptz`      | nullable                            | When closed                         |
| `deviation_id`      | `uuid`             | FK →`deviations.id`, nullable    | Linked formal deviation             |
| `created_at`        | `timestamptz`      | NOT NULL, default `now()`         | Created                             |
| `updated_at`        | `timestamptz`      | NOT NULL, default `now()`         | Updated                             |

**Indexes:** `idx_em_exc_org` ON `organization_id`, `idx_em_exc_room` ON `room_id`, `idx_em_exc_sample` ON `em_sample_id`

---

## 6. Quality Management Tables

### 6.1 `deviations`

| Column                     | Type                   | Constraints                         | Description                                                      |
| -------------------------- | ---------------------- | ----------------------------------- | ---------------------------------------------------------------- |
| `id`                     | `uuid`               | PK                                  | Deviation ID                                                     |
| `organization_id`        | `uuid`               | FK →`organizations.id`, NOT NULL | Tenant scope                                                     |
| `deviation_number`       | `varchar(50)`        | UNIQUE per org                      | Auto-generated "DEV-2026-001"                                    |
| `title`                  | `varchar(255)`       | NOT NULL                            | Short description                                                |
| `description`            | `text`               | NOT NULL                            | Full description                                                 |
| `source`                 | `deviation_source`   | NOT NULL                            | Where it originated                                              |
| `severity`               | `deviation_severity` | NOT NULL                            | Critical, major, minor                                           |
| `status`                 | `deviation_status`   | NOT NULL, default `'open'`        | Lifecycle                                                        |
| `source_batch_id`        | `uuid`               | FK →`batches.id`, nullable       | Related batch                                                    |
| `source_em_sample_id`    | `uuid`               | FK →`em_samples.id`, nullable    | Related EM sample                                                |
| `source_equipment_id`    | `uuid`               | FK →`equipment.id`, nullable     | Related equipment                                                |
| `root_cause_category`    | `varchar(100)`       | nullable                            | "Human Error", "Equipment", "Material", "Process", "Environment" |
| `root_cause_description` | `text`               | nullable                            | Detailed root cause                                              |
| `immediate_action`       | `text`               | nullable                            | Immediate corrective action taken                                |
| `product_impact`         | `text`               | nullable                            | Impact on product quality                                        |
| `patient_impact`         | `boolean`            | default `false`                   | Any patient safety impact?                                       |
| `reported_by`            | `uuid`               | FK →`users.id`, NOT NULL         | Who identified                                                   |
| `reported_at`            | `timestamptz`        | NOT NULL, default `now()`         | When identified                                                  |
| `assigned_to`            | `uuid`               | FK →`users.id`, nullable         | Investigator                                                     |
| `due_date`               | `date`               | nullable                            | Investigation due date                                           |
| `closed_by`              | `uuid`               | FK →`users.id`, nullable         | Who closed                                                       |
| `closed_at`              | `timestamptz`        | nullable                            | When closed                                                      |
| `days_open`              | `integer`            | nullable                            | Calculated aging (trigger-updated)                               |
| `created_at`             | `timestamptz`        | NOT NULL, default `now()`         | Created                                                          |
| `updated_at`             | `timestamptz`        | NOT NULL, default `now()`         | Updated                                                          |

**Indexes:** `idx_dev_org` ON `organization_id`, `idx_dev_status` ON `status`, `idx_dev_severity` ON `severity`, `idx_dev_batch` ON `source_batch_id`, `idx_dev_assigned` ON `assigned_to`, `idx_dev_due` ON `due_date`

---

### 6.2 `capas`

| Column                        | Type             | Constraints                         | Description                      |
| ----------------------------- | ---------------- | ----------------------------------- | -------------------------------- |
| `id`                        | `uuid`         | PK                                  | CAPA ID                          |
| `organization_id`           | `uuid`         | FK →`organizations.id`, NOT NULL | Tenant scope                     |
| `capa_number`               | `varchar(50)`  | UNIQUE per org                      | "CAPA-2026-001"                  |
| `deviation_id`              | `uuid`         | FK →`deviations.id`, NOT NULL    | Source deviation                 |
| `capa_type`                 | `capa_type`    | NOT NULL                            | Corrective, preventive, both     |
| `status`                    | `capa_status`  | NOT NULL, default `'open'`        | Lifecycle                        |
| `title`                     | `varchar(255)` | NOT NULL                            | Short description                |
| `description`               | `text`         | NOT NULL                            | Detailed action plan             |
| `assigned_to`               | `uuid`         | FK →`users.id`, NOT NULL         | Responsible person               |
| `due_date`                  | `date`         | NOT NULL                            | Target completion date           |
| `completed_at`              | `timestamptz`  | nullable                            | When completed                   |
| `effectiveness_check_date`  | `date`         | nullable                            | When to verify effectiveness     |
| `effectiveness_verified`    | `boolean`      | default `false`                   | Was effectiveness confirmed?     |
| `effectiveness_notes`       | `text`         | nullable                            | Effectiveness verification notes |
| `effectiveness_verified_by` | `uuid`         | FK →`users.id`, nullable         | Who verified                     |
| `created_by`                | `uuid`         | FK →`users.id`, NOT NULL         | Who created                      |
| `created_at`                | `timestamptz`  | NOT NULL, default `now()`         | Created                          |
| `updated_at`                | `timestamptz`  | NOT NULL, default `now()`         | Updated                          |

**Indexes:** `idx_capa_org` ON `organization_id`, `idx_capa_deviation` ON `deviation_id`, `idx_capa_status` ON `status`, `idx_capa_assigned` ON `assigned_to`, `idx_capa_due` ON `due_date`

---

## 7. Equipment & Cleaning Tables

### 7.1 `equipment`

| Column                        | Type                 | Constraints                         | Description                      |
| ----------------------------- | -------------------- | ----------------------------------- | -------------------------------- |
| `id`                        | `uuid`             | PK                                  | Equipment ID                     |
| `organization_id`           | `uuid`             | FK →`organizations.id`, NOT NULL | Tenant scope                     |
| `name`                      | `varchar(255)`     | NOT NULL                            | "pH Meter - Mettler Toledo S220" |
| `equipment_code`            | `varchar(50)`      | UNIQUE per org                      | "PH-001"                         |
| `equipment_type`            | `equipment_type`   | NOT NULL                            | pH meter, balance, etc.          |
| `status`                    | `equipment_status` | NOT NULL, default `'qualified'`   | Lifecycle                        |
| `manufacturer`              | `varchar(255)`     | nullable                            | Equipment manufacturer           |
| `model`                     | `varchar(100)`     | nullable                            | Model number                     |
| `serial_number`             | `varchar(100)`     | nullable                            | Serial number                    |
| `room_id`                   | `uuid`             | FK →`rooms.id`, nullable         | Installed location               |
| `calibration_interval_days` | `integer`          | nullable                            | Days between calibrations        |
| `last_calibration_date`     | `date`             | nullable                            | Last calibration                 |
| `next_calibration_due`      | `date`             | nullable                            | Next calibration due             |
| `last_maintenance_date`     | `date`             | nullable                            | Last PM                          |
| `next_maintenance_due`      | `date`             | nullable                            | Next PM due                      |
| `qualification_date`        | `date`             | nullable                            | IQ/OQ/PQ completion              |
| `qualification_document_id` | `uuid`             | FK →`documents.id`, nullable     | Qualification protocol           |
| `purchase_date`             | `date`             | nullable                            | Date acquired                    |
| `warranty_expiry`           | `date`             | nullable                            | Warranty end                     |
| `notes`                     | `text`             | nullable                            | Equipment notes                  |
| `created_at`                | `timestamptz`      | NOT NULL, default `now()`         | Created                          |
| `updated_at`                | `timestamptz`      | NOT NULL, default `now()`         | Updated                          |
| `deleted_at`                | `timestamptz`      | nullable                            | Soft delete                      |

**Indexes:** `idx_equip_org` ON `organization_id`, `idx_equip_type` ON `equipment_type`, `idx_equip_status` ON `status`, `idx_equip_cal_due` ON `next_calibration_due`

---

### 7.2 `calibration_records`

| Column                       | Type              | Constraints                         | Description                         |
| ---------------------------- | ----------------- | ----------------------------------- | ----------------------------------- |
| `id`                       | `uuid`          | PK                                  | Calibration record ID               |
| `equipment_id`             | `uuid`          | FK →`equipment.id`, NOT NULL     | Which equipment                     |
| `organization_id`          | `uuid`          | FK →`organizations.id`, NOT NULL | Tenant scope                        |
| `calibration_date`         | `date`          | NOT NULL                            | When calibrated                     |
| `calibration_type`         | `varchar(50)`   | NOT NULL                            | "routine", "post_repair", "initial" |
| `standard_used`            | `varchar(255)`  | nullable                            | Reference standard used             |
| `standard_lot`             | `varchar(100)`  | nullable                            | Standard lot number                 |
| `standard_expiry`          | `date`          | nullable                            | Standard expiry                     |
| `result`                   | `varchar(20)`   | NOT NULL                            | "pass", "fail", "adjusted"          |
| `pre_calibration_reading`  | `decimal(15,5)` | nullable                            | Reading before calibration          |
| `post_calibration_reading` | `decimal(15,5)` | nullable                            | Reading after calibration           |
| `acceptance_criteria`      | `varchar(255)`  | nullable                            | Pass/fail criteria                  |
| `next_due_date`            | `date`          | NOT NULL                            | Next calibration due                |
| `performed_by`             | `uuid`          | FK →`users.id`, NOT NULL         | Who calibrated                      |
| `verified_by`              | `uuid`          | FK →`users.id`, nullable         | QA verification                     |
| `certificate_document_id`  | `uuid`          | FK →`documents.id`, nullable     | Calibration certificate             |
| `notes`                    | `text`          | nullable                            | Calibration notes                   |
| `created_at`               | `timestamptz`   | NOT NULL, default `now()`         | Created                             |

**Indexes:** `idx_cal_equip` ON `equipment_id`, `idx_cal_date` ON `calibration_date`, `idx_cal_result` ON `result`

---

### 7.3 `cleaning_logs`

| Column                   | Type                   | Constraints                         | Description                                    |
| ------------------------ | ---------------------- | ----------------------------------- | ---------------------------------------------- |
| `id`                   | `uuid`               | PK                                  | Cleaning log ID                                |
| `organization_id`      | `uuid`               | FK →`organizations.id`, NOT NULL | Tenant scope                                   |
| `room_id`              | `uuid`               | FK →`rooms.id`, NOT NULL         | Room cleaned                                   |
| `cleaning_date`        | `date`               | NOT NULL                            | Date of cleaning                               |
| `frequency`            | `schedule_frequency` | NOT NULL                            | Daily, weekly, etc.                            |
| `status`               | `cleaning_status`    | NOT NULL, default `'scheduled'`   | Lifecycle                                      |
| `agent_name`           | `varchar(100)`       | NOT NULL                            | "Sporicidin", "70% IPA", "Peridox"             |
| `agent_lot`            | `varchar(100)`       | nullable                            | Cleaning agent lot                             |
| `agent_expiry`         | `date`               | nullable                            | Agent expiry date                              |
| `contact_time_minutes` | `integer`            | nullable                            | Required contact time                          |
| `actual_contact_time`  | `integer`            | nullable                            | Actual contact time                            |
| `surfaces_cleaned`     | `jsonb`              | nullable                            | `["floors", "walls", "ceiling", "counters"]` |
| `started_at`           | `timestamptz`        | nullable                            | Start time                                     |
| `completed_at`         | `timestamptz`        | nullable                            | Completion time                                |
| `performed_by`         | `uuid`               | FK →`users.id`, nullable         | Who cleaned                                    |
| `signed_by`            | `uuid`               | FK →`users.id`, nullable         | E-signature                                    |
| `signed_at`            | `timestamptz`        | nullable                            | Signature time                                 |
| `verified_by`          | `uuid`               | FK →`users.id`, nullable         | QA verification                                |
| `notes`                | `text`               | nullable                            | Cleaning notes                                 |
| `created_at`           | `timestamptz`        | NOT NULL, default `now()`         | Created                                        |
| `updated_at`           | `timestamptz`        | NOT NULL, default `now()`         | Updated                                        |

**Indexes:** `idx_clean_org` ON `organization_id`, `idx_clean_room` ON `room_id`, `idx_clean_date` ON `cleaning_date`, `idx_clean_status` ON `status`

---

## 8. Training, Lab, Documents, Audit & Notifications

### 8.1 `training_records`

| Column                | Type                | Constraints                         | Description                     |
| --------------------- | ------------------- | ----------------------------------- | ------------------------------- |
| `id`                | `uuid`            | PK                                  | Record ID                       |
| `organization_id`   | `uuid`            | FK →`organizations.id`, NOT NULL | Tenant scope                    |
| `user_id`           | `uuid`            | FK →`users.id`, NOT NULL         | Who was trained                 |
| `training_type`     | `training_type`   | NOT NULL                            | Type of training                |
| `status`            | `training_status` | NOT NULL, default `'assigned'`    | Lifecycle                       |
| `sop_id`            | `uuid`            | FK →`documents.id`, nullable     | Related SOP document            |
| `title`             | `varchar(255)`    | NOT NULL                            | Training title                  |
| `description`       | `text`            | nullable                            | Training details                |
| `assigned_by`       | `uuid`            | FK →`users.id`, NOT NULL         | Who assigned                    |
| `assigned_at`       | `timestamptz`     | NOT NULL, default `now()`         | When assigned                   |
| `due_date`          | `date`            | NOT NULL                            | Completion due date             |
| `completed_at`      | `timestamptz`     | nullable                            | When completed                  |
| `score`             | `decimal(5,2)`    | nullable                            | Quiz score if applicable        |
| `passing_score`     | `decimal(5,2)`    | nullable                            | Minimum passing score           |
| `expires_at`        | `date`            | nullable                            | When this qualification expires |
| `trainer_id`        | `uuid`            | FK →`users.id`, nullable         | Who conducted training          |
| `signed_by_trainee` | `uuid`            | FK →`users.id`, nullable         | Trainee e-signature             |
| `signed_by_trainer` | `uuid`            | FK →`users.id`, nullable         | Trainer e-signature             |
| `notes`             | `text`            | nullable                            | Training notes                  |
| `created_at`        | `timestamptz`     | NOT NULL, default `now()`         | Created                         |
| `updated_at`        | `timestamptz`     | NOT NULL, default `now()`         | Updated                         |

**Indexes:** `idx_train_user` ON `user_id`, `idx_train_org` ON `organization_id`, `idx_train_status` ON `status`, `idx_train_type` ON `training_type`, `idx_train_due` ON `due_date`, `idx_train_expires` ON `expires_at`

---

### 8.2 `lab_samples`

| Column                  | Type                  | Constraints                         | Description              |
| ----------------------- | --------------------- | ----------------------------------- | ------------------------ |
| `id`                  | `uuid`              | PK                                  | Sample ID                |
| `organization_id`     | `uuid`              | FK →`organizations.id`, NOT NULL | Tenant scope             |
| `batch_id`            | `uuid`              | FK →`batches.id`, NOT NULL       | Source batch             |
| `sample_number`       | `varchar(50)`       | UNIQUE per org                      | "LS-2026-0847-01"        |
| `test_type`           | `test_type`         | NOT NULL                            | Potency, sterility, etc. |
| `status`              | `lab_sample_status` | NOT NULL, default `'sampled'`     | Lifecycle                |
| `sampled_by`          | `uuid`              | FK →`users.id`, NOT NULL         | Who sampled              |
| `sampled_at`          | `timestamptz`       | NOT NULL                            | When sampled             |
| `quantity_sampled`    | `decimal(10,3)`     | nullable                            | Amount sampled           |
| `unit`                | `unit_of_measure`   | nullable                            | UOM                      |
| `external_lab`        | `varchar(255)`      | nullable                            | "Eagle Analytical"       |
| `shipped_at`          | `timestamptz`       | nullable                            | When shipped to lab      |
| `tracking_number`     | `varchar(100)`      | nullable                            | Shipping tracking        |
| `results_received_at` | `timestamptz`       | nullable                            | When results came back   |
| `result`              | `varchar(20)`       | nullable                            | "pass", "fail"           |
| `result_value`        | `varchar(255)`      | nullable                            | Specific result value    |
| `specification`       | `varchar(255)`      | nullable                            | Acceptance criteria      |
| `coa_document_id`     | `uuid`              | FK →`documents.id`, nullable     | Lab COA                  |
| `reviewed_by`         | `uuid`              | FK →`users.id`, nullable         | QC reviewer              |
| `reviewed_at`         | `timestamptz`       | nullable                            | When reviewed            |
| `notes`               | `text`              | nullable                            | Lab sample notes         |
| `created_at`          | `timestamptz`       | NOT NULL, default `now()`         | Created                  |
| `updated_at`          | `timestamptz`       | NOT NULL, default `now()`         | Updated                  |

**Indexes:** `idx_lab_org` ON `organization_id`, `idx_lab_batch` ON `batch_id`, `idx_lab_status` ON `status`, `idx_lab_test` ON `test_type`

---

### 8.3 `documents`

| Column              | Type                   | Constraints                         | Description               |
| ------------------- | ---------------------- | ----------------------------------- | ------------------------- |
| `id`              | `uuid`               | PK                                  | Document ID               |
| `organization_id` | `uuid`               | FK →`organizations.id`, NOT NULL | Tenant scope              |
| `title`           | `varchar(255)`       | NOT NULL                            | Document title            |
| `document_number` | `varchar(50)`        | UNIQUE per org                      | "SOP-001", "COA-2026-001" |
| `document_type`   | `document_type_enum` | NOT NULL                            | Document category         |
| `version`         | `integer`            | NOT NULL, default `1`             | Version number            |
| `status`          | `document_status`    | NOT NULL, default `'draft'`       | Document lifecycle status |
| `file_url`        | `text`               | NOT NULL                            | Storage path / URL        |
| `file_name`       | `varchar(255)`       | NOT NULL                            | Original filename         |
| `file_size_bytes` | `bigint`             | nullable                            | File size                 |
| `mime_type`       | `varchar(100)`       | nullable                            | MIME type                 |
| `effective_date`  | `date`               | nullable                            | When active               |
| `review_date`     | `date`               | nullable                            | Next review due           |
| `approved_by`     | `uuid`               | FK →`users.id`, nullable         | Approver                  |
| `approved_at`     | `timestamptz`        | nullable                            | Approval time             |
| `uploaded_by`     | `uuid`               | FK →`users.id`, NOT NULL         | Uploader                  |
| `description`     | `text`               | nullable                            | Document description      |
| `tags`            | `text[]`             | nullable                            | Searchable tags           |
| `created_at`      | `timestamptz`        | NOT NULL, default `now()`         | Created                   |
| `updated_at`      | `timestamptz`        | NOT NULL, default `now()`         | Updated                   |
| `deleted_at`      | `timestamptz`        | nullable                            | Soft delete               |

**Indexes:** `idx_doc_org` ON `organization_id`, `idx_doc_type` ON `document_type`, `idx_doc_status` ON `status`, `idx_doc_number` UNIQUE ON (`organization_id`, `document_number`, `version`)

---

### 8.4 `audit_trail`

Immutable, append-only audit log. Core 21 CFR Part 11 requirement.

| Column              | Type             | Constraints                         | Description                                   |
| ------------------- | ---------------- | ----------------------------------- | --------------------------------------------- |
| `id`              | `uuid`         | PK                                  | Audit entry ID                                |
| `organization_id` | `uuid`         | FK →`organizations.id`, NOT NULL | Tenant scope                                  |
| `user_id`         | `uuid`         | FK →`users.id`, nullable         | Who (null for system actions)                 |
| `user_name`       | `varchar(255)` | NOT NULL                            | Denormalized name at time of action           |
| `user_role`       | `user_role`    | nullable                            | Role at time of action                        |
| `action`          | `audit_action` | NOT NULL                            | What happened                                 |
| `table_name`      | `varchar(100)` | NOT NULL                            | Which table was affected                      |
| `record_id`       | `uuid`         | NOT NULL                            | PK of affected record                         |
| `field_name`      | `varchar(100)` | nullable                            | Specific field changed                        |
| `old_value`       | `text`         | nullable                            | Previous value (JSON for complex)             |
| `new_value`       | `text`         | nullable                            | New value                                     |
| `reason`          | `text`         | nullable                            | Reason for change (required for some changes) |
| `ip_address`      | `inet`         | nullable                            | Device IP                                     |
| `device_id`       | `varchar(255)` | nullable                            | Device identifier                             |
| `user_agent`      | `text`         | nullable                            | Browser/app UA                                |
| `session_id`      | `varchar(255)` | nullable                            | Auth session ID                               |
| `timestamp`       | `timestamptz`  | NOT NULL, default `now()`         | Exact timestamp                               |

**Indexes:** `idx_audit_org` ON `organization_id`, `idx_audit_user` ON `user_id`, `idx_audit_table_record` ON (`table_name`, `record_id`), `idx_audit_action` ON `action`, `idx_audit_timestamp` ON `timestamp`

**Immutability:** INSERT only. No UPDATE or DELETE ever. Partition by month for performance.

---

### 8.5 `notifications`

| Column              | Type                  | Constraints                         | Description                       |
| ------------------- | --------------------- | ----------------------------------- | --------------------------------- |
| `id`              | `uuid`              | PK                                  | Notification ID                   |
| `organization_id` | `uuid`              | FK →`organizations.id`, NOT NULL | Tenant scope                      |
| `user_id`         | `uuid`              | FK →`users.id`, NOT NULL         | Recipient                         |
| `type`            | `notification_type` | NOT NULL                            | Notification category             |
| `title`           | `varchar(255)`      | NOT NULL                            | Short title                       |
| `message`         | `text`              | NOT NULL                            | Full message                      |
| `link_url`        | `varchar(500)`      | nullable                            | Deep link to relevant page        |
| `reference_table` | `varchar(100)`      | nullable                            | Related table                     |
| `reference_id`    | `uuid`              | nullable                            | Related record                    |
| `is_read`         | `boolean`           | default `false`                   | Has user read it?                 |
| `read_at`         | `timestamptz`       | nullable                            | When read                         |
| `is_emailed`      | `boolean`           | default `false`                   | Was email sent?                   |
| `emailed_at`      | `timestamptz`       | nullable                            | When email sent                   |
| `is_pushed`       | `boolean`           | default `false`                   | Push notification sent?           |
| `priority`        | `varchar(10)`       | default `'normal'`                | "low", "normal", "high", "urgent" |
| `expires_at`      | `timestamptz`       | nullable                            | Auto-dismiss after this time      |
| `created_at`      | `timestamptz`       | NOT NULL, default `now()`         | Created                           |

**Indexes:** `idx_notif_user` ON `user_id`, `idx_notif_org` ON `organization_id`, `idx_notif_read` ON `is_read` WHERE `is_read = false`, `idx_notif_type` ON `type`, `idx_notif_created` ON `created_at`

---

## 9. Data Import Tables

### 9.1 `import_logs`

Tracking table for PK Software CSV imports and future integrations.

| Column              | Type             | Constraints                         | Description                                     |
| ------------------- | ---------------- | ----------------------------------- | ----------------------------------------------- |
| `id`              | `uuid`         | PK                                  | Import log ID                                   |
| `organization_id` | `uuid`         | FK →`organizations.id`, NOT NULL | Tenant scope                                    |
| `import_type`     | `varchar(50)`  | NOT NULL                            | "pk_formula", "pk_batch", "pk_inventory", "csv" |
| `file_name`       | `varchar(255)` | NOT NULL                            | Original filename                               |
| `file_size_bytes` | `bigint`       | nullable                            | File size                                       |
| `status`          | `varchar(20)`  | NOT NULL, default `'pending'`     | "pending", "processing", "completed", "failed"  |
| `total_rows`      | `integer`      | nullable                            | Total rows in source file                       |
| `rows_imported`   | `integer`      | default `0`                       | Successfully imported rows                      |
| `rows_skipped`    | `integer`      | default `0`                       | Skipped rows (duplicates, invalid)              |
| `rows_errored`    | `integer`      | default `0`                       | Rows with errors                                |
| `error_details`   | `jsonb`        | nullable                            | `[{"row": 5, "error": "..."}]`                |
| `started_at`      | `timestamptz`  | nullable                            | Processing start                                |
| `completed_at`    | `timestamptz`  | nullable                            | Processing end                                  |
| `imported_by`     | `uuid`         | FK →`users.id`, NOT NULL         | Who initiated                                   |
| `created_at`      | `timestamptz`  | NOT NULL, default `now()`         | Created                                         |

**Indexes:** `idx_import_org` ON `organization_id`, `idx_import_status` ON `status`, `idx_import_type` ON `import_type`

---

## 10. Entity Relationship Summary

```
organizations ──┬── users
                 ├── master_formulas ──┬── formula_steps
                 │                     └── formula_components
                 ├── batches ──────────┬── batch_step_records
                 │                     ├── batch_components_used
                 │                     └── lab_samples
                 ├── inventory_items ── inventory_lots ── inventory_transactions
                 ├── vendors
                 ├── rooms ────────────┬── em_locations ── em_samples ── em_excursions
                 │                     └── cleaning_logs
                 ├── equipment ──────── calibration_records
                 ├── deviations ─────── capas
                 ├── documents
                 ├── training_records
                 ├── e_signatures
                 ├── audit_trail
                 ├── notifications
                 └── import_logs
```

**Total Tables: 28** | **Total Enums: 37**

---

*Document generated: March 28, 2026 · Updated: March 29, 2026*
*Author: Nithin (Solo Developer / Product Lead)*
*Project: Clarix — 503B Digital Batch Record Platform*
