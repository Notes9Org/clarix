# Role: Quality Assurance Manager (`qa_manager`)

> **Tier:** 2 — Management  
> **RBAC Token:** `qa_manager`  
> **Access Level:** Broadest read access of any role · Full QA domain write · Batch review/sign authority  
> **Session Timeout:** Web: 30 minutes

---

## 1. Role Summary

The **QA Manager** is the highest authority on quality and regulatory compliance within the Clarix platform. In a 503B facility, the QA unit is legally required to be **independent from production** (21 CFR §211.22) — the QA Manager cannot be overridden by the Production Manager or VP on quality decisions.

The QA Manager has the broadest read access of any non-admin role, plus full write authority on the entire quality domain: deviations, CAPAs, documents, and batch review. They are the primary role responsible for ensuring the facility is always **audit-ready** and that every batch that leaves the facility meets quality and regulatory standards.

---

## 2. Primary Responsibilities

### 2.1 Batch Review & Disposition
- Review completed batch records submitted by Production (`pending_review` status)
- Perform systematic review: compare actual execution against master formula
- Check all e-signatures are present and valid
- Verify all deviations encountered during batch execution are dispositioned
- Confirm all component lots used were released and unexpired at time of use
- Verify yield is within tolerance
- Transition batch to `pending_release` (approved) or `rejected` with documented reason
- Only QA Manager (or QA Specialist) can move: `pending_review` → `pending_release`

### 2.2 Deviation Management
- Create, investigate, and close deviations (non-conformances, OOS events, protocol deviations)
- Classify severity: minor, major, critical
- Assign deviations to responsible departments for investigation
- Track status: open → under investigation → pending closure → closed
- Ensure critical deviations have a CAPA created within 24 hours (system-enforced)
- Close deviations with documented root cause and effectiveness note
- Ensure deviations with `patient_impact = true` receive PIC sign-off before closure

### 2.3 CAPA Management
- Create Corrective and Preventive Actions (CAPAs) linked to deviations
- Assign CAPA owners and due dates
- Monitor CAPA completion and overdue alerts
- Verify effectiveness of completed CAPAs (must be a different verifier than the assignee)
- A CAPA cannot close until `effectiveness_verified = true` and verified by a second user

### 2.4 Document Control
- Review and approve Standard Operating Procedures (SOPs), protocols, and policies
- Manage document lifecycle: draft → review → approved → superseded
- Ensure only `status = 'approved'` documents are accessible to operations personnel
- Coordinate periodic SOP review cycles (typically annual)

### 2.5 Vendor Quality
- Approve or hold vendor qualification status
- Review vendor audit findings
- Coordinate Certificates of Analysis (COA) review with QC Tech
- Maintain approved vendor list (AVL)

### 2.6 Environmental Monitoring Oversight
- Review EM data trends: viable and non-viable counts by room over time
- Review and approve EM excursion investigations  
- Close excursions after investigation is complete and linked deviation is resolved
- Escalate persistent EM issues to VP and initiate remediation

### 2.7 Audit Trail Review
- Access and review the full audit trail (alongside admin)
- Conduct periodic self-inspections using audit log data
- Prepare audit packages for FDA inspections: export relevant audit trail segments

### 2.8 Lab Sample Oversight
- Review lab sample results (sterility, endotoxin, potency, appearance)
- Pass/fail determination for external lab results
- Coordinate hold/release decisions on batches pending lab results

---

## 3. Daily Workflow in Clarix

### Morning (30–45 minutes)
1. Check notification inbox — escalations, critical deviations, overdue CAPAs
2. Check **Production Dashboard** — any batches moved to `pending_review` overnight?
3. Open **Deviation List** — review new deviations opened since yesterday
4. Check EM Dashboard — any action limit exceedances?

### During the Day
1. Conduct batch reviews as they arrive in `pending_review` queue
2. Respond to deviation investigations — guide teams, add notes, request additional data
3. Review and sign off on documents submitted for approval
4. Monitor CAPA due dates — chase overdue owners

### End of Day
1. Confirm all time-sensitive deviations (critical) have CAPAs created
2. Review any lab results received — release or hold as appropriate
3. Update audit readiness score assessment

---

## 4. Clarix Screen Access

| Screen | URL | Access Level |
|--------|-----|-------------|
| Executive Dashboard | `/dashboard` | Read |
| Production Dashboard | `/production` | Read |
| Batch List | `/batches` | Read + Sign (review) |
| **Batch Review** | `/batches/[id]/review` | Full (primary) |
| Batch Detail | `/batches/[id]` | Read (full) |
| Inventory Dashboard | `/inventory` | Read |
| Vendor Management | `/vendors` | Read + Sign (approve) |
| **EM Dashboard** | `/environmental` | Full (primary) |
| **Deviation List** | `/quality/deviations` | CRUD |
| Deviation Detail | `/quality/deviations/[id]` | CRUD |
| **CAPA List** | `/quality/capas` | CRUD |
| **Document Control** | `/documents` | CRUD |
| Equipment Dashboard | `/equipment` | Read |
| Cleaning Dashboard | `/cleaning` | Sign (verify) |
| **Training Dashboard** | `/training` | Read |
| Reports & Analytics | `/reports` | Read + Export |
| Lab Samples | `/lab` | Read + Pass/fail |
| Audit Trail | `/admin/audit-trail` | Read |
| Notifications Center | `/notifications` | Own |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `organizations` | R | |
| `users` | R | All personnel |
| `batches` | R + Sign | Can approve/reject — sign only |
| `batch_step_records` | R | Full review access |
| `e_signatures` | R | Review all signatures |
| `master_formulas` | R | Reference for batch review |
| `vendors` | Sign | Approve/hold vendor status |
| `inventory_items` | R | |
| `inventory_lots` | R | |
| `inventory_transactions` | R | |
| `rooms` | R | |
| `em_samples` | R | |
| `em_excursions` | CRUD | Open and close excursions |
| `cleaning_logs` | Sign | Sign cleaning verifications |
| `calibration_records` | Sign | Calibration QA sign-off |
| `deviations` | CRUD | Full authority |
| `capas` | CRUD | Full authority |
| `documents` | CRUD | Full authority |
| `training_records` | R | Personnel qualifications |
| `audit_trail` | R | Full audit log |

---

## 6. Cross-Role Interactions

| Interaction | With Role | Frequency |
|-------------|-----------|-----------|
| Batch review/disposition | `production_manager`, `pic` | Daily |
| Deviation investigation coordination | All operational roles | Multiple/week |
| EM trending review | `microbiologist` | Weekly |
| Document approvals | `qa_specialist`, `pic` | Weekly |
| Lab result review | `qc_tech` | Daily |
| Vendor qualification | `procurement` | As needed |
| Training compliance reporting | `training_coord` | Monthly |
| Executive KPI briefing | `vp` | Weekly |
| Final release authorization | `pic` | Per batch |

---

## 7. Key Events & Auto-Escalation Received

| Event | Notification | Expected QA Response |
|-------|-------------|---------------------|
| EM viable count exceeds alert limit | Push alert | Review — assess cleanup and sampling plan |
| EM viable count exceeds action limit | Push alert + auto-deviation | Investigate — assess batch impact |
| Deviation severity = critical opened | Push alert | Assign CAPA within 24 hours |
| CAPA overdue | Daily digest | Chase owner — document justification |
| Batch in `pending_review` > SLA | Alert | Prioritize batch review |
| Vendor COA not verified within 3 days | Alert | Coordinate with QC |
| Training expiry approaching (< 30 days) | Alert | Coordinate with Training Coordinator |

---

## 8. Regulatory Context

- **21 CFR §211.22:** The QA unit must have authority to approve or reject all materials and products — this is the foundational basis for the QA Manager role
- **21 CFR §211.192:** Batch production and control records must be reviewed by the quality control unit
- **21 CFR §211.68:** QA must review and approve computerized systems
- **21 CFR §211.180:** Records and reports — QA ensures all required records are maintained
- **FDA Guidance (2014):** "Current Good Manufacturing Practice—Guidance for Human Drug Compounding Outsourcing Facilities" defines QA's role in 503B specifically
- **CAPA Systems:** Required by 21 CFR Part 820 (QSR) principles, applied to 503B facilities as best practice and FDA expectation

---

*Role: `qa_manager` · Clarix 503B Platform · March 2026*
