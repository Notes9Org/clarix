---
id: SCR-004
title: Production Board & Scheduling
version: "1.1"
status: approved
priority: P0
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [211.25, 211.68]
urs_refs: [URS-005, URS-006]
frs_refs: [FRS-009, FRS-010]
---
# 04 — Production Board & Scheduling

> **Users:** prod_mgr, pic, pharmacist
> **Route:** `/production`
> **Priority:** P0
> **Persona:** Production Manager — "Where is every batch right now?"
> **21 CFR Part 11 Scope:** Technician qualification gate enforcement (R7/R8)

## Revision History

| Version | Date       | Author  | Change Description                  | Approved By |
| ------- | ---------- | ------- | ----------------------------------- | ----------- |
| 1.0     | 2026-04-05 | fillsai | Initial production specification    | fillsai     |
| 1.1     | 2026-04-07 | fillsai | Added frontmatter, error/edge cases | fillsai     |

---

## Screen P1: Production Kanban Board (`/production`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <Factory /> Production                        [ + New Batch ] [Filter ▼]│
│  Real-time batch pipeline                                                │
└──────────────────────────────────────────────────────────────────────────┘

┌─ DRAFT (3) ─────┐ ┌─ IN PROGRESS (5) ┐ ┌─ PENDING REVIEW ─┐ ┌─ RELEASED ──┐
│                  │ │                   │ │ (3)              │ │ (12 today)  │
│ ┌──────────────┐ │ │ ┌───────────────┐ │ │ ┌──────────────┐ │ │ ┌──────────┐│
│ │ #2026-0849   │ │ │ │ #2026-0847    │ │ │ │ #2026-0840   │ │ │ │ #0838    ││
│ │ Ketorolac    │ │ │ │ Famotidine    │ │ │ │ Ondansetron  │ │ │ │ Famot.   ││
│ │ 15mg/mL      │ │ │ │ 20mg/mL       │ │ │ │ 4mg/mL       │ │ │ │          ││
│ │              │ │ │ │               │ │ │ │              │ │ │ │ [✓ Rel.] ││
│ │ [◦ Draft]    │ │ │ │ Step 7/12     │ │ │ │ [◷ Pending]  │ │ │ └──────────┘│
│ │ No tech      │ │ │ │ Carlos T.     │ │ │ │ Submitted    │ │ │            │
│ │ assigned     │ │ │ │ [↻ Active]    │ │ │ │ 2h ago       │ │ │ ┌──────────┐│
│ └──────────────┘ │ │ │               │ │ │ └──────────────┘ │ │ │ #0837    ││
│                  │ │ │ ██████░░░░ 58%│ │ │                  │ │ │ Ketor.   ││
│ ┌──────────────┐ │ │ └───────────────┘ │ │ ┌──────────────┐ │ │ │ [✓ Rel.] ││
│ │ #2026-0850   │ │ │                   │ │ │ #2026-0841   │ │ │ └──────────┘│
│ │ Famotidine   │ │ │ ┌───────────────┐ │ │ │ Methylpred   │ │ │            │
│ │ 20mg/mL      │ │ │ │ #2026-0848    │ │ │ │ 40mg/mL      │ │ │   ...      │
│ │ [◦ Draft]    │ │ │ │ Ondansetron   │ │ │ │ [◷ Pending]  │ │ │ +9 more    │
│ │ Sched: 10am  │ │ │ │ Step 3/8      │ │ │ │ <AlertTriangle/>││            │
│ └──────────────┘ │ │ │ Maria R.      │ │ │ │ 1 deviation  │ │ │            │
│                  │ │ │ [↻ Active]    │ │ │ └──────────────┘ │ │            │
│ ┌──────────────┐ │ │ │ ███░░░░░░ 37% │ │ │                  │ │            │
│ │ #2026-0851   │ │ │ └───────────────┘ │ │ ┌──────────────┐ │ │            │
│ │ Methylpred   │ │ │                   │ │ │ #2026-0842   │ │ │            │
│ │ [◦ Draft]    │ │ │     ...           │ │ │ Famotidine   │ │ │            │
│ │ Sched: 1pm   │ │ │   +3 more         │ │ │ [◷ Pending]  │ │ │            │
│ └──────────────┘ │ │                   │ │ └──────────────┘ │ │            │
└──────────────────┘ └───────────────────┘ └──────────────────┘ └────────────┘
```

---

## Kanban Card Anatomy

```
┌──────────────────────────────┐
│  #2026-0847                  │  ← font-mono, text-sm
│  Famotidine 20mg/mL          │  ← text-sm, font-medium
│  15mg/mL Injection           │  ← text-xs, muted-foreground
│                              │
│  Step 7 of 12                │  ← text-xs
│  ██████████░░░░░░░░░░ 58%    │  ← progress bar
│                              │
│  Carlos T.      [↻ Active]   │  ← avatar + status badge
│                              │
│ <AlertTriangle /> 1 deviation│ ← if has_open_deviation (red)
└──────────────────────────────┘

CARD INTERACTIONS:
- Click card  → Navigate to /batches/[id]
- Drag card   → NOT allowed (status changes require e-sig)
- Hover       → bg: muted/40
```

---

## Screen P2: Scheduling Calendar View

Toggle at top: `[ Board ]  [ Calendar ]  [ List ]`

```
┌──────────────────────────────────────────────────────────────────────┐
│  <Calendar /> April 2026                    [ ← ]  Today  [ → ]      │
│  [ Board ]  [ Calendar ]  [ List ]                                   │
└──────────────────────────────────────────────────────────────────────┘

┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐
│ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Sat  │ Sun  │
│ 4/7  │ 4/8  │ 4/9  │ 4/10 │ 4/11 │ 4/12 │ 4/13 │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│▓▓▓▓▓▓│      │      │      │      │      │      │
│ 12   │  8   │  10  │  6   │  8   │      │      │
|batches│batch│batch │batch │batch │      │      │
│      │      │      │      │      │      │      │
│ ┌──┐ │ ┌──┐ │      │      │      │      │      │
│ │F │ │ │O │ │      │      │      │      │      │
│ │K │ │ │M │ │      │      │      │      │      │
│ │F │ │ │F │ │      │      │      │      │      │
│ │M │ │ │  │ │      │      │      │      │      │
│ │..│ │ │..│ │      │      │      │      │      │
│ └──┘ │ └──┘ │      │      │      │      │      │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│ 4/14 │ 4/15 │ ...                               │
```

---

## Screen P3: Technician Assignment

**Scenario:** Prod Manager assigns Carlos to batch #2026-0849.

```
┌──────────────────────────────────────────────────────────┐
│  Assign Technician — Batch #2026-0849                     │
│  Ketorolac 15mg/mL Injection                              │
│                                                           │
│  ──────────────────────────────────────────────────────   │
│                                                           │
│  QUALIFIED TECHNICIANS                                    │
│                                                           │
│  ┌────┬────────────────┬───────────┬──────────┬────────┐ │
│  │    │ Name           │ Media Fill│ Garbing  │ HD     │ │
│  ├────┼────────────────┼───────────┼──────────┼────────┤ │
│  │ (•)│ Carlos T.      │ ✓ Current │ ✓ Current│ ✓ Yes  │ │
│  │ ( )│ Maria R.       │ ✓ Current │ ✓ Current│ ✕ No   │ │
│  │ ( )│ James W.       │ ◷ Due 4/15│ ✓ Current│ ✓ Yes  │ │
│  │ ──│ Alex P.         │ ✕ Expired │ ✕ Expired│ ✕ No   │ │
│  └────┴────────────────┴───────────┴──────────┴────────┘ │
│                                                           │
│  ⚠ Alex P. is not qualified (R7: garbing + media fill)   │
│  ⚠ HD product — Maria R. not HD-trained (R8)             │
│                                                           │
│                        [ Cancel ]  [ Assign Carlos T. ]   │
└──────────────────────────────────────────────────────────┘
```

### Assignment Rules

```
R7 Gate:  media_fill_qualified = true AND garbing_qualified = true
R8 Gate:  If batch.hazardous_drug = true → hd_trained = true required
Display:  Unqualified techs shown but greyed out with reason
```

---

*Next: [05-batch-lifecycle.md](./05-batch-lifecycle.md) — Batch list, detail, review, release*
