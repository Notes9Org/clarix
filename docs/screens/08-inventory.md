---
id: SCR-008
title: Inventory (Stock, Receiving, Vendors)
version: "1.1"
status: approved
priority: P1
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [211.80, 211.82, 211.84]
urs_refs: [URS-016, URS-017]
frs_refs: [FRS-021, FRS-022, FRS-023]
---

# 08 — Inventory (Stock, Receiving, Vendors)

> **Users:** warehouse, procurement, prod_mgr  
> **Routes:** `/inventory`, `/inventory/[id]`, `/inventory/receiving`, `/vendors`  
> **Priority:** P1  
> **Persona:** David (Warehouse) — "Scan it in, track it, never run out"  
> **21 CFR Part 11 Scope:** Material traceability, quarantine-to-release workflow, COA verification

## Revision History

| Version | Date       | Author   | Change Description                    | Approved By |
|---------|------------|----------|---------------------------------------|-------------|
| 1.0     | 2026-04-05 | fillsai  | Initial inventory specification       | fillsai     |
| 1.1     | 2026-04-07 | fillsai  | Added frontmatter, edge cases         | fillsai     |

---

## Screen I1: Inventory Dashboard (`/inventory`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <Boxes /> Inventory                      [ + Add Item ]  [ Receiving ] │
│  Stock levels and lot tracking                                           │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ TOTAL ITEMS  │  │ LOW STOCK    │  │ EXPIRING     │  │ QUARANTINED  │
│     142      │  │      3       │  │ WITHIN 30d   │  │     8        │
│  active SKUs │  │  ⚠ reorder  │  │      5       │  │  lots        │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  Category: [All ▼]  Status: [All ▼]  Low Stock: [ ] Only   [Search___] │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┬──────────┬──────────┬───────────┬────────┬──────┐
│ Item                 │ Category │ In Stock │ Safety Lvl│ Status │      │
├──────────────────────┼──────────┼──────────┼───────────┼────────┼──────┤
│ Famotidine USP       │ API      │   450 g  │   200 g   │ ✓ OK   │  →   │
│ Sodium Chloride USP  │ Excipient│  2.4 kg  │  1.0 kg   │ ✓ OK   │  →   │
│ 10mL Clear Vials     │ Container│   280 ea │  500 ea   │ ⚠ LOW  │  →   │
│ 20mm Butyl Stoppers  │ Closure  │  1200 ea │  500 ea   │ ✓ OK   │  →   │
│ 0.22μm PES Filters   │ Filter   │    12 ea │   10 ea   │ ⚠ LOW  │  →   │
│ Alcohol Wipes        │ Consumable│  3 packs│  5 packs  │ ⚠ LOW  │  →   │
│ WFI Sterile Water    │ Excipient│   40 L   │   20 L    │ ✓ OK   │  →   │
└──────────────────────┴──────────┴──────────┴───────────┴────────┴──────┘
```

---

## Screen I2: Item Detail (`/inventory/[id]`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Inventory                                                            │
│  Famotidine USP                                    Category: API         │
│  Barcode: FAM-USP-001  ·  Safety Stock: 200g                           │
└──────────────────────────────────────────────────────────────────────────┘

┌─ TABS ──────────────────────────────────────────────────────────────────┐
│  [ Active Lots ]  [ Transaction History ]  [ Consumption Chart ]        │
└─────────────────────────────────────────────────────────────────────────┘

═══ Active Lots ════════════════════════════════════════════════════════════

┌───────────────┬─────────┬────────────┬──────────┬──────────┬───────────┐
│ Lot #         │ Vendor  │ Qty Avail  │ Expiry   │ Status   │ COA       │
├───────────────┼─────────┼────────────┼──────────┼──────────┼───────────┤
│ FAM-2026-041  │ Spectrum│ 200 g      │ 2027-01  │[✓ Released]│ ✓ Verified│
│ FAM-2026-038  │ Spectrum│ 150 g      │ 2026-12  │[✓ Released]│ ✓ Verified│
│ FAM-2026-045  │ Letco   │ 100 g      │ 2027-03  │[◉ Quarantine]│ ◷ Pending│
└───────────────┴─────────┴────────────┴──────────┴──────────┴───────────┘

  FIFO order: System suggests FAM-2026-038 first (oldest unexpired) — Rule I4

═══ Transaction History ════════════════════════════════════════════════════

┌──────────────┬───────────────────┬──────────┬─────────┬────────────────┐
│ Date         │ Type              │ Qty      │ Lot     │ Batch / User   │
├──────────────┼───────────────────┼──────────┼─────────┼────────────────┤
│ 04/07 09:35  │ Issued to batch   │ -10.04 g │ -041    │ #2026-0847     │
│ 04/06 14:20  │ Issued to batch   │ -10.00 g │ -038    │ #2026-0844     │
│ 04/05 08:00  │ Received          │ +100 g   │ -045    │ David W.       │
│ 04/04 11:15  │ Released by QC    │ —        │ -041    │ QC: Sarah M.   │
│ 04/03 09:00  │ Received          │ +200 g   │ -041    │ David W.       │
└──────────────┴───────────────────┴──────────┴─────────┴────────────────┘
```

---

## Screen I3: Receiving Workflow (`/inventory/receiving`)

**Scenario:** David receives a shipment of Famotidine — iPad or Web.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <Truck /> Receiving                                                     │
│  Scan or enter incoming shipment items                                   │
└──────────────────────────────────────────────────────────────────────────┘

  Step 1: Scan or Select Item
  ┌──────────────────────────────────────────────┐
  │  <ScanBarcode /> Scan barcode                │
  │  OR                                          │
  │  Item: [Famotidine USP ▼]                    │
  └──────────────────────────────────────────────┘

  Step 2: Enter Lot Details
  ┌──────────────────────────────────────────────┐
  │  Vendor:       [Spectrum Chemical ▼]         │
  │  Lot Number:   [FAM-2026-045____________]    │
  │  Quantity:     [100____]  Unit: [g ▼]        │
  │  Expiry Date:  [2027-03-15______________]    │
  │  PO Number:    [PO-2026-0234____________]    │
  └──────────────────────────────────────────────┘

  Step 3: COA (Certificate of Analysis)
  ┌──────────────────────────────────────────────┐
  │  Requires COA:  ✓ Yes                        │
  │  COA Document:  [ Upload COA ] or [ Photo ]  │
  │  COA Verified:  [ ] Not yet (QC must verify) │
  └──────────────────────────────────────────────┘

  Step 4: Confirm
  ┌──────────────────────────────────────────────┐
  │  Status will be: [◉ Quarantined]             │
  │  (Rule I1: new lots enter as quarantined)    │
  │                                              │
  │           [ Cancel ]  [ Receive Item ]       │
  └──────────────────────────────────────────────┘
```

### Receiving Rules

```
I1: New lots → quarantined automatically
I2: Only qc_tech or qa_manager can release to "released"
I3: requires_coa = true → must have coa_document_id AND coa_verified = true
I5: Expired lots auto-transition daily via cron
I6: quantity_available cannot go negative
I7: Low stock → notification when qty < safety_stock_level
```

---

## Screen I4: Vendor Management (`/vendors`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <Truck /> Vendors                                     [ + Add Vendor ]  │
│  Approved supplier management                                            │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┬──────────────┬──────────┬───────────┬───────────┐
│ Vendor               │ Contact      │ Items    │ Status    │ QA Appr.  │
├──────────────────────┼──────────────┼──────────┼───────────┼───────────┤
│ Spectrum Chemical    │ orders@spec..│ 12       │[✓ Approved]│ Dr. Priya│
│ Letco Medical        │ sales@letco..│  8       │[✓ Approved]│ Marcus Q.│
│ Medisca              │ info@medis.. │  4       │[◷ Pending] │ —        │
│ West Pharma          │ sales@west.. │  3       │[✓ Approved]│ Marcus Q.│
└──────────────────────┴──────────────┴──────────┴───────────┴───────────┘
```

---

*Next: [09-environmental.md](./09-environmental.md) — EM dashboard, sampling, excursions*
