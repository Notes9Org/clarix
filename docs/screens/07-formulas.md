---
id: SCR-007
title: Master Formulas (Catalog & Editor)
version: "1.1"
status: approved
priority: P0
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [211.186, 211.100]
urs_refs: [URS-013, URS-014]
frs_refs: [FRS-018, FRS-019, FRS-020]
---
# 07 — Master Formulas (Catalog & Editor)

> **Users:** pic, pharmacist, prod_mgr (read-only)
> **Routes:** `/formulas`, `/formulas/[id]/edit`
> **Priority:** P0
> **Persona:** Dr. Priya (PIC) — "Version-controlled recipes with full audit trail"
> **21 CFR Part 11 Scope:** Formula versioning, change control, scale-up/scale-down

## Revision History

| Version | Date       | Author  | Change Description                  | Approved By |
| ------- | ---------- | ------- | ----------------------------------- | ----------- |
| 1.0     | 2026-04-05 | fillsai | Initial formula specification       | fillsai     |
| 1.1     | 2026-04-07 | fillsai | Added frontmatter, scale-up feature | fillsai     |

---

## Screen F1: Formula Catalog (`/formulas`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <FlaskConical /> Master Formulas                    [ + New Formula ]   │
│  Version-controlled compounding formulas                                 │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  Status: [All ▼]   Form: [All ▼]   Hazardous: [All ▼]   [Search_____] │
└──────────────────────────────────────────────────────────────────────────┘

┌───────────┬─────────────────────────┬───────┬───────────┬──────┬────────┐
│ Code      │ Product                 │ Ver   │ Status    │ Form │ HD     │
├───────────┼─────────────────────────┼───────┼───────────┼──────┼────────┤
│ FAM-20-INJ│ Famotidine 20mg/mL     │ v1.1  │[✓ Approved]│ Inj │        │
│ OND-04-INJ│ Ondansetron 4mg/mL     │ v2.0  │[✓ Approved]│ Inj │        │
│ KET-15-INJ│ Ketorolac 15mg/mL      │ v1.0  │[✓ Approved]│ Inj │        │
│ MPR-40-INJ│ Methylprednisolone 40mg│ v1.0  │[◷ Pending] │ Inj │        │
│ CIS-01-INJ│ Cisplatin 1mg/mL       │ v1.0  │[◦ Draft]   │ Inj │ ⚠ HD  │
│ MET-50-TOP│ Metronidazole 5% Cream │ v1.0  │[◦ Draft]   │ Top │        │
└───────────┴─────────────────────────┴───────┴───────────┴──────┴────────┘
```

---

## Screen F2: Formula Editor (`/formulas/[id]/edit`)

**Scenario:** Dr. Priya builds/edits a formula with steps and components.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Formulas                                                              │
│                                                                          │
│  Famotidine 20mg/mL Injection        v1.1   [✓ Approved]                 │
│  FAM-20-INJ  ·  PIC Approved: Dr. Priya  ·  2026-03-15                   │
└──────────────────────────────────────────────────────────────────────────┘

┌─ TABS ──────────────────────────────────────────────────────────────────┐
│  [ Details ]  [ Components (BOM) ]  [ Steps ]  [ Versions ]             │
└─────────────────────────────────────────────────────────────────────────┘

═══ TAB: Details ═══════════════════════════════════════════════════════════

┌────────────────────────────┐  ┌────────────────────────────────────────┐
│  PRODUCT INFO              │  │  QUALITY PARAMETERS                    │
│                            │  │                                        │
│  Product Name:             │  │  Target pH:        7.00                │
│  [Famotidine 20mg/mL_____] │  │  pH Tolerance:     ± 0.3               │
│                            │  │  Target Osmolality: 300 mOsm/kg        │
│  Product Code:             │  │  Osm Tolerance:    ± 10%               │
│  [FAM-20-INJ_____________] │  │                                        │
│                            │  │  Sterile:          [x] Yes             │
│  Dosage Form:  [Injectable ▼]││  Preservative Free: [x] Yes            │
│  Route:        [IV / IM___]│  │  Hazardous Drug:   [ ] No              │
│  Fill Volume:  [2.00___] mL│  │                                        │
│  Container:    [10mL Vial_]│  │  BUD Category:     [Cat 3 ▼]           │
│  Closure:      [20mm ButylStoppr]│  BUD Days:     [90_]                │
│  Batch Size:   [200__] units│ │  Storage:    [Refrigerated 2-8°C ▼]    │
│  Overfill %:   [10___] %   │  │                                        │
└────────────────────────────┘  └────────────────────────────────────────┘

═══ TAB: Components (BOM) ══════════════════════════════════════════════════

┌───┬──────────────────────────┬──────────┬──────┬──────┬─────────┬──────┐
│ # │ Component                │ Qty/Batch│ Unit │ API? │ Critical│      │
├───┼──────────────────────────┼──────────┼──────┼──────┼─────────┼──────┤
│ 1 │ Famotidine USP           │ 10.000   │ g    │  ✓   │    ✓    │ ✎ ✕  │
│ 2 │ Sodium Chloride USP      │ 18.000   │ g    │      │         │ ✎ ✕  │
│ 3 │ Sterile Water (WFI)      │ 1000.000 │ mL   │      │         │ ✎ ✕  │
│ 4 │ NaOH 1N Solution         │ q.s.     │ mL   │      │         │ ✎ ✕  │
│ 5 │ HCl 1N Solution          │ q.s.     │ mL   │      │         │ ✎ ✕  │
└───┴──────────────────────────┴──────────┴──────┴──────┴─────────┴──────┘
                                                          [ + Add Component ]

═══ TAB: Steps (Step Builder) ══════════════════════════════════════════════

┌───┬────────────┬──────────────────────────────────────┬──────────┬─────┐
│ # │ Type       │ Instruction                          │ Req Sign │     │
├───┼────────────┼──────────────────────────────────────┼──────────┼─────┤
│ 1 │ checklist  │ Verify all supplies gathered         │   ✓      │ ✎ ↕ │
│ 2 │ signature  │ Gown & enter cleanroom               │   ✓      │ ✎ ↕ │
│ 3 │ measurement│ Weigh Famotidine USP (10g ±2%)       │   ✓      │ ✎ ↕ │
│ 4 │ measurement│ Weigh NaCl (18g ±2%)                 │   ✓      │ ✎ ↕ │
│ 5 │ data_entry │ Dissolve in WFI qs to 1000mL         │          │ ✎ ↕ │
│ 6 │ measurement│ Adjust pH to 7.0 ±0.3                │   ✓      │ ✎ ↕ │
│ 7 │ instruction│ Filter through 0.22μm PES filter     │   ✓      │ ✎ ↕ │
│ 8 │ measurement│ Bubble point test (≥50 psi)          │   ✓      │ ✎ ↕ │
│ 9 │ timer      │ Fill vials (15 min process)          │   ✓      │ ✎ ↕ │
│10 │ instruction│ Stopper & crimp seal                 │   ✓      │ ✎ ↕ │
│11 │ checklist  │ Visual inspection (clarity, particulates)│ ✓    │ ✎ ↕ │
│12 │ checklist  │ Label & package                      │   ✓      │ ✎ ↕ │
└───┴────────────┴──────────────────────────────────────┴──────────┴─────┘
  ↕ = drag to reorder    ✎ = edit step    ✕ = delete       [ + Add Step ]
```

### Step Editor Modal (when clicking ✎)

```
┌──────────────────────────────────────────────────────────────┐
│  Edit Step #3                                                 │
│                                                               │
│  Step Type:     [measurement ▼]                               │
│  Instruction:   [Weigh Famotidine USP Powder_______________] │
│  Section:       [Admixing ▼]                                  │
│                                                               │
│  ── Measurement Config ──                                     │
│  Data Type:     [weight ▼]       Unit: [g ▼]                 │
│  Target Value:  [10.000__]                                    │
│  Tolerance Low: [9.800___]       Tolerance High: [10.200__]  │
│                                                               │
│  ── Requirements ──                                           │
│  [x] Requires e-signature    Meaning: [performed ▼]          │
│  [ ] Requires witness                                         │
│  [x] Requires barcode scan   Pattern: [FAM-*_______]         │
│  [ ] Requires photo                                           │
│  [x] Critical step (highlighted in QA review)                 │
│                                                               │
│  Equipment: [BAL-004 Analytical Balance ▼]                    │
│  Component: [Famotidine USP ▼]                                │
│                                                               │
│  Help Text: [Use tare function before weighing_____________] │
│                                                               │
│                               [ Cancel ]  [ Save Step ]       │
└──────────────────────────────────────────────────────────────┘
```

---

## Formula Approval Flow

```
PIC creates/edits formula
     │
     ▼
Status: DRAFT → Click "Submit for Review"
     │
     ▼
Status: PENDING REVIEW
     │
     ├─ Another PIC or admin reviews
     │
     ├─ Approve (with e-signature)
     │     └─ Status: APPROVED, effective_date set
     │
     └─ Request changes → back to DRAFT

Version control:
  Edit approved formula → auto creates v(N+1) as DRAFT
  Previous version → SUPERSEDED (superseded_by → new ID)
  Old batches reference v1.0, new batches use v1.1
```

---

## Scale-Up / Scale-Down (Competitive Feature — Matches InstantGMP)

> When a formula's target yield changes (e.g., from 100 units to 500 units),
> the system auto-creates a new version with recalculated component quantities.

```
┌─────────────────────────────────────────────────────────┐
│  Scale Formula: Vancomycin 1g/250mL                     │
│                                                          │
│  Current yield:  [100 units    ]                        │
│  Target yield:   [500 units____]  ← user enters new qty │
│                                                          │
│  Scaling factor: 5.0x                                    │
│                                                          │
│  ┌──────────────────┬──────────┬──────────┬────────────┐│
│  │ Component        │ Original │ Scaled   │ Status     ││
│  ├──────────────────┼──────────┼──────────┼────────────┤│
│  │ Vancomycin HCl   │ 100.0 g  │ 500.0 g  │ ✓ In stock││
│  │ WFI              │ 25.0 L   │ 125.0 L  │ ⚠ Low     ││
│  │ NaCl 0.9%        │ 5.0 L    │ 25.0 L   │ ✓ In stock││
│  └──────────────────┴──────────┴──────────┴────────────┘│
│                                                          │
│  ⚠ WFI: Current stock 80L — need 125L (short 45L)      │
│                                                          │
│  [ Cancel ]                    [ Create Scaled Version ] │
│                                   ↑ Creates v(N+1) DRAFT │
└─────────────────────────────────────────────────────────┘
```

### Scale-Up/Down Rules

1. Scaling factor = target_yield / current_yield
2. All component quantities are multiplied by the scaling factor
3. System checks current inventory against new quantities
4. If any component is short, warning is shown (does NOT block creation)
5. New version is created as DRAFT with `scaled_from` reference
6. Equipment requirements may change at different scales (manual review flag)
7. Step times that are quantity-dependent must be reviewed manually

---

## Acceptance Criteria (for IQ/OQ/PQ Validation)

### Screen F1: Formula Catalog

- [ ] AC-F1-01: Formula list displays name, version, status badge, BUD, yield
- [ ] AC-F1-02: Search filters by name, NDC, dosage form
- [ ] AC-F1-03: Status filter shows only selected status (Draft/Approved/Superseded)
- [ ] AC-F1-04: Click row navigates to formula detail
- [ ] AC-F1-05: Only pic/pharmacist roles see "Create Formula" button (Rule R3)
- [ ] AC-F1-06: Superseded formulas show greyed row with link to current version

### Screen F2: Formula Editor

- [ ] AC-F2-01: All required fields validated before save (name, NDC, yield, BUD)
- [ ] AC-F2-02: Component BOM allows add/remove/reorder with drag
- [ ] AC-F2-03: Step builder enforces sequential step numbering
- [ ] AC-F2-04: "Submit for Review" changes status from DRAFT to PENDING_REVIEW
- [ ] AC-F2-05: Version N+1 auto-created when editing an approved formula
- [ ] AC-F2-06: Previous version set to SUPERSEDED with `superseded_by` reference
- [ ] AC-F2-07: Scale-up/down creates new version with correct quantity math
- [ ] AC-F2-08: E-signature required for approval (21 CFR Part 11)
- [ ] AC-F2-09: Audit trail records all changes with old_value/new_value

---

## Error & Edge Cases

```
EDGE CASE: Scale-down to very small quantities
├── Component qty < 0.01g → warning: "Quantity below measurable threshold"
├── System suggests minimum viable batch size
└── pharmacist review required before approval

EDGE CASE: Formula with component discontinued by vendor
├── Component status shows ⊘ DISCONTINUED
├── Formula cannot be approved until replacement component selected
└── All batches using this formula are flagged

EDGE CASE: Concurrent formula editing
├── Optimistic locking with version check
├── If conflict detected: "This formula was modified by [user] at [time]"
├── User can view diff and merge or discard
└── Last-writer-wins is NOT acceptable per cGMP

ERROR: Invalid BUD calculation
├── BUD must be 1-180 days for 503B
├── BUD > 180 days → error: "BUD exceeds USP <797> maximum"
└── BUD field shows helper: "Based on sterility testing and stability data"

ERROR: Circular superseded_by reference
├── System prevents formula from referencing itself
├── Validation at database level: CHECK constraint
└── UI prevents selecting same formula ID as superseded_by

EMPTY STATE: No formulas created yet
├── Show: "No master formulas yet"
├── CTA: "Create your first formula to begin compounding"
└── Only visible to pic/pharmacist roles
```

---

## Data Requirements

```
Server Actions needed:
├── getFormulas()         → paginated list with status filter
├── getFormula(id)        → single formula with BOM, steps, history
├── createFormula(data)   → new formula as DRAFT
├── updateFormula(id, data) → edit with version increment
├── submitForReview(id)   → status DRAFT → PENDING_REVIEW
├── approveFormula(id, pin) → status → APPROVED (e-sig required)
├── rejectFormula(id, reason) → status → DRAFT with comment
├── scaleFormula(id, targetYield) → create new DRAFT with scaled BOM
└── getFormulaHistory(id) → audit trail for formula changes

Database tables accessed:
├── master_formulas (CRUD)
├── formula_steps (CRUD, linked to formula)
├── formula_components (CRUD, linked to formula)
├── e_signatures (write: approval e-sig)
├── audit_trail (write: all mutations)
└── inventory_items (read: stock check for scale-up)
```

---

*Next: [08-inventory.md](./08-inventory.md) — Stock levels, receiving, vendors*
