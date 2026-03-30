# Clarix — Role Definitions Index

> **Platform:** Clarix 503B Digital Batch Record System  
> **Compliance:** 21 CFR Parts 210, 211 · 21 CFR Part 11 · cGMP  
> **Last Updated:** March 2026

---

## Overview

Clarix serves a **15-role** personnel hierarchy spanning five tier levels across a FDA-registered 503B outsourcing facility. Each role is designed around the principle of **Separation of Duties** — no single user can initiate, verify, and release a critical action. Every role operates under strict Role-Based Access Control (RBAC) enforced at the database and API level.

---

## Role Hierarchy

```
Tier 1 — Executive
  └── vp                   Vice President of Operations / Quality

Tier 2 — Management
  ├── production_manager   Production Manager
  ├── qa_manager           Quality Assurance Manager
  ├── qa_specialist        Quality Assurance Specialist
  ├── training_coord       Training Coordinator
  └── procurement          Procurement Manager

Tier 3 — Professional
  ├── pic                  Pharmacist-in-Charge
  ├── pharmacist           Staff Compounding Pharmacist
  └── microbiologist       Environmental Microbiologist

Tier 4 — Operations
  ├── technician           Compounding Technician
  ├── visual_inspector     Visual Inspector
  ├── qc_tech              QC Technician
  ├── warehouse            Warehouse Technician
  └── maintenance          Facilities & Equipment Technician

Tier 5 — System
  └── admin                System Administrator
```

---

## Role Files

| File | Role | Tier | Primary Domain |
|------|------|------|----------------|
| [01-admin.md](./01-admin.md) | System Administrator | 5 | Platform governance, user management |
| [02-vp.md](./02-vp.md) | Vice President | 1 | Executive oversight, KPI monitoring |
| [03-production-manager.md](./03-production-manager.md) | Production Manager | 2 | Batch scheduling, team coordination |
| [04-qa-manager.md](./04-qa-manager.md) | QA Manager | 2 | Quality systems, deviations, CAPAs |
| [05-training-coordinator.md](./05-training-coordinator.md) | Training Coordinator | 2 | Personnel qualification, SOPs |
| [06-procurement.md](./06-procurement.md) | Procurement Manager | 2 | Vendor management, raw material supply |
| [07-pic.md](./07-pic.md) | Pharmacist-in-Charge | 3 | Regulatory authority, batch release |
| [08-pharmacist.md](./08-pharmacist.md) | Staff Pharmacist | 3 | Compounding oversight, formula authoring |
| [09-microbiologist.md](./09-microbiologist.md) | Microbiologist | 3 | Environmental monitoring, sterility |
| [10-technician.md](./10-technician.md) | Compounding Technician | 4 | Cleanroom batch execution |
| [11-visual-inspector.md](./11-visual-inspector.md) | Visual Inspector | 4 | Final product inspection |
| [12-qc-tech.md](./12-qc-tech.md) | QC Technician | 4 | Lab samples, material release |
| [13-warehouse.md](./13-warehouse.md) | Warehouse Technician | 4 | Receiving, inventory, storage |
| [14-maintenance.md](./14-maintenance.md) | Maintenance Technician | 4 | Equipment, cleaning, calibration |
| [15-qa-specialist.md](./15-qa-specialist.md) | QA Specialist | 2 | Quality operations, batch review, document control |

---

## Universal Rules (All Roles)

| Rule | Description |
|------|-------------|
| **Org Isolation** | Data is always scoped to `organization_id`. No cross-tenant access. |
| **Audit Trail** | Every CREATE / UPDATE / DELETE is logged. No exceptions. |
| **E-Signature** | Critical actions require re-authentication (PIN + biometric). |
| **Immutable Records** | Audit logs, e-signatures, and inventory transactions are INSERT-only. |
| **Session Timeout** | iPad: 5-min lock · Web: 30-min lock · Re-auth required to resume. |
| **Separation of Duties** | Minimum 2 distinct users must execute, verify, and release a batch. |

---

*Project: Clarix — 503B Digital Batch Record Platform*  
*Author: Nithin (Solo Developer / Product Lead)*
