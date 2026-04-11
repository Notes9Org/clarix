---
id: SCR-015
title: Reports, Analytics & Audit Packages
version: "1.1"
status: approved
priority: P1
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [211.180, 211.192]
urs_refs: [URS-032, URS-033, URS-034]
frs_refs: [FRS-041, FRS-042, FRS-043]
---
# 15 — Reports, Analytics & Audit Packages

> **Users:** vp, qa_manager, pic, prod_mgr
> **Routes:** `/reports`, `/reports/batch-analytics`, `/reports/483-readiness`
> **Priority:** P2
> **Key Insight:** Reports must be "auditor-ready" — not just pretty charts
> **21 CFR Part 11 Scope:** Export integrity, audit packet generation, 483 risk scoring

## Revision History

| Version | Date       | Author  | Change Description              | Approved By |
| ------- | ---------- | ------- | ------------------------------- | ----------- |
| 1.0     | 2026-04-05 | fillsai | Initial reports specification   | fillsai     |
| 1.1     | 2026-04-07 | fillsai | Added frontmatter, traceability | fillsai     |

---

## Screen R1: Reports Hub (`/reports`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <BarChart2 /> Reports & Analytics                                       │
│  Compliance metrics, operational insights, and audit-ready exports       │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌────────────────────────────┐  ┌───────────────────────────-─┐         │
│  │ <ClipboardList />          │  │ <Shield />                  │         │
│  │ BATCH ANALYTICS            │  │ 483 READINESS REPORT        │         │
│  │                            │  │                             │         │
│  │ Yield, throughput, cycle   │  │ FDA inspection simulation   │         │
│  │ times, rejection analysis  │  │ with risk scoring           │         │
│  │                            │  │                             │         │
│  │ [ Open Report → ]          │  │ [ Open Report → ]           │         │
│  └────────────────────────────┘  └─────────────────────────-───┘         │
│                                                                          │
│  ┌────────────────────────────┐  ┌────────────────────────────-┐         │
│  │ <AlertTriangle />          │  │ <Wind />                    │         │
│  │ QUALITY METRICS            │  │ EM TREND ANALYSIS           │         │
│  │                            │  │                             │         │
│  │ Deviation pareto, CAPA     │  │ Contamination pathways,     │         │
│  │ effectiveness, complaints  │  │ seasonal trends, room       │         │
│  │                            │  │ comparisons                 │         │
│  │ [ Open Report → ]          │  │ [ Open Report → ]           │         │
│  └────────────────────────────┘  └─────────────────────────-───┘         │
│                                                                          │
│  ┌────────────────────────────┐  ┌────────────────────────────-┐         │
│  │ <GraduationCap />          │  │ <Boxes />                   │         │
│  │ TRAINING COMPLIANCE        │  │ INVENTORY INTELLIGENCE      │         │
│  │                            │  │                             │         │
│  │ Qualification rates, gap   │  │ Consumption patterns, cost  │         │
│  │ analysis, media fill rates │  │ trends, vendor performance  │         │
│  │                            │  │                             │         │
│  │ [ Open Report → ]          │  │ [ Open Report → ]           │         │
│  └────────────────────────────┘  └──────────────────────────-──┘         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Screen R2: Batch Analytics (`/reports/batch-analytics`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Reports                                                               │
│  <ClipboardList /> Batch Analytics                     [ Export PDF ]    │
│  Date Range: [01/01/2026] to [04/07/2026]   Product: [All ▼]             │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐
│ TOTAL        │ │ AVG YIELD    │ │ REJECTION    │ │ AVG RELEASE          │
│ BATCHES      │ │              │ │ RATE         │ │ VELOCITY             │
│   97         │ │  97.2%       │ │  2.9%        │ │  2.6 days            │
│  released    │ │  ▲ +0.3%     │ │  ▼ -1.1%     │ │  (comp→release)      │
│              │ │  vs Q4 2025  │ │  vs Q4 2025  │ │  target: <3d  ✓      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────────────┘

┌─── YIELD TREND BY PRODUCT ────────────────────────────────────────────┐
│                                                                       │
│  100%┤          ╭─╮                                                   │
│   99%┤  ╭──────╯ │          ── Famotidine 20mg                        │
│   98%┤──╯        ╰─╮                                                  │
│   97%┤  ╭──╮ ╭──╮  ╰──      ── Ondansetron 4mg                        │
│   96%┤──╯  ╰─╯  ╰──╮                                                  │
│   95%┤               ╰──    -- Ketorolac 15mg                         │
│   94%┤                       ·· Methylpred 40mg                       │
│      └──┬───┬───┬───┬───┬───┬───→                                     │
│        Jan  Feb  Mar  Apr                                             │
│                                                                       │
│  ⚠ Ketorolac trending down — 3 of last 5 batches below 96% yield      │
│  Recommendation: Review raw material lot consistency (Letco supply)   │
└───────────────────────────────────────────────────────────────────────┘

┌─── RELEASE VELOCITY BREAKDOWN ─────────────────────────────────────-───┐
│                                                                        │
│  Average time from batch completion to patient-ready:                  │
│                                                                        │
│  Execution  ●────────● QA Review  ●──────────────● PIC Release  ●──●   │
│   (on iPad)   0.3 days  (in queue)    1.8 days     (sign-off) 0.5 day  │
│                                                └─ BOTTLENECK           │
│                                                                        │
│  Analysis:                                                             │
│  · QA review consuming 69% of total release time                       │
│  · 3 of 4 pending batches have zero flags — eligible for fast-track    │
│  · Implementing Review-by-Exception could reduce to 0.5 days           │
│  · Estimated impact: Save 4.2 days/week across facility                │
└────────────────────────────────────────────────────────────────────────┘

┌─── REJECTION ROOT CAUSE PARETO ──────────────────────────────────────-─┐
│                                                                        │
│  pH Out of Spec          ████████████ 3 (43%)                          │
│  Weight OOS              ██████ 1 (14%)                                │
│  Particulate failure     ██████ 1 (14%)                                │
│  Visual inspection fail  ██████ 1 (14%)                                │
│  Labeling error          ██████ 1 (14%)                                │
│                                                                        │
│  Top corrective action: pH adjustment SOP retraining (completed 03/28) │
│  Impact: 0 pH-related rejections after retraining                      │
└────────────────────────────────────────────────────────────────────────┘

┌─── TECHNICIAN PERFORMANCE MATRIX ─────────────────────────────────────┐
│                                                                       │
│  Technician │ Batches │ Yield  │ Rejects│ Avg Time│ OOS Rate│ Right   │
│             │ Done    │ Avg    │        │ /batch  │         │ First   │
│  ───────────┼─────────┼────────┼────────┼─────────┼─────────┼───────  │
│  Carlos T.  │  38     │ 98.1%  │ 0      │ 3.2 hrs │ 2.6%    │ 100%    │
│  Maria R.   │  32     │ 97.5%  │ 1      │ 3.5 hrs │ 3.1%    │ 97%     │
│  James W.   │  24     │ 96.2%  │ 1      │ 4.1 hrs │ 4.2%    │ 96%     │
│  Alex P.    │   3     │ 94.8%  │ 1      │ 4.8 hrs │ 8.3%    │ 67%     │
│                                                                       │
│  Insight: Carlos T. has highest right-first-time rate + zero rejects  │
│  Concern: Alex P. blocked since 03/20 (expired qualifications)        │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Screen R3: FDA 483 Readiness Report (`/reports/483-readiness`)

**Scenario:** VP runs this before the next FDA inspection window.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Reports                                                               │
│  <Shield /> FDA 483 Readiness Report                   [ Export PDF ]    │
│  Generated: April 7, 2026 at 13:30 EDT                                   │
└──────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════════════════╗
║  OVERALL READINESS: 92% — ACTION NEEDED                                  ║
║  ████████████████████████████████████████████████░░░░░░                  ║
║                                                                          ║
║  Previous assessment (03/01): 88%  ·  Improvement: +4%                   ║
╚══════════════════════════════════════════════════════════════════════════╝

┌─── CFR CITATION RISK MAP ────────────────────────────────────────────┐
│                                                                      │
│  21 CFR Reference        Area              Score   Risk     Finding  │
│  ──────────────────────  ────────────────  ──────  ──────   ──────── │
│  211.25 Personnel        Training & Qual   84%     ⚠ MED   3 gaps    │
│  211.42 Facilities       Cleanroom EM      95%     ✓ LOW   trending  │
│  211.46 Analysis of Comp Lab controls      90%     ✓ LOW   1 pending │
│  211.63 Testing          Stability prog    75%     ✕ HIGH  no CIS    │
│  211.68 Production Rec   Batch records     98%     ✓ LOW   compliant │
│  211.100 Process Control CAPA system       88%     ⚠ MED   1 overdue │
│  211.180 Records         Audit trail       100%    ✓ LOW   intact    │
│  211.192 Review          Batch review      94%     ✓ LOW   4 pending │
│                                                                      │
│  OVERALL VERDICT:                                                    │
│  2 medium-risk areas require action before next inspection window    │
│  1 high-risk area (stability for CIS-01-INJ) is a potential 483      │
└──────────────────────────────────────────────────────────────────────┘

┌─── ACTION ITEMS FOR INSPECTION READINESS ─────────────────────────────┐
│                                                                       │
│  Priority │ Action                              │ Owner     │ Due     │
│  ─────────┼─────────────────────────────────────┼───────────┼──────── │
│  ✕ P0     │ Establish stability protocol for    │ Dr. Priya │ 04/14   │
│           │ Cisplatin 1mg/mL before production  │           │         │
│  ⚠ P1     │ Requalify Alex P. (garbing +        │ Training  │ 04/10   │
│           │ media fill)                          │ Coord.    │        │
│  ⚠ P1     │ Close CAPA-005 (NaOH tracking)     │ Marcus Q. │ 04/14    │
│  ⚠ P1     │ Investigate ISO 7 Room B EM trend   │ Sarah M.  │ 04/10   │
│  ○ P2     │ Complete SOP-003 review & approval │ Dr. Priya │ 04/20    │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Screen R4: Audit Package Generator

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <FileDown /> Generate Audit Packet                                      │
│  Complete, auditor-ready documentation bundle                            │
└──────────────────────────────────────────────────────────────────────────┘

  ── Scope ──
  Date Range: [01/01/2026] to [04/07/2026]
  Specific Batch: [_____________] (leave empty for all)

  ── Contents ──
  [x] Batch records with step data, values, tolerances, and e-signatures
  [x] Material traceability (lot → vendor → COA → batch usage)
  [x] Equipment calibration certificates & qualification records
  [x] Deviation investigation reports with root cause analysis
  [x] CAPA records with effectiveness verification
  [x] Environmental monitoring data with trending analysis
  [x] Training records and qualification certificates
  [x] Cleaning and sanitization logs
  [x] Full audit trail (chronological + per-batch genealogy)
  [ ] Complaint and adverse event history
  [ ] Change control records
  [ ] Vendor audit reports

  ── Format ──
  (•) PDF Bundle (one file, bookmarked sections)
  ( ) ZIP Archive (individual PDFs per section)
  ( ) CSV Data Export (for analysis tools)

  Estimated size: ~45 MB  ·  ~850 pages

                    [ Cancel ]  [ Generate Audit Packet ]

  ⚠ Note: Generation takes 2–5 minutes. You'll be notified when ready.
  All generated packets are logged in the audit trail.
```

---

## Screen R5: Quality Metrics Report

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Reports                                                               │
│  <AlertTriangle /> Quality Metrics                     [ Export PDF ]    │
│  Date Range: [01/01/2026] to [04/07/2026]                                │
└──────────────────────────────────────────────────────────────────────────┘

┌─── DEVIATION ANALYTICS ───────────────────────────────────────────────┐
│                                                                       │
│  Total deviations (YTD): 11  ·  Open: 4  ·  Closed: 7                 │
│                                                                       │
│  Root Cause Pareto:                      By Source:                   │
│  Process deviation     █████████ 5       Batch OOS        ██████ 6    │
│  Equipment issue       ████ 2            EM Excursion     ███ 3       │
│  Material quality      ██ 1              Visual Inspect.  █ 1         │
│  Training gap          ██ 1              Customer Compl.  █ 1         │
│  Contamination         ██ 1                                           │
│  Other                 █ 1               Avg investigation: 12 days   │
│                                          Target: <14 days  ✓          │
│                                                                       │
│  TREND: ▁▂▁▁▂▁▁▁▃▁▁▁  (deviations per week, 12 weeks)                 │ 
│  No upward trend detected ✓                                           │
└───────────────────────────────────────────────────────────────────────┘

┌─── CAPA EFFECTIVENESS ────────────────────────────────────────────────┐
│                                                                       │
│  CAPAs closed (YTD): 8  ·  Avg close time: 18 days  ·  Target: <30d   │
│                                                                       │
│  Effective:         ████████ 7 (87.5%)                                │
│  Not effective:     █ 1 (12.5%) — required re-investigation           │
│  Pending verify:    ██ 2 (from current open)                          │
│                                                                       │
│  On-time closure:   91%  (target: >90%)  ✓                            │
│  Recurrence rate:   0%   (same root cause repeating)  ✓               │
└───────────────────────────────────────────────────────────────────────┘

┌─── COMPLAINT MANAGEMENT ─────────────────────────────────────────────┐
│                                                                      │
│  Total complaints (YTD): 3                                           │
│  Patient impact: 0  ·  Adverse events: 0  ·  Recalls: 0              │
│                                                                      │
│  #  │ Date  │ Product           │ Category    │ Resolution │ Days    │
│  ───┼───────┼───────────────────┼─────────────┼────────────┼──────── │
│  C-3│ 03/15 │ Famotidine 20mg   │ Discoloration│ Lot tested │ 5      │
│     │       │                   │              │ — passed   │        │
│  C-2│ 02/28 │ Ondansetron 4mg   │ Packaging    │ Replaced   │ 3      │
│  C-1│ 01/20 │ Ketorolac 15mg    │ Short count  │ Replaced   │ 2      │
│                                                                      │
│  Avg resolution time: 3.3 days  ·  Target: <7 days  ✓                │
└──────────────────────────────────────────────────────────────────────┘
```

---

*Next: [16-notifications.md](./16-notifications.md) — Notification center*
