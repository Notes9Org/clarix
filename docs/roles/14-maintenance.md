# Role: Maintenance Technician (`maintenance`)

> **Tier:** 4 — Operations  
> **RBAC Token:** `maintenance`  
> **Access Level:** Equipment registry · Calibration records · Cleaning logs · iPad workflows  
> **Session Timeout:** Web: 30 minutes · iPad: 5 minutes

---

## 1. Role Summary

The **Maintenance Technician** ensures that every piece of equipment and every square foot of cleanroom in the 503B facility is in a qualified, calibrated, and compliant state. In a sterile compounding environment, equipment failure or an uncleaned room is not just an operational problem — it is a patient safety and regulatory risk. FDA 483 observations frequently cite equipment calibration gaps, inadequate cleaning validation, and uncontrolled facility conditions.

In Clarix, the Maintenance Technician executes two primary iPad workflows: **Cleaning Log** (M8) and **Calibration Entry** (M9). These workflows enforce the correct protocols, require e-signatures at each step, and automatically calculate next-due dates, creating a continuous compliance calendar that feeds into the Equipment Dashboard.

---

## 2. Primary Responsibilities

### 2.1 Equipment Maintenance & Calibration
- Perform scheduled preventive maintenance (PM) on all production equipment per equipment-specific SOP
- Perform calibration on instruments per calibration schedule:
  - Analytical balances, pH meters, osmometers
  - Temperature monitoring probes (incubators, refrigerators, freezers)
  - Pressure gauges, mass flow controllers
  - Filling pumps and peristaltic assemblies
- Record pre-calibration and post-calibration readings in Clarix
- Document standard reference used (with traceability to NIST or equivalent national standard)
- System auto-calculates `next_calibration_due` based on calibration frequency in equipment record
- If calibration fails: equipment auto-transitions to `out_of_calibration` — batch assignment blocked

### 2.2 Cleaning & Disinfection
- Execute cleanroom cleaning per schedule and per cleaning SOP:
  - Daily (ISO 5 and ISO 7 areas): disinfectant wipe-down, residue removal
  - Weekly: sporicidal agent rotation
  - Monthly: full clean and contact time verification
- Scan room QR code on iPad → Clarix displays the required cleaning protocol for that room
- Agent rotation is enforced by the system (alternates between disinfectant types to prevent resistance)
- Enter actual contact time (timed on iPad) to confirm disinfectant dwell time is met
- Complete checklist of surfaces cleaned
- E-sign cleaning log on iPad — QA Manager verifies cleaning records in the web dashboard

### 2.3 Facility Infrastructure Management
- Monitor HVAC system performance: pressure differentials, air change rates, temperature, humidity
- Respond to HVAC alerts: room pressure alarms, temperature excursions
- Coordinate cleanroom certifications (ISO classification testing by third-party) typically annual
- Manage controlled area access: gowning room supplies, pass-throughs, material airlocks
- Track facility maintenance work orders — log all maintenance events in equipment records

### 2.4 Equipment Registry Management
- Maintain the equipment registry in Clarix: equipment name, model, serial number, location, status
- Update equipment status when equipment is sent for repair, returned from repair, or decommissioned
- Batches cannot reference equipment with `status = 'out_of_calibration'` or `'decommissioned'` (system enforced)
- Manage equipment qualification history: IQ/OQ/PQ documentation for new or modified equipment

### 2.5 Cleaning Log Compliance
- All cleaning events are documented in Clarix per room and per date
- QA Manager electronically verifies completed cleaning logs
- Cleaning records are FDA-audit-ready: timestamped, agent-identified, signed, and linked to room and date

---

## 3. Daily Workflow in Clarix

### Morning (Pre-Production)
1. Log into iPad — review today's cleaning schedule
2. Confirm all critical equipment operational: HVAC, isolators, autoclave
3. Check Clarix Equipment Dashboard — any equipment showing `out_of_calibration` or due today?

### Cleaning (iPad Workflow - M8)
1. Tap **Cleaning Log** on iPad
2. Scan room QR code → Clarix displays the required cleaning protocol
3. Confirm cleaning agent (system shows rotation — if wrong agent was used last time, system enforces correct next agent)
4. Complete cleaning → enter contact time (set timer on iPad)
5. Complete checklist: all required surfaces cleaned, pass/fail each
6. E-sign cleaning log

### Calibration (iPad Workflow - M9)
1. Tap **Calibration Entry** on iPad
2. Select equipment from registry
3. Enter pre-calibration "as found" reading
4. Perform calibration per SOP
5. Enter post-calibration "as left" reading
6. Enter standard reference used (lot, expiry, certificate number)
7. System evaluates pass/fail against acceptance criteria
8. E-sign calibration record → system auto-calculates next due date

### End of Day
1. Confirm all cleaning logs for production areas are complete and signed
2. Check equipment status dashboard — any alerts outstanding?

---

## 4. Clarix Screen Access

### Web
| Screen | URL | Access Level |
|--------|-----|-------------|
| **Equipment Dashboard** | `/equipment` | Full CRUD |
| **Cleaning Dashboard** | `/cleaning` | Full CRUD |
| Notifications Center | `/notifications` | Own |

### iPad App Screens
| Screen | Access |
|--------|--------|
| **Cleaning Log (M8)** | Full |
| **Calibration Entry (M9)** | Full |
| **E-Signature Modal (M11)** | Full |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `equipment` | CRUD | Full equipment registry |
| `calibration_records` | CRUD | Log and manage calibrations |
| `cleaning_logs` | CRUD | Log cleaning events |
| `rooms` | R | Room reference |
| `e_signatures` | CR + Own | Sign calibration and cleaning records |
| `users` | Own | Own profile |
| `training_records` | Own | Own qualification records |

---

## 6. Equipment Status State Machine

```
new_equipment → IQ/OQ/PQ → qualified
qualified → calibration_due → (pass: re-qualified / fail: out_of_calibration)
out_of_calibration → maintenance → re-calibrate → (pass: qualified / fail: decommissioned)
decommissioned → archived (removed from batch assignment pool)
```

**Key Rule:** Any batch that references equipment in `out_of_calibration` or `decommissioned` status is blocked by Clarix at the system level. This prevents production on non-compliant equipment.

---

## 7. Regulatory Context

- **21 CFR §211.58:** Maintenance of equipment — required to ensure equipment performance does not alter the product
- **21 CFR §211.68:** Appropriate controls over computerized systems — Maintenance manages equipment/system integration points (ICS connections, sensor calibrations)
- **21 CFR §211.67:** Equipment cleaning and maintenance — cleaning logs, schedules, and agent records are required
- **21 CFR §211.68:** Calibration of instruments — must be calibrated against certified standards, with records retained
- **USP <1058>:** Analytical Instrument Qualification — provides the framework for categorizing and qualifying equipment used in QC testing
- **ISPE Baseline Guide:** Facilities and equipment — pharmaceutical GMP facility design and maintenance practices

---

*Role: `maintenance` · Clarix 503B Platform · March 2026*
