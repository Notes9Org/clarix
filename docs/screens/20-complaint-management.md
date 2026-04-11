---
id: SCR-020
title: Complaint Management & Post-Market Surveillance
version: "1.0"
status: approved
priority: P1
author: fillsai
created: 2026-04-08
last_reviewed: 2026-04-08
change_control: CC-2026-003
cfr_references: [211.198, "Part 11.10", "211.180"]
urs_refs: [URS-044, URS-045, URS-046]
frs_refs: [FRS-051, FRS-052, FRS-053]
---

# 20 — Complaint Management & Post-Market Surveillance

> **Users:** qa_manager, pic, admin, customer_service
> **Routes:** `/complaints`, `/complaints/[id]`, `/complaints/adverse-events`
> **Priority:** P1
> **Persona:** QA Manager + PIC — "Every patient complaint is a signal — we investigate every one"
> **21 CFR Part 11 Scope:** Complaint record integrity, adverse event assessment, MedWatch workflow
> **Regulatory basis:** 21 CFR 211.198 (Complaint Files), FDA Guidance on Complaint Handling for Compounders,
>   MedWatch 3500A (voluntary/mandatory adverse event reporting), USP 797 §8

## Revision History

| Version | Date       | Author  | Change Description                   | Approved By |
|---------|------------|---------|--------------------------------------|-------------|
| 1.0     | 2026-04-08 | fillsai | Initial complaint management spec    | fillsai     |

---

## Why Complaint Management Is Critical for 503B

> 21 CFR 211.198 requires that ALL written or oral complaints be "reviewed and evaluated" with
> a written record of each complaint. For 503B compounders, a complaint involving a potentially
> adulterated or misbranded product may require an FDA MedWatch report. The consequences of
> missing this are severe — voluntary recalls, facility shutdown, or criminal prosecution.
> Clarix closes this gap with structured intake, automated triage, and regulatory reporting workflows.

---

## Screen CM1: Complaint List (`/complaints`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <MessageSquareWarning /> Complaints              [ + Log Complaint ]    │
│  Patient and customer complaint tracking and investigation               │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  Type: [All ▼]  Severity: [All ▼]  Status: [All ▼]  [Search_________]  │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  SUMMARY  (rolling 90 days)                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ TOTAL        │ │ OPEN         │ │ ADVERSE EVT  │ │ REPORTABLE   │   │
│  │ COMPLAINTS   │ │              │ │ (patient harm)│ │ TO FDA       │   │
│  │      7       │ │      2       │ │      0       │ │      0       │   │
│  │  this quarter│ │  under inv.  │ │  ● Good      │ │  ● Good      │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────┬───────────┬──────────────────────────────┬──────────┬──────────┐
│ COMP #  │ Type      │ Description                  │ Severity │ Status   │
├─────────┼───────────┼──────────────────────────────┼──────────┼──────────┤
│ CMP-007 │ Product   │ Vial particulate — Famotidine│ ● Crit.  │[◷ Invest]│
│         │ Quality   │  Batch #2026-0841 · RX 83921 │ Adverse  │          │
│         │           │  Patient: Dr. Chen · 04/07   │ Evt Ass. │          │
│ CMP-006 │ Label     │ Wrong patient name on label  │ ● Major  │[◷ Invest]│
│         │           │  Batch #2026-0841 · 04/06    │          │          │
│ CMP-005 │ Delivery  │ Wrong temperature — FedEx    │ ○ Minor  │[✓ Closed]│
│         │           │ shipment arrived warm ·04/01  │          │          │
│ CMP-004 │ Product   │ Package damaged on receipt   │ ○ Minor  │[✓ Closed]│
│         │           │ Batch #2026-0836 · 03/20     │          │          │
└─────────┴───────────┴──────────────────────────────┴──────────┴──────────┘

  ⚠ CMP-007: Potential adverse event — patient impact assessment REQUIRED within 24 hours
  Rule CM1: Any complaint flagged as "potential adverse event" escalates to PIC immediately
```

---

## Screen CM2: Complaint Detail (`/complaints/[id]`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Complaints                                                            │
│  CMP-2026-007                                        [◷ Under Investigation]│
│  Particulate Observed in Famotidine 20mg/mL Vial                        │
│  Received: 04/07 09:14  ·  Severity: ● Critical  ·  Days Open: 1       │
└──────────────────────────────────────────────────────────────────────────┘

┌─ TABS ──────────────────────────────────────────────────────────────────┐
│  [ Complaint ]  [ Adverse Event Assessment ]  [ Investigation ]         │
│  [ Regulatory Reporting ]  [ Resolution ]  [ History ]                  │
└─────────────────────────────────────────────────────────────────────────┘

═══ Complaint Tab ══════════════════════════════════════════════════════════

┌──────────────────────────────┐  ┌────────────────────────────────────────┐
│  COMPLAINT INFO              │  │  PRODUCT INFO                          │
│                              │  │                                        │
│  Type:        Product Quality│  │  Product:  Famotidine 20mg/mL         │
│  Received via: Phone         │  │  Batch #:  2026-0841                   │
│  Received by: Customer Svc   │  │  BUD:      06/07/2026                  │
│  Reporter:    Dr. Alan Chen  │  │  Lot released: 04/01/2026              │
│  Facility:    HealthFirst MO │  │  Rx #:     83921                       │
│  Phone/Email: (314)555-0183  │  │  Patient:  [Protected — ID only]      │
│                              │  │  Patient ID: PT-2026-1143              │
│  Received: 04/07 09:14      │  │                                        │
│  Logged by:  Sarah M. (CS)  │  │  Retain sample available? [x] Yes      │
│  Assigned to: Marcus Q. (QA)│  │  Location: Ref Sample Fridge R-03      │
└──────────────────────────────┘  └────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  COMPLAINT DESCRIPTION (verbatim from reporter)                          │
│                                                                          │
│  "Dr. Chen's office called at 9:10am reporting that a vial of           │
│  Famotidine from batch 2026-0841 had visible particles when the nurse   │
│  attempted to administer the injection. The nurse did not administer    │
│  the dose and held the vial. She states it appears as white flecks      │
│  floating throughout the vial. She retained the vial."                  │
│                                                                          │
│  Action taken by reporter: Dose held. Patient not administered.         │
│  Retained sample: Yes — Dr. Chen's office will ship back today.         │
│                                                                          │
│  Is this a complaint about a potential adverse event?                    │
│  [x] Potential — patient impact assessment required                      │
│  [ ] No patient impact                                                   │
└──────────────────────────────────────────────────────────────────────────┘

═══ Adverse Event Assessment Tab ═══════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  ADVERSE EVENT ASSESSMENT         Due: 04/08 09:14 (within 24h of log) │
│  Assigned to: Dr. Priya Shah (PIC) — Rule CM1: PIC must assess all AE  │
│                                                                          │
│  Step 1: Was the product administered to the patient?                   │
│  (•) No — Dose was held before administration                           │
│  ( ) Yes — Patient received the product                                 │
│                                                                          │
│  Step 2: Did the patient experience any adverse health outcome?         │
│  (•) No — Dose not administered, no AE occurred                        │
│  ( ) Yes — Patient experienced [___]                                    │
│                                                                          │
│  Step 3: Is the complaint potentially linked to sterility failure?      │
│  (•) Possible — Particulate matter in injectable could indicate         │
│       contamination or aggregation. Retain sample for testing.           │
│  ( ) No                                                                  │
│                                                                          │
│  Step 4: Is this potentially reportable to FDA via MedWatch?            │
│  (•) Possibly — will confirm after retain sample testing                 │
│  ( ) Yes — Reportable (complete MedWatch 3500A)                         │
│  ( ) No — Not reportable                                                 │
│                                                                          │
│  Assessment Conclusion:                                                  │
│  [No adverse event occurred as dose was not administered. However,      │
│  particle matter in an injectable product is a critical quality event   │
│  requiring full investigation of the batch and retain sample testing.   │
│  Hold all remaining vials from Batch #2026-0841. Report results to     │
│  QA and reassess reportability upon test results.________________________]│
│                                                                          │
│  E-Signature (PIC review):                                               │
│  Dr. Priya Shah  ·  04/07 16:45  ·  [e-sig captured]                   │
│                                                                          │
│  [ Save Assessment ]   [ Escalate to Recall Procedure ]                 │
└──────────────────────────────────────────────────────────────────────────┘

═══ Investigation Tab ══════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  INVESTIGATION                                                            │
│                                                                          │
│  Linked Deviation: DEV-2026-009 (auto-created on complaint log)          │
│  Linked Batch: #2026-0841 — Famotidine 20mg/mL                          │
│                                                                          │
│  INVESTIGATION ACTIONS                          Status        Due        │
│  ─────────────────────────────────────────────────────────────────────  │
│  [x] Batch record review — all steps, e-sigs   ✓ Complete   04/07      │
│      Finding: All steps signed, no visible anomalies in batch record     │
│  [x] QA hold on remaining vials (#2026-0841)   ✓ Complete   04/07      │
│      6 remaining vials pulled from distribution, quarantined             │
│  [ ] Retain sample visual inspection           ◷ Pending    04/09      │
│      (Awaiting returned vial from Dr. Chen's office)                     │
│  [ ] Retain sample sterility testing (USP<71>) ◷ Pending    04/14      │
│  [ ] Retain sample particulate testing(USP<788>)◷Pending    04/14      │
│  [ ] Cleaning log review — Hood LFH-03         ◷ Pending    04/09      │
│  [ ] Environmental swab of LFH-03              ◷ Pending    04/09      │
│  [ ] Root cause determination                  ◦ Not started 04/16      │
│  [ ] CAPA initiation (if applicable)           ◦ Not started 04/16      │
└──────────────────────────────────────────────────────────────────────────┘

═══ Regulatory Reporting Tab ════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  FDA REPORTING ASSESSMENT                                                │
│                                                                          │
│  Reportability Status:  [◷ Pending — awaiting investigation results]    │
│                                                                          │
│  Reportability Criteria (21 CFR 310.305 / MedWatch 3500A):              │
│  [ ] Patient died                                                        │
│  [ ] Life-threatening event                                              │
│  [ ] Hospitalization (initial or prolonged)                              │
│  [x] Product quality issue identified (particulate in injectable)        │
│  [ ] Disability or permanent damage                                      │
│  [ ] Required intervention to prevent harm                               │
│                                                                          │
│  Required Reporting Timeframe when reportable:                           │
│  Serious / unexpected: 15-calendar-day report (MedWatch 3500A)          │
│  Expedited safety: 7-calendar-day report                                 │
│                                                                          │
│  Current Assessment: NOT YET REPORTABLE                                  │
│  Reason: No adverse event occurred. Monitoring pending investigation.    │
│  Reassessment due: 04/14 (on receipt of lab results)                    │
│                                                                          │
│  [ Initiate MedWatch 3500A Report ]   [ Mark as Not Reportable ]        │
│                                                                          │
│  ⚠ WARNING: Failure to file a required MedWatch report is a federal      │
│  violation under 21 CFR 310.305. When in doubt, report.                 │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Complaint Lifecycle

```
  ┌───────────┐
  │  INTAKE   │  ← Phone, email, in-person — logged by CS or QA
  └─────┬─────┘
        │
        ▼
  ┌──────────────────────┐
  │  TRIAGE / SEVERITY   │  ← Severity assigned; AE flag triggers PIC alert
  └──────┬───────────────┘
         │
         ├─ Potential AE → ─→ ┌────────────────────────────────┐
         │                    │ AE ASSESSMENT (PIC, <24h)      │
         │                    └──────────────┬─────────────────┘
         │                                   │
         ▼                                   ▼
  ┌──────────────────────┐      ┌─────────────────────────────┐
  │  UNDER INVESTIGATION │      │  REPORTABLE → FDA REPORT    │
  └──────┬───────────────┘      └─────────────────────────────┘
         │
         ▼
  ┌──────────────────────┐
  │  ROOT CAUSE + CAPA   │
  └──────┬───────────────┘
         │
         ▼
  ┌──────────────────────┐
  │  RESOLUTION / CLOSED │  ← Response to reporter (if required)
  └──────────────────────┘
```

---

## Business Rules

```
Rule CM1: Complaint flagged as "potential adverse event" sends immediate alert to PIC
Rule CM2: PIC must complete adverse event assessment within 24 hours of AE-flagged complaint
Rule CM3: Product quality complaints auto-create a linked Deviation record
Rule CM4: Product quality complaints auto-generate a QA hold on all remaining lots from the batch
Rule CM5: Complaint record is immutable once closed — amendments require a new companion record
Rule CM6: All critical complaints must have investigation closure with root cause documented
Rule CM7: MedWatch reportability determination must be recorded regardless of outcome (yes or no)
Rule CM8: Complaint trend alert sent to QA if same batch receives >1 complaints
Rule CM9: Annual complaint trend report must be generated for management review (ICH Q10)
```

---

## Acceptance Criteria (for IQ/OQ/PQ Validation)

- [ ] AC-CM1-01: Complaint can be logged with type, reporter, product, batch, and description
- [ ] AC-CM1-02: "Potential adverse event" flag triggers PIC notification within 60 seconds
- [ ] AC-CM1-03: Adverse event assessment form captures all 4 required assessment steps
- [ ] AC-CM1-04: PIC e-signature is captured on adverse event assessment
- [ ] AC-CM1-05: Product quality complaint auto-creates a linked deviation record
- [ ] AC-CM1-06: Product quality complaint auto-creates a QA hold on the linked batch lots
- [ ] AC-CM1-07: MedWatch reportability determination is captured and time-stamped
- [ ] AC-CM1-08: Investigation task list supports individual task assignment and sign-off
- [ ] AC-CM1-09: Complaint count widget on dashboard shows 90-day rolling totals
- [ ] AC-CM1-10: Audit trail captures every status change and document access event
- [ ] AC-CM1-11: Annual complaint trend report can be generated from the Reports module

---

## Data Requirements

```
Server Actions / API Endpoints needed:
├── createComplaint(payload)
├── flagAdverseEvent(complaintId, flag)
├── submitAEAssessment(complaintId, assessment, picEsig)
├── createInvestigationTask(complaintId, task)
├── completeInvestigationTask(complaintId, taskId, note)
├── setReportabilityDecision(complaintId, decision, reason)
├── initiateMedWatch(complaintId) → generate pre-filled MedWatch 3500A
├── closeComplaint(complaintId, resolution, esig)
└── getComplaintTrendReport(startDate, endDate)

Database tables:
├── complaints (id, type, severity, description, reporter, product_id, batch_id)
├── complaint_ae_assessments (complaint_id, steps, conclusion, pic_esig_hash, timestamp)
├── complaint_investigations (complaint_id, task, assigned_to, status, note)
├── complaint_reportability (complaint_id, decision, reason, logged_by, timestamp)
├── medwatch_reports (complaint_id, form_data, submitted_at, confirmation_number)
└── complaint_links (complaint_id, deviation_id, capa_id, hold_id)
```

---

*Next: [21-risk-management.md](./21-risk-management.md) — Integrated risk register, FMEA, ICH Q9 risk tools*
