---
id: SCR-002
title: App Shell (Sidebar + Header + Layout)
version: "1.1"
status: approved
priority: P0
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [Part 11.10(d)]
urs_refs: [URS-003]
frs_refs: [FRS-004, FRS-005]
---

# 02 — App Shell (Sidebar + Header + Layout)

> **Users:** All authenticated roles  
> **Route:** Layout wrapper for all `/(app)/*` routes  
> **Priority:** P0 — Every screen lives inside this shell  
> **21 CFR Part 11 Scope:** RBAC navigation enforcement, role-conditional sidebar visibility

## Revision History

| Version | Date       | Author   | Change Description                    | Approved By |
|---------|------------|----------|---------------------------------------|-------------|
| 1.0     | 2026-04-05 | fillsai  | Initial shell specification           | fillsai     |
| 1.1     | 2026-04-07 | fillsai  | Added frontmatter, acceptance criteria| fillsai     |

---

## Screen S1: Full App Shell (Desktop Web)

```
+──────────────────────────────────────────────────────────────────────────+
│ SIDEBAR (220px)          │  MAIN CONTENT (flex-1)                       │
│                          │                                               │
│ ┌──────┐                 │  ┌──────────────────────────────────────────┐ │
│ │  C   │ Clarix          │  │  Page Title            <Bell /> <User /> │ │
│ └──────┘                 │  │  Subtitle / breadcrumb                  │ │
│                          │  └──────────────────────────────────────────┘ │
│ ADMIN                    │                                               │
│ ⬤ Overview              │  ┌────────────┐ ┌────────────┐ ┌──────────┐  │
│ ○ Users                  │  │  KPI Card  │ │  KPI Card  │ │ KPI Card │  │
│ ○ Organizations          │  │            │ │            │ │          │  │
│ ○ Events                 │  └────────────┘ └────────────┘ └──────────┘  │
│ ○ Settings               │                                               │
│                          │  ┌────────────────────────────────────────┐   │
│ ─────────────────────    │  │                                        │   │
│                          │  │  Main content area                     │   │
│ MODULES                  │  │  (table / form / chart / cards)        │   │
│ ○ Production             │  │                                        │   │
│ ○ Batches                │  │                                        │   │
│ ○ Formulas               │  │                                        │   │
│ ○ Inventory              │  │                                        │   │
│ ○ Environmental          │  └────────────────────────────────────────┘   │
│ ○ Quality                │                                               │
│ ○ Equipment              │                                               │
│ ○ Training               │                                               │
│ ○ Documents              │                                               │
│ ○ Lab                    │                                               │
│ ○ Reports                │                                               │
│                          │                                               │
│ ─────────────────────    │                                               │
│ ┌──┐ Carlos T.           │                                               │
│ │CT│ technician           │                                               │
│ └──┘                     │                                               │
+──────────────────────────────────────────────────────────────────────────+
```

---

## Sidebar — Role-Conditional Visibility

Each nav section is hidden/shown based on the user's RBAC role:

```
SECTION: Admin
├── Overview (/dashboard)        → ALL authenticated
├── Users (/admin/users)         → admin only
├── Organizations (/admin/orgs)  → admin only
├── Events (/admin/events)       → admin only
└── Settings (/admin/settings)   → admin only

SECTION: Modules
├── Production (/production)     → prod_mgr, pic, pharmacist, technician
├── Batches (/batches)           → prod_mgr, pic, pharmacist, qa_manager, qa_specialist
├── Formulas (/formulas)         → pic, pharmacist, prod_mgr
├── Inventory (/inventory)       → warehouse, procurement, prod_mgr
├── Environmental (/environmental) → microbiologist, qa_manager
├── Quality (/quality)           → qa_manager, qa_specialist, pic
├── Equipment (/equipment)       → maintenance, qa_manager
├── Training (/training)         → training_coord, qa_manager
├── Documents (/documents)       → qa_specialist, qa_manager, pic
├── Lab (/lab)                   → qc_tech, qa_manager
└── Reports (/reports)           → vp, qa_manager, pic, prod_mgr
```

---

## Sidebar States

### Active Item
```
┌─────────────────────────┐
│ bg: #18181b (zinc-900)  │
│ text: #fafafa (white)   │
│ ⬤ Overview              │
└─────────────────────────┘
```

### Inactive Item
```
┌─────────────────────────┐
│ bg: transparent         │
│ text: #a1a1aa (zinc-400)│
│ ○ Batches               │
└─────────────────────────┘
```

### Hover Item
```
┌─────────────────────────┐
│ bg: #18181b/50          │
│ text: #fafafa           │
│ ○ Batches               │
└─────────────────────────┘
```

---

## Page Header Pattern

Every page inside the shell follows this header pattern:

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  <Icon /> Page Title                     <Bell /> <User />   │
│  Description or breadcrumb text                              │
│                                                              │
│  [ + Create New ]  [ Export ]  [ Filter ▼ ]    [Search____]  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Header Elements

```
Left side:
├── Icon:        Lucide icon matching the module
├── Title:       text-2xl, font-semibold, foreground
└── Description: text-sm, muted-foreground

Right side:
├── Bell icon:   Notification count badge (red dot if unread)
└── User avatar: First initial, role tooltip

Action bar:
├── Primary CTA: "Create" button (left-aligned)
├── Filters:     Dropdown filters (center)
└── Search:      Search input (right-aligned)
```

---

## User Profile Dropdown

When clicking user avatar in sidebar:

```
┌──────────────────────────────┐
│  Carlos Thompson             │
│  carlos@facility.com         │
│  Role: Technician            │
│                              │
│  ──────────────────────────  │
│                              │
│  Scale:  ○○●○○○              │
│          W L M Dm D B        │
│                              │
│  Accent: ●○○                 │
│          N B S               │
│                              │
│  ──────────────────────────  │
│                              │
│  <Settings /> Profile        │
│  <LogOut /> Sign Out         │
│                              │
└──────────────────────────────┘
```

---

## Responsive Breakpoints

```
Desktop (≥1280px):  Sidebar 220px + full content
Tablet (768-1279):  Sidebar collapsed to 64px (icons only)
Mobile (<768):      Sidebar hidden, hamburger menu
iPad (app):         Separate native app, no sidebar
```

---

*Next: [03-executive-dashboard.md](./03-executive-dashboard.md) — VP/Admin KPI view*
