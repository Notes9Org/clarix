# Role: Procurement Manager (`procurement`)

> **Tier:** 2 — Management  
> **RBAC Token:** `procurement`  
> **Access Level:** Full inventory & vendor management · Raw material lifecycle  
> **Session Timeout:** Web: 30 minutes

---

## 1. Role Summary

The **Procurement Manager** owns the supply chain for a 503B outsourcing facility — from sourcing and vendor qualification to purchase orders, incoming material tracking, and inventory reorder management. In a pharmaceutical environment, procurement is a quality-critical function: using an unapproved vendor or an unverified lot of raw material can result in a batch failure, an FDA 483 observation, or a patient safety event.

All vendors used in a 503B facility must be qualified and approved. The Procurement Manager works in close coordination with the QA Manager to maintain the **Approved Vendor List (AVL)** and ensure every incoming material is traceable to a legitimate, compliant source.

---

## 2. Primary Responsibilities

### 2.1 Vendor Management & Qualification
- Maintain the Approved Vendor List (AVL) in Clarix
- Onboard new vendors: collect qualification documents, quality agreements, DEA licenses where applicable
- Submit vendors for QA approval (`qa_manager` signs off on vendor approval)
- Monitor vendor performance: on-time delivery, lot rejection rate, COA compliance
- Coordinate periodic vendor audits and reassessments
- Place vendors on hold or quarantine when quality issues arise (in coordination with QA)

### 2.2 Purchase Orders & Inbound Tracking
- Issue purchase orders for raw materials, packaging components, and laboratory supplies
- Track expected delivery dates and alert operations if delays impact production schedule
- Coordinate with warehouse on inbound receiving process
- Follow up on missing or discrepant shipments

### 2.3 Inventory Reorder Management
- Monitor inventory levels against reorder points and safety stock thresholds
- Respond to system-generated low-stock alerts (`quantity_available < safety_stock_level`)
- Manage minimum order quantities (MOQs) and economic order quantities (EOQs)
- Forecast future demand based on production schedule and historical usage
- Maintain buffer stock for high-criticality APIs and excipients

### 2.4 Cost & Supplier Negotiation
- Negotiate pricing, lead times, and contract terms with suppliers
- Maintain supplier contracts and renewal dates
- Seek alternative sourcing for critical materials (single-source risk mitigation)
- Track cost per unit and report on procurement spend to VP

### 2.5 Certificate of Analysis (COA) Management
- Ensure all incoming lots arrive with a COA from the supplier
- Coordinate COA review with QC Tech (who verifies COA data against specifications)
- Track lots where `requires_coa = true` — these cannot proceed to QC release without a verified COA
- Maintain COA document library linked to each inventory lot

---

## 3. Daily Workflow in Clarix

### Morning
1. Open **Inventory Dashboard** (`/inventory`) — review low-stock alerts
2. Check **Vendor Management** (`/vendors`) — any vendor qualification renewals approaching?
3. Review inbound receiving queue — anything expected to arrive today?
4. Respond to low-stock notifications from overnight inventory transactions

### During the Day
1. Issue purchase orders for items below reorder point
2. Coordinate with Warehouse on receiving confirmation
3. Follow up with vendors on late shipments
4. Review COA compliance for recently received lots

### Weekly
- Review inventory health summary
- Verify no critical materials are in single-lot supply
- Review vendor performance metrics
- Meet with Production Manager on 2-week material demand forecast

---

## 4. Clarix Screen Access

| Screen | URL | Access Level |
|--------|-----|-------------|
| **Inventory Dashboard** | `/inventory` | Full (primary) |
| Inventory Item Detail | `/inventory/[id]` | Full |
| Receiving | `/inventory/receiving` | Read (Warehouse owns execution) |
| **Vendor Management** | `/vendors` | CRUD (primary) |
| Notifications Center | `/notifications` | Own |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `organizations` | R | |
| `users` | Own | Own profile only |
| `vendors` | CRUD | Full vendor lifecycle |
| `inventory_items` | CRUD | Item catalog management |
| `inventory_lots` | CRUD | Lot creation, receiving coordination |
| `inventory_transactions` | R | Transaction history |
| `notifications` | Own | |

---

## 6. Cross-Role Interactions

| Interaction | With Role | Frequency |
|-------------|-----------|-----------|
| Vendor approval sign-off | `qa_manager` | Each new/requalified vendor |
| COA review and release | `qc_tech` | Per lot received |
| Low-stock alerts response | `warehouse` | Daily |
| Material demand forecasting | `production_manager` | Weekly |
| Budget and spend reporting | `vp` | Monthly |
| Material availability for batch scheduling | `production_manager` | Daily |

---

## 7. Key Events & Triggers

| Event | Trigger | Procurement Response |
|-------|---------|---------------------|
| `quantity_available < safety_stock_level` | System alert | Issue PO to vendor |
| Incoming lot COA missing | Warehouse creates receipt without COA | Follow up with vendor for COA — lot stays quarantined |
| Vendor approval expiry | System notification | Initiate requalification — coordinate with QA |
| Lot `expiry_date` approaching | System alert | Assess usage plan — expedite consumption or write-off |
| Vendor rejection (lot rejected by QC) | Notification from QC | Initiate vendor return/credit — evaluate vendor quality record |

---

## 8. Regulatory Context

- **21 CFR §211.80:** Requirements for active ingredients — must be from qualified vendors with valid COAs
- **21 CFR §211.84:** Testing and approval of incoming components — Procurement supports QC in ensuring this happens
- **21 CFR §211.80(d):** Storage of components must follow GMP — Procurement defines storage requirements for incoming materials
- **DEA 21 CFR Part 1301:** Controlled substance registration — Procurement manages DEA-regulated API procurement compliance
- **ICH Q10:** Pharmaceutical Quality System — Supply chain integrity is a key pillar; Procurement Manager owns this

---

*Role: `procurement` · Clarix 503B Platform · March 2026*
