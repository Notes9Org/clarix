---
id: SCR-000
title: Screen & Flow Design Guide — Master Index
version: "1.2"
status: approved
priority: P0
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-08
change_control: CC-2026-003
---
# Clarix — Screen & Flow Design Guide

> **Purpose:** ASCII wireframes for every screen in the platform, organized by user flow.
> Develop these files in order — each builds on the previous.
> **Compliance standard:** These documents constitute the Design Specification (DS) layer
> of the Clarix validation framework (URS → FRS → DS → IQ/OQ/PQ).

---

## Revision History

| Version | Date       | Author  | Change Description                                       | Approved By |
| ------- | ---------- | ------- | -------------------------------------------------------- | ----------- |
| 1.0     | 2026-04-05 | fillsai | Initial screen specification — all 17 modules           | fillsai     |
| 1.1     | 2026-04-07 | fillsai | Added YAML frontmatter, traceability IDs, CFR mapping,   | fillsai     |
|         |            |         | acceptance criteria, error/edge cases, revision history, |             |
|         |            |         | data requirements, formula scale-up feature              |             |
| 1.2     | 2026-04-08 | fillsai | Added 3 gap-fill modules: Change Control (18),           | fillsai     |
|         |            |         | Supplier Quality Management (19), Complaint Management   |             |
|         |            |         | (20), Risk Management / FMEA / ICH Q9 Register (21)     |             |

---

## File Index

| #  | File                                                    | Flow                                                                                                                                                                                                        | Primary Users                        | Priority | URS Refs                  | CFR Refs                       |
| -- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | -------- | ------------------------- | ------------------------------ |
| 01 | [01-auth.md](./01-auth.md)                                 | Login, Signup, Session Lock                                                                                                                                                                                 | All                                  | P0       | URS-001, URS-002          | 211.68, Part 11.10             |
| 02 | [02-app-shell.md](./02-app-shell.md)                       | Sidebar, Header, RBAC Navigation                                                                                                                                                                            | All                                  | P0       | URS-003                   | Part 11.10(d)                  |
| 03 | [03-executive-dashboard.md](./03-executive-dashboard.md)   | **FDA Readiness Control Tower** — 5-pillar audit score, facility state-of-control, personnel heatmap, supply chain forecasting, activity feed. 4 role-specific variants (VP, QA, ProdMgr, PIC)       | vp, admin, qa_manager, prod_mgr, pic | P0       | URS-004, URS-012, URS-015 | 211.180, 211.192               |
| 04 | [04-production.md](./04-production.md)                     | Kanban Board, Calendar, Tech Assignment with R7/R8 gates                                                                                                                                                    | prod_mgr, pic                        | P0       | URS-005, URS-006          | 211.25, 211.68                 |
| 05 | [05-batch-lifecycle.md](./05-batch-lifecycle.md)           | Batch List → Detail →**Review-by-Exception** → Release. Zero-flag fast-track, material traceability, lab results                                                                                   | All production + QA                  | P0       | URS-007, URS-008, URS-009 | 211.68, 211.188, 211.192       |
| 06 | [06-ipad-batch-execution.md](./06-ipad-batch-execution.md) | Step-by-step iPad cleanroom: measurement, timer, barcode, checklist, OOS auto-deviation, e-signature                                                                                                        | technician, visual_inspector         | P0       | URS-010, URS-011          | 211.68, Part 11.50, Part 11.70 |
| 07 | [07-formulas.md](./07-formulas.md)                         | Formula Catalog, BOM Editor, Step Builder,**Scale-Up/Down**, version control                                                                                                                          | pic, pharmacist                      | P0       | URS-013, URS-014          | 211.186, 211.100               |
| 08 | [08-inventory.md](./08-inventory.md)                       | Stock levels,**Stockout Forecasting**, Receiving with quarantine, FIFO lot management, Vendor performance                                                                                             | warehouse, procurement               | P1       | URS-016, URS-017          | 211.80, 211.82, 211.84         |
| 09 | [09-environmental.md](./09-environmental.md)               | Room Status Map, CFU Trending with sparklines, Excursion → Deviation linking, iPad sampling                                                                                                                | microbiologist, qa_manager           | P1       | URS-018, URS-019          | 211.42, 211.46                 |
| 10 | [10-quality.md](./10-quality.md)                           | Deviation aging with escalation, Root cause investigation, CAPA effectiveness tracking, Document control                                                                                                    | qa_manager, qa_specialist            | P1       | URS-020, URS-021, URS-022 | 211.100, 211.192, 211.180      |
| 11 | [11-equipment.md](./11-equipment.md)                       | Equipment registry, iPad calibration, Cleaning log with agent rotation                                                                                                                                      | maintenance, qa_manager              | P2       | URS-023, URS-024          | 211.63, 211.68                 |
| 12 | [12-training.md](./12-training.md)                         | Qualification heatmap, expiry tracking, R7 gate enforcement                                                                                                                                                 | training_coord                       | P2       | URS-025, URS-026          | 211.25                         |
| 13 | [13-lab.md](./13-lab.md)                                   | Sample Tracking, External lab lifecycle, Results entry                                                                                                                                                      | qc_tech                              | P3       | URS-027, URS-028          | 211.160, 211.165               |
| 14 | [14-admin.md](./14-admin.md)                               | User CRUD,**Batch Genealogy** (FDA investigation view), **483 Risk Radar** (compliance monitor), System Events, Audit Trail with data integrity checks                                          | admin, vp                            | P0       | URS-029, URS-030, URS-031 | Part 11 (all), 211.180, 211.68 |
| 15 | [15-reports.md](./15-reports.md)                           | Batch analytics with**release velocity bottleneck**, rejection Pareto, **483 Readiness Report** with CFR citations, **Audit Packet Generator**, quality metrics with complaint management | vp, qa_manager, pic                  | P1       | URS-032, URS-033, URS-034 | 211.180, 211.192               |
| 16 | [16-notifications.md](./16-notifications.md)               | Notification Center with deep links, role-targeted alerts                                                                                                                                                   | All                                  | P1       | URS-035                   | N/A                            |
| 17 | [17-ipad-shared.md](./17-ipad-shared.md)                   | iPad PIN/biometric login, Barcode scanner, Offline mode with sync queue                                                                                                                                     | All iPad roles                       | P0       | URS-036, URS-037          | Part 11.10, Part 11.50         |
| 18 | [18-change-control.md](./18-change-control.md)             | **Change Control** — Multi-role approval workflow, impact assessment matrix, FMEA scoring, implementation tasks, effectiveness verification, CC→CAPA→SOP linking                                      | qa_manager, pic, admin, prod_mgr     | P1       | URS-038, URS-039, URS-040 | 211.100, 211.68, 211.180, P11  |
| 19 | [19-supplier-quality.md](./19-supplier-quality.md)         | **Supplier Quality** — Approved Supplier List (ASL), qualification lifecycle, performance scorecard, NCRs, audit history, COA verification, procurement blocking for non-ASL vendors                  | qa_manager, pic, procurement         | P1       | URS-041, URS-042, URS-043 | 211.80, 211.82, 211.84, 211.86 |
| 20 | [20-complaint-management.md](./20-complaint-management.md) | **Complaint Management** — Multichannel intake, adverse event triage, PIC assessment workflow, MedWatch 3500A reportability, investigation tasks, auto-CAPA/deviation linking, trend reporting         | qa_manager, pic, customer_service    | P1       | URS-044, URS-045, URS-046 | 211.198, Part 11.10, 211.180   |
| 21 | [21-risk-management.md](./21-risk-management.md)           | **Risk Management (ICH Q9)** — Facility risk register, FMEA worksheet (S×O×D RPN), heat map visualization, control measures linked to CAPAs/CCs, residual risk assessment, management review output | qa_manager, pic, admin               | P1       | URS-047, URS-048, URS-049 | 211.100, 211.192, ICH Q9/Q10   |

---

## Design Conventions Used in All Files

### Wireframe Symbols

```
+---+  Box border (card, modal, section)
|   |  Content area
[ Button ]  Clickable button
[x]  Checkbox checked
[ ]  Checkbox unchecked
( ) Radio unselected
(•) Radio selected
[____]  Text input field
[▼]  Dropdown/select
<Icon />  Lucide icon reference
───  Horizontal rule / divider
│  Vertical divider
→  Navigation / flow arrow
...  Content truncated
⬤  Active indicator / dot
○  Inactive indicator
▲ ▼  Sort indicators
```

### Status Badge Notation

```
[✓ Released]     → emerald  (--status-success)
[◷ Pending]      → amber    (--status-warning)
[✕ Rejected]     → red      (--status-error)
[↻ In Progress]  → blue     (--status-info)
[◦ Draft]        → gray     (--muted-foreground)
[◉ Quarantined]  → gray     (--muted-foreground)
```

### Layout Grid

```
Sidebar: 220px (expanded) / 64px (collapsed)
Main content: flex-1, max-w-7xl (1280px)
Page padding: 24px vertical, 32px horizontal
Card gap: 12px
Section gap: 24px
```

### Screen ID Convention

```
Format: SCR-NNN (index file) or <Prefix>-N (per file)
  A  = Auth screens
  S  = Shell screens
  D  = Dashboard screens
  P  = Production screens
  B  = Batch screens
  M  = Mobile (iPad) screens
  F  = Formula screens
  I  = Inventory screens
  E  = Environmental screens
  Q  = Quality screens
  EQ = Equipment screens
  CL = Cleaning screens
  T  = Training screens
  L  = Lab screens
  N  = Notification screens
  R  = Report screens
```

### URS Reference Convention

```
URS-NNN  = User Requirement Specification ID
FRS-NNN  = Functional Requirement Specification ID (derived from URS)
Rule X-N = Business rule (B=Batch, R=Security, Q=Quality, I=Inventory,
           T=Training, E=Environmental)
```

### Document Control Metadata

Every screen doc file in this directory follows the format:

1. **YAML frontmatter** — machine-readable metadata (id, version, CFR refs, URS refs)
2. **Revision history table** — who-what-when for every change
3. **Screen wireframes** — ASCII wireframes with interaction annotations
4. **States** — all UI states (default, loading, error, empty, locked)
5. **Acceptance criteria** — testable requirements for IQ/OQ/PQ
6. **Data requirements** — API endpoints / server actions needed
7. **Error & edge cases** — boundary conditions and failure modes
8. **Business rules** — regulatory rule references (R1, B5, etc.)
9. **Flow diagrams** — lifecycle and interaction flow charts

---

*Build order: Start at 01, each screen depends on the shell from 02.*
