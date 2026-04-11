---
id: SCR-005
title: Batch Lifecycle (List → Detail → Review → Release)
version: "1.1"
status: approved
priority: P0
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [211.68, 211.188, 211.192]
urs_refs: [URS-007, URS-008, URS-009]
frs_refs: [FRS-011, FRS-012, FRS-013, FRS-014]
---
# 05 — Batch Lifecycle (List → Detail → Review → Release)

> **Users:** prod_mgr, pic, pharmacist, qa_manager, qa_specialist
> **Routes:** `/batches`, `/batches/[id]`, `/batches/[id]/review`
> **Priority:** P0
> **Core flow:** The most critical workflow in the entire platform
> **21 CFR Part 11 Scope:** Electronic batch records, Review-by-Exception, e-signatures

## Revision History

| Version | Date       | Author  | Change Description                     | Approved By |
| ------- | ---------- | ------- | -------------------------------------- | ----------- |
| 1.0     | 2026-04-05 | fillsai | Initial batch lifecycle specification  | fillsai     |
| 1.1     | 2026-04-07 | fillsai | Added frontmatter, acceptance criteria | fillsai     |

---

## Screen B1: Batch List (`/batches`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <ClipboardList /> Batches                          [ + Create Batch ]   │
│  All batch records                                                       │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  Status: [All ▼]  Product: [All ▼]  Date: [Last 30 days ▼]  [Search__]   │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────┬────────────────────┬────────────┬───────────┬─────────┬──────┐
│ Batch #  │ Product            │ Technician │ Status    │ Yield   │      │
├──────────┼────────────────────┼────────────┼───────────┼─────────┼──────┤
│ 2026-0847│ Famotidine 20mg/mL │ Carlos T.  │[↻ Step7/12]│  —     │  →   │
│ 2026-0848│ Ondansetron 4mg/mL │ Maria R.   │[↻ Step3/8] │  —     │  →   │
│ 2026-0846│ Ketorolac 15mg/mL  │ James W.   │[◷ Pending] │ 97.8%  │  →   │
│ 2026-0845│ Methylpred 40mg/mL │ Carlos T.  │[◷ Pending] │ 98.1%  │  →   │
│ 2026-0844│ Famotidine 20mg/mL │ Maria R.   │[✓ Released]│ 99.2%  │  →   │
│ 2026-0843│ Ondansetron 4mg/mL │ Carlos T.  │[✓ Released]│ 96.5%  │  →   │
│ 2026-0842│ Famotidine 20mg/mL │ James W.   │[✕ Rejected]│ 89.1%  │  →   │
└──────────┴────────────────────┴────────────┴───────────┴─────────┴──────┘
  Showing 1–7 of 234                                      [ ← 1 2 3 ... → ]
```

---

## Screen B2: Batch Detail (`/batches/[id]`)

**Scenario:** QA Manager clicks batch #2026-0847 to see full record.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Back to Batches                                                       │
│                                                                          │
│  Batch #2026-0847                               [↻ In Progress]          │
│  Famotidine 20mg/mL Injection                                            │
│  Formula: FAM-20-INJ v1.1  ·  Size: 200 units  ·  BUD: 2026-06-07        │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ PROGRESS     │ │ YIELD        │ │ DEVIATIONS   │ │ TECHNICIAN   │
│  Step 7/12   │ │    —         │ │     1        │ │  Carlos T.   │
│  58%         │ │  pending     │ │  open        │ │  On step 7   │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

┌─ TABS ──────────────────────────────────────────────────────────────────┐
│  [ Steps ]  [ Components ]  [ Signatures ]  [ Deviations ]  [ History ] │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  STEP EXECUTION TIMELINE                                                │
│                                                                          │
│  #  │ Step                 │ Value         │ Status  │ Signed    │ Time  │
│  ───┼──────────────────────┼───────────────┼─────────┼───────────┼────── │
│  1  │ Verify supplies      │ —             │ ✓ Done  │ Carlos T. │ 09:14 │
│  2  │ Gown & enter room    │ —             │ ✓ Done  │ Carlos T. │ 09:22 │
│  3  │ Weigh Famotidine     │ 10.04g ✓      │ ✓ Done  │ Carlos T. │ 09:35 │
│     │                      │ (target 10g ±2%)│       │           │       │
│  4  │ Weigh NaCl           │ 18.00g ✓      │ ✓ Done  │ Carlos T. │ 09:48 │
│  5  │ Dissolve in WFI      │ 1000mL        │ ✓ Done  │ Carlos T. │ 10:05 │
│  6  │ Adjust pH            │ 6.82 ✓        │ ✓ Done  │ Carlos T. │ 10:22 │
│     │                      │ (target 7.0 ±0.3)│      │           │       │
│  7  │ Filter sterilize     │ —             │[↻ Now]  │ —         │ —     │
│  8  │ Bubble point test    │ —             │ ○ Next  │ —         │ —     │
│  9  │ Fill vials           │ —             │ ○       │ —         │ —     │
│  10 │ Stopper & crimp      │ —             │ ○       │ —         │ —     │
│  11 │ Visual inspection    │ —             │ ○       │ —         │ —     │
│  12 │ Labeling & packaging │ —             │ ○       │ —         │ —     │
│                                                                          │
└────────────────────────────────────────────────────────────────────────-─┘
```

### Step Row States

```
✓ Done:     bg: transparent, check icon green, value shown
↻ Active:   bg: status-info-bg, blue left border, pulsing dot
○ Pending:  text: muted-foreground, no value
⚠ OOS:      bg: status-error-bg, red left border, deviation link
⊘ Skipped:  text: muted-foreground, strikethrough, "QA approved"
```

---

## Screen B3: Batch Review — Review-by-Exception (`/batches/[id]/review`)

**Review-by-Exception (RbE):** The system auto-analyzes the entire batch record and
surfaces ONLY the items that need human attention. Zero-flag batches can be approved
in under 2 minutes instead of the traditional 45-minute line-by-line review.

**Scenario:** Marcus (QA) opens batch #2026-0846 review. System already flagged issues.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <ClipboardCheck /> Batch Review — Review by Exception                   │
│  #2026-0846  ·  Ketorolac 15mg/mL  ·  [◷ Pending Review]                 │
│  Formula: KET-15-INJ v1.0  ·  Lot Size: 150 units  ·  BUD: 06/07/26      │
└──────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════════════════╗
║  EXCEPTION SUMMARY — 1 FLAG REQUIRES ATTENTION                           ║
║                                                                          ║
║  ✕ FLAG 1: Open deviation linked (DEV-2026-003)                          ║
║    Step 6 — pH reading 6.52 (below tolerance 6.70)                       ║
║    Investigation status: Under review by Marcus Q.                       ║
║    Rule B11: Cannot approve with open deviation                          ║
║    [ View Deviation → ]                                                  ║
║                                                                          ║
║  ── AUTO-VERIFIED (no flags) ──────────────────────────────────────      ║
║  ✓ All 8 steps completed with e-signatures                               ║
║  ✓ All measurement values within tolerance (except Step 6 — flagged)     ║
║  ✓ All barcode scans matched expected patterns                           ║
║  ✓ All component lots: released, unexpired, COA verified                 ║
║  ✓ All equipment calibrated at time of use                               ║
║  ✓ Technician fully qualified at time of execution                       ║
║  ✓ Separation of duties: 1 executor + 1 reviewer (2 unique users)        ║
║  ✓ Yield 97.8% within acceptable range (target: >95%)                    ║
║  ✓ Total execution time: 3h 41m (reasonable for this formula)            ║
║  ✓ No post-execution edits detected in audit trail                       ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### Tabbed Detail Panels

```
┌─ TABS ──────────────────────────────────────────────────────────────────┐
│  [Exception Detail]  [Step Data]  [Materials]  [Equipment]  [Lab]       │
└─────────────────────────────────────────────────────────────────────────┘

═══ Step Data (collapsed — expand any step to see detail) ══════════════════

┌───┬──────────────────┬───────────────────┬───────┬──────────┬──────────┐
│ # │ Step             │ Value             │ Spec  │ Status   │ Signed   │
├───┼──────────────────┼───────────────────┼───────┼──────────┼──────────┤
│ 1 │ Verify supplies  │ —                 │ —     │ ✓ Pass   │ Carlos T.│
│ 2 │ Gown & enter     │ —                 │ —     │ ✓ Pass   │ Carlos T.│
│ 3 │ Weigh Ketorolac  │ 7.52g             │ 7.50±2%│ ✓ Pass  │ Carlos T.│
│ 4 │ Weigh NaCl       │ 13.50g            │13.50±2%│ ✓ Pass  │ Carlos T.│
│ 5 │ Dissolve in WFI  │ 750 mL            │ qs 750│ ✓ Pass   │ Carlos T.│
│ 6 │ Adjust pH        │ 6.52              │7.0±0.3│ ⚠ FLAG   │ Carlos T.│
│   │                  │ ✕ BELOW TOLERANCE │       │ DEV-003  │          │
│ 7 │ Filter sterilize │ —                 │ —     │ ✓ Pass   │ Carlos T.│
│ 8 │ Bubble point     │ 54 psi            │ ≥50psi│ ✓ Pass   │ Carlos T.│
└───┴──────────────────┴───────────────────┴───────┴──────────┴──────────┘

═══ Materials Traceability ═════════════════════════════════════════════════

┌─────────────────────┬────────────────┬──────────┬──────────┬──────────┐
│ Component           │ Lot            │ Vendor   │ COA      │ Expiry   │
├─────────────────────┼────────────────┼──────────┼──────────┼──────────┤
│ Ketorolac Trometh.  │ KET-2026-018   │ Spectrum │ ✓ Verified│ 2027-01 │
│ Sodium Chloride     │ NaCl-2026-055  │ Spectrum │ ✓ Verified│ 2027-06 │
│ NaOH 1N Solution    │ NaOH-2026-012  │ Letco    │ ✓ Verified│ 2026-10 │
│ WFI Sterile Water   │ WFI-2026-088   │ In-house │ N/A       │ 2026-05 │
│ 0.22μm PES Filter   │ FIL-2026-004   │ Millipore│ ✓ Verified│ 2027-09 │
└─────────────────────┴────────────────┴──────────┴──────────┴──────────┘
  All lots: ✓ Released  ·  ✓ Unexpired  ·  ✓ COA on file

═══ Lab Results ════════════════════════════════════════════════════════════

┌──────────────────┬────────────┬──────────┬──────────┬──────────────────┐
│ Test             │ Lab        │ Status   │ Result   │ Spec             │
├──────────────────┼────────────┼──────────┼──────────┼──────────────────┤
│ Sterility        │ Eagle      │ ✓ Pass   │ No growth│ USP <71>         │
│ Endotoxin (BET)  │ Eagle      │ ✓ Pass   │ <0.25 EU │ <0.5 EU/mL       │
│ Potency          │ Eagle      │ ✓ Pass   │ 99.2%    │ 90–110%          │
│ Particulate      │ In-house   │ ✓ Pass   │ 2 /10mL  │ ≤25 /container   │
│ Visual           │ In-house   │ ✓ Pass   │ 0 rejects│ Clear, no part.  │
└──────────────────┴────────────┴──────────┴──────────┴──────────────────┘
  All tests: ✓ Pass

─────────────────────────────────────────────────────────────────────────

  REVIEW DECISION:

  Review Notes:
  [pH deviation under investigation. NaOH lot suspected._____________]
  [Corrective action in progress (CAPA-005). Awaiting closure.________]

  [ APPROVE → Pending Release ]    [ REJECT ]    [ Request More Info ]

  ⚠ BLOCKED: Cannot approve — 1 open deviation (DEV-2026-003)
  Rule B11: All linked deviations must be closed before batch release.
  [ View DEV-2026-003 → ]
```

### Zero-Flag Fast-Track Review (for clean batches)

```
╔══════════════════════════════════════════════════════════════════════════╗
║  EXCEPTION SUMMARY — 0 FLAGS ✓                                         ║
║                                                                         ║
║  ✓ This batch has ZERO exceptions. All auto-checks passed.             ║
║  Fast-track approval eligible — review time: ~2 minutes.               ║
║                                                                         ║
║  ✓ All steps completed with valid e-signatures                          ║
║  ✓ All measurements within tolerance                                    ║
║  ✓ All components verified (lot, COA, expiry)                           ║
║  ✓ All equipment calibrated                                             ║
║  ✓ Technician qualified · separation of duties met                     ║
║  ✓ Yield within range · no post-execution modifications                ║
║  ✓ All lab results: PASS                                                ║
║  ✓ No linked deviations                                                 ║
║                                                                         ║
║               [ APPROVE → Pending Release ]    [ Expand Details ]       ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## Batch Status Lifecycle

```
                    ┌────────┐
                    │ DRAFT  │  ← Created by prod_mgr
                    └───┬────┘
                        │ Start batch (assign tech)
                        ▼
                ┌───────────────┐
                │ IN PROGRESS   │  ← Tech executing on iPad
                └───┬───────────┘
                    │  │
           On hold ◄┘  │ All steps completed
                    │   │ → auto-submit
                    │   ▼
              ┌─────────────────┐
              │ PENDING REVIEW  │  ← Awaiting QA
              └───┬─────────────┘
                  │ QA Manager starts review
                  ▼
              ┌─────────────────┐
              │ UNDER REVIEW    │  ← QA actively reviewing
              └───┬──────┬──────┘
                  │      │
            Approve│    Reject│
                  │      │
                  ▼      ▼
       ┌────────────┐  ┌──────────┐
       │ PENDING    │  │ REJECTED │  ← rejection_reason required (B9)
       │ RELEASE    │  └──────────┘
       └───┬────────┘
           │ PIC e-signs release (B8)
           ▼
       ┌──────────┐
       │ RELEASED │  ← BUD date set, ready for distribution
       └──────────┘

  Rules enforced:
  B7: Only qa_manager/qa_specialist can approve
  B8: Only PIC can release
  B6: Separation of duties — min 2 distinct users
  B11: Cannot release with open deviations
```

---

*Next: [06-ipad-batch-execution.md](./06-ipad-batch-execution.md) — Step-by-step iPad cleanroom UX*

---

## Acceptance Criteria (for IQ/OQ/PQ Validation)

### Screen B1: Batch List

- [ ] AC-B1-01: Batch list loads with status filter tabs (All/Active/Review/Released)
- [ ] AC-B1-02: Search by batch number, formula name, or NDC works within 1 second
- [ ] AC-B1-03: Status badges use correct color coding per design system
- [ ] AC-B1-04: Click row navigates to batch detail (`/batches/[id]`)
- [ ] AC-B1-05: Only authorized roles can see "Create Batch" button (Rule R3)

### Screen B2: Batch Detail

- [ ] AC-B2-01: Header shows batch number, formula, status, assigned technician, timestamps
- [ ] AC-B2-02: Step timeline displays all execution steps with pass/fail indicators
- [ ] AC-B2-03: Material traceability section lists all components with lot numbers
- [ ] AC-B2-04: Linked deviations section shows any deviations opened during execution
- [ ] AC-B2-05: Lab Results tab shows all pending/completed test results

### Screen B3: Review-by-Exception

- [ ] AC-B3-01: Zero-flag batches show green banner: "No flags — eligible for fast-track"
- [ ] AC-B3-02: Flagged steps are highlighted with amber/red indicators
- [ ] AC-B3-03: Reviewer can expand any step to see full data, photos, e-signatures
- [ ] AC-B3-04: "Approve" button requires e-signature (PIN or biometric)
- [ ] AC-B3-05: "Reject" button requires mandatory reason field
- [ ] AC-B3-06: Reviewer cannot be same user as executor (Rule B6)

### Screen B4: Release

- [ ] AC-B4-01: Release blocked if open deviations exist (Rule B11)
- [ ] AC-B4-02: Release blocked if lab results pending
- [ ] AC-B4-03: Successful release triggers BUD calculation and label generation
- [ ] AC-B4-04: Release event recorded in audit trail with e-signature
- [ ] AC-B4-05: Batch status changes to RELEASED with timestamp

---

## Error & Edge Cases

```
EDGE CASE: Batch with partial execution (technician shift change)
├── New technician must re-authenticate on iPad
├── Previous steps remain locked — cannot be modified
├── Audit trail shows technician handoff with timestamps
└── Both technicians' names appear in batch record

EDGE CASE: Review-by-Exception with 0 flags but missing lab results
├── Zero-flag banner still shows (execution was clean)
├── Release button is DISABLED with tooltip: "Awaiting lab results"
├── Reviewer can approve but batch stays in APPROVED (not RELEASED)
└── Auto-releases when lab results pass (if configured)

EDGE CASE: Batch reject after partial release
├── NOT POSSIBLE — once released, batch cannot be unreleased
├── Quality recall process required instead
├── Links to deviation creation flow
└── Audit trail preserves release AND recall events

ERROR: Concurrent review attempts
├── Optimistic locking — first reviewer wins
├── Second reviewer sees: "Batch is being reviewed by [name]"
├── Real-time lock released after 10min inactivity
└── Admin can force-release lock via /admin/settings

EMPTY STATE: No batches in system
├── Show: "No batches created yet"
├── CTA: "Create your first batch" → /batches/create
└── Links to formula setup if no formulas exist

LOADING STATE:
├── Batch list: Table skeleton with 10 rows
├── Batch detail: Content skeleton with header + timeline placeholder
├── Review screen: Full page skeleton with step cards
└── All loaders timeout after 10s → error state
```

---

## Data Requirements

```
Server Actions needed:
├── getBatches(filters)     → paginated list with status/date/formula filters
├── getBatch(id)            → full batch with steps, materials, deviations, labs
├── createBatch(formulaId)  → new batch from formula (status: SCHEDULED)
├── startBatch(id)          → status SCHEDULED → IN_PROGRESS
├── reviewBatch(id)         → load Review-by-Exception view
├── approveBatch(id, pin)   → status → APPROVED (e-sig required)
├── rejectBatch(id, reason, pin) → status → REJECTED (e-sig required)
├── releaseBatch(id, pin)   → status → RELEASED (e-sig + lab check)
├── getBatchTimeline(id)    → execution steps with timestamps
└── getBatchFlags(id)       → flagged steps for review-by-exception

Database tables accessed:
├── batches (CRUD)
├── batch_step_records (read: execution data)
├── batch_components_used (read: material traceability)
├── deviations (read: linked deviations)
├── lab_samples (read: pending results check)
├── e_signatures (write: review/release signatures)
├── master_formulas (read: formula reference)
└── audit_trail (write: all batch events)
```

---
