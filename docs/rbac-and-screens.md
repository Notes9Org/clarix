# Clarix — RBAC Rules & UI Screen Design Guide

## Document Purpose

Defines **permission rules** for every user role and catalogs every **UI screen** (web + iPad) with per-role visibility and interaction boundaries. This is the definitive reference for implementing Better-Auth RBAC and building Figma wireframes.

---

## 1. Role Hierarchy & Permission Model

### 1.1 Role Tiers

```text
Tier 1 (Executive)      → vp
Tier 2 (Management)     → production_manager, qa_manager, qa_specialist, training_coord, procurement
Tier 3 (Professional)   → pic, pharmacist, microbiologist
Tier 4 (Operations)     → technician, visual_inspector, qc_tech, warehouse, maintenance
Tier 5 (System)         → admin
```

### 1.2 Global Permission Rules

| Rule                               | Description                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **R1: Org Isolation**        | Every query is scoped by `organization_id`. No cross-tenant data access ever.                                    |
| **R2: Soft Delete**          | Only `admin` can soft-delete. All other roles see active records only.                                           |
| **R3: Audit Trail**          | Every CREATE/UPDATE/DELETE writes to `audit_trail`. No exceptions.                                               |
| **R4: E-Signature Auth**     | Any action requiring `e_signatures` must re-authenticate via PIN, biometric, or both.                            |
| **R5: Immutable Records**    | `audit_trail`, `e_signatures`, and `inventory_transactions` are INSERT-only. No role can UPDATE/DELETE.      |
| **R6: Separation of Duties** | A batch cannot be executed, reviewed, AND released by the same person. Minimum 2 distinct users.                   |
| **R7: Qualification Gate**   | `technician` cannot execute batch steps unless `media_fill_qualified = true` AND `garbing_qualified = true`. |
| **R8: HD Gate**              | Batches with `hazardous_drug = true` require `hd_trained = true` on the assigned technician.                   |
| **R9: Session Timeout**      | iPad: 5-minute inactivity lock. Web: 30-minute inactivity lock. Re-auth required.                                  |
| **R10: Failed Login Lock**   | After 5 consecutive failed logins, account locks for 30 minutes. Only `admin` can unlock early.                  |

---

## 2. RBAC Permission Matrix

### Legend

| Symbol | Meaning |
| ------ | ------- |
| CRUD | Full Access (Create, Read, Update, Delete) |
| R | Read Only |
| CR | Create + Read (no Update/Delete) |
| Own | Own Records Only |
| None | No Access |
| Sign | Approve/Sign Only |

### 2.1 Core Tables

| Resource                | admin | vp | prod_mgr      | pic | pharmacist | technician | visual_inspector |
| ----------------------- | ----- | -- | ------------- | --- | ---------- | ---------- | ---------------- |
| **organizations** | CRUD (metadata)  | R  | R             | R   | R          | R          | R                |
| **users**         | CRUD  | R  | R (own team)  | R   | R          | Own        | Own              |
| **notifications** | CRUD  | Own | Own          | Own | Own        | Own        | Own              |

| Resource                | qa_manager | qa_specialist | qc_tech | microbiologist | warehouse | procurement | maintenance | training_coord |
| ----------------------- | ---------- | ------------- | ------- | -------------- | --------- | ----------- | ----------- | -------------- |
| **organizations** | R          | R             | R       | R              | R         | R           | R           | R              |
| **users**         | R          | R             | Own     | Own            | Own       | Own         | Own         | R              |
| **notifications** | Own        | Own           | Own     | Own            | Own       | Own         | Own         | Own            |

### 2.2 Formula & Batch Tables

| Resource                        | admin | vp   | prod_mgr                      | pic               | pharmacist  | technician                       | visual_inspector                |
| ------------------------------- | ----- | ---- | ----------------------------- | ----------------- | ----------- | -------------------------------- | ------------------------------- |
| **master_formulas**       | CRUD (metadata)  | R    | R                             | CRUD + Sign       | CR          | R                                | None                            |
| **formula_steps**         | CRUD (metadata)  | None | R                             | CRUD              | CR          | R                                | None                            |
| **formula_components**    | CRUD (metadata)  | None | R                             | CRUD              | CR          | R                                | None                            |
| **batches**               | CRUD (metadata)  | R    | CRUD (create, assign, schedule) | Sign (Release)  | Sign (Verify) | R (assigned only)              | R (assigned only)               |
| **batch_step_records**    | CRUD (metadata)  | None | R                             | R + Sign          | R + Sign    | CR + Own (execute assigned)      | CR + Own (inspection steps)     |
| **batch_components_used** | CRUD (metadata)  | None | R                             | R                 | R           | CR (during batch)                | None                            |
| **e_signatures**          | R     | None | R                             | CR + R            | CR + R      | CR + Own                         | CR + Own                        |

| Resource                     | qa_manager       | qa_specialist    | qc_tech                    | microbiologist | warehouse | procurement | maintenance | training_coord |
| ---------------------------- | ---------------- | ---------------- | -------------------------- | -------------- | --------- | ----------- | ----------- | -------------- |
| **master_formulas**    | R                | R                | None                       | None           | None      | None        | None        | None           |
| **batches**            | R + Sign (Review) | R + Sign (Review) | R (linked to lab samples) | None           | None      | None        | None        | None           |
| **batch_step_records** | R (full review)  | R (full review)  | None                       | None           | None      | None        | None        | None           |
| **e_signatures**       | R                | R                | CR + Own                   | CR + Own       | None      | None        | CR + Own    | None           |

### 2.3 Inventory Tables

| Resource                         | admin | vp | prod_mgr | pic | technician             | warehouse                    | procurement | qa_manager    | qc_tech          |
| -------------------------------- | ----- | -- | -------- | --- | ---------------------- | ---------------------------- | ----------- | ------------- | ---------------- |
| **vendors**                | CRUD  | R  | R        | R   | None                   | R                            | CRUD        | Sign (Approve) | None            |
| **inventory_items**        | CRUD  | R  | R        | R   | R                      | CRUD                         | CRUD        | R             | R                |
| **inventory_lots**         | CRUD  | R  | R        | R   | R (available only)     | CRUD (receive, adjust)       | R           | R             | Sign (QC Release) |
| **inventory_transactions** | R     | R  | R        | R   | CR (batch consumption) | CR (receiving, adjustment)   | R           | R             | None             |

### 2.4 Facility & EM Tables

| Resource                      | admin | microbiologist    | qa_manager    | maintenance | technician | prod_mgr | pic  |
| ----------------------------- | ----- | ----------------- | ------------- | ----------- | ---------- | -------- | ---- |
| **rooms**               | CRUD  | R                 | R             | R           | R          | R        | R    |
| **em_locations**        | CRUD  | CRUD              | R             | None        | None       | None     | R    |
| **em_samples**          | CRUD  | CRUD              | R             | None        | None       | None     | R    |
| **em_excursions**       | CRUD  | CRUD (investigate) | CRUD (close) | None        | None       | R        | R    |
| **cleaning_logs**       | CRUD  | R                 | Sign (Verify) | CRUD        | None       | R        | R    |
| **equipment**           | CRUD  | R                 | R             | CRUD        | R          | R        | R    |
| **calibration_records** | CRUD  | None              | Sign (Verify) | CRUD        | None       | R        | R    |

### 2.5 Quality, Training, Documents & Audit

| Resource                   | admin     | qa_manager | qa_specialist | pic           | training_coord | All Others          |
| -------------------------- | --------- | ---------- | ------------- | ------------- | -------------- | ------------------- |
| **deviations**       | CRUD      | CRUD       | CR + R        | R             | None           | CR (report only)    |
| **capas**            | CRUD      | CRUD       | CR + R        | R             | None           | R (assigned)        |
| **documents**        | CRUD      | CRUD       | CRUD          | Sign (Approve) | R             | R (approved only)   |
| **training_records** | CRUD      | R          | R             | R             | CRUD           | Own                 |
| **audit_trail**      | R (full)  | R (full)   | R             | R             | None           | None                |

---

## 3. Business Rules (Per Domain)

### 3.1 Batch Workflow Rules

| #   | Rule                                                                                                                                        | Enforced By |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| B1  | A batch can only start if all required components have `lot_status = 'released'`                                                          | System      |
| B2  | Steps execute in order. Step N+1 cannot start until Step N status =`'completed'`                                                          | System      |
| B3  | Steps with `requires_signature = true` block progression until e-signature is captured                                                    | System      |
| B4  | Steps with `requires_witness = true` need a second user's e-signature (cannot be same as performer)                                       | System      |
| B5  | Steps with `requires_barcode_scan = true` block until a valid scan matches `expected_barcode_pattern`                                   | System      |
| B6  | If `entered_numeric` is outside `[tolerance_low, tolerance_high]`, auto-flag `within_tolerance = false` and prompt deviation creation | System      |
| B7  | Only `qa_manager` or `qa_specialist` can transition batch status from `pending_review` → `pending_release`                         | RBAC        |
| B8  | Only `pic` can transition batch status from `pending_release` → `released`                                                           | RBAC        |
| B9  | `rejection_reason` is required when transitioning to `rejected`                                                                         | System      |
| B10 | `bud_date` auto-calculates as `manufacture_date + bud_days` from the linked formula                                                     | System      |
| B11 | A batch with `has_open_deviation = true` cannot be released. All deviations must be closed or dispositioned.                              | System      |

### 3.2 Inventory Rules

| #  | Rule                                                                                                                   | Enforced By |
| -- | ---------------------------------------------------------------------------------------------------------------------- | ----------- |
| I1 | New lots enter as `lot_status = 'quarantined'`. Cannot be used until `'released'`                                  | System      |
| I2 | Only `qc_tech` or `qa_manager` can change lot status to `'released'`                                             | RBAC        |
| I3 | Lots with `requires_coa = true` cannot be released without `coa_document_id` populated AND `coa_verified = true` | System      |
| I4 | FIFO enforcement: system suggests oldest unexpired lot first. Technician must justify skipping.                        | System      |
| I5 | Expired lots (`expiry_date < today`) auto-transition to `'expired'` status via daily cron job                      | System      |
| I6 | `quantity_available` cannot go negative. Attempted over-consumption blocks the transaction.                          | System      |
| I7 | Low stock alert triggers notification when `quantity_available < safety_stock_level`                                 | System      |

### 3.3 Environmental Monitoring Rules

| #  | Rule                                                                                                                                      | Enforced By |
| -- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| E1 | If `viable_count_cfu > alert_limit`, system sets `exceeds_alert = true` and notifies `microbiologist`                               | System      |
| E2 | If `viable_count_cfu > action_limit`, system sets `exceeds_action = true`, auto-creates `em_excursion`, and notifies `qa_manager` | System      |
| E3 | EM excursions with `excursion_type = 'action'` must link to a formal `deviation` before closing                                       | System      |
| E4 | `affected_batches` auto-populated by querying batches with `room_id` match and overlapping time window                                | System      |
| E5 | Overdue samples (past `sampling_frequency` without collection) trigger escalation to `qa_manager`                                     | System      |

### 3.4 Quality Rules

| #  | Rule                                                                                                           | Enforced By   |
| -- | -------------------------------------------------------------------------------------------------------------- | ------------- |
| Q1 | Deviations with `severity = 'critical'` must have a CAPA created within 24 hours                             | System        |
| Q2 | Deviations with `patient_impact = true` require `pic` sign-off before closure                              | RBAC          |
| Q3 | CAPAs cannot close until `effectiveness_verified = true` (verified by a different user than `assigned_to`) | System + RBAC |
| Q4 | `days_open` auto-increments daily via trigger. Deviations open > 30 days escalate to `vp`                  | System        |
| Q5 | Documents can only transition to `'approved'` by `pic`, `qa_manager`, or `admin`                       | RBAC          |

### 3.5 Equipment & Training Rules

| #  | Rule                                                                                                              | Enforced By |
| -- | ----------------------------------------------------------------------------------------------------------------- | ----------- |
| T1 | Equipment with `next_calibration_due < today` auto-transitions to `status = 'out_of_calibration'`             | System      |
| T2 | Batches cannot reference equipment with `status = 'out_of_calibration'` or `'decommissioned'`                 | System      |
| T3 | Users with expired training (`expires_at < today`) are blocked from performing steps that require that training | System      |
| T4 | `media_fill_qualified` auto-sets to `false` when `media_fill_expiry < today`                                | System      |

---

## 4. UI Screen Inventory

### 4.1 Web Dashboard Screens

| #   | Screen                          | URL Path                        | Accessible By                                        | Description                                                                              |
| --- | ------------------------------- | ------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| W1  | **Login**                 | `/login`                      | All                                                  | Email + password. 2FA optional.                                                          |
| W2  | **Executive Dashboard**   | `/dashboard`                  | vp, admin                                            | KPI cards: batches today, deviations, EM status, inventory health, audit readiness score |
| W3  | **Production Dashboard**  | `/production`                 | prod_mgr, pic, pharmacist                            | Active batches board (kanban), scheduling calendar, technician assignments               |
| W4  | **Batch List**            | `/batches`                    | prod_mgr, pic, pharmacist, qa_manager, qa_specialist | Filterable table: status, date range, product, technician                                |
| W5  | **Batch Detail**          | `/batches/[id]`               | (per RBAC §2.2)                                     | Full batch record: steps timeline, component usage, signatures, deviations, lab results  |
| W6  | **Batch Review**          | `/batches/[id]/review`        | qa_manager, qa_specialist                            | Side-by-side: master formula vs actual execution. Flag discrepancies. Approve/reject.    |
| W7  | **Master Formulas**       | `/formulas`                   | pic, pharmacist, prod_mgr                            | Formula catalog with version history                                                     |
| W8  | **Formula Editor**        | `/formulas/[id]/edit`         | pic, pharmacist                                      | Step builder, component BOM, parameter tolerances, preview mode                          |
| W9  | **Inventory Dashboard**   | `/inventory`                  | warehouse, procurement, prod_mgr                     | Stock levels, expiry alerts, reorder status, lot tracking                                |
| W10 | **Inventory Item Detail** | `/inventory/[id]`             | warehouse, procurement                               | Lot history, transaction ledger, consumption chart                                       |
| W11 | **Receiving**             | `/inventory/receiving`        | warehouse                                            | Scan-to-receive workflow, COA upload, quarantine assignment                              |
| W12 | **Vendor Management**     | `/vendors`                    | procurement, qa_manager                              | Vendor list, approval status, qualification tracking                                     |
| W13 | **EM Dashboard**          | `/environmental`              | microbiologist, qa_manager                           | Room map, sample schedule, trend charts, excursion timeline                              |
| W14 | **EM Sample Detail**      | `/environmental/samples/[id]` | microbiologist                                       | Sample entry, incubation tracking, result logging                                        |
| W15 | **Deviation List**        | `/quality/deviations`         | qa_manager, qa_specialist, pic                       | Open/closed deviations table with aging indicators                                       |
| W16 | **Deviation Detail**      | `/quality/deviations/[id]`    | qa_manager, qa_specialist                            | Investigation form, root cause, CAPA link, closure workflow                              |
| W17 | **CAPA List**             | `/quality/capas`              | qa_manager, qa_specialist                            | CAPA tracker with due dates and effectiveness status                                     |
| W18 | **Equipment Dashboard**   | `/equipment`                  | maintenance, qa_manager                              | Equipment registry, calibration calendar, status overview                                |
| W19 | **Cleaning Dashboard**    | `/cleaning`                   | maintenance, qa_manager                              | Room cleaning schedule, completion log, agent rotation                                   |
| W20 | **Training Dashboard**    | `/training`                   | training_coord, qa_manager                           | Personnel qualification matrix, due dates, compliance percentage                         |
| W21 | **Document Control**      | `/documents`                  | qa_specialist, qa_manager, pic                       | SOP repository, version control, approval workflows                                      |
| W22 | **Audit Trail**           | `/admin/audit-trail`          | admin, qa_manager                                    | Searchable audit log with filters: user, table, action, date range                       |
| W23 | **User Management**       | `/admin/users`                | admin                                                | User CRUD, role assignment, qualification status, account lock/unlock                    |
| W24 | **System Settings**       | `/admin/settings`             | admin                                                | Org settings, timezone, integration config, notification rules                           |
| W25 | **Reports & Analytics**   | `/reports`                    | vp, qa_manager, pic, prod_mgr                        | Batch yield trends, deviation Pareto, EM trending, training compliance                   |
| W26 | **Notifications Center**  | `/notifications`              | All                                                  | Notification inbox with read/unread, deep links, priority filters                        |
| W27 | **Lab Samples**           | `/lab`                        | qc_tech, qa_manager                                  | Sample tracker, external lab coordination, result entry, pass/fail                       |

### 4.2 iPad App Screens

| #   | Screen                        | Accessible By                | Description                                                                                                                                                 |
| --- | ----------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M1  | **iPad Login**          | All mobile roles             | PIN + biometric login. Large buttons for gloved hands.                                                                                                      |
| M2  | **My Batches**          | technician, visual_inspector | Today's assigned batches with status indicators. Tap to enter.                                                                                              |
| M3  | **Batch Execution**     | technician                   | Step-by-step guided workflow. One step per screen. Large input fields, auto-calculated values, barcode scan trigger, timer, photo capture, e-signature pad. |
| M4  | **Barcode Scanner**     | technician, warehouse        | Full-screen camera viewfinder. Scans lot barcodes, validates against expected pattern, shows pass/fail overlay.                                             |
| M5  | **Visual Inspection**   | visual_inspector             | Checklist UI: clarity, particulates, color, volume, container integrity. Photo capture required. Pass/fail per unit.                                        |
| M6  | **EM Sampling**         | microbiologist               | Location list → scan room QR → log sample type, media lot, collection time → submit.                                                                     |
| M7  | **EM Results Entry**    | microbiologist               | Incubation timer countdown → enter CFU count → system auto-flags exceedances → deviation link if needed.                                                 |
| M8  | **Cleaning Log**        | maintenance                  | Scan room QR → show required cleaning protocol → agent selection (rotation enforced) → contact time timer → checklist → e-sign.                        |
| M9  | **Calibration Entry**   | maintenance                  | Select equipment → enter readings (pre/post) → standard used → pass/fail → next due date auto-calculated → e-sign.                                     |
| M10 | **Receiving**           | warehouse                    | Scan shipment barcodes → auto-populate vendor/item → enter quantity → upload COA photo → assign quarantine status.                                      |
| M11 | **E-Signature Modal**   | All                          | Full-screen PIN pad + FaceID/TouchID prompt. Shows signer name, role, meaning, timestamp.                                                                   |
| M12 | **Offline Mode Banner** | All                          | Persistent banner when offline. Data queued locally. Auto-sync on reconnect with conflict resolution.                                                       |

---

## 5. Screen Design Specifications

### 5.1 Executive Dashboard (W2) — VP View

```text
+-------------------------------------------------------------------+
|  CLARIX    [logo]          <Bell /> Notifications  <User /> Jim  |
+-------------------------------------------------------------------+
|                                                                   |
|  +----------+ +----------+ +----------+ +----------+            |
|  | Batches  | |Open Devs | | EM Status| | Inventory|            |
|  |   12     | |    0     | | CLEAN    | |   94%    |            |
|  | today    | | critical | | all rooms| |  health  |            |
|  +----------+ +----------+ +----------+ +----------+            |
|                                                                   |
|  +------------------------------+ +-------------------------+    |
|  | Batch Pipeline               | | Audit Readiness Score   |    |
|  | [kanban: draft to released]  | |                         |    |
|  |                              | |      97% --------       |    |
|  +------------------------------+ +-------------------------+    |
|                                                                   |
|  +------------------------------+ +-------------------------+    |
|  | Weekly Batch Yield Trend     | | EM Viable Count Trend   |    |
|  | [line chart]                 | | [line chart by room]    |    |
|  +------------------------------+ +-------------------------+    |
+-------------------------------------------------------------------+
```

### 5.2 Batch Execution — iPad (M3) — Technician View

```text
+----------------------------------------------+
│  Batch #2026-0847 | Famotidine 20mg/mL       │
│  Step 3 of 12     | <Loader2 /> In Progress   │
+----------------------------------------------+
│                                              │
│  INSTRUCTION                                 │
│  Weigh Famotidine USP Powder                 │
│  Target: 10.00 g  ·  Tolerance: ±2%         │
│                                              │
│  +--------------------------------------+    │
│  │  ACTUAL WEIGHT                       │    │
│  │                                      │    │
│  │       [ 10.04 ] g                    │    │
│  │       <CheckCircle2 /> Within spec   │    │
│  +--------------------------------------+    │
│                                              │
│  +--------------------------------------+    │
│  │  COMPONENT SCAN                      │    │
│  │  <ScanBarcode />  Lot: FAM-2026-041  │    │
│  │  <CheckCircle2 /> Verified           │    │
│  +--------------------------------------+    │
│                                              │
│  +--------------------------------------+    │
│  │       [ SIGN & CONTINUE -> ]         │    │
│  +--------------------------------------+    │
│                                              │
│  <FileEdit /> Add Note  <Camera /> Photo     │
+----------------------------------------------+
```

### 5.3 QA Batch Review — Web (W6) — QA Manager View

```text
+------------------------------------------------------------------+
|  Batch Review | #2026-0847 | Famotidine 20mg/mL | [Pending]     |
+------------------------------------------------------------------+
| +----------------------+ +----------------------------------+   |
| | Review Checklist     | | Step Execution Timeline          |   |
| |                      | |                                  |   |
| | [x] All steps done   | | Step 1  <CheckCircle2 /> 09:14  |   |
| | [x] All sigs         | | Step 2  <CheckCircle2 /> 09:22  |   |
| | [x] No OOS values    | | Step 3  <AlertTriangle /> 09:35 |   |
| | [ ] Deviations closed| |   DEV-2026-003 (resolved)       |   |
| | [x] Components ok    | | Step 4  <CheckCircle2 /> 09:48  |   |
| | [x] Yield in range   | | ...                              |   |
| |                      | | Step 12 <CheckCircle2 /> 12:15  |   |
| | Yield: 98.2%         | |                                  |   |
| | BUD:  2026-06-27     | |                                  |   |
| +----------------------+ +----------------------------------+   |
|                                                                  |
| [ APPROVE ]  [ REJECT ]  [ Add Comment ]                         |
+------------------------------------------------------------------+
```

---

## 6. Navigation Structure

### 6.1 Web Sidebar (role-conditional)

```text
<LayoutDashboard />  Dashboard       → vp, admin, prod_mgr, qa_manager, pic
<FlaskConical />     Production      → prod_mgr, pic, pharmacist, technician
   Active Batches
   Schedule
   Formulas
<Boxes />            Inventory       → warehouse, procurement, prod_mgr
   Stock Levels
   Receiving
   Vendors
<Wind />             Environmental  → microbiologist, qa_manager
   EM Dashboard
   Samples
   Excursions
<ClipboardCheck />   Quality        → qa_manager, qa_specialist, pic
   Deviations
   CAPAs
   Documents
<Gauge />            Equipment      → maintenance, qa_manager
   Registry
   Calibrations
   Cleaning
<GraduationCap />    Training       → training_coord, qa_manager
<TestTube2 />        Lab            → qc_tech, qa_manager
<BarChart2 />        Reports        → vp, qa_manager, pic, prod_mgr
<ShieldCheck />      Admin          → admin
   Users
   Audit Trail
   Settings
```

### 6.2 iPad Tab Bar

```text
[ My Batches ]  [ Scanner ]  [ EM ]  [ Cleaning ]  [ Profile ]
  technician     warehouse   micro    maintenance     all
  vis_inspector  technician
```

---

## 7. Design System Notes for Figma

### 7.1 Color Semantics

See [design-system.md](./design-system.md) for the full token specification. Summary:

| Token | oklch Value | Usage |
| ----- | ----------- | ----- |
| `--status-success` | `oklch(0.52 0.17 142)` | Success, released, within spec, clean EM |
| `--status-warning` | `oklch(0.62 0.16 75)` | Warning, pending review, approaching limits, due soon |
| `--status-error` | `oklch(0.58 0.22 25)` | Error, rejected, OOS, action limit exceeded, overdue |
| `--status-info` | `oklch(0.55 0.18 240)` | Info, in-progress, active, links |
| `--muted-foreground` | `oklch(0.50 0 0)` | Neutral, draft, inactive, disabled — always gray |

### 7.2 Typography

See [design-system.md](./design-system.md) for the full type scale. Summary for Figma:

| Element | Font | Size | Weight |
| ------- | ---- | ---- | ------ |
| iPad step instruction | Geist Sans | 20px | 600 |
| iPad numeric input | Geist Mono | 36px | 400 |
| iPad button | Geist Sans | 18px | 700 |
| Web heading | Geist Sans | 24px | 700 |
| Web body / table | Geist Sans | 14px | 400 |
| Batch IDs / Lot numbers | Geist Mono | 14px | 400 |

### 7.3 iPad-Specific Design Rules

- Minimum tap target: **44×44px** (Apple HIG for gloved hands, recommend 56×56px)
- No hover states (touch only)
- High contrast: WCAG AAA on critical data
- Step screens: **one primary action per page** to prevent mis-taps
- Landscape orientation locked for batch execution
- Persistent batch header (product name, batch #, step progress)

---

*Document generated: March 28, 2026*
*Author: Nithin (Solo Developer / Product Lead)*
*Project: Clarix — 503B Digital Batch Record Platform*
