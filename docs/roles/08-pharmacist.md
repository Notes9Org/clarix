# Role: Staff Compounding Pharmacist (`pharmacist`)

> **Tier:** 3 — Professional  
> **RBAC Token:** `pharmacist`  
> **Access Level:** Formula create/edit · Batch verification (not release) · Cleanroom oversight  
> **Session Timeout:** Web: 30 minutes · iPad: 5 minutes

---

## 1. Role Summary

The **Staff Compounding Pharmacist** is a licensed pharmacist who works under the authority of the Pharmacist-in-Charge (PIC). In a 503B facility, the pharmacist is the primary clinical presence on the production floor — they supervise compounding technicians, author and revise master formulas, perform in-process checks and verifications, and are responsible for ensuring aseptic technique and cGMP compliance during active compounding operations.

Unlike the PIC (who has final release authority), the Staff Pharmacist has **create and verify** authority but not **release** authority. They can write formulas and verify batch steps, but the PIC must sign off on the batch's final disposition.

---

## 2. Primary Responsibilities

### 2.1 Formula Development & Maintenance
- Author new master formulas (Master Formulation Records — MFRs) in Clarix
- Define formula components, quantities, concentrations, and tolerances
- Write step-by-step compounding procedures with quality checkpoints
- Set compatibility flags, storage conditions, BUD limits per USP <797>
- Submit formulas to the PIC for final approval and signing
- Update existing formulas when new stability data, regulatory guidance, or clinical information warrants changes
- Cannot publish/approve formulas — that requires PIC signature

### 2.2 In-Process Verification During Batch Execution
- Perform pharmacist verification checks at designated batch steps (per master formula)
- Apply e-signature on steps marked `requires_witness = true` (witnessed check)
- Review in-process weight checks, pH measurements, and appearance assessments
- Document any observations or concerns directly in the batch step record
- Identify and escalate deviations from formula parameters to QA

### 2.3 Cleanroom Clinical Supervision
- Maintain physical presence during active aseptic compounding operations
- Supervise technicians' technique: component transfers, environmental controls, gowning
- Intervene immediately if aseptic technique breach is observed — document the event
- Perform final visual check of master formula printed for daily production (compare to Clarix digital record)

### 2.4 Clinical Reference & Consultation
- Answer clinical questions from technicians during production (compatibility, substitution, etc.)
- Review clinical use cases for new formulas (indications, dosing, patient populations)
- Coordinate with hospital pharmacy customers on formulation requirements
- Advise PIC on patient impact assessment when deviations occur

### 2.5 Ongoing Quality Participation
- Participate in deviation investigations under QA Manager guidance
- Review relevant SOPs to ensure compounding practices stay aligned
- Contribute to CAPA effectiveness verification where clinical input is needed

---

## 3. Daily Workflow in Clarix

### Pre-Production
1. Review the day's batch schedule with Production Manager
2. Open each day's batches in Clarix — review assigned master formula steps
3. Confirm the correct formula version is being used
4. Confirm signature steps in the batch record — where is the pharmacist required to verify?

### During Production
1. Perform in-process verifications as steps require — sign in Clarix via PIN + biometric
2. Monitor overall cleanroom compliance — escalate issues immediately
3. Review any system alerts: out-of-tolerance measurements, barcode scan failures

### Post-Production
1. Complete any unsigned verification steps from production
2. Review batch record for completeness before QA review begins
3. Document any observations from today's production as an internal note

---

## 4. Clarix Screen Access

| Screen | URL | Access Level |
|--------|-----|-------------|
| Production Dashboard | `/production` | Read |
| Batch List | `/batches` | Read + Sign (verify) |
| Batch Detail | `/batches/[id]` | Read + Sign |
| **Master Formulas** | `/formulas` | Create + Read |
| **Formula Editor** | `/formulas/[id]/edit` | Full (pending PIC approval) |
| Deviation List | `/quality/deviations` | Read |
| Document Control | `/documents` | Read |
| Notifications Center | `/notifications` | Own |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `master_formulas` | CR | Create and read — cannot approve |
| `formula_steps` | CR | Author steps |
| `formula_components` | CR | Author BOM |
| `batches` | Sign | Verification steps only — not release |
| `batch_step_records` | R + Sign | Sign witness/verification steps |
| `e_signatures` | CR + R | Own signatures |
| `deviations` | R | Read — cannot investigate |
| `documents` | R | Read approved SOPs |
| `training_records` | Own | Own records |

---

## 6. Distinction: Pharmacist vs PIC

| Capability | `pharmacist` | `pic` |
|-----------|-------------|-------|
| Author master formulas | ✓ | ✓ |
| Approve/publish formulas | ✗ | ✓ |
| Verify batch steps | ✓ | ✓ |
| Final batch release | ✗ | ✓ |
| Sign patient-impact deviations | ✗ | ✓ |
| Approve documents | ✗ | ✓ |
| Regulatory/FDA contact | ✗ | ✓ |

---

## 7. Regulatory Context

- **21 CFR §211.34:** Supervision — compounding must be supervised by qualified, licensed personnel
- **USP <797>:** Designated Persons / Pharmacists must verify compounding steps
- **State Pharmacy Practice Acts:** Staff pharmacists must hold an active license in the state of practice
- **21 CFR Part 11:** Pharmacist e-signatures on batch records serve as legally binding, attributable electronic records

---

*Role: `pharmacist` · Clarix 503B Platform · March 2026*
