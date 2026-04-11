---
id: SCR-006
title: iPad Batch Execution (Cleanroom)
version: "1.1"
status: approved
priority: P0
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [211.68, Part 11.50, Part 11.70]
urs_refs: [URS-010, URS-011]
frs_refs: [FRS-015, FRS-016, FRS-017]
---

# 06 — iPad Batch Execution (Cleanroom)

> **Users:** technician, visual_inspector  
> **Interface:** iPad (React Native / Expo), landscape locked  
> **Priority:** P0  
> **Persona:** Carlos — "One step at a time, gloved hands, no mistakes"  
> **21 CFR Part 11 Scope:** E-signatures per step, contemporaneous data capture, barcode verification

## Revision History

| Version | Date       | Author   | Change Description                    | Approved By |
|---------|------------|----------|---------------------------------------|-------------|
| 1.0     | 2026-04-05 | fillsai  | Initial iPad execution specification  | fillsai     |
| 1.1     | 2026-04-07 | fillsai  | Added frontmatter, offline edge cases | fillsai     |

---

## Screen M2: My Batches (iPad Home)

```
╔══════════════════════════════════════════════════════════════════════════╗
║  CLARIX                           Carlos T. · Technician     ◷ 09:14   ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║   TODAY'S BATCHES                                                       ║
║                                                                         ║
║   ┌──────────────────────────────────────────────────────────────────┐  ║
║   │                                                                  │  ║
║   │   #2026-0847   Famotidine 20mg/mL Injection                     │  ║
║   │   200 units  ·  Room: ISO 7-A  ·  Hood: LFH-03                 │  ║
║   │                                                                  │  ║
║   │   Step 7 of 12  ·  [↻ In Progress]                              │  ║
║   │   ██████████████░░░░░░░░░░  58%                                  │  ║
║   │                                                                  │  ║
║   │                                  [ CONTINUE → ]  (56px height)   │  ║
║   │                                                                  │  ║
║   └──────────────────────────────────────────────────────────────────┘  ║
║                                                                         ║
║   ┌──────────────────────────────────────────────────────────────────┐  ║
║   │                                                                  │  ║
║   │   #2026-0851   Methylprednisolone 40mg/mL                       │  ║
║   │   150 units  ·  Room: ISO 7-A  ·  Hood: LFH-03                 │  ║
║   │                                                                  │  ║
║   │   Not started  ·  [◦ Draft]  ·  Scheduled: 1:00 PM             │  ║
║   │                                                                  │  ║
║   │                                  [ START BATCH → ]               │  ║
║   │                                                                  │  ║
║   └──────────────────────────────────────────────────────────────────┘  ║
║                                                                         ║
╠══════════════════════════════════════════════════════════════════════════╣
║  [ My Batches ]    [ Scanner ]    [ EM ]    [ Cleaning ]   [ Profile ] ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## Screen M3: Batch Execution — Step View

**One step per screen. This is the core cleanroom interaction.**

### Step Type: Measurement (Weight)

```
╔══════════════════════════════════════════════════════════════════════════╗
║  ← Back    Batch #2026-0847  │  Famotidine 20mg/mL  │  Step 3 of 12   ║
║            ████████░░░░░░░░░░░░░░░░░░░░░░  25%      │  [↻ In Progress]║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║   INSTRUCTION                                                           ║
║   ─────────────────────────────────────────────────────────────────     ║
║   Weigh Famotidine USP Powder                                           ║
║   using calibrated balance BAL-004                                      ║
║                                                                         ║
║   Target: 10.00 g   ·   Tolerance: ±2%  (9.80 – 10.20 g)             ║
║                                                                         ║
║   ┌──────────────────────────────────────────────────────────────────┐  ║
║   │                                                                  │  ║
║   │   ACTUAL WEIGHT                                                  │  ║
║   │                                                                  │  ║
║   │              ┌──────────────────────┐                            │  ║
║   │              │                      │                            │  ║
║   │              │     10.04            │  g     ← text-4xl mono    │  ║
║   │              │                      │                            │  ║
║   │              └──────────────────────┘                            │  ║
║   │                                                                  │  ║
║   │              <CheckCircle2 /> Within spec  (green)               │  ║
║   │                                                                  │  ║
║   └──────────────────────────────────────────────────────────────────┘  ║
║                                                                         ║
║   ┌──────────────────────────────────────────────────────────────────┐  ║
║   │   COMPONENT SCAN                                                 │  ║
║   │   <ScanBarcode />  Lot: FAM-2026-041                             │  ║
║   │   <CheckCircle2 />  Verified  ·  Exp: 2027-01-15               │  ║
║   └──────────────────────────────────────────────────────────────────┘  ║
║                                                                         ║
║   <FileEdit /> Add Note     <Camera /> Photo                            ║
║                                                                         ║
║   ┌──────────────────────────────────────────────────────────────────┐  ║
║   │                                                                  │  ║
║   │                  [ SIGN & CONTINUE → ]                           │  ║
║   │                   (full width, h-14)                              │  ║
║   │                                                                  │  ║
║   └──────────────────────────────────────────────────────────────────┘  ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### Step Type: Out-of-Spec (OOS)

```
║   Target: 10.00 g   ·   Tolerance: ±2%  (9.80 – 10.20 g)             ║
║                                                                         ║
║              ┌──────────────────────┐                                   ║
║              │     9.42             │  g                                ║
║              └──────────────────────┘                                   ║
║                                                                         ║
║              <XCircle /> OUT OF SPEC  (red)                             ║
║              Value below tolerance (9.80 g minimum)                     ║
║                                                                         ║
║   ┌──────────────────────────────────────────────────────────────┐      ║
║   │  ⚠ A deviation will be created for this step.               │      ║
║   │  Rule B6: OOS auto-flags within_tolerance = false           │      ║
║   └──────────────────────────────────────────────────────────────┘      ║
║                                                                         ║
║   [ SIGN & RAISE DEVIATION → ]                                          ║
```

### Step Type: Timer

```
║   INSTRUCTION                                                           ║
║   Mix solution for minimum 15 minutes on magnetic stirrer               ║
║                                                                         ║
║              ┌──────────────────────────┐                               ║
║              │                          │                               ║
║              │       12:34              │  ← countdown (text-5xl mono) ║
║              │       remaining          │                               ║
║              │                          │                               ║
║              └──────────────────────────┘                               ║
║                                                                         ║
║   Started: 10:05:12    ·    Required: 15:00    ·    Elapsed: 02:26     ║
║                                                                         ║
║   [ SIGN & CONTINUE → ]   ← disabled until timer completes             ║
```

### Step Type: Barcode Scan

```
║   INSTRUCTION                                                           ║
║   Scan lot barcode for Sterile Water for Injection (WFI)                ║
║   Expected pattern: WFI-2026-*                                          ║
║                                                                         ║
║   ┌──────────────────────────────────────────────────────────────┐      ║
║   │                                                              │      ║
║   │              <ScanBarcode /> TAP TO SCAN                     │      ║
║   │                                                              │      ║
║   │         Point camera at barcode on container                 │      ║
║   │                                                              │      ║
║   └──────────────────────────────────────────────────────────────┘      ║
║                                                                         ║
║   OR enter manually: [____________________________]                     ║
```

### Step Type: Visual Inspection Checklist (visual_inspector)

```
║   VISUAL INSPECTION — Unit Range: 001–050 of 200                       ║
║                                                                         ║
║   [x]  Clarity: Solution is clear, no haze                             ║
║   [x]  Particulates: No visible particles                               ║
║   [x]  Color: Matches reference standard                                ║
║   [x]  Fill volume: Within acceptable range                             ║
║   [ ]  Container integrity: No cracks, chips, or defects               ║
║   [ ]  Stopper/seal: Properly seated and crimped                       ║
║                                                                         ║
║   Units failed: [__0__]                                                 ║
║   Failure reason: [____________________________________]                ║
║                                                                         ║
║   <Camera /> Capture photo (required)                                   ║
║                                                                         ║
║   [ SIGN & CONTINUE → ]                                                 ║
```

---

## E-Signature Flow (Triggered by "Sign & Continue")

```
╔══════════════════════════════════════════════════════════════════════════╗
║▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓║
║▓▓                                                                    ▓▓║
║▓▓   ┌──────────────────────────────────────────────────────────┐     ▓▓║
║▓▓   │                                                          │     ▓▓║
║▓▓   │   <Fingerprint />  E-SIGNATURE REQUIRED                  │     ▓▓║
║▓▓   │                                                          │     ▓▓║
║▓▓   │   Signer:   Carlos Thompson                              │     ▓▓║
║▓▓   │   Role:     Compounding Technician                       │     ▓▓║
║▓▓   │   Action:   "I performed this step"                      │     ▓▓║
║▓▓   │   Time:     2026-04-07 10:22:14 EDT                      │     ▓▓║
║▓▓   │                                                          │     ▓▓║
║▓▓   │   ─────────────────────────────────────────────────────  │     ▓▓║
║▓▓   │                                                          │     ▓▓║
║▓▓   │   Enter PIN:                                              │     ▓▓║
║▓▓   │                                                          │     ▓▓║
║▓▓   │        ●  ●  ●  ○  ○  ○                                  │     ▓▓║
║▓▓   │                                                          │     ▓▓║
║▓▓   │   ┌───┐ ┌───┐ ┌───┐                                     │     ▓▓║
║▓▓   │   │ 1 │ │ 2 │ │ 3 │                                     │     ▓▓║
║▓▓   │   ├───┤ ├───┤ ├───┤     (56×56px tap targets)           │     ▓▓║
║▓▓   │   │ 4 │ │ 5 │ │ 6 │                                     │     ▓▓║
║▓▓   │   ├───┤ ├───┤ ├───┤                                     │     ▓▓║
║▓▓   │   │ 7 │ │ 8 │ │ 9 │                                     │     ▓▓║
║▓▓   │   ├───┤ ├───┤ ├───┤                                     │     ▓▓║
║▓▓   │   │ ⌫ │ │ 0 │ │ ✓ │                                     │     ▓▓║
║▓▓   │   └───┘ └───┘ └───┘                                     │     ▓▓║
║▓▓   │                                                          │     ▓▓║
║▓▓   │   ── OR ──                                               │     ▓▓║
║▓▓   │                                                          │     ▓▓║
║▓▓   │   [ Use Face ID / Touch ID ]  (full width, h-14)        │     ▓▓║
║▓▓   │                                                          │     ▓▓║
║▓▓   │                        [ Cancel ]                        │     ▓▓║
║▓▓   │                                                          │     ▓▓║
║▓▓   └──────────────────────────────────────────────────────────┘     ▓▓║
║▓▓                                                                    ▓▓║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## Batch Execution Flow (iPad)

```
My Batches → Tap "Continue"
     │
     ▼
Step N loaded (one step per screen)
     │
     ├─ Data entry / measurement / scan / timer / checklist
     │
     ├─ requires_barcode_scan? → Camera opens → validate pattern (B5)
     ├─ Is measurement?       → Check tolerance (B6)
     │     └─ OOS? → auto-flag, prompt deviation
     ├─ requires_photo?       → Camera capture
     │
     ▼
"Sign & Continue" tapped
     │
     ├─ requires_signature? → E-Sig modal (PIN or biometric)
     │     └─ requires_witness? → Second user must also sign (B4)
     │
     ▼
Step N+1 loaded (B2: steps execute in order)
     │
     ... repeat until final step ...
     │
     ▼
All steps completed
     │
     ▼
Auto-submit → batch.status = "pending_review"
     │
     ▼
"Batch submitted for QA review" confirmation
     │
     ▼
Return to My Batches
```

---

*Next: [07-formulas.md](./07-formulas.md) — Master formula catalog & editor*

---

## Acceptance Criteria (for IQ/OQ/PQ Validation)

### Screen M1: Batch Selection

- [ ] AC-M1-01: Shows only batches assigned to logged-in technician
- [ ] AC-M1-02: Batch cards show formula name, batch number, step progress
- [ ] AC-M1-03: Tap card opens step execution view
- [ ] AC-M1-04: All tap targets are ≥56x56px for gloved hands

### Screen M2: Step Execution

- [ ] AC-M2-01: Current step displays instructions, expected value, tolerance range
- [ ] AC-M2-02: Measurement entry validates within tolerance (Rule B3)
- [ ] AC-M2-03: OOS value triggers auto-deviation creation with batch+step linkage
- [ ] AC-M2-04: Timer step shows countdown with audible alert at completion
- [ ] AC-M2-05: Barcode scan step validates material lot against BOM
- [ ] AC-M2-06: Checklist step requires all items checked before proceed
- [ ] AC-M2-07: Photo step captures image with automatic timestamp watermark
- [ ] AC-M2-08: E-signature (PIN or Face ID) required after each step completion
- [ ] AC-M2-09: Cannot skip steps — sequential progress enforced
- [ ] AC-M2-10: Cannot go back to modify a completed step

### Screen M3: Batch Summary

- [ ] AC-M3-01: Shows all steps with pass/fail status at completion
- [ ] AC-M3-02: Final e-signature required to submit batch for review
- [ ] AC-M3-03: If offline, shows sync queue count and pending status
- [ ] AC-M3-04: Navigation returns to batch list after submission

---

## Error & Edge Cases

```
CRITICAL: Offline during batch execution
├── All step data cached locally (expo-sqlite)
├── Steps continue to record normally with local timestamps
├── Sync queue builds up with pending records
├── Visual indicator: 🔴 "Offline — N steps pending sync"
├── On reconnect: auto-sync in order, server validates timestamps
├── Conflict resolution: server timestamp takes precedence
└── If sync fails: retry 3x → escalate to admin notification

CRITICAL: iPad battery dies during execution
├── expo-sqlite persists data before shutdown
├── On restart: app resumes at last incomplete step
├── No data loss — everything is in local DB
└── Audit trail records DEVICE_RESTART event

EDGE CASE: Wrong material scanned
├── Barcode mismatch → screen flashes red with haptic feedback
├── Shows: "Expected: [material] Lot: [lot] — Scanned: [wrong item]"
├── Technician must scan correct material to proceed
├── Wrong scan attempt is logged (never deleted)
└── 3+ wrong scans → supervisor notification

EDGE CASE: Multiple iPads executing same batch
├── NOT ALLOWED — batch is locked to single device
├── If second iPad tries: "Batch in use on [device name]"
├── Admin can force-unlock via web admin panel
└── Lock expires after 30min inactivity

ERROR: Face ID fails repeatedly
├── After 3 Face ID failures → falls back to PIN entry
├── PIN must be 6+ digits, unique per user
├── Failed biometric attempts logged in audit trail
└── Account lock after 5 total failed auth attempts (Rule R10)

EDGE CASE: Timer expires but technician hasn't completed action
├── Timer shows OVERDUE in red with elapsed overtime
├── Technician must record actual time taken
├── Deviation auto-flagged: "Timer overrun: expected [x]min, actual [y]min"
└── Does not auto-skip — supervisor acknowledgment required
```

---

## Data Requirements

```
Local Storage (expo-sqlite):
├── batch_step_cache     → current batch steps + instructions
├── material_lot_cache   → barcode lookup table (synced daily)
├── pending_sync_queue   → completed steps awaiting upload
├── user_session         → encrypted user token + PIN hash
└── device_config        → device ID, last sync timestamp

Server Actions (when online):
├── getAssignedBatches(userId)  → batches assigned to technician
├── getBatchSteps(batchId)      → step list with instructions
├── submitStepRecord(data)      → single step completion
├── submitBatchCompletion(id)   → final submission for review
├── syncPendingRecords(records) → bulk upload offline queue
└── validateBarcode(code)       → material lot verification

Sync Protocol:
├── Interval: every 30 seconds when online
├── Order: FIFO — oldest record first
├── Retry: 3 attempts with exponential backoff
├── Conflict: server timestamp wins, local flagged for review
└── Max queue: 500 records before force-connect warning
```

---

