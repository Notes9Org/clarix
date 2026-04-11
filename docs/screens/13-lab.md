---
id: SCR-013
title: Lab Sample Tracking (Mini-LIMS)
version: "1.1"
status: approved
priority: P3
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [211.160, 211.165]
urs_refs: [URS-027, URS-028]
frs_refs: [FRS-035, FRS-036]
---

# 13 — Lab Sample Tracking (Mini-LIMS)

> **Users:** qc_tech, qa_manager  
> **Route:** `/lab`  
> **Priority:** P3  
> **Persona:** QC Tech — "Track every sample from bench to result"  
> **21 CFR Part 11 Scope:** Sample chain of custody, COA verification, batch-release blocking

## Revision History

| Version | Date       | Author   | Change Description                    | Approved By |
|---------|------------|----------|---------------------------------------|-------------|
| 1.0     | 2026-04-05 | fillsai  | Initial lab specification             | fillsai     |
| 1.1     | 2026-04-07 | fillsai  | Added frontmatter, sample lifecycle   | fillsai     |

---

## Screen L1: Lab Dashboard (`/lab`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <TestTube2 /> Lab Samples                          [ + Log Sample ]    │
│  QC sample tracking and external lab coordination                        │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ ACTIVE       │  │ AWAITING     │  │ IN TESTING   │  │ RESULTS      │
│ SAMPLES      │  │ SHIPMENT     │  │              │  │ RECEIVED     │
│     18       │  │      4       │  │     6        │  │     8        │
│  total       │  │  pack today  │  │  at Eagle    │  │  review      │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌──────────┬──────────────┬──────────────┬──────────┬──────────┬─────────┐
│ Sample # │ Batch        │ Test Type    │ Lab      │ Status   │ Result  │
├──────────┼──────────────┼──────────────┼──────────┼──────────┼─────────┤
│ SAM-0089 │ #2026-0847   │ Sterility    │ Eagle    │[↻ Testing]│ —      │
│ SAM-0088 │ #2026-0847   │ Endotoxin    │ Eagle    │[↻ Testing]│ —      │
│ SAM-0087 │ #2026-0847   │ Potency      │ Eagle    │[↻ Testing]│ —      │
│ SAM-0086 │ #2026-0846   │ Sterility    │ Eagle    │[✓ Pass]  │ PASS   │
│ SAM-0085 │ #2026-0846   │ Endotoxin    │ Eagle    │[✓ Pass]  │ <0.25  │
│ SAM-0084 │ #2026-0846   │ Potency      │ Eagle    │[✓ Pass]  │ 99.2%  │
│ SAM-0083 │ #2026-0844   │ Particulate  │ In-house │[✕ Fail]  │ FAIL   │
│          │              │              │          │          │ retest  │
└──────────┴──────────────┴──────────────┴──────────┴──────────┴─────────┘

  Sample lifecycle: Sampled → Shipped → In Testing → Results → Pass/Fail
  Batch cannot release until all linked lab samples = Pass
```

---

## Screen L2: Sample Detail

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Lab Samples                                                          │
│  SAM-2026-0086  ·  Batch #2026-0846  ·  Ketorolac 15mg/mL             │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐  ┌────────────────────────────────────────┐
│  SAMPLE INFO                 │  │  RESULT                                │
│                              │  │                                        │
│  Test Type:  Sterility       │  │  Result:   PASS                        │
│  Method:     USP <71>        │  │  Report #: EAG-2026-4521              │
│  Lab:        Eagle Analytical│  │  Received: 04/05                       │
│  Sampled by: Carlos T.      │  │                                        │
│  Sampled:    03/28           │  │  COA: [View PDF]                       │
│  Shipped:    03/29           │  │                                        │
│  Received:   03/30           │  │  Entered by: QC Tech                   │
│  Completed:  04/05 (14 days)│  │  Verified:   QA Manager                │
└──────────────────────────────┘  └────────────────────────────────────────┘
```

---

*Next: [14-admin.md](./14-admin.md) — User management, audit trail, settings*
