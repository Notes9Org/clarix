---
id: SCR-018
title: Change Control Management
version: "1.0"
status: approved
priority: P1
author: fillsai
created: 2026-04-08
last_reviewed: 2026-04-08
change_control: CC-2026-003
cfr_references: [211.100, 211.68, 211.180, "Part 11.10"]
urs_refs: [URS-038, URS-039, URS-040]
frs_refs: [FRS-045, FRS-046, FRS-047]
---

# 18 — Change Control Management

> **Users:** qa_manager, pic, admin, prod_mgr
> **Routes:** `/change-control`, `/change-control/[id]`
> **Priority:** P1
> **Persona:** Marcus (QA Manager) — "Every change must be evaluated, approved, and its impact verified"
> **21 CFR Part 11 Scope:** Full change request lifecycle, multi-role e-signatures, impact assessment, effectiveness verification
> **Regulatory basis:** 21 CFR 211.100 (written procedures), ICH Q10 PQS, USP 797 §7 Change Control

## Revision History

| Version | Date       | Author  | Change Description              | Approved By |
|---------|------------|---------|---------------------------------|-------------|
| 1.0     | 2026-04-08 | fillsai | Initial change control spec     | fillsai     |

---

## Why Change Control Is Critical for 503B

> A 503B compounder modifying **any** validated process, formula, equipment, facility, supplier, SOP, or software
> must capture the change through a formal, documented workflow. Without this, FDA inspectors can issue 483s for
> "lack of written procedures for production and process controls" (21 CFR 211.100) and data integrity failures.
> This module closes that gap entirely.

---

## Screen CC1: Change Control List (`/change-control`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <GitBranch /> Change Control                      [ + Initiate Change ] │
│  Formal change management for processes, formulas, equipment & systems   │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  Category: [All ▼]  Status: [All ▼]  Impact: [All ▼]  [Search________] │
│  Date Range: [Last 90 days ▼]                                            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  SUMMARY                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ OPEN        │ │ PENDING     │ │ IMPLEMENTED │ │ REJECTED    │       │
│  │             │ │ APPROVAL    │ │ (verifying) │ │             │       │
│  │      4      │ │      2      │ │      1      │ │      1      │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────┬──────────┬─────────────────────────────┬──────────┬──────────┬──────┐
│ CC #    │ Category │ Description                  │ Impact   │ Status   │      │
├─────────┼──────────┼─────────────────────────────┼──────────┼──────────┼──────┤
│ CC-0012 │ Process  │ Update pH adj. step — NaOH  │ ● Major  │[◷ Pending]│  →  │
│         │          │ expiry check procedure       │          │ approval │      │
│ CC-0011 │ Supplier │ Add Spectrum Alt. supplier   │ ● Major  │[◷ Pending]│  →  │
│         │          │ for 0.22μm PES filters       │          │ approval │      │
│ CC-0010 │ Equipment│ Replace BAL-004 balance      │ ● Major  │[↻ Impact │  →  │
│         │          │ with Mettler XPR 204         │          │  Assess.]│      │
│ CC-0009 │ SOP      │ SOP-002 EM freq. update      │ ○ Minor  │[↻ Open]  │  →  │
│ CC-0008 │ Formula  │ Famotidine concentration     │ ● Major  │[✓ Verif.]│  →  │
│         │          │ range 20→20±0.5 mg/mL        │          │ Complete │      │
│ CC-0007 │ Software │ Clarix system upgrade v1.2   │ ● Major  │[✕ Reject]│  →  │
└─────────┴──────────┴─────────────────────────────┴──────────┴──────────┴──────┘

  Impact levels:
  ● Major  = affects formula, validated process, regulatory filing, or patient safety
  ○ Minor  = administrative, cosmetic, or non-GMP area change
```

---

## Screen CC2: Change Request Detail (`/change-control/[id]`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Change Control                                                        │
│  CC-2026-0012                                      [◷ Pending Approval] │
│  Update pH Adjustment Procedure — NaOH Expiry Check                     │
│  Initiated: 04/04  ·  Initiator: Carlos Thompson  ·  Days Open: 4      │
└──────────────────────────────────────────────────────────────────────────┘

┌─ TABS ──────────────────────────────────────────────────────────────────┐
│  [ Request ]  [ Impact Assessment ]  [ Approvals ]  [ Implementation ]  │
│  [ Effectiveness ]  [ History ]                                          │
└─────────────────────────────────────────────────────────────────────────┘

═══ Request Tab ════════════════════════════════════════════════════════════

┌──────────────────────────────┐  ┌────────────────────────────────────────┐
│  CHANGE REQUEST INFO         │  │  LINKED RECORDS                        │
│                              │  │                                        │
│  Category: Process           │  │  Triggered by Deviation:               │
│  Priority: Major             │  │  DEV-2026-003 (pH OOS)                 │
│  Linked CAPA: CAPA-005       │  │                                        │
│  Linked Deviation: DEV-003   │  │  Affects Formula(s):                   │
│  Initiated by: Carlos T.     │  │  MPR-40-INJ (Famotidine 20mg)         │
│  Assigned to: Marcus Q. (QA) │  │  MPR-38-INJ (Ketorolac 15mg)          │
│                              │  │                                        │
│  Estimated Impact:           │  │  Affects SOP(s):                       │
│  ● Product Quality           │  │  SOP-001 Aseptic Compounding v3.0      │
│  ○ Regulatory Filing         │  │                                        │
│  ○ Validated System          │  │  Affects Equipment:                    │
│  ○ Supplier / Supply Chain   │  │  None                                  │
└──────────────────────────────┘  └────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  DESCRIPTION OF CHANGE                                                   │
│                                                                          │
│  Current State:                                                          │
│  NaOH 1N solution is prepared in-house and used without a formal expiry  │
│  check procedure. No system tracking of open container date.             │
│                                                                          │
│  Proposed Change:                                                        │
│  1. NaOH 1N solutions will be labeled with "prepared date" at point of   │
│     preparation using Clarix barcode generation.                         │
│  2. Each batch step requiring NaOH will include a mandatory barcode scan │
│     that verifies the solution is < 30 days from preparation date.       │
│  3. If expired: batch step blocked, auto-deviation raised (DEV auto).    │
│                                                                          │
│  Justification / Business Case:                                          │
│  DEV-2026-003 was caused by use of an expired NaOH 1N solution. This    │
│  change prevents recurrence through system-enforced expiry checking.     │
│                                                                          │
│  Revalidation Required? [ ] Yes  [x] No                                 │
│  Reason: Change is additive to the existing step — no formula, process   │
│  parameter, or equipment change that would affect critical attributes.   │
└──────────────────────────────────────────────────────────────────────────┘

═══ Impact Assessment Tab ══════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  IMPACT ASSESSMENT MATRIX                          [✓ Assessment Saved] │
│                                                                          │
│  Completed by: Marcus Q. (QA Manager)  ·  Date: 04/05/2026              │
│                                                                          │
│  AREA                    │ IMPACT? │ DETAILS / ACTION REQUIRED           │
│  ────────────────────────┼─────────┼──────────────────────────────────── │
│  Product Quality         │ [x] Yes │ Risk reduced — NaOH concentration  │
│                          │         │ will now be verified at point of    │
│                          │         │ use. No change to product spec.    │
│  Validated Systems       │ [ ] No  │ —                                  │
│  Regulatory (NDA/ANDA)   │ [ ] No  │ 503B — no filing required          │
│  Supplier / Supply Chain │ [ ] No  │ —                                  │
│  Patient Safety          │ [x] Yes │ Risk reduced — prevents incorrect  │
│                          │         │ pH in injectable products           │
│  Personnel Training      │ [x] Yes │ Technicians require training on    │
│                          │         │ new barcode labeling procedure      │
│  Environmental / Facility│ [ ] No  │ —                                  │
│  Other SOPs / Documents  │ [x] Yes │ SOP-001 requires update to v3.1    │
│                          │         │ to include NaOH expiry procedure   │
│                                                                          │
│  Overall Risk Rating: ● Medium → [✓ Low] (after change implementation) │
│                                                                          │
│  FMEA Score (pre-change): Severity 8 · Occurrence 6 · Detection 7      │
│                            RPN = 336                                     │
│  FMEA Score (post-change): Severity 8 · Occurrence 2 · Detection 2     │
│                             RPN = 32  (90% risk reduction)               │
└──────────────────────────────────────────────────────────────────────────┘

═══ Approvals Tab ══════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  APPROVAL WORKFLOW                                                       │
│                                                                          │
│  Step 1  QA Manager Review    Marcus Q.       [✓ Approved 04/05 09:22]  │
│  Step 2  PIC Sign-Off         Dr. Priya Shah  [◷ Pending — sent 04/05] │
│  Step 3  Operations Review    Prod. Manager   [◦ Not Started]           │
│                                                                          │
│  ┌──────── APPROVAL PANEL (Dr. Priya) ─────────────────────────────┐   │
│  │                                                                  │   │
│  │  You are reviewing: CC-2026-0012                                 │   │
│  │  Impact: ● Major (product quality + training)                    │   │
│  │  Estimated implementation: 3–5 business days                     │   │
│  │                                                                  │   │
│  │  Comments (required):                                            │   │
│  │  [_____________________________________________________________] │   │
│  │                                                                  │   │
│  │  E-signature (21 CFR Part 11.50):                                │   │
│  │  Meaning: "I approve this change as described"                   │   │
│  │  Password: [___________]                                         │   │
│  │                                                                  │   │
│  │  [ ✓ Approve ]   [ ✕ Reject ]   [ … Request More Info ]        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘

═══ Implementation Tab ═════════════════════════════════════════════════════

```
┌──────────────────────────────────────────────────────────────────────────┐
│  IMPLEMENTATION TASKS                                     [ + Add Task ] │
│                                                                          │
│  [x] Update barcode label template in Clarix inventory module      Done  │
│      Completed by: Admin · 04/06 · Sign: [e-sig captured]               │
│  [x] Update batch formula step for NaOH to require barcode scan    Done  │
│      Completed by: Marcus Q. · 04/06 · Sign: [e-sig captured]           │
│  [ ] Retrain all compounding technicians (7 staff)          Due: 04/12  │
│      Assigned to: Training Coordinator                                   │
│  [ ] Update SOP-001 to v3.1                                 Due: 04/10  │
│      Assigned to: Marcus Q. (QA)                                         │
│  [ ] Close linked CAPA-005 after training complete          Due: 04/14  │
│      Assigned to: Marcus Q. (QA)                                         │
│                                                                          │
│  Implementation Progress:  ████████░░░░  2 of 5 tasks complete (40%)   │
└──────────────────────────────────────────────────────────────────────────┘
```

═══ Effectiveness Tab ══════════════════════════════════════════════════════

```
┌──────────────────────────────────────────────────────────────────────────┐
│  EFFECTIVENESS VERIFICATION                                              │
│                                                                          │
│  Status: [◦ Pending Implementation Completion]                           │
│                                                                          │
│  Effectiveness criteria (defined at approval):                           │
│  ✓ Zero NaOH-related pH deviations in next 90 days after go-live        │
│  ✓ 100% of affected technicians trained and signed off                   │
│  ✓ SOP-001 v3.1 approved and in use                                      │
│  ✓ Barcode scanner successfully blocking expired NaOH in pilot test      │
│                                                                          │
│  Verification Review Date: 07/14/2026   Assigned to: Marcus Q. (QA)    │
│                                                                          │
│  NOTE: Rule CC3 — Effectiveness must be verified by a different user    │
│         than the change implementer to prevent confirmation bias.        │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Change Control Lifecycle

```
  ┌──────────┐
  │ DRAFT    │  ← Initiated by any user
  └────┬─────┘
       │
       ▼
  ┌──────────────────────┐
  │ IMPACT ASSESSMENT    │  ← QA completes FMEA, affected areas matrix
  └────┬─────────────────┘
       │
       ▼
  ┌──────────────────────┐
  │ PENDING APPROVAL     │  ← Sequential multi-role sign-off; all must approve
  └────┬────────────┬────┘
       │            │
       ▼            ▼
  ┌─────────┐  ┌──────────┐
  │ REJECTED│  │ APPROVED │
  └─────────┘  └────┬─────┘
                    │
                    ▼
              ┌──────────────────────┐
              │ IMPLEMENTATION       │  ← Tasks assigned, tracked in-app
              └────┬─────────────────┘
                   │
                   ▼
              ┌──────────────────────┐
              │ EFFECTIVENESS VERIFY │  ← Different user; 30–90 day window
              └────┬─────────────────┘
                   │
                   ▼
              ┌──────────┐
              │ CLOSED   │  ← Links CAPA closure, SOP version control
              └──────────┘
```

---

## Change Control Categories

```
Category           CFR / USP Basis                  Approval Required
─────────────────────────────────────────────────────────────────────
Process Change     21 CFR 211.100, USP 797 §7       QA + PIC
Formula Change     21 CFR 211.186                   QA + PIC + ProdMgr
Equipment Change   21 CFR 211.63–211.68             QA + Maintenance
Supplier Change    21 CFR 211.80–211.86             QA + PIC
SOP / Document     21 CFR 211.180                   QA
Environmental      21 CFR 211.42–211.46             QA + Micro
Software / System  21 CFR Part 11                   Admin + QA + PIC
Personnel / Role   21 CFR 211.25                    QA + Admin
```

---

## Business Rules

```
Rule CC1: Major impact changes require minimum 3-person approval chain
Rule CC2: PIC e-signature always required for formula and process changes
Rule CC3: Effectiveness verification must be performed by a different user than implementer
Rule CC4: Batch records created after the "effective date" must reference the CC number
Rule CC5: Cannot close CAPA until linked change control is in "Effectiveness" or "Closed" status
Rule CC6: Revalidation flag triggers creation of a validation task in Admin > System Events
Rule CC7: Rejected change control gets locked — a new CC must be initiated to re-propose
Rule CC8: Change control record is immutable once "Closed" — all amendments require a new CC
```

---

## Acceptance Criteria (for IQ/OQ/PQ Validation)

- [ ] AC-CC1-01: User can initiate a change request with category, description, justification fields
- [ ] AC-CC1-02: Impact assessment matrix captures all 8 impact areas with Yes/No + details
- [ ] AC-CC1-03: FMEA RPN calculation auto-populates from Severity × Occurrence × Detection inputs
- [ ] AC-CC1-04: Approval workflow enforces sequential role order — Step 2 cannot start until Step 1 approved
- [ ] AC-CC1-05: E-signature at approval captures meaning, timestamp, user ID per Part 11.50
- [ ] AC-CC1-06: "Rejected" state locks further editing — audit trail records rejection reason
- [ ] AC-CC1-07: Implementation tasks can be created, assigned, and checked off with e-signature
- [ ] AC-CC1-08: Effectiveness verification due date is auto-set at 90 days after implementation complete
- [ ] AC-CC1-09: Linked deviations, CAPAs, SOPs, formulas appear in the Linked Records panel
- [ ] AC-CC1-10: Change control number is auto-generated in format CC-YYYY-NNNN
- [ ] AC-CC1-11: Dashboard summary widget shows open/pending/closed counts with drill-down links
- [ ] AC-CC1-12: Audit trail logs every status change with user, timestamp, IP address

---

## Error & Edge Cases

```
APPROVAL CHAIN CONFLICT:
├── If the initiator is also a required approver → they cannot approve their own change
├── System prompts admin to assign a substitute approver
└── Logged as a conflict event in the audit trail

REVALIDATION REQUIRED:
├── Admin receives a "Validation Task" alert
├── Implementation tasks cannot be marked complete until revalidation task is linked
└── Batch records from the affected formula cannot be started until revalidation is closed

CHANGE CONFLICTS WITH IN-PROGRESS BATCH:
├── System checks if any batch is currently active that uses the changed formula/SOP
├── Warning banner: "Batch #XXXX is currently in progress — change will apply to future batches only"
└── Option to block or allow at PIC discretion
```

---

## Data Requirements

```
Server Actions / API Endpoints needed:
├── createChangeRequest(payload)
├── updateImpactAssessment(ccId, matrix)
├── submitForApproval(ccId)
├── approveChangeStep(ccId, stepId, esig)
├── rejectChange(ccId, reason, esig)
├── addImplementationTask(ccId, task)
├── completeImplementationTask(ccId, taskId, esig)
├── submitEffectivenessVerification(ccId, result, esig)
└── closeChangeControl(ccId)

Database tables:
├── change_controls (id, category, description, status, impact_level)
├── change_approvals (cc_id, step, role, user_id, status, esig_hash, timestamp)
├── change_impact_areas (cc_id, area, impacted, details)
├── change_tasks (cc_id, task, assigned_to, due_date, completed_at, esig_hash)
├── change_effectiveness (cc_id, criteria, result, verified_by, verified_at)
└── change_links (cc_id, linked_type, linked_id)
```

---

*Next: [19-supplier-quality.md](./19-supplier-quality.md) — Supplier qualification, scorecards, and approved supplier list*
