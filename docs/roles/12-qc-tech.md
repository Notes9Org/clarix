# Role: QC Technician (`qc_tech`)

> **Tier:** 4 — Operations  
> **RBAC Token:** `qc_tech`  
> **Access Level:** Lab sample management · Inventory lot QC release · Limited batch visibility  
> **Session Timeout:** Web: 30 minutes · iPad: 5 minutes

---

## 1. Role Summary

The **QC Technician** sits at the intersection of laboratory science and regulatory compliance. In a 503B facility, QC Tech responsibilities span two critical domains:

1. **Laboratory / Analytical work** — coordinating sterility tests, endotoxin (LAL) tests, potency assays, and appearance testing for each batch
2. **Material Release** — reviewing incoming material Certificates of Analysis (COAs), verifying test results against specifications, and transitioning lot status from `quarantined` → `released`

The QC Tech reports to the QA Manager. Their release decisions on inventory lots are gated operations: no lot of API or excipient can enter production until the QC Tech (or QA Manager) has verified it meets spec and changed its status to `released`.

---

## 2. Primary Responsibilities

### 2.1 Incoming Material (Lot) Release
- Review COA submitted by Procurement/Warehouse for each new incoming lot
- Verify COA data against approved specifications for that material:
  - Identity (correct compound, correct grade)
  - Potency / assay result
  - Microbial limits
  - Moisture content, pH, appearance (as applicable)
  - Certificate signed by qualified QC lab
- If COA meets specifications: change `lot_status` from `quarantined` → `released` + e-sign
- If COA is missing or fails: document rejection reason, notify Procurement, hold lot in quarantine
- Lots with `requires_coa = true` cannot be released without verified COA (system-enforced)

### 2.2 Batch Sample Coordination
- For each batch produced: track sterility test, endotoxin test, and potency sample collection
- Confirm samples are collected by the compounding team at the correct batch step
- Coordinate shipment of samples to external reference laboratory (or in-house if applicable)
- Log sample tracking information in Clarix: collection date, shipped date, expected result date, lab reference number
- Monitor for overdue results — escalate to QA if results delayed beyond release window

### 2.3 Lab Result Entry
- Enter test results into Clarix as received from external lab:
  - Sterility: pass / fail / invalid
  - Endotoxin (LAL): result in EU/mL vs. limit
  - Potency / assay: % of label claim result
  - Appearance: meets / does not meet specification
- Flag OOS (Out-of-Specification) results immediately to QA Manager
- An OOS result on a batch triggers an automatic deviation — QC Tech documents the initial notification

### 2.4 In-Process Testing Support
- Perform in-process tests if applicable (pH, osmolality, visual clarity) during batch steps
- Enter in-process test results in Clarix linked to the specific batch step
- Results outside tolerance auto-flag as OOS in the system

### 2.5 QC Documentation
- Maintain calibration and maintenance logs for laboratory instruments (pH meter, osmometer, LAL reader, etc.)
- Document all reagent lot information (LAL reagent, culture media, controls)
- Maintain lab control charts and trending data

---

## 3. Daily Workflow in Clarix

### Morning
1. Open **Lab Samples** screen (`/lab`) — review pending lab samples and their status
2. Check for any overnight lab results received — enter results into Clarix
3. Check inventory dashboard — any new lots received yesterday that need COA review?

### During the Day
1. Review new COAs submitted by Warehouse — verify against specifications
2. Release compliant lots (e-sign with PIN + biometric)
3. Enter lab results as received from external lab
4. Coordinate shipment of any new batch samples

### Weekly
- Reconcile open lab samples against expected turnaround times
- Flag any samples overdue for results to QA Manager
- Review lab instrument calibration due dates

---

## 4. Clarix Screen Access

| Screen | URL | Access Level |
|--------|-----|-------------|
| **Lab Samples** | `/lab` | Full CRUD (primary) |
| Inventory Dashboard | `/inventory` | Read |
| Inventory Lot Detail | Part of inventory | Read + Sign (QC release) |
| Batch List | `/batches` | Read (for linked lab samples) |
| Batch Detail | `/batches/[id]` | Read |
| Notifications Center | `/notifications` | Own |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `inventory_lots` | Sign (QC Release) | Change `lot_status` from `quarantined` → `released` |
| `inventory_items` | R | Reference |
| `batches` | R | Linked to lab samples |
| `batch_step_records` | None | No production access |
| `e_signatures` | CR + Own | Sign lot releases and lab result entries |
| `training_records` | Own | Own records |
| `users` | Own | Own profile |

---

## 6. Lot Release Decision Matrix

| Condition | QC Action | System Effect |
|-----------|-----------|---------------|
| COA present, all specs pass | Release lot | `lot_status = 'released'` · lot available for production |
| COA present, one spec fails | Hold lot + notify QA | `lot_status = 'quarantined'` · create deviation |
| COA missing | Hold — request from Procurement | `lot_status = 'quarantined'` · no production use |
| Lot expired | N/A — system auto-transitions | `lot_status = 'expired'` (daily cron) |
| Lot rejected by QA after use | Quarantine remaining | `lot_status = 'quarantined'` · investigate other batches |

---

## 7. Regulatory Context

- **21 CFR §211.84:** Testing and approval or rejection of components — QC Tech performs this function
- **21 CFR §211.165:** Testing and release for distribution — QC lab results support batch release decisions
- **21 CFR §211.192:** Laboratory records — all test results must be documented and retained
- **USP <71>:** Sterility Tests — defines methods and acceptance criteria that QC Tech applies
- **USP <85>:** Bacterial Endotoxins Test — QC Tech coordinates LAL testing
- **USP <661>:** Containers — COA review for container quality where applicable
- **21 CFR Part 11:** Lab result electronic records must comply with audit trail and e-signature requirements

---

*Role: `qc_tech` · Clarix 503B Platform · March 2026*
