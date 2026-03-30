# Role: Warehouse Technician (`warehouse`)

> **Tier:** 4 — Operations  
> **RBAC Token:** `warehouse`  
> **Access Level:** Full inventory receiving · Lot management · iPad barcode scanning  
> **Session Timeout:** Web: 30 minutes · iPad: 5 minutes

---

## 1. Role Summary

The **Warehouse Technician** manages the physical lifecycle of every material that enters and exits the 503B facility — from receiving incoming API and excipient shipments at the dock to staging components for daily production. In a pharmaceutical cGMP environment, the warehouse is not just a storage function: it is a quality-critical operation governed by strict material handling, temperature control, segregation, and chain-of-custody requirements.

The Warehouse Technician's actions in Clarix create the **inventory transaction ledger** — every lot that arrives, moves, or is consumed generates an immutable transaction record. This ledger is the foundation for full material traceability, which is required in the event of a batch recall, deviation investigation, or FDA inspection.

---

## 2. Primary Responsibilities

### 2.1 Receiving & Incoming Inspection
- Receive shipments at the receiving dock
- Confirm physical count matches purchase order
- Inspect container condition: no damage, no temperature excursion (check temperature indicator if applicable)
- Scan each container barcode using iPad (M4 / M10)
- Log receipt in Clarix: vendor, item, lot number, quantity received, expiry date, storage condition
- Place incoming lots in **quarantine** storage area (`lot_status = 'quarantined'` — system default)
- Upload photo of COA and shipping documents (attached to lot record)
- Lots cannot move to production until `lot_status = 'released'` by QC Tech

### 2.2 Inventory Management
- Maintain organized stock in appropriate storage zones: controlled room temp (CRT), refrigerated (2–8°C), frozen (-20°C), HD segregated
- Perform FIFO management: oldest lots pulled first (system suggests and enforces FIFO order)
- Perform periodic physical inventory cycle counts
- Reconcile physical counts against Clarix perpetual inventory — report discrepancies to QA
- Manage materials in designated segregation areas: quarantine, approved, rejected, returned, expired

### 2.3 Component Staging for Production
- Receive daily production staging requests from Production Manager / Pharmacist
- Pull released lots per FIFO — scan components out of storage
- Stage components in the anteroom or staging area in labeled, organized fashion
- Document each material pull as an inventory transaction

### 2.4 Adjustments & Discrepancy Management
- Record inventory adjustments in Clarix: spoilage, breakage, returned goods, expired lot disposal
- Every adjustment creates an `inventory_transaction` with quantity delta, reason, and e-signature
- `quantity_available` cannot go negative — system blocks any transaction that would cause a negative balance
- Escalate discrepancies > threshold to QA for investigation

### 2.5 Expiry & Storage Compliance
- Monitor lot expiry dates — daily cron auto-transitions `expiry_date < today` to `lot_status = 'expired'`
- Physically segregate and label expired material
- Dispose of expired materials per SOP (and per DEA requirements for controlled substances)
- Monitor refrigerator/freezer temperature logs — escalate excursions to QA and Maintenance

---

## 3. Daily Workflow in Clarix

### Morning
1. Review today's expected inbound deliveries (from Procurement)
2. Check **Inventory Dashboard** — any low-stock alerts?
3. Check overnight expiry transitions — any lots auto-transitioned to expired?

### During the Day
1. Process incoming shipments: scan, log, quarantine, upload COA
2. Stage materials for today's production (per Production Manager's batch assignments)
3. Process any returns or adjustments

### End of Day
1. Confirm all today's material movements are logged in Clarix
2. Verify staging area is organized for next-day production
3. Review tomorrow's delivery schedule

### Weekly
- Conduct cycle count for one storage zone
- Review temperature monitoring logs for all storage areas
- Report inventory health metrics

---

## 4. Clarix Screen Access

### Web
| Screen | URL | Access Level |
|--------|-----|-------------|
| **Inventory Dashboard** | `/inventory` | Full (primary) |
| Inventory Item Detail | `/inventory/[id]` | Full |
| **Receiving** | `/inventory/receiving` | Full |
| Notifications Center | `/notifications` | Own |

### iPad App Screens
| Screen | Access |
|--------|--------|
| **Barcode Scanner (M4)** | Full |
| **Receiving (M10)** | Full |
| **E-Signature Modal (M11)** | Full |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `inventory_items` | CRUD | Catalog management |
| `inventory_lots` | CRUD | Receive, adjust, track lots |
| `inventory_transactions` | CR | Record all material movements |
| `vendors` | R | Vendor reference for receiving |
| `users` | Own | Own profile |
| `e_signatures` | CR + Own | Sign receiving and adjustment transactions |

---

## 6. Inventory Transaction Types

| Transaction Type | Created By | Description |
|----------------|-----------|-------------|
| `receipt` | `warehouse` | Incoming lot received — quantity increases |
| `adjustment_up` | `warehouse` | Positive adjustment (count discrepancy) |
| `adjustment_down` | `warehouse` | Negative adjustment (spoilage, breakage) |
| `consumption` | `technician` (via batch) | Component consumed in batch execution |
| `return` | `warehouse` | Returned to vendor or internal rework |
| `expired` | System (cron) | Auto-generated on lot expiry |

---

## 7. Regulatory Context

- **21 CFR §211.80:** Requirements for storing components, drug product containers, and closures
- **21 CFR §211.86:** FIFO use of oldest approved component inventory — Warehouse implements this
- **21 CFR §211.87:** Retesting of approved components — Warehouse flags lots approaching retest date
- **21 CFR §211.89:** Rejected components must be identified and segregated — Warehouse manages physical quarantine zones
- **21 CFR Part 11:** All inventory transactions (electronic records) must be attributable and audit-trailed

---

*Role: `warehouse` · Clarix 503B Platform · March 2026*
