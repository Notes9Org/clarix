---
id: SCR-017
title: iPad Shared Screens (Login, Scanner, Offline)
version: "1.1"
status: approved
priority: P0
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [Part 11.10, Part 11.50]
urs_refs: [URS-036, URS-037]
frs_refs: [FRS-045, FRS-046, FRS-047]
---

# 17 — iPad Shared Screens (Login, Scanner, Offline)

> **Users:** All iPad roles (technician, visual_inspector, warehouse, microbiologist, maintenance)  
> **Interface:** iPad (React Native / Expo)  
> **Priority:** P0  
> **21 CFR Part 11 Scope:** Unique user identification on shared devices, offline data integrity

## Revision History

| Version | Date       | Author   | Change Description                    | Approved By |
|---------|------------|----------|---------------------------------------|-------------|
| 1.0     | 2026-04-05 | fillsai  | Initial iPad shared specification     | fillsai     |
| 1.1     | 2026-04-07 | fillsai  | Added frontmatter, offline edge cases | fillsai     |

---

## Screen M1: iPad Login

```
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                         ║
║                          ┌──────────┐                                   ║
║                          │          │                                   ║
║                          │    C     │  ← Logo (56×56)                   ║
║                          │          │                                   ║
║                          └──────────┘                                   ║
║                                                                         ║
║                          CLARIX                                         ║
║                     Cleanroom Portal                                    ║
║                                                                         ║
║                                                                         ║
║            ┌────────────────────────────────────────┐                   ║
║            │  Employee ID or Email                  │                   ║
║            │  [________________________________]    │  ← h-14 (56px)   ║
║            └────────────────────────────────────────┘                   ║
║                                                                         ║
║            ┌────────────────────────────────────────┐                   ║
║            │  PIN                                   │                   ║
║            │                                        │                   ║
║            │     ●  ●  ○  ○  ○  ○                   │                   ║
║            │                                        │                   ║
║            │  ┌────┐ ┌────┐ ┌────┐                 │                   ║
║            │  │  1 │ │  2 │ │  3 │                 │                   ║
║            │  ├────┤ ├────┤ ├────┤                 │  ← 56×56 targets  ║
║            │  │  4 │ │  5 │ │  6 │                 │                   ║
║            │  ├────┤ ├────┤ ├────┤                 │                   ║
║            │  │  7 │ │  8 │ │  9 │                 │                   ║
║            │  ├────┤ ├────┤ ├────┤                 │                   ║
║            │  │  ⌫ │ │  0 │ │  ✓ │                 │                   ║
║            │  └────┘ └────┘ └────┘                 │                   ║
║            └────────────────────────────────────────┘                   ║
║                                                                         ║
║            ┌────────────────────────────────────────┐                   ║
║            │      [ Use Face ID / Touch ID ]        │  ← h-14          ║
║            └────────────────────────────────────────┘                   ║
║                                                                         ║
║     CompoundRx Pharmacy · FDA FEI: 3012345678                          ║
║                                                                         ║
╚══════════════════════════════════════════════════════════════════════════╝

  Design rules:
  - All tap targets ≥ 56×56px (nitrile gloves)
  - No hover states (touch only)
  - High contrast WCAG AAA
  - Large PIN dots (size-5)
```

---

## Screen M4: Barcode Scanner (Full Screen)

```
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                         ║
║  ┌──────────────────────────────────────────────────────────────────┐   ║
║  │                                                                  │   ║
║  │                                                                  │   ║
║  │               ┌──────────────────────────┐                      │   ║
║  │               │                          │                      │   ║
║  │               │    CAMERA VIEWFINDER     │                      │   ║
║  │               │                          │                      │   ║
║  │               │      ┌────────────┐      │                      │   ║
║  │               │      │  ▒▒▒▒▒▒▒▒  │      │  ← scan target      │   ║
║  │               │      │  ▒▒▒▒▒▒▒▒  │      │     area             │   ║
║  │               │      └────────────┘      │                      │   ║
║  │               │                          │                      │   ║
║  │               └──────────────────────────┘                      │   ║
║  │                                                                  │   ║
║  │  Point camera at barcode on container                            │   ║
║  │                                                                  │   ║
║  └──────────────────────────────────────────────────────────────────┘   ║
║                                                                         ║
║  Expected: FAM-2026-*                                                   ║
║  Last scan: —                                                           ║
║                                                                         ║
║  ┌────────────────────────────┐  ┌──────────────────────────────────┐   ║
║  │   [ Enter Manually ]      │  │        [ Cancel ]                │   ║
║  └────────────────────────────┘  └──────────────────────────────────┘   ║
║                                                                         ║
╚══════════════════════════════════════════════════════════════════════════╝

  ON SUCCESSFUL SCAN:
  ┌──────────────────────────────────────────────────────────────────┐
  │  ✓ MATCH                                                        │
  │                                                                  │
  │  Scanned:  FAM-2026-041                                          │
  │  Item:     Famotidine USP                                        │
  │  Lot:      FAM-2026-041                                          │
  │  Expiry:   2027-01-15                                            │
  │  Status:   Released ✓                                            │
  │                                                                  │
  │  Haptic:   ✓ Success vibration                                   │
  └──────────────────────────────────────────────────────────────────┘

  ON FAILED SCAN:
  ┌──────────────────────────────────────────────────────────────────┐
  │  ✕ MISMATCH                                                     │
  │                                                                  │
  │  Scanned:  OND-2026-033                                          │
  │  Expected: FAM-2026-*                                            │
  │                                                                  │
  │  Wrong item! Check container and try again.                      │
  │                                                                  │
  │  Haptic:   ✕ Error vibration (double tap)                        │
  └──────────────────────────────────────────────────────────────────┘
```

---

## Screen M12: Offline Mode Banner

**Persistent banner when iPad loses connectivity.**

```
╔══════════════════════════════════════════════════════════════════════════╗
║ ┌──────────────────────────────────────────────────────────────────┐   ║
║ │  <WifiOff /> OFFLINE — Data saved locally. Will sync on reconnect│   ║
║ └──────────────────────────────────────────────────────────────────┘   ║
║                                                                         ║
║   (rest of screen unchanged — user continues working)                   ║
║                                                                         ║
║   Queued actions: 3                                                     ║
║   ● Step 7 completion + e-sig (10:22)                                   ║
║   ● Step 8 barcode scan (10:25)                                         ║
║   ● Step 8 completion + e-sig (10:30)                                   ║
║                                                                         ║
╚══════════════════════════════════════════════════════════════════════════╝

  RECONNECT BEHAVIOR:
  1. Banner changes: "Syncing... (3 actions)"
  2. Actions replayed in order
  3. Conflict detection: if server has newer data, show resolution modal
  4. Banner disappears on full sync
  5. Non-dismissible — always visible when offline
```

---

## iPad Tab Bar (All Screens)

```
╔══════════════════════════════════════════════════════════════════════════╗
║  ┌────────────┬────────────┬────────────┬────────────┬────────────┐    ║
║  │ My Batches │  Scanner   │    EM      │  Cleaning  │  Profile   │    ║
║  │ <Clipboard>│ <ScanLine> │  <Wind>    │  <Waves>   │  <User>    │    ║
║  └────────────┴────────────┴────────────┴────────────┴────────────┘    ║
╚══════════════════════════════════════════════════════════════════════════╝

  Role visibility:
  My Batches:  technician, visual_inspector
  Scanner:     technician, warehouse
  EM:          microbiologist
  Cleaning:    maintenance
  Profile:     all (settings, theme, logout)
```

---

*End of screen documentation. All 17 files cover every user scenario in the Clarix platform.*
