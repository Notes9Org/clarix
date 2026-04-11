---
id: SCR-009
title: Environmental Monitoring (EM)
version: "1.1"
status: approved
priority: P1
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [211.42, 211.46]
urs_refs: [URS-018, URS-019]
frs_refs: [FRS-024, FRS-025, FRS-026]
---
# 09 — Environmental Monitoring (EM)

> **Users:** microbiologist, qa_manager
> **Routes:** `/environmental`, `/environmental/samples/[id]`
> **Priority:** P1
> **Persona:** Sarah (Microbiologist) — "Track every CFU, catch trends before FDA does"
> **21 CFR Part 11 Scope:** EM sample chain of custody, excursion-to-deviation linking

## Revision History

| Version | Date       | Author  | Change Description                | Approved By |
| ------- | ---------- | ------- | --------------------------------- | ----------- |
| 1.0     | 2026-04-05 | fillsai | Initial EM specification          | fillsai     |
| 1.1     | 2026-04-07 | fillsai | Added frontmatter, CFR references | fillsai     |

---

## Screen E1: EM Dashboard (`/environmental`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <Wind /> Environmental Monitoring                  [ + Log Sample ]    │
│  Cleanroom trending and excursion tracking                               │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ ROOMS        │  │ ACTIVE       │  │ EXCURSIONS   │  │ SAMPLES DUE  │
│ MONITORED    │  │ EXCURSIONS   │  │ (30 DAYS)    │  │ TODAY        │
│     6        │  │      1       │  │      3       │  │     12       │
│  rooms       │  │  ISO 7-B     │  │  all resolved│  │  locations   │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌──────────────────────────────────┐  ┌────────────────────────────────────┐
│  ROOM STATUS MAP                 │  │  VIABLE COUNT TREND (90 days)      │
│                                  │  │                                    │
│  ┌────────┐  ┌────────┐         │  │  CFU                               │
│  │ ISO 5  │  │ ISO 5  │         │  │   8 ┤ - - - - - - Action Limit     │
│  │ Hood A │  │ Hood B │         │  │   6 ┤                               │
│  │  ✓ 0   │  │  ✓ 0   │         │  │   4 ┤──────────── Alert Limit      │
│  └────────┘  └────────┘         │  │   2 ┤  ╭─╮                         │
│                                  │  │   0 ┤──╯ ╰──────── ISO 5 Hood A   │
│  ┌──────────────────────┐       │  │     ┤                               │
│  │    ISO 7 - Room A    │       │  │   4 ┤     ╭─╮                       │
│  │     ✓ Clean (2 CFU)  │       │  │   2 ┤─────╯ ╰────── ISO 7 Room A  │
│  └──────────────────────┘       │  │   0 ┤                               │
│                                  │  │     ┤     ╭──────╮                  │
│  ┌──────────────────────┐       │  │   7 ┤─────╯      ╰── ISO 7 Room B │
│  │    ISO 7 - Room B    │       │  │   4 ┤  ⚠ trending up               │
│  │     ⚠ Alert (6 CFU)  │       │  │     └──┬──┬──┬──┬──┬──→           │
│  └──────────────────────┘       │  │       Jan Feb Mar Apr              │
│                                  │  │                                    │
│  ┌──────────────────────┐       │  │  Legend:                            │
│  │    ISO 8 - Ante Room │       │  │  ── Alert limit (ISO 5: >1 CFU)   │
│  │     ✓ Clean (3 CFU)  │       │  │  -- Action limit (ISO 5: >3 CFU)  │
│  └──────────────────────┘       │  │                                    │
└──────────────────────────────────┘  └────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  RECENT SAMPLES                                                          │
│                                                                          │
│  Date      │ Location    │ Type          │ CFU │ Status        │ Action  │
│  ──────────┼─────────────┼───────────────┼─────┼───────────────┼──────── │
│  04/07 AM  │ ISO 5 Hood A│ Viable Air    │  0  │ [✓ Within]   │  →      │
│  04/07 AM  │ ISO 7 Rm A  │ Viable Air    │  2  │ [✓ Within]   │  →      │
│  04/07 AM  │ ISO 7 Rm B  │ Viable Air    │  6  │ [⚠ Alert!]   │  →      │
│  04/07 AM  │ ISO 8 Ante  │ Viable Air    │  3  │ [✓ Within]   │  →      │
│  04/06 AM  │ ISO 5 Hood A│ Surface       │  0  │ [✓ Within]   │  →      │
│  04/06 AM  │ ISO 7 Rm B  │ Viable Air    │  8  │ [✕ Action!]  │  →      │
│            │             │               │     │ EXC-2026-004  │         │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Screen E2: EM Sample Detail (`/environmental/samples/[id]`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Environmental                                                        │
│  Sample EM-2026-0412                                                     │
│  ISO 7 Room B  ·  Viable Air  ·  04/06 at 08:30                        │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐  ┌────────────────────────────────────────┐
│  SAMPLE INFO                 │  │  RESULT                                │
│                              │  │                                        │
│  Location:  ISO 7 - Room B   │  │  Viable Count:   8 CFU                 │
│  Type:      Viable Air       │  │  Alert Limit:    5 CFU                 │
│  Media Lot: TSA-2026-012     │  │  Action Limit:   7 CFU                 │
│  Collected: Sarah M.         │  │                                        │
│  Collected: 04/06 08:30      │  │  Status: [✕ ACTION LIMIT EXCEEDED]    │
│                              │  │                                        │
│  Incubation:                 │  │  Rule E2: Auto-created excursion       │
│  Started:  04/06 08:45       │  │  EXC-2026-004 (linked below)          │
│  Read on:  04/13 08:45       │  │                                        │
│  Duration: 7 days ✓          │  │  Organism ID: pending                  │
└──────────────────────────────┘  └────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  AFFECTED BATCHES (Rule E4: auto-populated by room + time overlap)      │
│                                                                          │
│  Batch #     │ Product              │ Time in Room       │ Status        │
│  ────────────┼──────────────────────┼────────────────────┼────────────── │
│  #2026-0844  │ Famotidine 20mg/mL   │ 04/06 06:00–12:30 │ [✓ Released]  │
│  #2026-0845  │ Methylpred 40mg/mL   │ 04/06 13:00–16:45 │ [◷ Pending]   │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  LINKED EXCURSION: EXC-2026-004                                         │
│  Status: [Under Investigation]                                           │
│  Investigator: Sarah M.                                                  │
│  Root Cause: [____________________________________________]              │
│  Corrective Action: Enhanced cleaning protocol initiated                │
│                                                                          │
│  ⚠ Rule E3: Action excursion must link to formal deviation before close │
│                                                                          │
│                       [ Link to Deviation ]  [ Close Excursion ]         │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## iPad: EM Sampling (Screen M6)

```
╔══════════════════════════════════════════════════════════════════════════╗
║  CLARIX EM                        Sarah M. · Microbiologist    ◷ 08:30   ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║   TODAY'S SAMPLING SCHEDULE                                             ║
║                                                                         ║
║   ┌────────────────────────┬──────────┬──────────────┬────────────────┐ ║
║   │ Location               │ Type     │ Frequency    │ Status         │ ║
║   ├────────────────────────┼──────────┼──────────────┼────────────────┤ ║
║   │ ISO 5 Hood A           │ Viable   │ Daily        │ [ ] Not done   │ ║
║   │ ISO 5 Hood B           │ Viable   │ Daily        │ [ ] Not done   │ ║
║   │ ISO 7 Room A           │ Viable   │ Daily        │ [ ] Not done   │ ║
║   │ ISO 7 Room B           │ Viable   │ Daily        │ [ ] Not done   │ ║
║   │ ISO 8 Ante Room        │ Viable   │ Weekly       │ [x] Done       │ ║
║   │ ISO 5 Hood A           │ Surface  │ Weekly       │ [ ] Not done   │ ║
║   └────────────────────────┴──────────┴──────────────┴────────────────┘ ║
║                                                                         ║
║   Tap location or scan room QR code to begin sampling.                  ║
║                                                                         ║
║   ┌──────────────────────────────────────────────────────────────────┐  ║
║   │              <ScanBarcode /> SCAN ROOM QR CODE                   │  ║
║   │                  (full width, h-14)                              │  ║
║   └──────────────────────────────────────────────────────────────────┘  ║
╚═════════════════════════════════════════════════════════════════════════╝
```

---

## EM Rules Summary

```
E1: viable_count > alert_limit → exceeds_alert = true → notify micro
E2: viable_count > action_limit → exceeds_action = true → auto excursion → notify qa
E3: Action excursions must link to deviation before closing
E4: affected_batches auto-populated by room + time overlap
E5: Overdue samples (past schedule) → escalate to qa_manager
```

---

*Next: [10-quality.md](./10-quality.md) — Deviations, CAPAs, Documents*
