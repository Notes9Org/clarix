---
id: SCR-016
title: Notifications Center
version: "1.1"
status: approved
priority: P1
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [N/A]
urs_refs: [URS-035]
frs_refs: [FRS-044]
---
# 16 — Notifications Center

> **Users:** All roles
> **Route:** `/notifications`
> **Priority:** P1
> **21 CFR Part 11 Scope:** Role-targeted escalation alerts, deep-link navigation

## Revision History

| Version | Date       | Author  | Change Description                  | Approved By |
| ------- | ---------- | ------- | ----------------------------------- | ----------- |
| 1.0     | 2026-04-05 | fillsai | Initial notifications specification | fillsai     |
| 1.1     | 2026-04-07 | fillsai | Added frontmatter, role mapping     | fillsai     |

---

## Screen N1: Notification Center (`/notifications`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <Bell /> Notifications                    [ Mark All Read ]  [Filter ▼] │
│  3 unread                                                                │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ⬤ [✕ EM Action Limit]  ISO 7 Room B — 8 CFU (action limit: 7)          │
│     1 hour ago  ·  Excursion EXC-2026-004 auto-created                  │
│     → /environmental/samples/EM-2026-0412                                │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  ⬤ [⚠ Calibration Due]  BAL-004 Analytical Balance — due in 3 days    │
│     3 hours ago  ·  Next cal: 04/10                                     │
│     → /equipment                                                         │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  ⬤ [↻ Batch Assigned]  Batch #2026-0851 assigned to you                │
│     5 hours ago  ·  Methylprednisolone 40mg/mL  ·  Scheduled: 1:00 PM  │
│     → /batches/2026-0851                                                 │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  ○ [◷ Batch Pending Review]  Batch #2026-0846 submitted for QA review  │
│     Yesterday  ·  Ketorolac 15mg/mL                                     │
│     → /batches/2026-0846/review                                          │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  ○ [⚠ Low Stock]  10mL Clear Vials — 280 ea (safety: 500)             │
│     Yesterday  ·  Estimated stockout in 12 days                         │
│     → /inventory/vials-10ml                                              │
│                                                                          │
│  ──────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  ○ [✓ Batch Released]  Batch #2026-0844 released by Dr. Priya          │
│     2 days ago  ·  Famotidine 20mg/mL                                   │
│     → /batches/2026-0844                                                 │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

  ⬤ = unread (white dot)     ○ = read (no dot)
  Each notification has: type badge, message, timestamp, deep link
  Click → navigate to the relevant screen
```

### Notification Header Icon (in app shell)

```
Standard:    <Bell />         (no badge)
With unread: <Bell /> ⬤3      (red dot + count)
```

### Notification Types (role-targeted)

```
batch_assigned          → technician, visual_inspector
batch_pending_review    → qa_manager, qa_specialist
batch_released          → prod_mgr, pic
batch_rejected          → prod_mgr, technician
deviation_opened        → qa_manager, pic
capa_assigned           → assigned user
capa_due_soon           → assigned user
capa_overdue            → qa_manager + assigned user
calibration_due         → maintenance
calibration_overdue     → maintenance + qa_manager
em_alert_limit          → microbiologist
em_action_limit         → microbiologist + qa_manager
inventory_low_stock     → warehouse + procurement
inventory_expired       → warehouse
training_due            → user + training_coord
training_overdue        → user + training_coord + qa_manager
cleaning_overdue        → maintenance + qa_manager
document_approval       → pic, qa_manager
signature_required      → target signer
```

---

*Next: [17-ipad-shared.md](./17-ipad-shared.md) — iPad login, offline, scanner*
