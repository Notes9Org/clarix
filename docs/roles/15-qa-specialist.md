# Role: QA Specialist (`qa_specialist`)

> **Tier:** 2 — Management  
> **RBAC Token:** `qa_specialist`  
> **Access Level:** QA domain write (deviations, CAPAs, docs) · Batch review/sign authority  
> **Session Timeout:** Web: 30 minutes

---

## 1. Role Summary

The **QA Specialist** is a senior quality professional who works under the QA Manager, sharing most quality domain responsibilities but without the final management authority. In many 503B facilities, the QA Specialist functions as the day-to-day workhorse of the quality system — investigating deviations, authoring CAPA plans, reviewing batch records, and maintaining the SOP library.

The key distinction from the QA Manager is that the QA Specialist **cannot** independently close deviations above minor severity — critical decisions escalate to the QA Manager. They can, however, review and approve most batch records, create and progress CAPAs, and author quality documents.

This role is important in Clarix as a **delegation layer** — it allows the QA Manager to distribute quality workload without losing control of final quality decisions.

---

## 2. Primary Responsibilities

### 2.1 Batch Record Review
- Review completed batch records submitted to `pending_review`
- Perform the same systematic review as QA Manager (see [04-qa-manager.md](./04-qa-manager.md))
- Transition batch: `pending_review` → `pending_release` (if acceptable)
- Document review findings, flag discrepancies for QA Manager escalation if complex
- Cannot perform *final* release — that remains with the PIC

### 2.2 Deviation Investigation
- Create deviation reports when non-conformances are identified
- Lead investigations for minor and major severity deviations
- Assign investigation tasks and gather evidence (batch records, EM data, equipment logs)
- Document root cause analysis (5-Why, Fishbone diagram, etc.) in the deviation record
- Critical severity deviations → escalate to QA Manager immediately

### 2.3 CAPA Creation & Progress
- Create Corrective and Preventive Actions linked to closed deviations
- Write CAPA action plans: what will be done, who owns it, when is it due
- Monitor CAPA progress — follow up with owning departments
- Document CAPA closure with evidence of completion
- Record effectiveness verification (by a different user than the CAPA owner)

### 2.4 Document Authorship & Control
- Author new SOPs, protocols, and policies
- Manage document lifecycle: draft → review → approval → distribution → archival
- Submit documents for PIC or QA Manager approval
- Coordinate SOP training acknowledgement with Training Coordinator after document approval
- Supersede outdated document versions (old version archived, new version activated)

### 2.5 Internal Audits
- Conduct scheduled self-inspection audits of production, warehouse, and lab areas
- Document audit findings and issue report to QA Manager
- Track audit observations to ensure timely CAPA response

---

## 3. Daily Workflow in Clarix

### Morning
1. Check notification inbox — new deviations flagged overnight? Batch records in review queue?
2. Review **Deviation List** — any escalations or investigations needing progress today?
3. Review **CAPA List** — any items due soon?

### During the Day
1. Complete batch reviews in `pending_review` queue
2. Progress active deviation investigations — document findings
3. Review and progress CAPA action items
4. Author or revise documents as scheduled

---

## 4. Clarix Screen Access

| Screen | URL | Access Level |
|--------|-----|-------------|
| Production Dashboard | `/production` | Read |
| Batch List | `/batches` | Read + Sign (review) |
| Batch Review | `/batches/[id]/review` | Full |
| Batch Detail | `/batches/[id]` | Read (full) |
| **Deviation List** | `/quality/deviations` | CR + R |
| Deviation Detail | `/quality/deviations/[id]` | CR + R |
| **CAPA List** | `/quality/capas` | CR + R |
| **Document Control** | `/documents` | CRUD |
| Inventory Dashboard | `/inventory` | Read |
| Audit Trail | `/admin/audit-trail` | Read |
| Reports & Analytics | `/reports` | Read |
| Notifications Center | `/notifications` | Own |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `batches` | R + Sign | Review and sign (`pending_review` → `pending_release`) |
| `batch_step_records` | R | Full review |
| `e_signatures` | R | Review all signatures |
| `master_formulas` | R | Reference |
| `deviations` | CR + R | Create and investigate — escalate critical |
| `capas` | CR + R | Create and progress |
| `documents` | CRUD | Full document authorship and control |
| `audit_trail` | R | Support audit activities |
| `training_records` | R | Reference |

---

## 6. Comparison: QA Manager vs QA Specialist

| Capability | `qa_specialist` | `qa_manager` |
|-----------|----------------|-------------|
| Review batches | ✓ | ✓ |
| Create deviations | ✓ | ✓ |
| Close minor deviations | ✓ | ✓ |
| Close critical deviations | Escalate to QA Mgr | ✓ |
| Create CAPAs | ✓ | ✓ |
| Verify CAPA effectiveness | ✓ | ✓ |
| Author documents | ✓ | ✓ |
| Approve documents | ✗ | ✓ |
| Approve vendor qualification | ✗ | ✓ |
| EM excursion close | ✗ | ✓ |
| Full audit trail access | ✓ | ✓ |
| Approve calibration records | ✗ | ✓ |

---

## 7. Regulatory Context

- **21 CFR §211.22:** Quality unit authority — QA Specialist exercises delegated authority from the QA Manager
- **21 CFR §211.192:** Batch record review must be completed by the quality control unit — QA Specialist is a member of the QCU
- **21 CFR §211.68:** Electronic records reviewed and authorized by qualified personnel
- **ICH Q10:** Pharmaceutical Quality System — CAPA system and change control are responsibilities of the QA function

---

*Role: `qa_specialist` · Clarix 503B Platform · March 2026*
