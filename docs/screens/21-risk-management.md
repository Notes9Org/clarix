---
id: SCR-021
title: Risk Management (ICH Q9 / FMEA / Risk Register)
version: "1.0"
status: approved
priority: P1
author: fillsai
created: 2026-04-08
last_reviewed: 2026-04-08
change_control: CC-2026-003
cfr_references: [211.100, 211.192, "211.42"]
urs_refs: [URS-047, URS-048, URS-049]
frs_refs: [FRS-054, FRS-055, FRS-056]
---

# 21 — Risk Management (ICH Q9 / FMEA / Risk Register)

> **Users:** qa_manager, pic, prod_mgr, admin
> **Routes:** `/risk`, `/risk/register`, `/risk/[id]`, `/risk/fmea`
> **Priority:** P1
> **Persona:** QA Manager + PIC — "We proactively identify and control risk before it reaches the patient"
> **21 CFR Part 11 Scope:** Risk assessment records, FMEA worksheets, risk register audit trail
> **Regulatory basis:** ICH Q9 (Quality Risk Management), ICH Q10 (PQS), USP 1120 (Raman Spectroscopy),
>   FDA Guidance for Industry: Quality Systems Approach to cGMP Regulations (2006)

## Revision History

| Version | Date       | Author  | Change Description               | Approved By |
|---------|------------|---------|----------------------------------|-------------|
| 1.0     | 2026-04-08 | fillsai | Initial risk management spec     | fillsai     |

---

## Why Risk Management Is Critical for 503B

> ICH Q9 requires that pharmaceutical organizations implement a **formal quality risk management process**
> that covers risk identification, analysis, evaluation, control, review, and communication. For 503B
> compounders, risks span sterility assurance, formula criticality, personnel competency, equipment failure,
> and supply chain disruption. This module makes those risks visible, traceable, and actively controlled —
> and critically, links every risk to the deviations, CAPAs, and change controls that arise from them.

---

## Screen RM1: Risk Register (`/risk/register`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <ShieldAlert /> Risk Register                      [ + Add Risk Item ]  │
│  Facility-wide quality risk register — ICH Q9 aligned                   │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  Category: [All ▼]  Residual Risk: [All ▼]  Owner: [All ▼]  [Search__] │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  RISK SUMMARY                                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ TOTAL RISKS  │ │ HIGH         │ │ MEDIUM       │ │ LOW          │   │
│  │              │ │ (RPN > 200)  │ │ (RPN 50-200) │ │ (RPN < 50)   │   │
│  │     24       │ │      3       │ │      9       │ │     12       │   │
│  │  in register │ │  ✕ Action    │ │  ⚠ Monitor   │ │  ✓ Accept.  │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘

┌────────┬─────────────┬─────────────────────────────┬──────┬──────┬──────┐
│ Risk # │ Category    │ Risk Description             │ RPN  │ Res. │      │
│        │             │                              │(calc)│ Risk │      │
├────────┼─────────────┼─────────────────────────────┼──────┼──────┼──────┤
│ RSK-01 │ Sterility   │ CSI contamination during     │ 320  │ ●HIGH│  →  │
│        │ Assurance   │ aseptic compounding —        │      │      │      │
│        │             │ inadequate garbing           │      │      │      │
│ RSK-02 │ Product     │ Incorrect concentration from │ 240  │ ●HIGH│  →  │
│        │ Quality     │ expired reagents (NaOH, etc.)│      │      │      │
│ RSK-03 │ Supply Chain│ Single-source API stockout   │ 210  │ ●HIGH│  →  │
│        │             │ (Ketorolac — 1 supplier)     │      │      │      │
│ RSK-04 │ Equipment   │ Balance calibration drift    │ 160  │ ⚠MED │  →  │
│        │             │ affecting weighing accuracy   │      │      │      │
│ RSK-05 │ Personnel   │ Key person dependency —      │ 150  │ ⚠MED │  →  │
│        │             │ only 1 HD-qualified tech      │      │      │      │
│ RSK-06 │ EM          │ ISO 7 room trending — if     │ 140  │ ⚠MED │  →  │
│        │             │ action limit breached         │      │      │      │
│ ...    │ ...         │ ...                          │ ...  │ ...  │  →  │
└────────┴─────────────┴─────────────────────────────┴──────┴──────┴──────┘

  RPN = Severity (1-10) × Occurrence (1-10) × Detectability (1-10)
  ●HIGH: RPN > 200 → Control required, CAPA or Change Control must be initiated
  ⚠MED:  RPN 50–200 → Monitor quarterly, control measures documented
  ✓LOW:  RPN < 50  → Accept with periodic review
```

---

## Screen RM2: Risk Item Detail (`/risk/[id]`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Risk Register                                                         │
│  RSK-2026-002                                                ●HIGH RISK  │
│  Incorrect Concentration from Expired Reagents                           │
│  Category: Product Quality  ·  Owner: Marcus Q. (QA)  ·  Created 03/01 │
└──────────────────────────────────────────────────────────────────────────┘

┌─ TABS ──────────────────────────────────────────────────────────────────┐
│  [ Risk Analysis ]  [ Control Measures ]  [ Linked Events ]  [ History ] │
└─────────────────────────────────────────────────────────────────────────┘

═══ Risk Analysis Tab ══════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  FMEA WORKSHEET                                                          │
│                                                                          │
│  Risk Title: Incorrect concentration from use of expired in-house        │
│              reagents (NaOH, buffer solutions) during compounding        │
│                                                                          │
│  Failure Mode:  Technician uses expired NaOH solution for pH adjustment  │
│  Effect:        pH out of specification → subpotent or superpotent drug  │
│  Cause:         No system-enforced expiry check at point of use          │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │  INITIAL ASSESSMENT                                              │    │
│  │                                                                  │    │
│  │  Severity (S):         8/10  — OOS product, patient risk         │    │
│  │  Occurrence (O):       6/10  — 1 event in 12 months             │    │
│  │  Detection (D):        7/10  — not caught until QC or complaint  │    │
│  │                        ─────                                     │    │
│  │  Initial RPN:          336   — ●HIGH RISK                        │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │  RESIDUAL RISK (after CC-0012 — barcode expiry enforcement)      │    │
│  │                                                                  │    │
│  │  Severity (S):         8/10  — unchanged (consequence same)      │    │
│  │  Occurrence (O):       2/10  — system now prevents use ↓         │    │
│  │  Detection (D):        2/10  — system alert at point of use ↓    │    │
│  │                        ─────                                     │    │
│  │  Residual RPN:         32    — ✓LOW RISK  (90.5% reduction)      │    │
│  │  Residual Risk Status: ✓ Acceptable                              │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  RISK COMMUNICATION:                                                     │
│  [x] Risk disclosed to facility VP in management review (03/15/2026)    │
│  [x] Risk described in CAPA-005 justification                            │
│  [x] Residual risk assessed and approved by PIC (04/06/2026)            │
└──────────────────────────────────────────────────────────────────────────┘

═══ Control Measures Tab ════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  RISK CONTROL MEASURES                                                   │
│                                                                          │
│  Measure                      Type       Linked To     Status           │
│  ────────────────────────────────────────────────────────────────────── │
│  Barcode expiry enforcement   Elimination CC-2026-0012 ✓ Implemented    │
│  on all in-house reagents     (system)                                   │
│  NaOH 1N 30-day labeling SOP Reduction   SOP-001 v3.1  ◷ In Progress    │
│  (administrative control)     (SOP)       (draft)                       │
│  Technician retraining on     Awareness   CAPA-005      ◷ In Progress    │
│  reagent expiry management    (training)  Training Plan                  │
│                                                                          │
│  Control Hierarchy (ICH Q9):                                             │
│  1. Elimination > 2. Substitution > 3. Engineering > 4. Admin > 5. PPE  │
│  Current control: Level 3 (Engineering — system-enforced)                │
└──────────────────────────────────────────────────────────────────────────┘

═══ Linked Events Tab ═══════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  RISK HISTORY & LINKED QUALITY EVENTS                                    │
│                                                                          │
│  This risk was first identified from:                                    │
│  → DEV-2026-003  pH OOS — Batch #2026-0846  (04/04/2026)               │
│                                                                          │
│  Actions taken:                                                          │
│  → CAPA-005      Implement NaOH expiry tracking  (Active — 04/14 due)  │
│  → CC-2026-0012  Update pH adjustment procedure  (Pending PIC approval) │
│                                                                          │
│  Similar events (trend analysis):                                        │
│  → No prior events found for this risk category in previous 12 months   │
│                                                                          │
│  Related risks:                                                          │
│  → RSK-004  Balance calibration drift (same category: product quality)  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Screen RM3: Risk Dashboard Overview (`/risk`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <ShieldAlert /> Quality Risk Management          [ Export Risk Report ] │
│  ICH Q9-aligned risk register · Last reviewed: 03/15/2026               │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  RISK HEAT MAP  (Severity × Occurrence)                                  │
│                                                                          │
│  Severity →  Low (1-3)    Medium (4-6)   High (7-10)                    │
│  ─────────────────────────────────────────────────────────               │
│  Occur. High│              RSK-03         RSK-01                        │
│  (7-10)     │              Supply Chain   Sterility                     │
│             │                                                            │
│  Occur. Med │              RSK-04         RSK-02                        │
│  (4-6)      │              Equipment      Reagent Expiry                │
│             │                             RSK-06 EM                     │
│             │                                                            │
│  Occur. Low │  RSK-12..    RSK-05         —                             │
│  (1-3)      │  (8 items)   Personnel                                    │
│  ─────────────────────────────────────────────────────────               │
│             ●LOW            ⚠MEDIUM        ●HIGH                         │
│                                                                          │
│  Legend: Each cell shows risk count. Click to see risk items.            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  RISKS REQUIRING IMMEDIATE ACTION (RPN > 200)                            │
│                                                                          │
│  RSK-001  Sterility Assurance  RPN: 320  Owner: Dr. Priya  [Open →]    │
│           Control gap: garbing observation program — no formal schedule  │
│                                                                          │
│  RSK-002  Reagent Expiry       RPN: 336→32  Owner: Marcus Q [Resolving]│
│           Control implemented: CC-0012 (barcode expiry) — residual LOW  │
│                                                                          │
│  RSK-003  API Stockout         RPN: 210  Owner: Procurement [Open →]   │
│           Control gap: single-source supplier for Ketorolac USP          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  RISK REVIEW SCHEDULE                                                    │
│                                                                          │
│  HIGH risks:   Quarterly review (next: 06/15/2026)                      │
│  MEDIUM risks: Semi-annual review (next: 09/15/2026)                    │
│  LOW risks:    Annual review (next: 03/15/2027)                         │
│                                                                          │
│  Last management review: 03/15/2026  ·  Reviewed by: Dr. Priya (PIC)   │
│  Next management review due: 06/15/2026                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Risk Categories for 503B Compounders

```
Category              Examples                                     CFR / USP
─────────────────────────────────────────────────────────────────────────────
Sterility Assurance   Garbing failure, HVAC excursion,            USP 797 §6
                      contamination during aseptic fill
Product Quality       OOS concentration, pH error,                211.100
                      particulate matter, wrong API
Equipment             Calibration drift, equipment failure,        211.63–68
                      laminar flow hood integrity
Personnel             Training expiry, key person dependency,      211.25
                      inadequate qualification
Supply Chain          Single-source supplier, stockout risk,       211.80–86
                      COA failure
Environmental         EM trending, HVAC failure, cleanroom        211.42–46
                      classification drift
Software / Data       System failure, data integrity breach,       Part 11
  Integrity           unauthorized access
Regulatory            Citation risk, inspection readiness,         All CFR
  Compliance          documentation gaps
```

---

## Business Rules

```
Rule RM1: Any new deviation automatically prompts QA to assess if it represents a new risk item
Rule RM2: HIGH risks (RPN > 200) must have a control measure (CAPA or CC) within 30 days of identification
Rule RM3: Residual risk must be assessed and approved by PIC before a risk item can be closed
Rule RM4: Risk register must be reviewed quarterly for HIGH items, semi-annually for MEDIUM
Rule RM5: Management review must include risk register summary (ICH Q10 requirement)
Rule RM6: FMEA worksheet must document S, O, D scores and their rationale before RPN is calculated
Rule RM7: When a change control or CAPA closes, QA is prompted to re-assess any linked risk items
Rule RM8: New complaints or deviations automatically suggest potentially related risk register items
```

---

## Acceptance Criteria (for IQ/OQ/PQ Validation)

- [ ] AC-RM1-01: Risk register shows all risk items with RPN, category, owner, and residual risk
- [ ] AC-RM1-02: Heat map visualization renders severity vs. occurrence matrix with correct color coding
- [ ] AC-RM1-03: FMEA worksheet captures S, O, D scores and auto-calculates RPN
- [ ] AC-RM1-04: Control measure linking to CAPA, CC, and SOP records works bidirectionally
- [ ] AC-RM1-05: Risk review reminders sent to risk owner at scheduled intervals
- [ ] AC-RM1-06: PIC e-signature required for residual risk acceptance
- [ ] AC-RM1-07: Dashboard widget shows count of HIGH risks requiring action
- [ ] AC-RM1-08: Export function generates PDF risk report with all FMEA data and signatures
- [ ] AC-RM1-09: Audit trail captures all RPN changes and score updates with user + timestamp
- [ ] AC-RM1-10: New deviation/complaint creation prompts optional risk register linking

---

## Data Requirements

```
Server Actions / API Endpoints needed:
├── getRiskRegister(filters)
├── createRiskItem(category, description, cause, effect)
├── updateFMEA(riskId, severity, occurrence, detection, rationale)
├── addControlMeasure(riskId, measure, type, linkedId)
├── submitResidualRiskAssessment(riskId, assessment, picEsig)
├── closeRiskItem(riskId, justification, esig)
├── getRiskHeatmapData()
└── exportRiskReport(format: 'pdf')

Database tables:
├── risk_items (id, category, title, failure_mode, effect, cause, owner)
├── risk_fmea (risk_id, severity, occurrence, detection, initial_rpn, rationale)
├── risk_controls (risk_id, measure, type, linked_entity_type, linked_entity_id, status)
├── risk_residual (risk_id, residual_s, residual_o, residual_d, residual_rpn, pic_esig_hash)
├── risk_reviews (risk_id, reviewed_by, review_date, findings)
└── risk_links (risk_id, deviation_id, capa_id, cc_id, complaint_id)
```

---

*Next: [22-management-review.md](./22-management-review.md) — Periodic management review dashboard and report generation*
