---
id: SCR-003
title: Executive Dashboard (Command Center)
version: "1.1"
status: approved
priority: P0
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [211.180, 211.192]
urs_refs: [URS-004, URS-012, URS-015]
frs_refs: [FRS-006, FRS-007, FRS-008]
---
# 03 — Executive Dashboard (Command Center)

> **Users:** vp, admin, prod_mgr, qa_manager, pic
> **Route:** `/dashboard`
> **Priority:** P0 — This is the "single pane of glass" for the entire facility
> **Concept:** FDA Inspection Readiness Control Tower — not vanity metrics
> **21 CFR Part 11 Scope:** Aggregated compliance metrics, role-filtered data access

## Revision History

| Version | Date       | Author  | Change Description                  | Approved By |
| ------- | ---------- | ------- | ----------------------------------- | ----------- |
| 1.0     | 2026-04-05 | fillsai | Initial dashboard specification     | fillsai     |
| 1.1     | 2026-04-07 | fillsai | Added frontmatter, traceability, AC | fillsai     |

---

## Design Philosophy

The dashboard is NOT a collection of pretty cards. It's a **facility state-of-control indicator**
that answers one question per role:

| Role                | Core Question                     | Dashboard Answers                                      |
| ------------------- | --------------------------------- | ------------------------------------------------------ |
| VP (Jim)            | "Are we FDA-ready right now?"     | Audit readiness score, 483 risk areas, facility health |
| QA Manager (Marcus) | "What needs my attention?"        | Review queue, open deviations, aging CAPAs, trending   |
| PIC (Dr. Priya)     | "What's blocking release?"        | Pending releases, open deviations on pending batches   |
| Prod Manager        | "Are we on schedule and staffed?" | Today's board, tech availability, bottlenecks          |

---

## Screen D1: VP / Facility Owner Dashboard

**Scenario:** Jim opens Clarix at 7am. Within 5 seconds he knows if his facility is in control.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <LayoutDashboard />  Facility Command Center       CompoundRx Pharmacy  │
│  Monday, April 7, 2026  ·  FDA FEI: 3012345678                           │
└──────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════════════════╗
║  FDA INSPECTION READINESS                                         92%    ║
║  ████████████████████████████████████████████████░░░░░░                  ║
║                                                                          ║
║  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────┐   ║
║  │ Batch Rec. │ │ Quality    │ │ EM Program │ │ Personnel  │ │ Equip │   ║
║  │ Integrity  │ │ System     │ │            │ │ Training   │ │ & Cal │   ║
║  │            │ │            │ │            │ │            │ │       │   ║
║  │   98%      │ │   88%      │ │   95%      │ │   84%      │ │  91%  │   ║
║  │   ✓        │ │   ⚠        │ │   ✓        │ │   ⚠        │ │  ✓    │   ║
║  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └───────┘   ║
║                                                                          ║
║  ⚠ 2 RISK AREAS IDENTIFIED (click to drill down)                         ║
║  · Quality System: 1 CAPA overdue by 3 days (CAPA-005)                   ║
║  · Personnel: 3 technicians with training expiring within 30 days        ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### Readiness Score Calculation

```
AUDIT READINESS = weighted average of 5 quality system pillars:

Pillar 1: BATCH RECORD INTEGRITY (25% weight)
├── % of batches with zero post-hoc corrections
├── Average batch review turnaround time
├── % of steps with complete e-signatures
└── Deduction: -5% per batch with unsigned steps

Pillar 2: QUALITY SYSTEM (25% weight)
├── % of deviations investigated within 30 days
├── % of CAPAs closed on time
├── Number of open deviations > 30 days (Q4 escalation)
└── Deduction: -10% per overdue critical CAPA

Pillar 3: ENVIRONMENTAL MONITORING (20% weight)
├── % of EM samples collected on schedule
├── Number of action-limit excursions in 90 days
├── EM trend direction (stable, improving, degrading)
└── Deduction: -15% per unresolved action excursion

Pillar 4: PERSONNEL TRAINING (15% weight)
├── % of staff fully qualified for their role
├── Number of expired qualifications
├── Media fill pass rate (last 12 months)
└── Deduction: -5% per expired critical qualification

Pillar 5: EQUIPMENT & CALIBRATION (15% weight)
├── % of equipment calibrated on schedule
├── Number of overdue calibrations
├── Preventive maintenance completion rate
└── Deduction: -10% per out-of-calibration instrument in use

COLOR THRESHOLDS:
≥ 95%  → Green  "Inspection Ready"
85-94% → Amber  "Action Needed"
< 85%  → Red    "Critical Gaps — Not Inspection Ready"
```

---

### Section 2: Production Throughput (Real-Time)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  TODAY'S PRODUCTION                                      April 7, 2026   │
│                                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐                │
│  │ ACTIVE NOW     │ │ COMPLETED      │ │ PENDING QA     │                │
│  │                │ │ TODAY          │ │ RELEASE        │                │
│  │   5 batches    │ │   3 batches    │ │   4 batches    │                │
│  │  in cleanroom  │ │  awaiting pkg  │ │  avg 2.1 days  │                │
│  │                │ │                │ │  in queue      │                │
│  │  Carlos: Stp7  │ │  #0844 ✓       │ │  #0840 (3d)    │                │
│  │  Maria:  Stp3  │ │  #0845 ✓       │ │  #0841 (2d)    │                │
│  │  James:  Stp1  │ │  #0846 ✓       │ │  #0842 (2d)    │                │
│  │                │ │                │ │  #0843 (1d)    │                │
│  └────────────────┘ └────────────────┘ └────────────────┘                │
│                                                                          │
│  BATCH RELEASE VELOCITY (last 30 days)                                   │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                                                                  │    │
│  │  Avg time:  Completion ──→ QA Review ──→ PIC Release             │    │
│  │              0.3 days       1.8 days       0.5 days              │    │
│  │              ├──────────────┤───────────────┤──────┤             │    │
│  │                                                                  │    │
│  │  Total: 2.6 days avg (target: < 3 days)   ✓ On target            │    │
│  │                                                                  │    │
│  │  Bottleneck: QA Review stage — 69% of total release time         │    │
│  │  Recommendation: Review-by-Exception could reduce to 0.5 days    │    │
│  │                                                                  │    │
│  └──────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### Section 3: Quality System Health

```
┌──────────────────────────────────────────────────────────────────────────┐
│  QUALITY SYSTEM OVERVIEW                                                 │
│                                                                          │
│  ┌─── DEVIATION AGING ─────────────────┐ ┌─── CAPA STATUS ────────────┐  │
│  │                                     │ │                            │  │
│  │  Open Deviations: 4                 │ │  Open CAPAs: 3             │  │
│  │                                     │ │                            │  │
│  │  < 7 days    ██ 2   (normal)        │ │  On track    ██ 2          │  │
│  │  7-14 days   █ 1    (watch)         │ │  Due soon    █ 1  ⚠        │  │
│  │  15-30 days  █ 1    (escalate)      │ │  Overdue     ─ 0           │  │
│  │  > 30 days   ─ 0    (VP alert)      │ │                            │  │
│  │                                     │ │  Effectiveness verified:  ││
│  │  By severity:                       │ │  8 of 11 (73%) in 90 days ││
│  │  Critical ✕  0                      │ │                            ││
│  │  Major    ⚠  2                      │ │  Avg close time: 18 days  ││
│  │  Minor    ○  2                      │ │  Target: < 30 days  ✓     ││
│  └─────────────────────────────────────┘ └────────────────────────────┘│
│                                                                          │
│  ┌─── COMPLAINT TRACKER (last 90 days) ──────────────────────────────┐ │
│  │                                                                    │ │
│  │  Total complaints: 2    ·    Open: 0    ·    Avg resolution: 8 days│ │
│  │  Patient impact: 0      ·    Adverse events reported: 0           │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### Section 4: Environmental & Facility State

```
┌─────────────────────────────────────────────────────────────────────────┐
│  FACILITY STATE OF CONTROL                                              │
│                                                                         │
│  ┌─── CLEANROOM STATUS ──────────────────────────────────────────────┐  │
│  │                                                                   │  │
│  │  Room            │ ISO  │ Pressure  │ Temp    │ EM Status│ Clean  │  │
│  │  ────────────────┼──────┼───────────┼─────────┼──────────┼─────── │  │
│  │  Hood A (LFH-03) │ ISO5 │ +0.05" ✓  │ 20.1°C ✓│ 0 CFU ✓  │ ✓ 6am  │  │
│  │  Hood B (LFH-04) │ ISO5 │ +0.05" ✓  │ 20.3°C ✓│ 0 CFU ✓  │ ✓ 6am  │  │
│  │  Buffer Room A   │ ISO7 │ +0.03" ✓  │ 20.8°C ✓│ 2 CFU ✓  │ ✓ 6am  │  │
│  │  Buffer Room B   │ ISO7 │ +0.02" ✓  │ 21.1°C ✓│ 6 CFU ⚠  │ ⚠ LATE │  │
│  │  Ante Room       │ ISO8 │ +0.01" ✓  │ 21.5°C ✓│ 3 CFU ✓  │ ✓ 6am  │  │
│  │                                                                   │  │
│  │  ⚠ Buffer Room B: EM trending upward (3→4→6 CFU over 3 weeks)     │  │
│  │  ⚠ Buffer Room B: Daily cleaning overdue (last: yesterday 4pm)    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─── EM TREND SPARKLINES (90 days) ────────────────────────────────┐   │
│  │                                                                  │   │
│  │  ISO 5 Hood A:    ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  stable (0-1 CFU)       │   │
│  │  ISO 5 Hood B:    ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  stable (0 CFU)         │   │
│  │  ISO 7 Room A:    ▁▁▂▁▁▁▂▁▁▂▁▁▁▁▂▁▁▁▁▂▁▁  stable (1-3 CFU)       │   │
│  │  ISO 7 Room B:    ▁▁▁▂▂▂▃▃▃▃▄▄▅▅▅▅▆▆▆▇▇█  ⚠ TRENDING UP          │   │
│  │  ISO 8 Ante:      ▁▂▁▁▂▁▁▁▂▂▁▁▁▁▂▁▁▁▁▁▂▁  stable (1-4 CFU)       │   │
│  │                                           ──── alert limit       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Section 5: Inventory & Supply Chain Intelligence

```
┌──────────────────────────────────────────────────────────────────────────┐
│  SUPPLY CHAIN HEALTH                                                     │
│                                                                          │
│  ┌─── STOCKOUT RISK FORECAST ────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  Item                   │ Current  │ Burn Rate │ Stockout In │ Act.│  │
│  │  ───────────────────────┼──────────┼───────────┼─────────────┼─────│  │
│  │  10mL Clear Vials       │ 280 ea   │ 24/day    │ 12 days     │ ⚠   │  │
│  │  0.22μm PES Filters     │ 12 ea    │ 2/day     │ 6 days      │ ✕   │  │
│  │  Alcohol Wipes          │ 3 packs  │ 0.5/day   │ 6 days      │ ✕   │  │
│  │  Famotidine USP         │ 450 g    │ 10g/day   │ 45 days     │ ✓   │  │
│  │  20mm Butyl Stoppers    │ 1200 ea  │ 24/day    │ 50 days     │ ✓   │  │
│  │                                                                    │  │
│  │  ✕ = order now   ⚠ = order this week   ✓ = adequate                │  │
│  │                                                                    │  │
│  │  Vendor Performance (90 days):                                     │  │
│  │  Spectrum Chemical:  98% on-time  ·  avg 3.2 day lead time         │  │
│  │  Letco Medical:      91% on-time  ·  avg 5.1 day lead time         │  │
│  │  West Pharma:        100% on-time ·  avg 2.0 day lead time         │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─── QUARANTINE QUEUE ──────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  8 lots in quarantine  ·  Avg time in quarantine: 2.4 days        │  │
│  │  3 awaiting COA verification  ·  5 awaiting QC release            │  │
│  │  Oldest: FAM-2026-042 (5 days) — needs QC attention               │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### Section 6: Personnel Readiness Heatmap

```
┌──────────────────────────────────────────────────────────────────────────┐
│  PERSONNEL READINESS                                                     │
│                                                                          │
│  On Shift Today: 8 of 12 technicians  ·  3 of 3 pharmacists            │
│                                                                          │
│  ┌─── QUALIFICATION HEATMAP ─────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │               GMP  Aseptic  MediaFill  Garbing  HD   Can Work?    │  │
│  │  Carlos T.    ■     ■       ■ (67d)    ■ (24d)  ■    ✓ Cleared   │  │
│  │  Maria R.     ■     ■       ■ (103d)   ■ (64d)  □    ✓ Non-HD    │  │
│  │  James W.     ■     ■       □ (8d!)    ■ (116d) ■    ⚠ Exp. soon │  │
│  │  Alex P.      ■     □       □ (exp)    □ (exp)  □    ✕ BLOCKED   │  │
│  │                                                                    │  │
│  │  ■ = Current (>30d remaining)                                      │  │
│  │  □ = Expired or expiring within 30 days                            │  │
│  │  (Nd) = days until expiry                                          │  │
│  │  (Nd!) = critical — less than 14 days                              │  │
│  │                                                                    │  │
│  │  ⚠ James W. media fill expires in 8 days — schedule requalification│ │
│  │  ✕ Alex P. cannot perform any batch work (R7 gate)                │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### Section 7: Recent Activity Feed (Audit-Style)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ACTIVITY FEED                                    [ View Full Audit Log ]│
│  Last 24 hours  ·  43 events                                            │
│                                                                          │
│  10:22  Carlos T.      SIGNED   Step 6 — pH Adjustment (Batch #0847)   │
│                                  Value: 6.82 (target 7.0 ±0.3) ✓       │
│  10:05  Carlos T.      EXECUTED Step 5 — Dissolve in WFI (#0847)       │
│  09:48  Maria R.       EXECUTED Step 3 — Weigh API (#0848)             │
│  09:35  Carlos T.      SCANNED  FAM-2026-041 verified for #0847       │
│  09:14  Carlos T.      STARTED  Batch #2026-0847 — Famotidine 20mg    │
│  08:00  David W.       RECEIVED 100g Famotidine lot FAM-2026-045       │
│                                  → Quarantined (awaiting COA)           │
│  07:45  SYSTEM         ALERT    ISO 7 Room B cleaning overdue          │
│  07:30  SYSTEM         ALERT    0.22μm Filters: stockout in 6 days    │
│  07:00  SYSTEM         CRON     2 lots auto-expired (Rule I5)          │
│  06:30  Rosa M.        CLEANED  ISO 5 Hood A — Sporicidin — ✓ signed   │
│  06:00  Rosa M.        CLEANED  ISO 5 Hood B — Sporicidin — ✓ signed   │
│  ...                                                                     │
│                                              [ Load more (32 events) → ]│
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Screen D2: QA Manager Dashboard

**Scenario:** Marcus opens his dashboard. Sees his review queue sorted by urgency.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <ClipboardCheck /> QA Command Center               Marcus Q. · QA Mgr  │
│  Monday, April 7, 2026                                                   │
└──────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════════════════╗
║  YOUR QUEUE — 11 items requiring attention                              ║
║                                                                         ║
║  ── BATCH REVIEW (Review-by-Exception) ──────────────────── 4 batches  ║
║                                                                         ║
║  #2026-0840  Ondansetron 4mg    3 days in queue   0 flags   [ Review ] ║
║  #2026-0841  Methylpred 40mg    2 days in queue   1 flag ⚠  [ Review ] ║
║  #2026-0842  Famotidine 20mg    2 days in queue   0 flags   [ Review ] ║
║  #2026-0843  Famotidine 20mg    1 day in queue    0 flags   [ Review ] ║
║                                                                         ║
║  Review-by-Exception summary:                                           ║
║  3 of 4 batches have ZERO flags → fast-track approval eligible         ║
║  1 batch has 1 flag: deviation DEV-003 linked (open, major)            ║
║                                                                         ║
║  ── OPEN DEVIATIONS ─────────────────────────────────────── 4 open     ║
║                                                                         ║
║  DEV-003   pH OOS (#0846)        Major    3 days   [Investigate]       ║
║  DEV-004   EM Action ISO7-B      Major    1 day    [Investigate]       ║
║  DEV-005   Vial crack (#0843)    Minor    1 day    [Investigate]       ║
║  DEV-006   Label error (#0841)   Minor    <1 day   [Investigate]       ║
║                                                                         ║
║  ── CAPAs DUE ───────────────────────────────────────────── 1 due      ║
║                                                                         ║
║  CAPA-005  NaOH expiry tracking  Due: 04/14 (7 days)  [View]          ║
║                                                                         ║
║  ── APPROVALS PENDING ───────────────────────────────────── 2 items    ║
║                                                                         ║
║  DOC  SOP-003 Equipment Calibration v1.0    [ Approve ]  [ Reject ]    ║
║  LOT  FAM-2026-045 COA verification         [ Release ]  [ Reject ]    ║
║                                                                         ║
╚══════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────┐
│  QA PERFORMANCE METRICS (rolling 30 days)                                │
│                                                                          │
│  Batch review turnaround:  1.8 days avg  (target: <2 days) ✓           │
│  Right-first-time rate:    94%           (target: >90%)     ✓           │
│  Deviation close rate:     87%           (target: >85%)     ✓           │
│  CAPA on-time closure:     91%           (target: >90%)     ✓           │
│  Batch records requiring correction post-review: 6%  (target <10%) ✓   │
│                                                                          │
│  ● Compare to facility average:  ███████████████████████░░░  Top 10%   │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Screen D3: Production Manager Dashboard

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <Factory /> Production Command Center                                   │
│  Monday, April 7, 2026                                                   │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  TODAY'S SCHEDULE  ·  12 batches planned  ·  8 technicians on shift     │
│                                                                          │
│  TIME  │ BATCH      │ PRODUCT              │ TECH      │ STATUS         │
│  ──────┼────────────┼──────────────────────┼───────────┼──────────────  │
│  06:00 │ #2026-0847 │ Famotidine 20mg/mL   │ Carlos T. │ ██████░░ 58%  │
│  06:00 │ #2026-0848 │ Ondansetron 4mg/mL   │ Maria R.  │ ███░░░░░ 37%  │
│  06:30 │ #2026-0852 │ Ketorolac 15mg/mL    │ James W.  │ █░░░░░░░  8%  │
│  08:00 │ #2026-0849 │ Ketorolac 15mg/mL    │ ---       │ [Unassigned]  │
│  10:00 │ #2026-0850 │ Famotidine 20mg/mL   │ ---       │ [Unassigned]  │
│  13:00 │ #2026-0851 │ Methylpred 40mg/mL   │ Carlos T. │ [Scheduled]   │
│  ...   │ +6 more    │                      │           │               │
│                                                                          │
│  BOTTLENECK ALERT:                                                       │
│  ⚠ 2 batches unassigned — no qualified HD technician available          │
│  ⚠ 0.22μm filters: only 12 remaining (need 2/batch, 6 batches today)  │
│     ─ will run out by batch #8 today                                    │
│                                                                          │
│  CAPACITY UTILIZATION:                                                   │
│  Hood A (LFH-03):  ██████████████████████░░░░  85% (Carlos, Maria)     │
│  Hood B (LFH-04):  ████████░░░░░░░░░░░░░░░░░░  30% (James)            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  30-DAY PRODUCTION SUMMARY                                               │
│                                                                          │
│  Batches completed: 68   │  Yield avg: 97.2%  │  On-time: 91%          │
│  Batches rejected:  2    │  Rejection rate: 2.9% │  Target: <5%  ✓     │
│                                                                          │
│  Top products:                        Technician output:                 │
│  Famotidine 20mg    ████████ 28      Carlos T.  ████████ 24 / 0 rejects│
│  Ondansetron 4mg    █████ 18         Maria R.   ██████ 20 / 1 reject   │
│  Ketorolac 15mg     ████ 14          James W.   █████ 16 / 1 reject    │
│  Methylpred 40mg    ██ 8             Alex P.    — (blocked/unqualified)│
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Screen D4: PIC Dashboard (Dr. Priya)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <FlaskConical /> PIC Command Center          Dr. Priya Shah · PIC       │
│  Monday, April 7, 2026                                                   │
└──────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════════════════╗
║  PENDING YOUR RELEASE — 2 batches awaiting PIC e-signature               ║
║                                                                          ║
║  #2026-0844  Famotidine 20mg/mL  │  QA: ✓ Approved  │  Lab: ✓ All Pass.  ║
║              Yield: 99.2%        │  Devs: 0 open    │  BUD: 06/07/26     ║
║              [ REVIEW & RELEASE ]                                        ║
║                                                                          ║
║  #2026-0838  Ketorolac 15mg/mL   │  QA: ✓ Approved  │  Lab: ✓ All Pass   ║
║              Yield: 96.5%        │  Devs: 0 open    │  BUD: 06/01/26     ║ 
║              [ REVIEW & RELEASE ]                                        ║
╚══════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────┐
│  RELEASE BLOCKERS — 3 batches stuck                                      │
│                                                                          │
│  #2026-0841  Cannot release: DEV-006 (label error) — OPEN                │
│  #2026-0846  Cannot release: DEV-003 (pH OOS) — under investigation      │
│  #2026-0847  In progress (Step 7/12) — not yet submitted                 │
│                                                                          │
│  FORMULA APPROVALS                                                       │
│  MPR-40-INJ v1.0  Methylprednisolone 40mg — pending your approval        │
│  CIS-01-INJ v1.0  Cisplatin 1mg (HD) — draft, awaiting submission        │
│                                                                          │
│  Change Control:                                                         │
│  2 active changes in last 30 days  ·  0 pending your sign-off            │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Dashboard Design Rules

```
1. NO VANITY METRICS — Every number must answer a decision question
   Bad:  "12 batches today" (so what?)
   Good: "2 unassigned batches — no qualified HD tech available" (action needed)

2. EXCEPTIONS FIRST — Surface problems, not successes
   Lead with what needs attention, not what's going well

3. DRILL-DOWN ALWAYS — Every metric links to the detail screen
   Click "4 batches pending review" → goes to /batches?status=pending_review

4. CONTEXTUAL COMPARISON — Always show target alongside actual
   "Review turnaround: 1.8 days (target: <2 days) ✓"

5. PREDICTIVE, NOT JUST HISTORICAL
   "Stockout in 6 days" is 100x more useful than "12 filters in stock"

6. TREND, NOT SNAPSHOT
   Sparklines for EM, aging bars for deviations, velocity for batch release
```

---

*Next: [04-production.md](./04-production.md) — Production board & scheduling*

---

## Acceptance Criteria (for IQ/OQ/PQ Validation)

### Screen D1: Dashboard (All Roles)

- [ ] AC-D1-01: Page loads within 2 seconds with all 5 pillar scores visible
- [ ] AC-D1-02: Audit Readiness Score displays as percentage with color coding (≥90% green, 70-89% amber, <70% red)
- [ ] AC-D1-03: Clicking any pillar card navigates to that module's list view
- [ ] AC-D1-04: Active Batches section shows real-time count and status breakdown
- [ ] AC-D1-05: Personnel heatmap shows qualification matrix with color-coded expiry
- [ ] AC-D1-06: Stockout Forecast shows items predicted to expire/deplete in 30/60/90 days
- [ ] AC-D1-07: Activity Feed shows last 50 events with timestamps and deep links
- [ ] AC-D1-08: Dashboard is role-filtered — each role sees only their authorized metrics

### Role-Specific Variants

- [ ] AC-D2-01: VP view shows facility-wide KPIs, no individual batch details
- [ ] AC-D2-02: QA Manager view highlights open deviations, CAPA aging, and EM excursions
- [ ] AC-D2-03: Production Manager view shows Kanban summary and technician availability
- [ ] AC-D2-04: PIC view shows batch release queue and formula review backlog

---

## Error & Edge Cases

```
LOADING STATE:
├── Skeleton cards (animated pulse) for all 5 pillar sections
├── Activity feed shows 5 skeleton rows
└── No data is shown until all API calls resolve

EMPTY STATE (Day 1 — no batches yet):
├── Score displays "N/A" with gray badge
├── Batch section: "No batches created yet — start your first batch"
├── Personnel: "No technicians assigned — go to Training"
├── EM: "No environmental data — configure rooms first"
└── Each empty card has a CTA button to the relevant module

ERROR STATE (API failure):
├── Failed pillar shows: ⚠ "Unable to load [section name]"
├── Retry button appears on failed section only
├── Other sections continue to render independently
└── Error logged to observability (batchLogger, complianceLogger)

EDGE CASE: Data staleness
├── Dashboard auto-refreshes every 60 seconds
├── Shows "Last updated: [timestamp]" in footer
├── Manual refresh button in header
└── If server unreachable for >5min, banner: "Connection lost — showing cached data"

EDGE CASE: User with no team members
├── Personnel heatmap shows only the logged-in user
├── "Add team members" CTA links to /admin/users
└── Does not show empty grid
```

---

## Data Requirements

```
Server Actions / API Endpoints needed:
├── getDashboardMetrics(role)
│   → Returns: { auditScore, batchStats, personnelMatrix,
│                 stockForecast, emSummary, activityFeed }
│   → Cached: 60s TTL, role-specific cache key
│
├── getAuditReadinessScore()
│   → Aggregates: open deviations, training compliance,
│                  calibration status, EM trends, document review
│
├── getStockoutForecast(days: 30|60|90)
│   → Calculates: burn rate × days remaining vs. reorder lead time
│
├── getPersonnelHeatmap(orgId)
│   → Returns: matrix of users × qualifications × expiry dates
│
└── getActivityFeed(limit: 50)
    → Returns: { events: AuditTrailEntry[], hasMore: boolean }

Database tables accessed (read-only):
├── batches (count by status)
├── deviations (open count, aging)
├── capas (overdue count)
├── training_records (expiry check)
├── calibration_records (next due)
├── em_samples (excursion count)
├── inventory_lots (stock + burn rate)
├── audit_trail (activity feed)
└── users (personnel matrix)
```

---
