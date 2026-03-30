# Role: Training Coordinator (`training_coord`)

> **Tier:** 2 — Management  
> **RBAC Token:** `training_coord`  
> **Access Level:** Full training domain · Read on personnel · Read on procedures  
> **Session Timeout:** Web: 30 minutes

---

## 1. Role Summary

The **Training Coordinator** manages the personnel qualification and training compliance program for the 503B facility. In a cGMP environment, training is not optional or informal — every person who touches a batch, a cleanroom, or a quality document must have documented, current training before performing that activity. If training expires, system access to perform that activity is automatically blocked in Clarix.

The Training Coordinator owns the **training records system**, maintains the qualification matrix, schedules onboarding and refresher training, and generates compliance reports for QA review and FDA inspections.

---

## 2. Primary Responsibilities

### 2.1 New Employee Onboarding
- Create training plan for new hires based on their assigned role
- Schedule required training modules: cGMP fundamentals, aseptic technique, SOP reading, safety
- Coordinate hands-on qualification events (garbing, media fill, gowning)
- Document successful completion in `training_records`
- Set qualification flags on user profile:
  - `media_fill_qualified` — required for sterile compounding
  - `garbing_qualified` — required for cleanroom entry
  - `hd_trained` — required for hazardous drug handling
- A technician cannot execute batch steps until all required qualifications are current

### 2.2 Ongoing Qualification Management
- Monitor qualification expiry dates for all personnel
- Send advance notices (30-day, 14-day, 7-day) alerting personnel of upcoming expirations
- Schedule refresher training before expiry to avoid operational blockage
- Coordinate annual requalification: media fill, garbing competency, SOP updates

### 2.3 SOP Training & Acknowledgement
- When a new or revised SOP is approved by QA, assign the document for read/acknowledge training
- Track who has acknowledged each SOP version
- Ensure all affected personnel complete SOP training before the SOP becomes effective
- Generate SOP training completion reports for QA

### 2.4 Compliance Reporting
- Maintain the **Personnel Qualification Matrix** — a role-by-qualification grid showing compliance for every person
- Generate training compliance percentage reports (target: 100% — FDA expects no gaps)
- Identify and report personnel with expired or near-expiry qualifications
- Provide training compliance data for Annual Product Reviews (APRs)

### 2.5 Training Record Maintenance
- Document all training events: classroom, hands-on, computer-based, on-the-job
- Attach supporting evidence: test scores, competency assessments, certificates
- Maintain training records that are FDA-inspection-ready (complete, legible, attributable, contemporaneous)
- Ensure records meet 21 CFR Part 11 standards (electronic signature on completion)

---

## 3. Daily Workflow in Clarix

### Morning
1. Open **Training Dashboard** (`/training`) — review qualification expiry calendar
2. Check for any personnel who expired overnight (system auto-blocks them from clinical activity)
3. Review training notifications in notification center

### Regular Activities
- Schedule training sessions (new hires, refreshers, SOP updates)
- Record training completion and upload supporting evidence
- Monitor training completion for currently assigned new hires
- Coordinate with QA for media fill scheduling (quarterly event)

### Monthly
- Generate Personnel Qualification Matrix report
- Review training compliance % by department
- Report to QA Manager and VP on training status
- Review upcoming expirations for next 90 days — proactive scheduling

---

## 4. Clarix Screen Access

| Screen | URL | Access Level |
|--------|-----|-------------|
| **Training Dashboard** | `/training` | Full CRUD (primary) |
| User Profiles | Part of User Management read | Read |
| Document Control | `/documents` | Read |
| Notifications Center | `/notifications` | Own |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `organizations` | R | |
| `users` | R | All users and their qualification flags |
| `training_records` | CRUD | Full authority — this is the core function |
| `documents` | R | Read approved SOPs to create training plans |
| `notifications` | Own | |

---

## 6. Qualification Flags in Clarix

Training Coordinator manages the following boolean flags on the `users` table:

| Flag | Description | Controls Access To |
|------|-------------|-------------------|
| `media_fill_qualified` | Passed sterile media fill qualification | Sterile batch execution steps |
| `garbing_qualified` | Passed sterile gowning/garbing competency | Any cleanroom entry activity |
| `hd_trained` | Completed hazardous drug handling training | HD batch execution steps |

When any of these flags expire (`media_fill_expiry < today`, etc.), the system auto-sets the flag to `false`, and the technician is immediately blocked from those activities in Clarix.

---

## 7. Cross-Role Interactions

| Interaction | With Role | Frequency |
|-------------|-----------|-----------|
| New employee qualification | All roles (new hires) | As hired |
| Qualification expiry alerts | `production_manager` | Ongoing |
| SOP training after document approval | `qa_manager`, `qa_specialist` | Whenever SOP is updated |
| Media fill event coordination | `microbiologist`, `qa_manager` | Quarterly |
| Training compliance reporting | `vp`, `qa_manager` | Monthly |

---

## 8. Regulatory Context

- **21 CFR §211.68:** Personnel qualifications must be documented
- **21 CFR §211.25:** Personnel qualifications — each person must have education, training, and experience to perform assigned functions
- **21 CFR §211.68:** Training records are subject to FDA inspection
- **21 CFR Part 11:** Electronic training records require appropriate controls (audit trail, authentication)
- **USP <797>:** Requires initial and ongoing competency assessments for personnel performing sterile compounding — the Training Coordinator is responsible for managing this

---

*Role: `training_coord` · Clarix 503B Platform · March 2026*
