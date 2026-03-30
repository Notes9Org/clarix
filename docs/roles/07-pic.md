# Role: Pharmacist-in-Charge (`pic`)

> **Tier:** 3 — Professional  
> **RBAC Token:** `pic`  
> **Access Level:** Highest clinical authority in the platform · Batch final release · Formula approval  
> **Session Timeout:** Web: 30 minutes · iPad: 5 minutes (if used in cleanroom)

---

## 1. Role Summary

The **Pharmacist-in-Charge (PIC)** holds the highest clinical and legal authority in a 503B outsourcing facility. The PIC is personally accountable for the quality, safety, and regulatory compliance of every compounded preparation that leaves the facility. This responsibility is codified in state pharmacy law and federal cGMP regulations.

In Clarix, the PIC role occupies a unique position: it is the **only role** that can transition a batch from `pending_release` → `released`. The PIC also authors and approves master formulas, signs off on patient-impact deviations, and approves critical facility documents.

The PIC is typically a **licensed pharmacist** with advanced expertise in sterile compounding, pharmaceutical chemistry, and regulatory affairs. In many 503B facilities, the PIC is also the VP of Quality or serves in a dual executive/clinical capacity.

---

## 2. Primary Responsibilities

### 2.1 Batch Final Release — The "Last Gate"
- Review batches submitted as `pending_release` (after QA Manager has already approved)
- Perform final risk assessment: review QA notes, deviation dispositions, lab results
- Apply e-signature with PIN + biometric to release batch to `released` status
- If not satisfied, send batch back with documented concern (`rejection_reason` required)
- **No other role can perform this action** — the PIC is the ultimate product release authority

This is the cGMP concept of **Quality Unit Authority** at its highest expression. Every vial that reaches a hospital, clinic, or patient has the PIC's e-signature in its release record.

### 2.2 Master Formula Authorship & Approval
- Create and version master formulas (compounding formulas / Master Formulation Records)
- Define all formula components (API, excipients, diluents), quantities, and tolerances
- Write and approve formula preparation steps with validation parameters
- Set hazard flags: `hazardous_drug`, `requires_media_fill`, `requires_sterility_test`
- Set BUD (Beyond Use Date) parameters per USP <797>/<800> guidelines
- Approve or archive formulas — only approved formulas can be used in production
- Sign formula version changes with e-signature (any formula change creates a new version)

### 2.3 Deviation Sign-off (Patient Impact)
- Review deviations flagged with `patient_impact = true`
- Assess clinical risk: does this deviation affect product potency, sterility, or safety?
- Provide documented clinical opinion before deviation can be closed
- Coordinate with prescribers or hospital pharmacy contacts if patient notification is needed
- A deviation with `patient_impact = true` cannot close without PIC e-signature

### 2.4 Document Approval
- Review and approve critical policy documents: Sterility Testing SOPs, Environmental Monitoring SOPs, Master Formula Templates
- Co-approver (with QA Manager) for SOPs that require a pharmacist's clinical endorsement
- Ensure all approved documents reflect current USP and FDA guidance

### 2.5 Regulatory Interface
- Primary point of contact during FDA inspections of compounding operations
- Responsible for responding to FDA 483 observations related to compounding practices
- Maintains state pharmacy board licensure for the facility
- Manages DEA Schedule II–V controlled substance handling oversight

### 2.6 Production Oversight (Clinical)
- Review active production from a clinical quality standpoint (not scheduling)
- Approve deviations from master formula parameters during active production (with documented justification)
- Serve as pharmacist supervisor for all compounding personnel during production hours

---

## 3. Daily Workflow in Clarix

### Morning
1. Check notification inbox — any batches awaiting release (`pending_release`)?
2. Review overnight lab results — any OOS results requiring hold decision?
3. Check open deviations with `patient_impact = true` — any pending sign-off?

### During the Day
1. Perform batch final release reviews as QA approvals complete
2. Review and sign formula version updates submitted by staff pharmacists
3. Review document approvals in Document Control queue
4. Respond to production questions that require clinical judgment

### On-call
- The PIC is effectively "on-call" for patient impact events
- If a sterility failure is identified post-release, the PIC coordinates the voluntary recall process with FDA

---

## 4. Clarix Screen Access

| Screen | URL | Access Level |
|--------|-----|-------------|
| Executive Dashboard | `/dashboard` | Read |
| **Production Dashboard** | `/production` | Read (production oversight) |
| **Batch List** | `/batches` | Read + Sign (release) |
| **Batch Detail** | `/batches/[id]` | Read + Sign |
| **Master Formulas** | `/formulas` | CRUD + Sign |
| **Formula Editor** | `/formulas/[id]/edit` | Full |
| Deviation List | `/quality/deviations` | Read + Sign (patient impact) |
| CAPA List | `/quality/capas` | Read |
| **Document Control** | `/documents` | Sign (approve) |
| Inventory Dashboard | `/inventory` | Read |
| Reports & Analytics | `/reports` | Read + Export |
| Notifications Center | `/notifications` | Own |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `organizations` | R | |
| `users` | R | All users — oversight |
| `master_formulas` | CRUD + Sign | Full formula authority |
| `formula_steps` | CRUD | Step authorship |
| `formula_components` | CRUD | BOM authorship |
| `batches` | Sign | Release only (`pending_release` → `released`) |
| `batch_step_records` | R + Sign | Verification of critical steps |
| `e_signatures` | CR + R | All signatures attributable to PIC context |
| `deviations` | R + Sign | Patient-impact closure sign-off |
| `capas` | R | Review |
| `documents` | Sign | Approval authority |
| `training_records` | R | Personnel qualification oversight |
| `inventory_items` | R | |
| `inventory_lots` | R | |
| `audit_trail` | R | Inspection preparation |

---

## 6. The Three-Signature Release Chain

The Clarix batch release workflow enforces a strict sequential approval chain:

```
1. Production Complete
   └── Technician executes all steps + e-signs each
       
2. QA Review (qa_manager or qa_specialist)
   └── Reviews batch record → transitions: pending_review → pending_release
   └── Checks: all steps done, all sigs present, no open deviations, yield in range
   
3. Final Release (pic only)
   └── Clinical/regulatory risk assessment
   └── E-signs release: pending_release → released
   └── Product enters inventory as available for dispensing
```

No batch can skip any step. No role can perform another role's step. This is enforced by the RBAC system and is a core cGMP requirement.

---

## 7. Cross-Role Interactions

| Interaction | With Role | Frequency |
|-------------|-----------|-----------|
| Final batch release | `qa_manager` | Per batch |
| Formula authorship | `pharmacist` | Ongoing |
| Patient impact deviation review | `qa_manager` | As needed |
| Document approval | `qa_manager`, `qa_specialist` | Weekly |
| FDA inspection coordination | `admin`, `qa_manager` | During inspections |
| Production clinical oversight | `production_manager` | Daily |
| Lab OOS review | `qa_manager`, `qc_tech` | As needed |

---

## 8. Regulatory Context

- **Section 503B of the FD&C Act:** Defines the legal requirements for an outsourcing facility PIC
- **21 CFR §211.22:** The quality control unit has the authority to approve or reject — PIC embodies this authority for final product release
- **21 CFR §211.68:** Electronic signatures on electronic batch records — PIC's e-signature is legally binding
- **USP <797>:** Pharmaceutical Compounding — Sterile Preparations — PIC is responsible for ensuring USP <797> compliance
- **USP <800>:** Hazardous Drugs — PIC ensures HD handling policies meet USP <800> requirements
- **State Board of Pharmacy Regulations:** PIC designation is a legal designation; the PIC must hold an active pharmacist license in the state of operation

---

*Role: `pic` · Clarix 503B Platform · March 2026*
