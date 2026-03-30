# Role: Compounding Technician (`technician`)

> **Tier:** 4 — Operations  
> **RBAC Token:** `technician`  
> **Access Level:** Execute assigned batches via iPad · Barcode scanning · E-sign own steps  
> **Session Timeout:** iPad: 5 minutes (auto-lock in cleanroom) · Web: 30 minutes

---

## 1. Role Summary

The **Compounding Technician** is the operational core of a 503B facility — the person who physically executes the compounding process inside the cleanroom. They weigh, measure, mix, fill, label, and document every step of the compounding process according to the master formula, under the direct supervision of a licensed pharmacist.

In Clarix, the technician's primary interface is the **iPad Batch Execution app** (screen M3). The user experience is optimized for gloved hands in an ISO 7 cleanroom: large touch targets, one step per screen, barcode scanning, voice-guided numeric entry, and photo capture. Every action is time-stamped, attributable, and immutable.

> **Qualification Gate:** A technician cannot execute batch steps in Clarix unless:
> - `garbing_qualified = true` (sterile gowning competency current)
> - `media_fill_qualified = true` (annual sterile media fill passed)
> - `hd_trained = true` (if batch is a hazardous drug)

---

## 2. Primary Responsibilities

### 2.1 Batch Execution (iPad)
- Access assigned batches from the **My Batches** screen (M2)
- Execute each step in sequence — steps are locked until the previous step is completed
- For each step, the iPad presents:
  - Step instructions (in plain, step-by-step language)
  - Expected parameters (target weight, target volume, pH range)
  - Input field for actual measured value
  - Barcode scan field (if `requires_barcode_scan = true`)
  - Timer (if step requires a timed contact/mixing period)
  - Photo capture button (for visual documentation)
  - E-signature pad (for steps requiring signature)

### 2.2 Component Handling
- Retrieve materials from staging area (prepared by Warehouse per Pharmacist's batch ticket)
- Scan component barcodes using the iPad barcode scanner to confirm identity and lot
   - System validates: is this the correct component? Is the lot released? Is it unexpired?
   - Failed scan blocks progression — technician escalates to Pharmacist
- Record actual quantity consumed (`batch_components_used`) — updates inventory in real-time
- Manage component transfer aseptically (sterile technique throughout)

### 2.3 Garbing & Cleanroom Entry
- Follow garbing SOP before every cleanroom entry (logged in gowning record)
- Maintain aseptic technique throughout production
- Follow environmental controls: no unnecessary movement, proper gowning hygiene
- Report any breach of aseptic technique or unusual observations to supervising Pharmacist immediately

### 2.4 Documentation (Contemporaneous)
- All documentation is entered **at the time of performance** (not after the fact)
- Every numeric entry is checked by the system against tolerance bands
- Out-of-tolerance values trigger the OOS workflow automatically — technician cannot override
- If step cannot be completed, technician selects "unable to complete" and provides reason (creates a deviation)

### 2.5 Barcode Verification
- Scan each component lot barcode at point of use
- Scan-to-fill: verify filled container label matches expected product barcode
- Scan room QR code at start of each cleaning verification

---

## 3. Daily Workflow on iPad (Typical Day)

### Gowning & Entry
1. Log into iPad with PIN — biometric optional for technicians
2. Check **My Batches** — review today's assigned batches, step count, and expected duration
3. Proceed to gowning room → follow garbing SOP → enter cleanroom

### Batch Execution in Cleanroom
1. On iPad: tap assigned batch → tap "Start Batch"
2. Step 1 appears: reading components list → scan each component's barcode
3. Step 2: weigh API → enter actual weight → system checks against tolerance
4. Step 3: add diluent → scan and enter volume → add note if needed
5. (Each step follows same pattern: instruction → action → entry → sign if required → advance)
6. At pharmacist verification steps: pharmacist enters their e-signature on the same iPad
7. Final step: label and fill review → tap "Submit for Inspection"

### After Production
1. Remove gown → record and discard per HD or non-HD SOP
2. Clean and decontaminate workstation and equipment per cleaning SOP
3. Review any pending corrections identified by supervising pharmacist

---

## 4. Clarix Screen Access

### iPad App Screens
| Screen | Access | Description |
|--------|--------|-------------|
| **My Batches (M2)** | Full | Today's assigned batches |
| **Batch Execution (M3)** | Full (assigned batches only) | Step-by-step guided workflow |
| **Barcode Scanner (M4)** | Full | Component and container scanning |
| **E-Signature Modal (M11)** | Full | PIN + biometric entry |
| **Offline Mode (M12)** | Full | Data queued for sync |

### Web Access (Limited)
| Screen | URL | Access |
|--------|-----|--------|
| My Profile | Part of user settings | Own |
| Training Records | `/training` | Own records only |
| Notifications | `/notifications` | Own |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `batches` | R | Assigned batches only (`assigned_technician_id = self`) |
| `batch_step_records` | CR + Own | Create step records, sign own steps |
| `batch_components_used` | CR | Record component consumption during batch |
| `master_formulas` | R | Read the formula being executed |
| `formula_steps` | R | Read step instructions |
| `formula_components` | R | Read BOM |
| `inventory_lots` | R | View available lots (for barcode verification) |
| `inventory_transactions` | CR | Record consumption transactions |
| `e_signatures` | CR + Own | Sign own steps only |
| `training_records` | Own | Own training records |
| `users` | Own | Own profile |

---

## 6. System Safeguards & Automation

| Safeguard | Trigger | Outcome |
|-----------|---------|---------|
| **Qualification Gate** | Batch assignment attempted | Blocked if `media_fill_qualified = false` or `garbing_qualified = false` |
| **HD Gate** | Batch has `hazardous_drug = true` | Blocked if `hd_trained = false` |
| **Step Sequencing** | Step N+1 start attempted | Blocked until Step N status = 'completed' |
| **Barcode Validation** | Barcode scanned | System validates lot identity and release status |
| **OOS Auto-Flag** | Numeric entry outside tolerance | `within_tolerance = false`, deviation prompt triggered |
| **Session Lock** | 5-minute inactivity on iPad | Lock screen → re-auth required to resume |
| **Offline Queue** | iPad loses network | Steps queued locally — sync on reconnect |

---

## 7. Regulatory Context

- **21 CFR §211.25:** Education, training, and experience required for each function
- **21 CFR §211.68:** Technicians must be trained on any computerized system they use
- **USP <797>:** Personnel Training and Evaluation — technicians must annually pass garbing assessment and media fill
- **USP <800>:** Hazardous Drug Handling — HD-designated technicians must complete additional training
- **21 CFR §211.101:** Charge-in of components — technicians must document each component use contemporaneously

---

*Role: `technician` · Clarix 503B Platform · March 2026*
