# Role: Production Manager (`production_manager`)

> **Tier:** 2 — Management  
> **RBAC Token:** `production_manager`  
> **Access Level:** Full production scheduling · Batch create/assign/schedule · Read-heavy on quality  
> **Session Timeout:** Web: 30 minutes

---

## 1. Role Summary

The **Production Manager** is the operational backbone of a 503B compounding facility. They translate business demand into daily batch schedules, coordinate compounding technicians, manage cleanroom resource allocation, and ensure that the right materials are available at the right time. Unlike the PIC (who has legal authority) or QA Manager (who has quality authority), the Production Manager holds **operational authority** — scheduling, execution pacing, and workforce coordination.

In Clarix, the Production Manager has significant write access to batch records (create, schedule, assign) but holds limited quality authority — they cannot release batches, approve deviations, or sign off on QA-gated quality steps.

---

## 2. Primary Responsibilities

### 2.1 Batch Scheduling & Planning
- Create new batch records from approved master formulas
- Schedule batches by date, cleanroom, and assigned compounding team
- Manage batch calendar — daily, weekly, and rolling 2-week horizon
- Coordinate multi-batch days: sequence batches to minimize cross-contamination risk
- Identify and resolve scheduling conflicts (equipment availability, technician certification, component availability)

### 2.2 Technician Coordination
- Assign technicians to batches based on qualification status:
  - `media_fill_qualified = true` required for sterile batches
  - `garbing_qualified = true` required for cleanroom entry
  - `hd_trained = true` required for hazardous drug batches
- Manage daily shift assignments and gowning rotation
- Coordinate with Training Coordinator when qualifications are expiring
- Escalate technician performance issues to QA and HR

### 2.3 Resource & Component Management
- Confirm component availability before finalizing batch schedule
- Coordinate with Warehouse to ensure FIFO lot pulls are staged
- Identify supply shortages and escalate to Procurement
- Manage equipment use schedule: compounding isolators, filling lines, autoclaves
- Confirm equipment calibration status before assigning to a batch

### 2.4 Production Dashboard Management
- Monitor active batches in real-time via the kanban production board
- Identify stalled batches (waiting on signature, component, or QA review)
- Prioritize urgent or time-sensitive batches (hospital system orders, patient shortage drugs)
- Coordinate batch handoffs between shifts

### 2.5 Reporting & Analytics
- Review batch yield and cycle time reports
- Track on-time batch start/completion rates
- Report production capacity utilization to VP
- Provide input for continuous improvement projects targeting throughput

---

## 3. Daily Workflow in Clarix

### Pre-Shift (Before Production Starts)
1. Open **Production Dashboard** (`/production`) — review today's batch board
2. Confirm all batches for the day have:
   - All components in `lot_status = 'released'` (system blocks otherwise)
   - Equipment assigned and in calibration
   - Technicians assigned and qualified
3. Review any overnight alerts: component shortages, qualification expirations, equipment failures
4. Brief technicians at shift start — confirm assignments and any special instructions

### During Production
1. Monitor batch progress via kanban — each card updates in real-time as steps complete
2. Address exceptions: steps blocked pending signature, deviation flags, equipment issues
3. Coordinate with QA Manager on batches in `pending_review` status
4. Stage raw materials for next-shift batches with Warehouse

### End of Shift
1. Review batch completion status — any batches not completed per schedule?
2. Update next-day schedule based on today's actual throughput
3. Flag any open issues (open deviations on batches, stalled QA reviews) to night lead

---

## 4. Clarix Screen Access

| Screen | URL | Access Level |
|--------|-----|-------------|
| **Production Dashboard** | `/production` | Full (primary workspace) |
| Batch List | `/batches` | Read + Create |
| Batch Detail | `/batches/[id]` | Read |
| Master Formulas | `/formulas` | Read |
| Inventory Dashboard | `/inventory` | Read |
| Equipment Dashboard | `/equipment` | Read |
| Training Dashboard | `/training` | Read (own team) |
| Reports & Analytics | `/reports` | Read + Export |
| Notifications Center | `/notifications` | Own |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `organizations` | R | Read-only |
| `users` | R | Own team only |
| `batches` | CRUD | Create, assign, schedule — cannot sign or release |
| `batch_step_records` | R | Review step status — cannot edit |
| `batch_components_used` | R | View component consumption |
| `master_formulas` | R | Read approved formulas |
| `formula_steps` | R | Review steps |
| `formula_components` | R | Review BOM |
| `inventory_items` | R | Check availability |
| `inventory_lots` | R | Lot status review |
| `inventory_transactions` | R | Transaction history |
| `vendors` | R | Vendor info |
| `rooms` | R | Cleanroom availability |
| `equipment` | R | Equipment status |
| `cleaning_logs` | R | Confirm room readiness |
| `calibration_records` | R | Equipment compliance check |
| `deviations` | R | Open deviations affecting schedule |
| `training_records` | R | Team qualification status |

---

## 6. Cross-Role Interactions

| Interaction | With Role | Frequency |
|-------------|-----------|-----------|
| Assign batches to technicians | `technician` | Daily |
| Confirm component availability | `warehouse` | Daily |
| Request component reorder | `procurement` | As needed |
| Coordinate QA review turnaround | `qa_manager` | Daily |
| Confirm equipment readiness | `maintenance` | Daily |
| Report schedule to executive | `vp` | Weekly |
| Escalate training gaps | `training_coord` | As needed |

---

## 7. Key Events & Triggers

| Event | System Action | PM Response |
|-------|--------------|-------------|
| Batch component `lot_status = 'quarantined'` | Block batch from starting | Coordinate with warehouse/QC to expedite release or source alternative |
| Equipment `status = 'out_of_calibration'` | Block batch assignment | Escalate to Maintenance — reschedule if needed |
| Technician qualification expired | Block from batch assignment | Escalate to Training Coordinator — reassign batch |
| Deviation opened on active batch | Batch flagged — cannot release until closed | Coordinate with QA on impact assessment |
| Batch step > SLA time with no update | Alert to PM | Contact technician — assess blockers |

---

## 8. Regulatory Context

- **21 CFR §211.68:** Production supervisors must ensure personnel follow SOPs
- **21 CFR §211.101:** Charge-in of components — PM ensures only released lots enter production
- **21 CFR §211.105:** Equipment identification — PM ensures correct equipment is assigned in the batch record
- **21 CFR §211.192:** Production record review — PM verifies batch records are complete before submitting to QA

---

*Role: `production_manager` · Clarix 503B Platform · March 2026*
