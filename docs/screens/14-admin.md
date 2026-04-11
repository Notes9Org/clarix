---
id: SCR-014
title: Admin (Users, Audit Trail, System Intelligence)
version: "1.1"
status: approved
priority: P0
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [Part 11 (all), 211.180, 211.68]
urs_refs: [URS-029, URS-030, URS-031]
frs_refs: [FRS-037, FRS-038, FRS-039, FRS-040]
---

# 14 — Admin (Users, Audit Trail, System Intelligence)

> **Users:** admin, vp (audit trail read-only)  
> **Routes:** `/admin/users`, `/admin/audit-trail`, `/admin/settings`, `/admin/events`, `/admin/compliance`  
> **Priority:** P0  
> **21 CFR Part 11:** Audit trail is regulatory NON-NEGOTIABLE  
> **Key Insight from FDA 483s:** Most common citations are inadequate audit trails and missing documentation

## Revision History

| Version | Date       | Author   | Change Description                    | Approved By |
|---------|------------|----------|---------------------------------------|-------------|
| 1.0     | 2026-04-05 | fillsai  | Initial admin specification           | fillsai     |
| 1.1     | 2026-04-07 | fillsai  | Added frontmatter, traceability IDs   | fillsai     |

---

## Screen A1: User Management (`/admin/users`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <ShieldCheck /> User Management                       [ + Create User ] │
│  Personnel accounts, roles, and access control                           │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  Role: [All ▼]  Status: [All ▼]  Qualified: [All ▼]    [Search______]  │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────┬──────────────────┬──────────┬──────────┬──────┬──────┐
│ Name            │ Email            │ Role     │ Status   │ Qual.│      │
├─────────────────┼──────────────────┼──────────┼──────────┼──────┼──────┤
│ Carlos Thompson │ carlos@fac..     │ Tech     │[✓ Active]│ ✓    │ ✎    │
│ Maria Reyes     │ maria@fac..      │ Tech     │[✓ Active]│ ✓    │ ✎    │
│ James Wilson    │ james@fac..      │ Tech     │[✓ Active]│ ⚠    │ ✎    │
│ Alex Petrov     │ alex@fac..       │ Tech     │[◉ Susp.] │ ✕    │ ✎    │
│ Dr. Priya Shah  │ priya@fac..      │ PIC      │[✓ Active]│ ✓    │ ✎    │
│ Marcus Quinn    │ marcus@fac..     │ QA Mgr   │[✓ Active]│ ✓    │ ✎    │
│ Sarah Martinez  │ sarah@fac..      │ Micro    │[✓ Active]│ ✓    │ ✎    │
│ David Wang      │ david@fac..      │ Warehouse│[✓ Active]│ ✓    │ ✎    │
│ Rosa Morales    │ rosa@fac..       │ Maint.   │[✓ Active]│ ✓    │ ✎    │
│ Jim Hartley     │ jim@fac..        │ VP       │[✓ Active]│ N/A  │ ✎    │
└─────────────────┴──────────────────┴──────────┴──────────┴──────┴──────┘
```

### User Detail / Edit Panel (slides in from right)

```
┌──────────────────────────────────────────────────────────────┐
│  Carlos Thompson                                              │
│  technician · Active since 06/15/2024                        │
│                                                               │
│  ── ACCOUNT ──                                                │
│  Name:     [Carlos Thompson__________]                        │
│  Email:    [carlos@facility.com______]                        │
│  Role:     [technician ▼]                                     │
│  Status:   [active ▼]                                         │
│  Emp ID:   [CT-2024-001_____________]                         │
│                                                               │
│  ── QUALIFICATIONS ──                                         │
│  Media Fill:    [x] Qualified    Expires: [2026-06-15]       │
│  Garbing:       [x] Qualified    Expires: [2026-05-01]       │
│  HD (USP 800):  [x] Trained                                  │
│                                                               │
│  ── SECURITY ──                                               │
│  PIN Set:       ✓ (change PIN)                                │
│  Biometric:     ✓ Enabled                                     │
│  Failed Logins: 0  /  Locked: No                              │
│                                                               │
│  ── USER ACTIVITY (last 7 days) ──                            │
│  43 e-signatures  ·  12 batches  ·  0 security events        │
│  Last login: Today 09:14 from iPad (10.0.1.45)               │
│  Last action: Signed Step 6, Batch #2026-0847                │
│                                                               │
│                           [ Cancel ]  [ Save Changes ]        │
└──────────────────────────────────────────────────────────────┘
```

---

## Screen A2: Audit Trail — Full Investigation Mode (`/admin/audit-trail`)

**21 CFR Part 11 — Rule R3: Every mutation logged. Rule R5: INSERT-only, immutable.**

> This screen is designed for FDA investigators, quality auditors, and management.
> It must support: "Show me everything that happened to Batch #2026-0846"

### View Mode: Chronological Stream

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <ScrollText /> Audit Trail — Complete System Journal                    │
│  21 CFR Part 11 Compliant  ·  INSERT-only  ·  Immutable                │
│                                                                          │
│  [ Export CSV ]  [ Export PDF ]  [ Generate Audit Packet ]               │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  FILTERS                                                                 │
│                                                                          │
│  Date Range: [04/01/2026] to [04/07/2026]                               │
│  User:       [All Users ▼]      Table:  [All Systems ▼]                 │
│  Action:     [All Actions ▼]    Batch:  [_____________]                 │
│  Severity:   [All ▼]           Search:  [free text___________]          │
│                                                                          │
│  Quick filters:                                                          │
│  [ Security Events ]  [ Data Changes ]  [ E-Signatures ]               │
│  [ System Actions ]   [ Failed Attempts ]  [ Admin Changes ]            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  Showing 156 events  ·  April 1–7, 2026                                 │
│                                                                          │
│  ── APRIL 7, 2026 ──────────────────────────────────────────────────    │
│                                                                          │
│  10:22:14  Carlos T.     E-SIGNATURE                                    │
│  EDT       Technician    Batch #2026-0847  ·  Step 6 (pH Adjustment)   │
│            iPad          Meaning: "I performed this step"               │
│            10.0.1.45     Method: PIN (6-digit)                          │
│                          ┌──────────────────────────────────────┐       │
│                          │  old_value: null                     │       │
│                          │  new_value: "6.82"                   │       │
│                          │  target:    "7.00 ±0.3"              │       │
│                          │  within_tolerance: true              │       │
│                          │  component_lot: null                 │       │
│                          │  equipment_id: "PH-002"              │       │
│                          └──────────────────────────────────────┘       │
│                                                                          │
│  10:05:41  Carlos T.     DATA ENTRY                                     │
│  EDT       Technician    Batch #2026-0847  ·  Step 5 (Dissolve in WFI) │
│            iPad          old_value: null → new_value: "1000 mL"        │
│            10.0.1.45                                                     │
│                                                                          │
│  09:35:22  Carlos T.     BARCODE SCAN                                   │
│  EDT       Technician    Batch #2026-0847  ·  Step 3                    │
│            iPad          Scanned: "FAM-2026-041"                        │
│            10.0.1.45     Expected: "FAM-*"  ·  Result: MATCH           │
│                          Lot verified: Famotidine USP                   │
│                          Expiry: 2027-01-15  ·  Status: Released       │
│                                                                          │
│  09:35:18  SYSTEM        INVENTORY TRANSACTION                          │
│            (auto)        -10.04g from lot FAM-2026-041                  │
│                          Reason: Issued to Batch #2026-0847, Step 3    │
│                          Remaining: 189.96g                             │
│                                                                          │
│  09:14:02  Carlos T.     STATUS CHANGE                                  │
│  EDT       Technician    Batch #2026-0847                               │
│            iPad          old_status: "draft" → new_status: "in_progress"│
│            10.0.1.45     assigned_technician: "Carlos Thompson"         │
│                                                                          │
│  09:13:45  Carlos T.     LOGIN SUCCESS                                  │
│  EDT       Technician    Method: PIN (iPad)                             │
│            10.0.1.45     Device: iPad Pro 12.9" (Clarix v1.2.0)        │
│                          Session created: tok_abc...def                  │
│                                                                          │
│  08:00:33  David W.      RECEIVING                                      │
│  EDT       Warehouse     Created lot: FAM-2026-045                      │
│            Web           Item: Famotidine USP  ·  Qty: 100g            │
│            192.168.1.12  Vendor: Letco  ·  Status: quarantined         │
│                          COA: pending                                   │
│                                                                          │
│  07:00:00  SYSTEM        AUTOMATED ACTION (Cron: Rule I5)              │
│            (cron)        2 inventory lots auto-expired:                  │
│                          NaCl-2025-089 (exp: 04/06)                     │
│                          WFI-2025-112 (exp: 04/06)                      │
│                          old_status: "released" → new_status: "expired" │
│                                                                          │
│  ── APRIL 6, 2026 ──────────────────────────────────────────────────    │
│                                                                          │
│  16:45:00  Marcus Q.     E-SIGNATURE (REVIEW)                           │
│  EDT       QA Manager    Batch #2026-0844                               │
│            Web           Meaning: "I reviewed this batch record"        │
│            192.168.1.10  old_status: "pending_review" → "approved"      │
│                          Review notes: "All steps verified. No flags."  │
│                                                                          │
│  16:44:30  Marcus Q.     BATCH REVIEW COMPLETED                         │
│  EDT       QA Manager    Batch #2026-0844 review checklist:             │
│            Web           [x] All steps completed                        │
│                          [x] All signatures captured                    │
│                          [x] No OOS values                              │
│                          [x] No open deviations                         │
│                          [x] Components verified                        │
│                          [x] Yield 99.2% within range                  │
│                                                                          │
│  ...                                                                     │
│                                              [ Load more (112 events) → ]│
└──────────────────────────────────────────────────────────────────────────┘
```

---

### View Mode: Batch Genealogy (FDA Investigation View)

**Scenario:** FDA inspector says: "Show me everything about Batch #2026-0846."

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <ScrollText /> Audit Trail — Batch Genealogy                            │
│                                                                          │
│  Batch: [#2026-0846 ▼]  (or scan batch barcode)                        │
└──────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════════════════╗
║  BATCH #2026-0846  ·  Ketorolac 15mg/mL Injection                       ║
║  Formula: KET-15-INJ v1.0  ·  Lot Size: 150 units                      ║
║  Status: [◷ Pending Review]  ·  Created: 04/04  ·  Completed: 04/05    ║
╚══════════════════════════════════════════════════════════════════════════╝

┌─ TABS ──────────────────────────────────────────────────────────────────┐
│  [ Timeline ]  [ People ]  [ Materials ]  [ Equipment ]  [ Deviations ] │
└─────────────────────────────────────────────────────────────────────────┘

═══ Timeline (complete chain of custody) ═══════════════════════════════════

  04/04 09:00  BATCH CREATED
               By: Linda P. (prod_mgr)
               Formula: KET-15-INJ v1.0 (approved 03/15)

  04/04 09:05  TECHNICIAN ASSIGNED
               By: Linda P.  →  Carlos Thompson
               Qualification check: ✓ media_fill, ✓ garbing, ✓ non-HD

  04/04 09:14  BATCH STARTED (status: draft → in_progress)
               By: Carlos T.  ·  iPad (10.0.1.45)

  04/04 09:18  Step 1: Verify Supplies — COMPLETED
               Signed: Carlos T. (performed) — PIN
               Duration: 4 min

  04/04 09:22  Step 2: Gown & Enter — COMPLETED
               Signed: Carlos T. (performed) — PIN
               Duration: 4 min

  04/04 09:35  Step 3: Weigh Ketorolac — COMPLETED
               Value: 7.52g (target: 7.50g ±2%) ✓ WITHIN SPEC
               Lot: KET-2026-018 (scanned, verified)
               Equipment: BAL-004 (calibrated 01/10, next 04/10)
               Signed: Carlos T. (performed) — PIN

  ...

  04/04 10:22  Step 6: Adjust pH — COMPLETED  ⚠ OUT OF SPEC
               Value: 6.52 (target: 7.00 ±0.3, min 6.70)
               ✕ BELOW TOLERANCE — auto-flagged
               Signed: Carlos T. (performed) — PIN
               → AUTO: Deviation DEV-2026-003 created

  04/04 10:22  DEVIATION AUTO-CREATED
               DEV-2026-003  ·  Severity: Major  ·  Source: Batch OOS
               Assigned to: Marcus Q. (QA Manager)

  ...

  04/05 14:00  BATCH SUBMITTED FOR REVIEW
               By: Carlos T.  ·  Status: in_progress → pending_review
               All 8 steps completed  ·  1 deviation linked
               Yield: 97.8%

═══ People (who touched this batch) ════════════════════════════════════════

  Carlos Thompson  ·  Technician
  ├── Executed all 8 steps
  ├── 8 e-signatures (all PIN)
  ├── Qualification at time of batch: ✓ all current
  └── GMP training: current (exp: 01/2027)

  Linda Parker  ·  Production Manager
  ├── Created batch record
  └── Assigned technician

  Marcus Quinn  ·  QA Manager
  └── Deviation DEV-003 assigned (investigation pending)

═══ Materials (full traceability) ══════════════════════════════════════════

  ┌─────────────────────┬────────────────┬──────────┬──────────┬─────────┐
  │ Component           │ Lot            │ Vendor   │ COA      │ Qty Used│
  ├─────────────────────┼────────────────┼──────────┼──────────┼─────────┤
  │ Ketorolac Trometh.  │ KET-2026-018   │ Spectrum │ ✓ Verified│ 7.52g  │
  │ Sodium Chloride     │ NaCl-2026-055  │ Spectrum │ ✓ Verified│ 13.50g │
  │ NaOH 1N Solution    │ NaOH-2026-012  │ Letco    │ ✓ Verified│ 2.1 mL │
  │ WFI Sterile Water   │ WFI-2026-088   │ In-house │ N/A      │ 750 mL │
  │ 0.22μm PES Filter   │ FIL-2026-004   │ Millipore│ ✓ Verified│ 1 unit │
  └─────────────────────┴────────────────┴──────────┴──────────┴─────────┘

═══ Equipment (calibration chain) ══════════════════════════════════════════

  ┌─────────────────────┬────────────────────┬───────────────────┐
  │ Equipment           │ Cal Status at Use  │ Cert #            │
  ├─────────────────────┼────────────────────┼───────────────────┤
  │ BAL-004 Balance     │ ✓ Cal 01/10 (due 04/10)│ CAL-2026-001│
  │ PH-002 pH Meter     │ ✓ Cal 02/15 (due 05/15)│ CAL-2026-008│
  │ LFH-03 LAF Hood     │ ✓ Qual 12/01 (due 12/01)│ IQ-2025-044│
  │ AUT-001 Autoclave   │ ✓ Cal 03/01 (due 06/01)│ CAL-2026-015│
  └─────────────────────┴────────────────────┴───────────────────┘
```

---

## Screen A3: Compliance Monitoring (`/admin/compliance`)

**FDA 483 Risk Radar — proactively identifies areas that would trigger FDA observations.**

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <Shield /> Compliance Monitor                     [ Run Self-Audit ]   │
│  Proactive 483 risk detection                                            │
└──────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════════════════╗
║  483 RISK RADAR — 3 potential observation areas detected                ║
║                                                                         ║
║  ┌─── HIGH RISK ──────────────────────────────────────────────────────┐ ║
║  │                                                                    │ ║
║  │  ✕ PERSONNEL TRAINING GAP                             CFR 211.25  │ ║
║  │    Alex Petrov performing batch work with expired garbing           │ ║
║  │    qualification and expired media fill certification.             │ ║
║  │    Status: BLOCKED (system prevented batch assignment)             │ ║
║  │    Action: Schedule requalification immediately                    │ ║
║  │    → Last known assignment attempt: 04/02 (system rejected)       │ ║
║  │                                                                    │ ║
║  └────────────────────────────────────────────────────────────────────┘ ║
║                                                                         ║
║  ┌─── MEDIUM RISK ────────────────────────────────────────────────────┐ ║
║  │                                                                    │ ║
║  │  ⚠ EM TRENDING — CONTAMINATION PATHWAY                CFR 211.42  │ ║
║  │    ISO 7 Room B viable counts trending upward over 3 weeks         │ ║
║  │    (3→4→6 CFU). Below action limit but approaching alert.          │ ║
║  │    Correlated: Daily cleaning was late 2 of last 5 days.          │ ║
║  │    Action: Root cause investigation recommended.                   │ ║
║  │    → Auto-correlated: cleaning log gaps on 04/05 and 04/07        │ ║
║  │                                                                    │ ║
║  │  ⚠ STABILITY PROGRAM GAP                              CFR 211.166 │ ║
║  │    No stability protocol on file for Cisplatin 1mg/mL             │ ║
║  │    (CIS-01-INJ, draft formula). Must be established before        │ ║
║  │    production begins.                                              │ ║
║  │    Action: PIC must define stability protocol + testing schedule   │ ║
║  │                                                                    │ ║
║  └────────────────────────────────────────────────────────────────────┘ ║
║                                                                         ║
║  ┌─── DATA INTEGRITY CHECK ──────────────────────────────────────────┐ ║
║  │                                                                    │ ║
║  │  Audit trail integrity:   ✓ No gaps detected (continuous sequence)│ ║
║  │  Shared account check:    ✓ No shared logins (all unique users)   │ ║
║  │  Clock sync:              ✓ All devices within 1 second of NTP    │ ║
║  │  Failed login patterns:   ✓ No unusual patterns detected          │ ║
║  │  Post-close modifications:✓ 0 batch records modified post-release │ ║
║  │  Segregation of duties:   ✓ All batches have ≥2 unique signers   │ ║
║  │                                                                    │ ║
║  └────────────────────────────────────────────────────────────────────┘ ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## Screen A4: System Events (`/admin/events`)

**Real-time system health and security events.**

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <Activity /> System Events                                              │
│  Security, system health, and automated actions                          │
└──────────────────────────────────────────────────────────────────────────┘

┌─ TABS ──────────────────────────────────────────────────────────────────┐
│  [ Security ]  [ System Jobs ]  [ API Health ]  [ Client Devices ]      │
└─────────────────────────────────────────────────────────────────────────┘

═══ Security Events ════════════════════════════════════════════════════════

  ┌──────────┬──────────────┬────────────┬────────────────────────────────┐
  │ Time     │ User         │ Event      │ Detail                         │
  ├──────────┼──────────────┼────────────┼────────────────────────────────┤
  │ 09:13    │ Carlos T.    │ LOGIN OK   │ iPad 10.0.1.45 (PIN)          │
  │ 08:45    │ Marcus Q.    │ LOGIN OK   │ Web 192.168.1.10 (Password)   │
  │ 08:02    │ Alex P.      │ LOGIN FAIL │ Web 192.168.1.22 (bad pwd)    │
  │ 08:01    │ Alex P.      │ LOGIN FAIL │ Web 192.168.1.22 (bad pwd)    │
  │ 07:30    │ David W.     │ LOGIN OK   │ Web 192.168.1.12 (Password)   │
  │ 06:15    │ Rosa M.      │ LOGIN OK   │ iPad 10.0.1.48 (Face ID)      │
  └──────────┴──────────────┴────────────┴────────────────────────────────┘

  ⚠ Alex P. has 2 consecutive failed logins (threshold: 5)

═══ System Jobs ════════════════════════════════════════════════════════════

  ┌──────────┬──────────────────────────────┬──────────┬─────────────────┐
  │ Time     │ Job                          │ Result   │ Detail          │
  ├──────────┼──────────────────────────────┼──────────┼─────────────────┤
  │ 07:00    │ Cron: Lot expiry check       │ ✓ Ran    │ 2 lots expired  │
  │ 07:00    │ Cron: Training expiry check  │ ✓ Ran    │ 1 new expiry    │
  │ 07:00    │ Cron: Calibration due check  │ ✓ Ran    │ 0 new overdue   │
  │ 07:00    │ Cron: Low stock alerts       │ ✓ Ran    │ 3 items below   │
  │ 07:00    │ Cron: EM sample schedule     │ ✓ Ran    │ 12 samples due  │
  │ 07:00    │ Cron: Cleaning schedule      │ ✓ Ran    │ 1 overdue room  │
  │ 06:00    │ Backup: Full database        │ ✓ OK     │ 2.4 GB (encrypted)│
  │ 00:00    │ Audit trail integrity check  │ ✓ OK     │ No gaps/tampers │
  └──────────┴──────────────────────────────┴──────────┴─────────────────┘
```

---

## Screen A5: System Settings (`/admin/settings`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <Settings /> System Settings                                           │
│  Organization and security configuration                                 │
└──────────────────────────────────────────────────────────────────────────┘

┌─ TABS ──────────────────────────────────────────────────────────────────┐
│  [ Organization ]  [ Security ]  [ Notifications ]  [ Integrations ]   │
└─────────────────────────────────────────────────────────────────────────┘

═══ Organization ═══════════════════════════════════════════════════════════

  Facility Name:      [CompoundRx Pharmacy______________]
  FDA FEI Number:     [3012345678_______________________]
  DEA Number:         [CS1234567_________________________]
  State License:      [PH-2024-00456____________________]
  Address:            [123 Pharma Way, Suite 100, Dallas TX 75201]
  Timezone:           [America/New_York ▼]

═══ Security (21 CFR Part 11) ══════════════════════════════════════════════

  ── Session Management ──
  Web Session Timeout:       [30_] minutes  (R9)
  iPad Session Timeout:      [5__] minutes  (R9, cleanroom)
  Max Failed Logins:         [5__] attempts (R10)
  Lockout Duration:          [30_] minutes  (R10)

  ── E-Signature Policy ──
  Require PIN for E-Sig:     [x] Yes
  Allow Biometric E-Sig:     [x] Yes  (Face ID / Touch ID)
  Minimum PIN Length:         [6__] digits
  Require unique meaning:     [x] Yes  ("performed" | "reviewed" | "approved")

  ── Password Policy ──
  Min Length:                  [8__] characters
  Require uppercase:           [x] Yes
  Require number:              [x] Yes
  Require special char:        [ ] No
  Password expiry:             [90_] days  (0 = never)

  ── Data Integrity ──
  Audit trail:                 ✓ Enabled (cannot be disabled)
  Audit trail storage:         ✓ Append-only (WORM policy)
  Clock synchronization:       ✓ NTP: time.nist.gov
  Backup frequency:            [Daily ▼]
  Backup encryption:           ✓ AES-256

═══ Notifications ══════════════════════════════════════════════════════════

  ── Escalation Rules ──
  Deviation aging > 30 days:   Notify: [VP, QA Manager ▼]
  CAPA overdue:                Notify: [QA Manager, PIC ▼]
  Calibration overdue:         Notify: [Maintenance, QA Manager ▼]
  EM action excursion:         Notify: [Microbiologist, QA Manager ▼]
  Training expiry (30d):       Notify: [User, Training Coordinator ▼]
  Inventory stockout risk:     Notify: [Warehouse, Procurement ▼]

  ── Channels ──
  [x] In-app notifications
  [x] Email alerts
  [ ] SMS (requires Twilio)
  [ ] Slack webhook

═══ Integrations ═══════════════════════════════════════════════════════════

  PK Software:      [ ] Not connected      [ Configure ]
  Eagle Analytics:   [ ] Not connected      [ Configure ]
  Scale (BAL-004):   [x] Serial connected   [ Recalibrate ]
  pH Meter (PH-002): [x] Serial connected   [ Recalibrate ]
```

---

## Audit Trail Technical Requirements

```
EVERY ROW IN THE AUDIT LOG MUST CONTAIN:
├── id:              UUID (immutable primary key)
├── timestamp:       ISO 8601 with timezone (server clock, NTP-synced)
├── user_id:         FK to users (or "SYSTEM" for automated actions)
├── user_name:       Denormalized for faster reads
├── user_role:       Role at time of action
├── action:          CREATE | UPDATE | DELETE | SIGN | LOGIN | SCAN | CRON
├── table_name:      Which database table was affected
├── record_id:       PK of the affected record
├── old_value:       JSON — previous state (null for CREATE)
├── new_value:       JSON — new state
├── ip_address:      Client IP
├── device_type:     "web" | "ipad" | "system"
├── device_info:     User agent / app version
├── session_id:      FK to session (for traceability chain)
├── batch_id:        FK if action relates to a batch (for genealogy queries)
└── org_id:          Organization scope (multi-tenant)

CONSTRAINTS:
├── No UPDATE allowed on this table (INSERT-only via DB trigger)
├── No DELETE allowed (even admin cannot delete)
├── No row-level security bypass
├── Sequence column for gap detection
├── Daily integrity check via cron (detect any gaps/tampering)
└── 7-year retention minimum (FDA requirement)
```

---

*Next: [15-reports.md](./15-reports.md) — Analytics & export*
