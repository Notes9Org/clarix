# Role: Environmental Microbiologist (`microbiologist`)

> **Tier:** 3 — Professional  
> **RBAC Token:** `microbiologist`  
> **Access Level:** Full EM domain · Sample entry · Excursion investigation  
> **Session Timeout:** Web: 30 minutes · iPad: 5 minutes (used in cleanroom)

---

## 1. Role Summary

The **Environmental Microbiologist** is the specialist responsible for all environmental monitoring (EM) activities in a 503B outsourcing facility. In aseptic sterile compounding, the cleanroom environment is as critical as the product itself — if the air, surfaces, or personnel are contaminated, every batch produced in that environment is at risk.

The Microbiologist's domain is the invisible world: viable organisms (bacteria, mold, yeast), non-viable particulates, pressure differentials, and temperature/humidity trends. They collect samples, analyze results, trend data over time, investigate exceedances, and ensure the facility's cleanroom classification is continuously maintained at ISO 5, 7, and 8 standards.

---

## 2. Primary Responsibilities

### 2.1 Environmental Monitoring (EM) Sampling
- Execute the EM sampling schedule: active air sampling (RCS, SAS), passive air (settle plates), surface contact plates (contact plates / swabs)
- Sample all classified areas: ISO 5 (critical zone), ISO 7 (clean corridor), ISO 8 (gowning room)
- Sample personnel: fingertip plates, gown/glove sampling during/after production
- Log each sample collection event in Clarix iPad app:
  - Room + location
  - Sample type (air/surface/personnel)
  - Media lot used
  - Collection time and personnel present

### 2.2 Incubation & Result Logging
- Manage incubation of all microbial samples per SOP (typically 48–72 hrs at 30–35°C + 48-72 hrs at 20–25°C for total count)
- Enter CFU (colony-forming unit) counts into Clarix after incubation
- System auto-evaluates results against alert and action limits:
  - `exceeds_alert`: count above alert limit → system flags and notifies microbiologist
  - `exceeds_action`: count above action limit → system auto-creates EM excursion and notifies QA Manager

### 2.3 EM Excursion Investigation
- Investigate excursions: identify contamination source through trend analysis, room history, and production records
- Review affected batch list (auto-populated by Clarix based on room + time window overlap)
- Document investigation findings and proposed root cause in the excursion record
- Link excursion to formal deviation when required (`excursion_type = 'action'` always requires a deviation)
- Implement corrective remediation: additional cleaning, repeat sampling, hold investigation

### 2.4 Sterility Testing Coordination
- Coordinate sterility test samples from each batch (extracted at fill and sent to external lab)
- Track sample status: collected → shipped → in testing → results received
- Log sterility test results in Clarix when received from external lab
- Flag failures immediately to QA Manager and initiate investigation

### 2.5 Trend Analysis & Reporting
- Generate monthly EM trend reports: viable counts by room, by organism type, over time
- Identify trend patterns that may indicate emerging contamination risk before action limits are exceeded (proactive control)
- Generate trending graphs for QA Manager review and VP reporting
- Prepare EM data packages for annual product reviews and FDA inspections

### 2.6 EM Location & Schedule Management
- Maintain the map of EM sampling locations (`em_locations` in Clarix)
- Update sampling frequencies as required by risk assessment or regulatory guidance
- Coordinate sampling with production schedule to avoid interference

---

## 3. Daily Workflow in Clarix

### Start of Day
1. Open iPad → **EM Sampling** app (M6)
2. Review today's sampling schedule — which rooms, which locations, which sample types?
3. Gather media (settle plates, contact plates, SAS cassettes) — verify lots are released

### During Sampling
1. Scan room QR code on iPad → confirm room identity
2. Log each sample: type, location, media lot, collection time
3. Place plates in cleanroom per location map
4. Retrieve plates after sampling period — transport to microbiology lab

### Incubation & Results
1. Place plates in incubators — log start time
2. After incubation: count colonies → enter CFU counts in **EM Results Entry** (M7)
3. System auto-evaluates → alerts if limits exceeded
4. Investigate any alert/action limit exceedances immediately

### Monthly
- Generate EM trend report across all rooms
- Present trends at monthly QA meeting

---

## 4. Clarix Screen Access

| Screen | URL | Access Level |
|--------|-----|-------------|
| **EM Dashboard** | `/environmental` | Full (primary) |
| EM Sample Detail | `/environmental/samples/[id]` | Full CRUD |
| iPad EM Sampling | M6 | Full |
| iPad EM Results Entry | M7 | Full |
| Batch List | `/batches` | Read (for excursion cross-reference) |
| Deviation List | `/quality/deviations` | Read |
| Notifications Center | `/notifications` | Own |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `em_locations` | CRUD | Manage sampling location library |
| `em_samples` | CRUD | Create, log, and enter results |
| `em_excursions` | CRUD | Investigate excursions |
| `rooms` | R | Room reference |
| `batches` | R | Cross-reference for excursion impact assessment |
| `e_signatures` | CR + Own | Sign sample collections and result entries |

---

## 6. EM Alert vs Action Limits

| Classification | Alert Limit | Action Limit | System Response |
|---------------|-------------|-------------|----------------|
| ISO 5 (Critical Zone) | 1 CFU | 2 CFU | Alert → Excursion |
| ISO 7 (Clean Corridor) | 10 CFU | 20 CFU | Alert → Excursion |
| ISO 8 (Gowning Room) | 50 CFU | 100 CFU | Alert → Excursion |

*(Limits based on USP <797> and EU GMP Annex 1 guidance — may be tightened by facility SOP)*

These limits are configured per `em_location` in Clarix. When `viable_count_cfu` exceeds alert limit, Clarix flags the sample and notifies the microbiologist. When it exceeds the action limit, Clarix auto-creates an `em_excursion` record and notifies the QA Manager.

---

## 7. Regulatory Context

- **21 CFR §211.42:** Adequate control of environmental conditions — Microbiologist implements and monitors these controls
- **USP <797>:** Environmental Monitoring requirements — specifies EM program design, frequency, limits, and investigation requirements
- **USP <800>:** Additional requirements for hazardous drug areas — Microbiologist extended sampling to HD compounding areas
- **EU GMP Annex 1 (2022):** Most comprehensive global EM guideline — used as a best practice reference alongside FDA guidance
- **FDA Warning Letters:** Environmental monitoring failures are among the most common 503B FDA citation categories — the Microbiologist's work is directly tied to FDA compliance posture

---

*Role: `microbiologist` · Clarix 503B Platform · March 2026*
