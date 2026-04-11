---
id: SCR-019
title: Supplier Quality Management
version: "1.0"
status: approved
priority: P1
author: fillsai
created: 2026-04-08
last_reviewed: 2026-04-08
change_control: CC-2026-003
cfr_references: [211.80, 211.82, 211.84, 211.86]
urs_refs: [URS-041, URS-042, URS-043]
frs_refs: [FRS-048, FRS-049, FRS-050]
---
# 19 — Supplier Quality Management

> **Users:** qa_manager, pic, procurement, admin
> **Routes:** `/suppliers`, `/suppliers/[id]`, `/suppliers/approved-list`
> **Priority:** P1
> **Persona:** QA Manager + Procurement — "Only qualified, approved suppliers touch our products"
> **21 CFR Part 11 Scope:** Supplier qualification records, audit findings, COA lifecycle
> **Regulatory basis:** 21 CFR 211.80–211.86 (components from approved suppliers), USP 797 §5 (Component Verification), ICH Q10

## Revision History

| Version | Date       | Author  | Change Description            | Approved By |
| ------- | ---------- | ------- | ----------------------------- | ----------- |
| 1.0     | 2026-04-08 | fillsai | Initial supplier quality spec | fillsai     |

---

## Why Supplier Quality Management Is Critical for 503B

> 21 CFR 211.80 requires "written procedures for the receipt, identification, storage, handling, sampling,
> testing, and approval or rejection of components." A 503B compounder must maintain an **Approved Supplier List
> (ASL)**, verify COAs against specifications, and have a documented process for supplier qualification.
> Today's inventory module tracks lots but doesn't close the supplier lifecycle loop — this module does.

---

## Screen SQ1: Supplier Directory (`/suppliers`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <Building2 /> Supplier Quality                  [ + Qualify Supplier ]  │
│  Approved supplier list, qualification status, and performance tracking  │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  Status: [All ▼]  Category: [All ▼]  Risk: [All ▼]  [Search_________]  │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  ASL SUMMARY                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ APPROVED     │ │ CONDITIONAL  │ │ SUSPENDED    │ │ DISQUALIFIED │   │
│  │              │ │              │ │              │ │              │   │
│  │      8       │ │      2       │ │      1       │ │      0       │   │
│  │  on ASL      │ │  watch list  │ │ ⚠ blocked    │ │              │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘

┌────────┬───────────────────────┬──────────────┬────────┬──────────┬──────┐
│ Vendor │ Name                  │ Supplies     │ Risk   │ Status   │      │
├────────┼───────────────────────┼──────────────┼────────┼──────────┼──────┤
│ VND-01 │ Spectrum Chemical     │ APIs, Excip. │ ● Low  │[✓ Approved]│  → │
│ VND-02 │ Letco Medical         │ APIs, Excip. │ ● Med  │[✓ Approved]│  → │
│ VND-03 │ West Pharma           │ Stoppers,    │ ● Low  │[✓ Approved]│  → │
│        │                       │ Seals        │        │          │      │
│ VND-04 │ Eagle Analytical      │ Lab Services │ ● Low  │[✓ Approved]│  → │
│ VND-05 │ Fisher Scientific     │ Lab Supplies │ ● Low  │[✓ Approved]│  → │
│ VND-06 │ AmeriSource (new)     │ APIs         │ ● High │[◷ Qualif.]│  → │
│ VND-07 │ Generic Chem Co.      │ Excipients   │ ● High │[⚠ Suspen.]│  → │
└────────┴───────────────────────┴──────────────┴────────┴──────────┴──────┘

  Risk Score based on: delivery history, NCR rate, audit findings, COA compliance rate
  ● Low  = score ≥ 85    ● Medium = 70–84    ● High = < 70
```

---

## Screen SQ2: Supplier Detail Profile (`/suppliers/[id]`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Suppliers                                                             │
│  Spectrum Chemical Co.                              [✓ Approved Supplier]│
│  VND-2024-001  ·  APIs & Excipients  ·  FDA registered manufacturer     │
└──────────────────────────────────────────────────────────────────────────┘

┌─ TABS ──────────────────────────────────────────────────────────────────┐
│  [ Profile ]  [ Scorecard ]  [ Qualification ]  [ COA History ]         │
│  [ NCRs & CAPAs ]  [ Audit History ]  [ Documents ]                     │
└─────────────────────────────────────────────────────────────────────────┘

═══ Profile Tab ════════════════════════════════════════════════════════════

┌──────────────────────────────┐  ┌────────────────────────────────────────┐
│  SUPPLIER INFO               │  │  COMPLIANCE CREDENTIALS                │
│                              │  │                                        │
│  Legal Name: Spectrum        │  │  FDA Establishment Reg: ✓ Current     │
│              Chemical Co.    │  │  Reg # 1020-10234  ·  Exp: 12/31/26  │
│  HQ: Gardena, CA             │  │                                        │
│  Contact: Sarah J. (QA Mgr) │  │  ISO 9001:2015: ✓ Certified            │
│  Phone: (310) 555-0192       │  │  Cert # ISO-2024-445  ·  Exp: 06/26  │
│  Email: qm@spectrumchem.com  │  │                                        │
│                              │  │  DEA Schedule: ✓ Schedule III          │
│  Primary Categories:         │  │  License # DEA-35-A-0044              │
│  ✓ USP APIs                  │  │                                        │
│  ✓ USP Excipients            │  │  State Pharmacy Board Reg: ✓          │
│  ✓ Reference Standards       │  │  CA Board # MFG-2022-0892             │
│                              │  │                                        │
│  Account #: SPEC-2024-001    │  │  Last Verified by: Marcus Q. · 01/26  │
│  Payment Terms: Net 30       │  │  Next Re-verification Due: 01/27       │
└──────────────────────────────┘  └────────────────────────────────────────┘

═══ Scorecard Tab ══════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  PERFORMANCE SCORECARD  (rolling 12 months)                              │
│                                                                          │
│  Overall Risk Score: 96/100  ●● Low Risk                                │
│  ████████████████████████████████████████████████████████░░░░  96%      │
│                                                                          │
│  ┌─── DELIVERY PERFORMANCE ──────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  On-Time Delivery Rate:    98.2%  ████████████████████████░ ✓     │  │
│  │  Avg Lead Time:             3.2 days (promised: 5 days) ✓ Fast    │  │
│  │  Partial Shipments:            1  (in 12 months)                  │  │
│  │  Back-Ordered Items:            0                                  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─── QUALITY PERFORMANCE ───────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  COA Provided with Shipment:  100% ✓                              │  │
│  │  COA Meets Spec on Receipt:    97% ✓  (2 lots retested, passed)  │  │
│  │  Lots Rejected on Receipt:       1  (1.2%)                        │  │
│  │  Non-Conformance Reports (NCRs): 1                                │  │
│  │  Certified to USP standards:   Yes — verified 12/2025             │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─── RESPONSIVENESS ────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  NCR Response Time Avg:     2.1 days (target: <5 days) ✓         │  │
│  │  Audit Findings Resolved:   3 of 3 (100%) ✓                      │  │
│  │  Requested SDS/Docs Turnaround: 1.2 days ✓                       │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  TREND (12-month score history):                                         │
│  Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec             │
│   94   95   95   96   96   97   96   96   97   96   97   96             │
│  ▂▃▃▃▃▄▃▃▄▃▄▃  Stable — always above threshold                          │
└──────────────────────────────────────────────────────────────────────────┘

═══ Qualification Tab ══════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  QUALIFICATION HISTORY                              [ + Re-Qualify ]     │
│                                                                          │
│  Current Status: [✓ APPROVED]  ·  Valid Until: 01/31/2027               │
│  Qualified By: Marcus Q.  ·  Approved By: Dr. Priya (PIC)               │
│  Qualification Method: Audit + Document Review                           │
│                                                                          │
│  QUALIFICATION EVENTS                                                    │
│  ┌──────────┬─────────────────────────────┬──────────┬──────────────┐   │
│  │ Date     │ Event                       │ Result   │ Performed By │   │
│  ├──────────┼─────────────────────────────┼──────────┼──────────────┤   │
│  │ 01/2026  │ Annual Re-qualification     │ ✓ Passed │ Marcus Q.   │   │
│  │ 03/2025  │ For-cause audit (NCR-007)   │ ✓ Passed │ Marcus Q.   │   │
│  │ 01/2025  │ Annual Re-qualification     │ ✓ Passed │ Marcus Q.   │   │
│  │ 06/2024  │ Initial Qualification       │ ✓ Passed │ Dr. Priya   │   │
│  └──────────┴─────────────────────────────┴──────────┴──────────────┘   │
│                                                                          │
│  QUALIFICATION CHECKLIST (most recent — 01/2026)                        │
│  [x] Certificate of Analysis reviewed and on file                       │
│  [x] FDA establishment registration current                              │
│  [x] ISO/GMP certificate current                                         │
│  [x] Reference check (2 existing customers) completed                   │
│  [x] Site audit completed (or questionnaire if remote)                   │
│  [x] Material Safety Data Sheets (SDS) on file for all items            │
│  [x] Approved by PIC (e-signature: Dr. Priya Shah, 01/28/2026 10:14)  │
└──────────────────────────────────────────────────────────────────────────┘

═══ COA History Tab ════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  CERTIFICATE OF ANALYSIS HISTORY              [ Filter by Material ▼]   │
│                                                                          │
│  Lot #          │ Material        │ Received  │ COA Status   │ QC Result │
│  ───────────────┼─────────────────┼───────────┼──────────────┼────────── │
│  FAM-2026-045   │ Famotidine USP  │ 04/08/26  │ ✓ Verified   │ [◷ Queue]│
│  FAM-2026-041   │ Famotidine USP  │ 03/01/26  │ ✓ Verified   │ ✓ Pass   │
│  KET-2026-012   │ Ketorolac USP   │02/15/26   │ ✓ Verified   │ ✓ Pass   │
│  FAM-2026-039   │ Famotidine USP  │ 02/01/26  │ ✓ Verified   │ ✓ Pass   │
│  SOD-2026-008   │ Sodium Chloride │ 01/20/26  │ ✕ Rejected   │ ✕ Fail   │
│                 │                 │            │ (retest req.)│ retest   │
│  KET-2026-007   │ Ketorolac USP   │ 01/10/26  │ ✓ Verified   │ ✓ Pass   │
└──────────────────────────────────────────────────────────────────────────┘

═══ NCRs & CAPAs Tab ═══════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  NON-CONFORMANCE REPORTS                         [ + Log NCR ]          │
│                                                                          │
│  NCR-008  │ SOD-2026-008 Sodium Cl. failed ID test  │ 01/22/26 │[✓ Closed]│
│            │ Resolution: Supplier replaced lot within 3 days             │
│            │ CAPA issued to vendor: REQ-CAPA-2026-004 (received 02/02)   │
│                                                                          │
│  NCR-003  │ 3-day late delivery (Ketorolac, Oct '25) │ 10/14/25 │[✓ Closed]│
│            │ Resolution: Supplier provided root cause — weather delay    │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Screen SQ3: Approved Supplier List (ASL) (`/suppliers/approved-list`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <ShieldCheck /> Approved Supplier List (ASL)      [ Export PDF ]        │
│  21 CFR 211.80–211.86 compliant listing  ·  Last reviewed: 01/28/2026   │
│  Reviewed by: Dr. Priya Shah (PIC)  ·  Next review due: 01/28/2027      │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  VENDOR        │ MATERIALS APPROVED FOR         │ STATUS  │ EXPIRES    │
│  ──────────────┼────────────────────────────────┼─────────┼──────────  │
│  Spectrum Chem.│ APIs (all on formulary)        │ ✓ Appr. │ 01/27/27  │
│                │ Excipients (all on formulary)  │         │           │
│  Letco Medical │ APIs (all on formulary)        │ ✓ Appr. │ 03/15/27  │
│  West Pharma   │ Stoppers (all sizes/materials) │ ✓ Appr. │ 06/30/27  │
│                │ Seals (all sizes)              │         │           │
│  Eagle Analyt. │ Sterility testing (USP <71>)   │ ✓ Appr. │ 08/31/27  │
│                │ Endotoxin (USP <85>)           │         │           │
│                │ Potency (all compounds)        │         │           │
│  Fisher Sci.   │ Lab supplies (non-product)     │ ✓ Appr. │ 12/31/26  │
│  Generic Chem  │ — NONE —                       │ ⚠ Susp. │ Suspended │
│                │                                │  Blocked │ 04/01/26 │
└─────────────────────────────────────────────────────────────────────────┘

  ⚠ Procurement is BLOCKED from creating POs for Generic Chem Co. (suspended)
  ✕ Creating a receiving record for a non-ASL supplier triggers QA alert (Rule SQ1)

  [ Export as PDF (21 CFR 211.180 record) ]  [ View Audit Trail ]
```

---

## Business Rules

```
Rule SQ1: Inventory receiving module blocked from accepting lots from non-ASL suppliers
Rule SQ2: Supplier status change to "Suspended" immediately blocks inventory receiving
Rule SQ3: Qualification expires annually — 30-day advance warning sent to QA Manager
Rule SQ4: Any NCR automatically creates a watchlist flag on the supplier scorecard
Rule SQ5: PIC must e-sign initial qualification and annual re-qualification records
Rule SQ6: Rejected COA auto-creates a quarantine hold on the associated inventory lot
Rule SQ7: For-cause audit triggered when NCR count exceeds 2 in any 12-month rolling window
Rule SQ8: ASL must be reviewed and re-approved by PIC annually (21 CFR 211.80)
```

---

## Acceptance Criteria (for IQ/OQ/PQ Validation)

- [ ] AC-SQ1-01: Supplier directory shows status, category, and risk score for all vendors
- [ ] AC-SQ1-02: ASL page is exportable as PDF with PIC signature, date, and version
- [ ] AC-SQ1-03: Inventory receiving is blocked for any supplier not on ASL
- [ ] AC-SQ1-04: Scorecard auto-calculates from NCR count, on-time delivery, COA pass rate
- [ ] AC-SQ1-05: Qualification checklist requires all items checked before "Approved" status can be set
- [ ] AC-SQ1-06: PIC e-signature is captured on qualification approval
- [ ] AC-SQ1-07: 30-day advance alert sent to QA Manager when qualification is expiring
- [ ] AC-SQ1-08: NCR creation links to the specific inventory lot and deviation record
- [ ] AC-SQ1-09: Suspended supplier generates QA alert + blocks all procurement actions
- [ ] AC-SQ1-10: COA history filterable by material, date range, and pass/fail status

---

## Data Requirements

```
Server Actions / API Endpoints needed:
├── getSupplierList(filters)
├── getSupplierProfile(vendorId)
├── getSupplierScorecard(vendorId, months: 12)
├── createSupplierQualification(vendorId, checklist, esig)
├── updateSupplierStatus(vendorId, status, reason, esig)
├── createNCR(vendorId, lotId, description)
├── getASL() → approved supplier list with PIC signature metadata
├── exportASLPDF(signatureHash)
└── logCOAVerification(lotId, result, verifiedBy)

Database tables:
├── suppliers (id, name, category, status, risk_score)
├── supplier_qualifications (vendor_id, date, checklist, qualified_by, pic_esig)
├── supplier_scorecard_events (vendor_id, event_type, date, metric)
├── supplier_ncrs (vendor_id, lot_id, description, status, resolution)
├── asl_records (vendor_id, materials_approved, valid_until, pic_esig_hash)
└── coa_records (lot_id, vendor_id, material, received_date, status, verified_by)
```

---

*Next: [20-complaint-management.md](./20-complaint-management.md) — Customer complaint intake, investigation, and adverse event reporting*
