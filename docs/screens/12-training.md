---
id: SCR-012
title: Training & Personnel Qualification
version: "1.1"
status: approved
priority: P2
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [211.25]
urs_refs: [URS-025, URS-026]
frs_refs: [FRS-033, FRS-034]
---
# 12 — Training & Personnel Qualification

> **Users:** training_coord, qa_manager
> **Route:** `/training`
> **Priority:** P2
> **Persona:** Training Coordinator — "Every person qualified before they touch a batch"
> **21 CFR Part 11 Scope:** Qualification gate enforcement (R7/R8), training record immutability

## Revision History

| Version | Date       | Author  | Change Description             | Approved By |
| ------- | ---------- | ------- | ------------------------------ | ----------- |
| 1.0     | 2026-04-05 | fillsai | Initial training specification | fillsai     |
| 1.1     | 2026-04-07 | fillsai | Added frontmatter, edge cases  | fillsai     |

---

## Screen T1: Training Dashboard (`/training`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <GraduationCap /> Training & Qualification         [ + Assign Training ]│
│  Personnel qualification matrix and compliance tracking                  │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ TEAM         │  │ FULLY        │  │ EXPIRING     │  │ OVERDUE      │
│ MEMBERS      │  │ QUALIFIED    │  │ WITHIN 30d   │  │              │
│     15       │  │     11       │  │      3       │  │      1       │
│  active      │  │  73%         │  │  requalify   │  │  ✕ blocked   │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  QUALIFICATION MATRIX                                                    │
│                                                                          │
│              │ GMP  │ Aseptic │ Media Fill│ Garbing │ HD    │ Overall    │
│  ────────────┼──────┼─────────┼───────────┼─────────┼───────┼──────────  │
│  Carlos T.   │ ✓    │ ✓       │ ✓ 06/15   │ ✓ 05/01│ ✓       │ [✓ Qual.] │
│  Maria R.    │ ✓    │ ✓       │ ✓ 07/20   │ ✓ 06/10│ ✕       │ [✓ Qual.] │
│  James W.    │ ✓    │ ✓       │ ⚠ 04/15   │ ✓ 08/01│ ✓       │ [⚠ Due]   │
│  Alex P.     │ ✓    │ ✕ exp   │ ✕ expired │ ✕ exp  │ ✕       │ [✕ Blocked]│
│  Sarah M.    │ ✓    │ ✓       │ N/A       │ N/A    │ N/A     │ [✓ Qual.] │
│  Rosa M.     │ ✓    │ N/A     │ N/A       │ N/A    │ N/A     │ [✓ Qual.] │
│  David W.    │ ✓    │ N/A     │ N/A       │ N/A    │ N/A     │ [✓ Qual.] │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

  ✓       = Current qualification  (green)
  ⚠ MM/DD = Expiring within 30 days (amber) — shows expiry date
  ✕       = Expired or not trained  (red)
  N/A     = Not applicable for role (gray)

  Rule R7: technician blocked from batch steps if media_fill or garbing expired
  Rule T3: expired training blocks user from performing related steps
  Rule T4: media_fill_qualified auto-sets to false when expiry < today
```

---

## Screen T2: Individual Training Record

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Training                                                              │
│  Carlos Thompson  ·  Compounding Technician                              │
│  Employee ID: CT-2024-001  ·  Hire Date: 2024-06-15                      │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────┬─────────────────────────┬──────────┬──────────┬──────────────┐
│ Type     │ Training                │ Completed│ Expires  │ Status       │
├──────────┼─────────────────────────┼──────────┼──────────┼──────────────┤
│ GMP      │ cGMP General Training   │ 01/15/26 │ 01/15/27 │ [✓ Current]  │
│ Aseptic  │ Aseptic Technique       │ 02/01/26 │ 02/01/27 │ [✓ Current]  │
│ MediaFill│ Media Fill Qualification│ 12/15/25 │ 06/15/26 │ [✓ Current]  │
│ Garbing  │ Garbing Qualification   │ 11/01/25 │ 05/01/26 │ [⚠ Due Soon] │
│ HD       │ Hazardous Drug (USP 800)│ 03/10/26 │ 03/10/27 │ [✓ Current]  │
│ SOP      │ SOP-001 Aseptic Compounding│01/20/26│ —       │ [✓ Read]     │
│ SOP      │ SOP-004 Cleaning        │ 01/20/26 │ —        │ [✓ Read]     │
│ Equip    │ BAL-004 Balance Training│ 01/25/26 │ —        │ [✓ Complete] │
└──────────┴─────────────────────────┴──────────┴──────────┴──────────────┘

  [ + Assign New Training ]  [ Print Qualification Certificate ]
```

---

*Next: [13-lab.md](./13-lab.md) — Lab sample tracking*
