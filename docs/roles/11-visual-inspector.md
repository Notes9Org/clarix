# Role: Visual Inspector (`visual_inspector`)

> **Tier:** 4 — Operations  
> **RBAC Token:** `visual_inspector`  
> **Access Level:** Execute visual inspection steps on assigned batches via iPad  
> **Session Timeout:** iPad: 5 minutes · Web: 30 minutes

---

## 1. Role Summary

The **Visual Inspector** performs the 100% manual product inspection that is required before any sterile compounded preparation can advance to the release stage. This is the last quality checkpoint before a product is submitted for pharmacist verification and QA review.

In a 503B facility, visual inspection is a GMP-critical step: USP <1> and FDA guidance require that every container of a compounded sterile preparation (CSP) be inspected for visible particulate matter, container integrity, fill volume accuracy, label correctness, and appearance anomalies. The visual inspector works under standardized lighting conditions (typically a black-and-white background illuminated light station) reviewing each unit individually.

In Clarix, the visual inspector executes the inspection using the iPad **Visual Inspection** screen (M5), with a structured checklist, pass/fail designation per unit, and mandatory photo evidence for any rejected units.

---

## 2. Primary Responsibilities

### 2.1 100% Unit-by-Unit Visual Inspection
- Receive finished, filled, and labeled containers from compounding area
- Inspect each unit against the defined visual inspection checklist:
  - **Particulates:** Any visible particulate matter in solution (clear, white, black backgrounds)
  - **Clarity:** Is the solution appropriately clear, or turbid/cloudy where it shouldn't be?
  - **Color:** Does the solution color match the expected standard?
  - **Fill Volume:** Is the fill volume within expected range (vial line check)?
  - **Container Integrity:** No cracks, chips, sealing defects, leaking closures
  - **Label Accuracy:** Product name, lot number, concentration, BUD, storage conditions match
- Accept or reject each unit individually in Clarix

### 2.2 Documentation
- Enter inspection results per unit (or per batch if counting accepted/rejected units)
- Log total units inspected, total accepted, total rejected
- Capture photo evidence for all rejected units (mandatory in Clarix)
- Calculate and record yield at inspection stage
- If rejection rate exceeds alert threshold → system prompts deviation creation

### 2.3 Reject Disposition
- Place rejected units in quarantine / reject bin (physically segregated)
- Document rejection reason for each rejected unit (particulate, seal defect, fill volume, labeling)
- Aggregate rejection data is submitted for QA review — high rejection rate may indicate upstream compounding issue

### 2.4 Inspection Qualification Maintenance
- Visual inspectors must maintain annual inspector qualification:
  - Knapp test (or equivalent) for ability to detect spiked particles in test sets
  - Annual visual acuity check (corrected vision within required standard)
- If qualification expires, Clarix blocks assignment to inspection batch steps

---

## 3. Daily Workflow in Clarix

### Preparation
1. Log into iPad → review **My Batches** for today's inspection assignments
2. Confirm inspection station setup: correct lighting (2000–3750 lux), black/white background, magnification if needed
3. Confirm batch details on iPad: product name, lot number, expected appearance, BUD

### During Inspection
1. Open inspection record in Clarix (M5)
2. For each container:
   - Present to light station (swirl, inspect, invert)
   - Tap Pass or Reject on iPad
   - If Reject: select reason from dropdown → capture photo
3. After all units: review totals — confirm yield matches batch expectations
4. E-sign inspection completion on iPad

### After Inspection
1. Segregate rejected units to quarantine
2. Package accepted units for submission to pharmacist verification
3. Notify pharmacist that inspection is complete via Clarix notification

---

## 4. Clarix Screen Access

### iPad App Screens
| Screen | Access | Description |
|--------|--------|-------------|
| **My Batches (M2)** | Full | Today's assigned inspection batches |
| **Visual Inspection (M5)** | Full | Checklist UI with pass/fail per unit |
| **E-Signature Modal (M11)** | Full | Sign inspection completion |
| **Offline Mode (M12)** | Full | Inspection data queued if offline |

### Web Access (Limited)
| Screen | URL | Access |
|--------|-----|--------|
| My Profile | User settings | Own |
| Training Records | `/training` | Own records only |
| Notifications | `/notifications` | Own |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `batches` | R | Assigned batches only |
| `batch_step_records` | CR + Own | Create and sign inspection step records |
| `e_signatures` | CR + Own | Sign inspection completion |
| `training_records` | Own | Own qualification records |
| `users` | Own | Own profile |

---

## 6. Inspection Criteria Reference

| Defect Category | Inspection Method | Action |
|----------------|-------------------|--------|
| Visible particulate | Black + white background, swirl | Reject unit, log reason + photo |
| Turbidity/cloudiness | Against light background | Reject unit |
| Wrong color | Compare to standard color reference | Reject unit |
| Low/high fill | Visual line check against fill spec | Reject unit |
| Container crack/chip | Physical and visual check | Reject unit — quarantine |
| Closure defect (cap seal) | Visual and manual check | Reject unit |
| Label defect | Compare to batch label spec in Clarix | Reject — label error triggers deviation |

---

## 7. Regulatory Context

- **USP <1> Injections and Implanted Drug Products:** Defines visual inspection requirements for parenterals — 100% inspection is the standard
- **21 CFR §211.167:** Special testing requirements — visual inspection specifically required for injectables
- **EU GMP Annex 1, Section 11:** 100% visual inspection of parenteral products — global best practice standard
- **ASTM E2455:** Standard guide for visual inspection of filled injections — defines illumination standards and inspector qualification methods (Knapp test)
- **21 CFR §211.68:** Electronic documentation of inspection results must be attributable and audit-trailed

---

*Role: `visual_inspector` · Clarix 503B Platform · March 2026*
