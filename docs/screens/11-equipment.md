---
id: SCR-011
title: Equipment, Calibration & Cleaning
version: "1.1"
status: approved
priority: P2
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [211.63, 211.68]
urs_refs: [URS-023, URS-024]
frs_refs: [FRS-030, FRS-031, FRS-032]
---
# 11 — Equipment, Calibration & Cleaning

> **Users:** maintenance, qa_manager
> **Routes:** `/equipment`, `/cleaning`
> **Priority:** P2
> **Persona:** Rosa (Maintenance) — "Every instrument calibrated, every room clean"
> **21 CFR Part 11 Scope:** Calibration chain of custody, cleaning agent rotation enforcement

## Revision History

| Version | Date       | Author  | Change Description              | Approved By |
| ------- | ---------- | ------- | ------------------------------- | ----------- |
| 1.0     | 2026-04-05 | fillsai | Initial equipment specification | fillsai     |
| 1.1     | 2026-04-07 | fillsai | Added frontmatter, traceability | fillsai     |

---

## Screen EQ1: Equipment Dashboard (`/equipment`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <Gauge /> Equipment                               [ + Add Equipment ]  │
│  Registry, calibrations, and maintenance                                 │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ TOTAL        │  │ CAL DUE      │  │ OUT OF CAL   │  │ OUT OF       │
│ EQUIPMENT    │  │ THIS WEEK    │  │              │  │ SERVICE      │
│     24       │  │      3       │  │      1       │  │     0        │
│  registered  │  │  ⚠ schedule  │  │  ✕ blocked   │  │  retired     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌──────────┬──────────────────┬─────────────┬────────────┬──────────────┐
│ ID       │ Equipment        │ Type        │ Next Cal   │ Status       │
├──────────┼──────────────────┼─────────────┼────────────┼──────────────┤
│ BAL-004  │ Analytical Balance│ balance    │ 04/10      │[⚠ Cal Due]  │
│ PH-002   │ pH Meter         │ ph_meter    │ 04/12      │[⚠ Cal Due]  │
│ LFH-03   │ Laminar Flow Hood│ lam_flow    │ 05/01      │[✓ Qualified]│
│ AUT-001  │ Autoclave        │ autoclave   │ 04/20      │[✓ Qualified]│
│ PH-001   │ pH Meter (old)   │ ph_meter    │ OVERDUE    │[✕ Out of Cal]│
│ FIL-001  │ Colonnar Filler  │ colonnar    │ 06/15      │[✓ In Use]   │
│ PC-001   │ Particle Counter │ part_counter│ 05/10      │[✓ Qualified]│
└──────────┴──────────────────┴─────────────┴────────────┴──────────────┘

  Rule T1: next_calibration_due < today → auto "out_of_calibration"
  Rule T2: Batches cannot use out_of_calibration equipment
```

---

## iPad: Calibration Entry (Screen M9)

```
╔══════════════════════════════════════════════════════════════════════════╗
║  CLARIX                             Rosa M. · Maintenance     ◷ 07:30  ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║   CALIBRATE: BAL-004 — Analytical Balance                               ║
║   Last Cal: 2026-01-10  ·  Due: 2026-04-10  ·  Frequency: Quarterly   ║
║                                                                         ║
║   ── Pre-Calibration Readings ──                                        ║
║                                                                         ║
║   Standard Used: [NIST 10g Class F ▼]     Cert #: [C-2026-044____]     ║
║                                                                         ║
║   ┌──────────────────────┬──────────────────────┐                       ║
║   │  PRE-CAL READING     │  POST-CAL READING    │                       ║
║   │                      │                       │                       ║
║   │  10g Std: [10.002_]  │  10g Std: [10.001_]  │                       ║
║   │  50g Std: [50.005_]  │  50g Std: [50.002_]  │                       ║
║   │  100g Std:[100.003]  │  100g Std:[100.001]  │                       ║
║   │                      │                       │                       ║
║   └──────────────────────┴──────────────────────┘                       ║
║                                                                         ║
║   Result: [✓ PASS — all readings within ±0.01g tolerance]              ║
║                                                                         ║
║   Next Calibration Due: 2026-07-10 (auto-calculated)                    ║
║                                                                         ║
║   ┌──────────────────────────────────────────────────────────────────┐  ║
║   │                    [ SIGN & COMPLETE ]                            │  ║
║   └──────────────────────────────────────────────────────────────────┘  ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## Screen CL1: Cleaning Dashboard (`/cleaning`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <Waves /> Cleaning & Sanitization                                       │
│  Room cleaning schedule and completion tracking                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┬──────────┬──────────┬──────────────┬────────────┐
│ Room                 │ Schedule │ Last Done│ Agent Used   │ Status     │
├──────────────────────┼──────────┼──────────┼──────────────┼────────────┤
│ ISO 5 Hood A         │ After ea.│ 04/07 AM │ Sporicidin   │ [✓ Done]   │
│ ISO 5 Hood B         │ After ea.│ 04/07 AM │ Sporicidin   │ [✓ Done]   │
│ ISO 7 Room A         │ Daily    │ 04/07 AM │ CiDehol      │ [✓ Done]   │
│ ISO 7 Room B         │ Daily    │ 04/06 PM │ Sporicidin   │ [⚠ Overdue]│
│ ISO 8 Ante Room      │ Daily    │ 04/07 AM │ Peridox      │ [✓ Done]   │
│ Warehouse            │ Weekly   │ 04/02    │ Peridox      │ [✓ Done]   │
└──────────────────────┴──────────┴──────────┴──────────────┴────────────┘

  Agent rotation enforced: system tracks which agent was last used
  and suggests the next in rotation (Sporicidin → CiDehol → Peridox → ...)
```

---

## iPad: Cleaning Log Entry (Screen M8)

```
╔══════════════════════════════════════════════════════════════════════════╗
║  CLEANING LOG — ISO 7 Room B                                             ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║   ① Scan room QR code:  [✓ ISO 7 Room B verified]                       ║
║                                                                          ║
║   ② Cleaning Protocol: Standard Daily — ISO 7                           ║
║                                                                          ║
║   ③ Agent Selection (rotation enforced):                                ║
║      Last used: Sporicidin (04/06)                                      ║
║      Suggested: [CiDehol ▼]  ← system enforces rotation                 ║
║                                                                         ║
║   ④ Contact Time:                                                      ║
║      Required: 10 minutes                                               ║
║      ┌──────────────────┐                                               ║
║      │     08:34        │  ← countdown timer                            ║
║      │     remaining    │                                               ║
║      └──────────────────┘                                               ║
║                                                                         ║
║   ⑤ Checklist:                                                         ║
║      [x] All surfaces wiped (walls, floors, ceiling)                    ║
║      [x] Equipment surfaces decontaminated                              ║
║      [x] Pass-through wiped                                             ║
║      [ ] Drain cleaned (if applicable)                                  ║
║                                                                         ║
║   ┌──────────────────────────────────────────────────────────────────┐  ║
║   │                    [ SIGN & COMPLETE ]                           │  ║
║   └──────────────────────────────────────────────────────────────────┘  ║
╚═════════════════════════════════════════════════════════════════════════╝
```

---

*Next: [12-training.md](./12-training.md) — Personnel qualification matrix*
