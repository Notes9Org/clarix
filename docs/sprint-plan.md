# Clarix — 503B Digital Batch Record & Facility Management Platform
## Sprint Plan & Product Blueprint | Solo Developer Edition
## Start Date: March 28, 2026 | Target MVP: 3 Months

---

## 1. What is Clarix?

Clarix is a **digital batch record (eBR) and facility management platform** purpose-built for **FDA-registered 503B outsourcing compounding facilities**. It replaces paper-based batch records, manual inventory tracking, and spreadsheet environmental monitoring with a unified, 21 CFR Part 11–compliant digital system.

The platform acts as a **UI layer that bridges PK Software** (the facility's existing validated batch record generator) with modern digital workflows — capturing data at the point of action on cleanroom-certified tablets (iPads), eliminating the "double entry" transcription problem, and providing real-time QA oversight.

---

## 2. Market Validation & Opportunity

### Market Size
| Metric | Value |
|--------|-------|
| FDA-registered 503B facilities (2025) | **93 facilities** |
| US 503B compounding market (2025) | **$1.25 billion** |
| Projected market (2034) | **$2.42 billion** (7.63% CAGR) |
| Avg. facility revenue | $10M–$50M+ |

### Why Now?
1. **Post-NECC regulatory pressure**: The 2012 meningitis outbreak killed 64 people. Congress created the 503B designation with cGMP requirements. FDA scrutiny has only intensified.
2. **Paper is still king**: Most 503B facilities run on paper batch records, Excel EM logs, and QuickBooks inventory — despite being held to pharmaceutical manufacturing standards.
3. **Competitors are enterprise-priced**: MasterControl ($50K+/yr), Seal (custom enterprise pricing), InstantGMP ($25K+/yr). Small-to-mid 503B facilities are priced out.
4. **PK Software gap**: PK Software (The Compounder) handles formula management but has **zero digital execution** — records are printed, hand-carried into cleanrooms, and manually signed.

### Idea Validation Checklist
- [x] Facility stakeholders confirm paper degradation in cleanrooms (soggy records from IPA spraying)
- [x] "Missing initials" is the #1 QA bottleneck — forces post-hoc "re-signing" loops
- [x] "Double entry" from A4 sheets to laptops causes transcription errors and supply waste
- [x] 6-month vial shortage traced directly to manual inventory monitoring
- [x] Equipment rust on stainless steel tools going undetected due to manual calibration tracking
- [x] Facility VP prefers legacy workflows — solution must frame as "reducing delays" not "replacing systems"

---

## 3. Competitive Landscape

| Competitor | Strengths | Weaknesses | Pricing |
|-----------|-----------|------------|---------|
| **Seal** | AI-native, unified MES/QMS/LIMS/ELN, SOC 2 Type II, 503B-specific blueprint, "go live in 48 hrs" | Enterprise-only pricing, broad pharma focus (not 503B-first), complex onboarding for small facilities | Custom (enterprise) |
| **MasterControl** | Industry standard QMS, deep cGMP compliance, large customer base | Expensive, complex UI, overkill for small 503B shops, slow implementation | $50K–$100K+/yr |
| **InstantGMP** | Purpose-built for 503B/GMP, EBR + QMS + inventory + LMS, QuickBooks integration | Limited AI, aging UI, $25K entry point still steep for small facilities | ~$25K/yr |
| **Siemens Opcenter** | Deep automation integration, enterprise MES | Way too complex/expensive for 503B compounding, designed for large pharma | $100K+ |
| **PK Software** | Entrenched in compounding pharmacies, formula management | Print-only batch records, no digital execution, no EM, no inventory intelligence | ~$5K–$15K/yr |
| **Clarix (Us)** | 503B-first, PK Software bridge, iPad cleanroom execution, AI-assisted, affordable | New entrant, solo developer, no brand recognition yet | Target: $8K–$20K/yr |

### Our Differentiation
1. **PK Software bridge** — We don't replace PK; we extend it. Facility leadership keeps their validated system.
2. **Cleanroom-first iPad UX** — Designed for gloved hands, IPA wipe-downs, forced-completion workflows.
3. **AI-powered compliance** — Auto-flag contradictions, predict inventory shortfalls, draft deviation reports.
4. **Affordable for small 503B** — Not enterprise pricing. Accessible to the 50–80 facilities priced out of Seal/MasterControl.

---

## 4. Regulatory Requirements (Non-Negotiable)

| Regulation | What It Means for Clarix |
|-----------|--------------------------|
| **21 CFR Part 11** | Electronic signatures must be unique, time-stamped, and show signer identity + meaning. Full audit trail on every record. System must be validated. |
| **21 CFR 210/211** | cGMP for drug manufacturing. Batch records must document every production step. QCU must be independent. |
| **USP <797>** | Sterile compounding standards. Environmental monitoring, personnel qualification, BUD determination. |
| **USP <800>** | Hazardous drug handling. Negative pressure rooms, enhanced PPE, surface decontamination tracking. |
| **USP <795>** | Non-sterile compounding (if applicable). |
| **ALCOA+ Principles** | All data must be Attributable, Legible, Contemporaneous, Original, Accurate + Complete, Consistent, Enduring, Available. |

---

## 5. Organizational Roles & User Personas

A typical 503B outsourcing facility has **15–60 staff** across these departments. Each role has distinct software needs.

### 5.1 Role Map

| # | Role | Department | Count (typical) | System Access Level | Primary Interface |
|---|------|-----------|-----------------|--------------------|--------------------|
| 1 | **Vice President / Facility Owner** | Executive | 1 | Read-only dashboards, approvals | Web dashboard |
| 2 | **Production Manager** | Production | 1–2 | Full production oversight, scheduling, assignments | Web dashboard |
| 3 | **Pharmacist-in-Charge (PIC)** | Pharmacy / QA | 1 | Formula approval, final batch release, regulatory sign-off | Web + iPad |
| 4 | **Staff Pharmacist** | Pharmacy | 1–3 | Batch verification, calculation review, clinical oversight | Web + iPad |
| 5 | **Compounding Technician** | Production | 5–15 | Batch execution, data entry, barcode scanning, e-signatures | iPad (primary) |
| 6 | **Visual Inspector / Packager** | Production | 2–5 | Inspection checklists, labeling verification, packaging sign-off | iPad |
| 7 | **QA Manager / Director** | Quality Assurance | 1 | Batch review, deviation management, CAPA, audit preparation | Web dashboard |
| 8 | **QA Specialist** | Quality Assurance | 1–3 | Document control, batch record review, training tracking | Web dashboard |
| 9 | **QC Technician / Chemist** | Quality Control | 1–3 | Lab testing (potency, endotoxin, sterility), sample tracking | Web + iPad |
| 10 | **Microbiologist** | Quality Control | 1 | Environmental monitoring, media fills, surface sampling | Web + iPad |
| 11 | **Warehouse / Inventory Clerk** | Supply Chain | 1–3 | Receiving, barcode scanning, stock counts, reorder alerts | iPad + Web |
| 12 | **Procurement Manager** | Supply Chain | 1 | Vendor management, purchase orders, shortage forecasting | Web dashboard |
| 13 | **Maintenance / Facilities Tech** | Facilities | 1–2 | Equipment calibration, cleaning logs, room monitoring | iPad |
| 14 | **Training Coordinator** | HR / Quality | 1 | Personnel qualification, SOP training records, media fill tracking | Web dashboard |
| 15 | **IT Administrator** | IT | 1 | User management, system config, integrations, audit trail access | Web admin panel |

### 5.2 User Personas & Daily Scenarios

---

#### 👨‍🔬 PERSONA 1: Carlos — Compounding Technician

**Profile:** 28 years old, works 10-hour shifts in ISO 5/7 cleanrooms, gowns up 3x per day
**Current Pain:** Writes on paper that gets soggy from IPA spray. Forgets to initial steps during high-pressure manual filling. Gets "chased" by QA for missing signatures hours after leaving the cleanroom. Records supply lot numbers on A4 sheets, then re-enters them into a laptop — frequent digit transposition errors.

**User Scenarios:**
1. **Start Batch** → Carlos scans his badge on the iPad at the cleanroom entrance → sees his assigned batches for today → taps "Start Batch #2026-0847" → system pulls the master formula from PK Software integration → sees step-by-step guided instructions
2. **Supply Gathering** → walks to warehouse staging area → scans each supply item's barcode with iPad camera → system auto-populates lot number, expiry, quantity into the batch record → alerts if wrong vial size (5ml vs 10ml) or expired lot → no manual transcription
3. **Admixing** → follows on-screen steps: "Add 10g API [Famotidine]" → enters actual weight → system validates against ±2% tolerance → forces e-signature (PIN + biometric) before proceeding → cannot skip steps
4. **pH Balancing** → enters pH reading → if outside 7.0 ± 0.2, system blocks progression and generates deviation workflow → Carlos documents corrective action on-screen
5. **Shift End** → system shows 2 unsigned steps → forces Carlos to complete before clocking out → no "missing initials" for QA to chase

---

#### 👩‍⚕️ PERSONA 2: Dr. Priya — Pharmacist-in-Charge (PIC)

**Profile:** Licensed pharmacist, 15 years experience, responsible for regulatory compliance, reports to VP
**Current Pain:** Spends hours reviewing paper batch records for completeness. Tracks BUD calculations manually. Gets called by FDA inspectors who want instant documentation — has to dig through filing cabinets.

**User Scenarios:**
1. **Batch Review** → Opens web dashboard → sees queue of completed batches pending review → clicks Batch #2026-0847 → views complete digital record: every step time-stamped, all e-signatures captured, all deviations auto-flagged → reviews by exception (only flags, not every line) → signs final release with 21 CFR Part 11 e-signature
2. **BUD Calculation** → system auto-calculates Beyond Use Date based on product type + USP <797> category + preparation conditions → Dr. Priya verifies → no manual date math
3. **FDA Inspection** → FDA inspector asks for Batch #2026-0412 from 6 months ago → Dr. Priya searches by batch number → instant retrieval with complete audit trail, EM data, QC results, all signatures → inspector satisfied in minutes, not hours
4. **Formula Approval** → receives change request to adjust Famotidine concentration → reviews version-controlled master formula → approves v1.1 with documented rationale → all future batches auto-generate from v1.1

---

#### 🔬 PERSONA 3: Marcus — QA Manager

**Profile:** 12 years in pharmaceutical quality, manages batch review team, leads audit preparation
**Current Pain:** Chases technicians for missing initials. Compiles paper records for FDA visits. Tracks deviations in Excel. CAPA follow-ups fall through the cracks.

**User Scenarios:**
1. **Daily Queue** → Opens dashboard → sees: 8 batches pending review, 2 open deviations, 1 CAPA due this week, 3 overdue training items → prioritizes based on severity
2. **Deviation Management** → receives auto-generated deviation from Batch #2026-0850 (pH out of spec) → assigns root cause investigation → sets CAPA with due date → system sends reminders → tracks effectiveness verification
3. **Audit Preparation** → clicks "Generate Audit Packet" → selects date range → system compiles: all batch records, deviation history, CAPA log, EM trends, training records, equipment calibration status → exports as PDF bundle
4. **Trend Analysis** → views dashboard showing batch rejection rate, deviation categories, EM excursion trends → identifies that ISO 7 Room B has increasing viable counts → initiates preventive action before it becomes a 483 finding

---

#### 🧫 PERSONA 4: Sarah — Microbiologist / EM Coordinator

**Profile:** Microbiology degree, responsible for environmental monitoring program, surface sampling, media fills
**Current Pain:** Tracks EM results in Excel. 7-day incubation results get lost. Trends are invisible until a contamination event. Dixon monitoring reminders are manual.

**User Scenarios:**
1. **Daily EM Rounds** → Opens iPad → sees scheduled sampling locations for today (ISO 5 Hood A, ISO 7 Buffer Room, ISO 8 Ante Room) → scans location QR code → records viable/non-viable particle counts → takes surface samples → logs incubation start time
2. **Incubation Tracking** → system tracks 7-day incubation period → on Day 7, alerts Sarah to read plates → she logs CFU counts → system auto-checks against alert limits (ISO 5: >1 CFU = alert) and action limits (>3 CFU = action required)
3. **Excursion Response** → ISO 7 Room B sample shows 8 CFU (action limit = 7) → system auto-generates EM excursion investigation → links to all batches compounded in Room B during the window → Sarah assesses impact → documents corrective cleaning
4. **Monthly Trending** → views EM trend charts → sees Room B viable counts creeping upward over 3 months → recommends enhanced cleaning protocol before FDA finds the pattern

---

#### 📦 PERSONA 5: David — Warehouse / Inventory Clerk

**Profile:** Manages receiving dock, supply staging, cleanroom material transfers
**Current Pain:** Stacks supplies randomly. Uses QuickBooks for ordering. Discovered 6-month vial shortage only when shelf was empty. Cannot track real-time consumption of items like alcohol wipes.

**User Scenarios:**
1. **Receiving** → shipment arrives → David scans each item's barcode → system records: vendor, lot, expiry, quantity, COA reference → items enter "Quarantined" status → QC must release before use
2. **Staging for Production** → Production Manager assigns Batch #2026-0851 → system generates pick list → David pulls items from FIFO-ordered shelves → scans each to confirm correct item/lot → stages in ante-room staging area
3. **Low Stock Alert** → system detects 10ml vials at 15% of safety stock → auto-generates reorder alert to Procurement Manager → includes consumption rate projection: "At current usage, stockout in 18 days"
4. **Consumption Tracking** → alcohol wipe protocol changes from unrestricted to restricted use → system tracks daily consumption per cleanroom → flags abnormal usage spikes → prevents surprise shortages

---

#### 🏭 PERSONA 6: Jim — VP / Facility Owner

**Profile:** Built the facility from scratch, "old school," trusts paper, skeptical of technology changes
**Current Pain:** Production delays from QA record chasing. FDA 483 observations on missing documentation. Cannot see real-time production status.

**User Scenarios:**
1. **Executive Dashboard** → Opens read-only web dashboard → sees today's KPIs: 12 batches in progress, 2 pending QA release, 0 deviations open, EM status green, inventory health 94% → sees it as "making my facility run faster"
2. **Production Visibility** → clicks into Batch #2026-0847 → sees real-time progress: Step 7 of 12, currently in admixing, on schedule → no need to walk to cleanroom to ask "where are we?"
3. **Audit Readiness Score** → sees compliance dashboard: 97% audit readiness → green indicators on: training current, EM trending clean, all CAPAs closed on time → peace of mind before next FDA visit

---

#### 🔧 PERSONA 7: Rosa — Maintenance / Facilities Technician

**Profile:** Manages equipment calibration, cleanroom HVAC, cleaning schedules
**Current Pain:** Tracks calibration due dates on paper calendars. pH meter went out of calibration for 2 weeks before anyone noticed. Rust formed on tools that should have been replaced.

**User Scenarios:**
1. **Calibration Dashboard** → Opens iPad → sees: pH meter calibration due in 3 days (yellow), autoclave qualification due in 14 days (green), 2 forceps flagged for replacement (rust detected during last inspection, red)
2. **Cleaning Logs** → daily cleaning assigned by room → Rosa scans room QR code → follows checklist: sporicidal agent applied, contact time verified, surfaces wiped → enters sanitization agent (rotating per schedule) → e-signs completion
3. **Equipment Issue** → discovers pressure differential alarm in ISO 7 Room B → logs incident on iPad → system auto-notifies QA Manager and Production Manager → links to all active batches in the room → tracks resolution

---

## 6. Tech Stack (Mirrors Astra Monorepo)

### Web Application (Admin Dashboard, Batch Records, QMS)

| Category | Technology | Why |
|----------|------------|-----|
| **Monorepo** | Turborepo + Bun | Shared from Astra. Parallel builds, caching |
| **Framework** | Next.js 16 (App Router, RSC, React 19) | Server rendering, streaming, server actions |
| **Language** | TypeScript 6 (strict) | Type safety across the entire system |
| **Styling** | Tailwind CSS v4 | Utility-first, rapid UI, responsive iPad layouts |
| **UI Components** | shadcn/ui + Radix UI + Lucide | Accessible, composable primitives |
| **Forms** | TanStack Form + Zod v4 | Type-safe batch record forms with complex validation |
| **Data Tables** | TanStack Table | Batch lists, inventory tables, EM data grids |
| **Server State** | TanStack Query + next-safe-action | Caching, real-time batch status, type-safe mutations |
| **Client State** | Zustand | Lightweight state for active batch context |
| **URL State** | nuqs | Filter/search state in URL for shared links |
| **Animation** | Framer Motion | Dashboard transitions, step-completion animations |
| **Database** | PostgreSQL (via `pg`) | Relational data: batches, inventory, EM results, audit trails |
| **ORM** | Drizzle ORM + drizzle-zod | Type-safe queries, migrations, schema-to-form validation |
| **Auth** | Better-Auth (RBAC, organizations) | Role-based access: Tech vs QA vs PIC vs VP |
| **AI** | Vercel AI SDK v6 + Mastra | Deviation drafting, compliance gap detection, inventory forecasting |
| **Charts** | Recharts | EM trending, batch analytics, inventory dashboards |
| **Deployment** | Vercel (web) + Docker (self-hosted option) | Cloud + on-premise for facilities needing data locality |
| **Testing** | Vitest + Playwright | Unit tests for validation logic, E2E for batch workflows |

### iPad Application (Cleanroom Execution)

| Category | Technology | Why |
|----------|------------|-----|
| **Framework** | React Native + Expo SDK 53 | Cross-platform, OTA updates without App Store review |
| **Routing** | Expo Router v4 | File-based routing, deep linking to specific batch steps |
| **Styling** | NativeWind v4 | Same Tailwind utility classes as web |
| **Camera/Scanner** | expo-camera + expo-barcode-scanner | Barcode scanning for inventory and component verification |
| **Offline** | expo-sqlite + WatermelonDB | Critical: cleanrooms may have limited connectivity |
| **Auth** | Biometric (expo-local-authentication) + PIN | 21 CFR Part 11 e-signatures |
| **Background Sync** | expo-background-task | Sync batch data when connectivity restored |
| **Haptics** | expo-haptics | Tactile feedback for gloved-hand interactions |

### Monorepo Structure

```
apps/
  web/              -- Next.js admin dashboard, batch review, QMS, reporting
  console/          -- Internal admin console (existing from Astra)
  docs/             -- Product documentation (FumaDocs)
  mobile/           -- Expo iPad app for cleanroom execution
  agno/             -- Python AI backend (Mastra)

packages/
  db/               -- Drizzle schemas: batches, inventory, EM, equipment, users
  auth/             -- Better-Auth config, RBAC (Tech/QA/PIC/VP/Admin roles)
  ui/               -- Shared shadcn/ui components, design tokens
  email/            -- Notification emails (deviation alerts, calibration reminders)
  storage/          -- File uploads (COAs, batch record PDFs, photos)
  shared/           -- Cross-platform types, constants, enums
  utils/            -- BUD calculators, validation helpers, audit trail utilities
```

---

## 7. Core Feature Modules (MVP Scope)

### Module Priority Matrix

| Priority | Module | Primary Users | Interface | Sprint |
|----------|--------|--------------|-----------|--------|
| 🔴 P0 | **Electronic Batch Records** | Technicians, Pharmacists, QA | iPad + Web | Month 1 |
| 🔴 P0 | **21 CFR Part 11 E-Signatures** | All roles | iPad + Web | Month 1 |
| 🔴 P0 | **Auth & RBAC** | IT Admin, all roles | Web + iPad | Month 1 |
| 🟡 P1 | **Inventory & Barcode Scanning** | Warehouse, Technicians | iPad + Web | Month 1–2 |
| 🟡 P1 | **Environmental Monitoring** | Microbiologist, QA | iPad + Web | Month 2 |
| 🟡 P1 | **Deviation & CAPA Management** | QA Manager, PIC | Web | Month 2 |
| 🟢 P2 | **Equipment & Calibration** | Maintenance, QA | iPad + Web | Month 2–3 |
| 🟢 P2 | **Training & Personnel Qualification** | Training Coord, QA | Web | Month 3 |
| 🟢 P2 | **Executive Dashboard & Reporting** | VP, Production Manager | Web | Month 3 |
| 🔵 P3 | **AI Compliance Assistant** | QA, PIC | Web | Month 3+ |
| 🔵 P3 | **Cleaning & Sanitization Logs** | Maintenance | iPad | Month 3+ |
| 🔵 P3 | **Lab Sample Tracking (mini-LIMS)** | QC Technician | Web + iPad | Month 3+ |
| 🔵 P3 | **Marketing Website** | Prospects | Web | Parallel |

---

## 8. Solo Developer Sprint Plan (3 Months)

> **Reality check:** You are the only developer. This plan alternates between web dashboard and iPad app to maintain parallel progress. Website work is done in evening/weekend slots.

### Month 1 (Weeks 1–4): Foundation + Electronic Batch Records

| Week | Day | Focus | Tasks (4–6 hrs) |
|------|-----|-------|-----------------|
| **W1** | Mon | 🏗 Scaffold | Initialize Clarix as new app in Astra monorepo. Create `apps/clarix-web` (Next.js 16), extend `packages/db` with 503B schemas, configure Clarix-specific auth roles in `packages/auth`. |
| W1 | Tue | 🏗 Database | Design core Drizzle schema: `batches`, `batchSteps`, `masterFormulas`, `formulaVersions`, `users`, `roles`, `organizations`, `auditTrail`. Define pgEnums for batch status, step types, signature meanings. |
| W1 | Wed | 🏗 Database | Continue schema: `inventoryItems`, `inventoryTransactions`, `components`, `vendors`, `emSamples`, `emLocations`, `equipment`, `calibrations`. Push to PostgreSQL with `drizzle-kit push`. |
| W1 | Thu | 🔐 Auth | Set up Better-Auth with RBAC roles: `technician`, `pharmacist`, `pic`, `qa_manager`, `qa_specialist`, `qc_tech`, `warehouse`, `maintenance`, `vp`, `admin`. Organization-scoped multi-tenancy. |
| W1 | Fri | 🔐 Auth | Build login page, role-based middleware, 21 CFR Part 11 e-signature component (PIN + confirmation dialog with signer name, timestamp, meaning). Audit trail logging on every mutation. |
| **W2** | Mon | 📋 Batch Records | Master Formula CRUD — create, version, approve formulas. Version control with change reasons. Drizzle queries + server actions. |
| W2 | Tue | 📋 Batch Records | Batch Record generation from master formula. Step-by-step form builder — each batch step becomes a form section with required fields, tolerances, and e-signature requirements. |
| W2 | Wed | 📋 Batch Records | Batch execution UI (web) — guided step-by-step workflow. Forced completion (cannot skip steps). Real-time data capture with timestamps. Auto-save via server actions. |
| W2 | Thu | 📋 Batch Records | Batch execution continued — tolerance validation (e.g., pH 7.0 ± 0.2), out-of-spec blocking, deviation trigger when values are OOS. E-signature capture per critical step. |
| W2 | Fri | 📋 Batch Records | Batch review dashboard for QA — batch queue, review-by-exception (show only flagged steps), final release e-signature by PIC. Batch status lifecycle: Draft → In Progress → Pending Review → Released → Archived. |
| **W3** | Mon | 📱 iPad App | Initialize Expo project in `apps/clarix-mobile`. Configure Expo Router, NativeWind, expo-camera for barcode scanning. Large touch targets for gloved hands. |
| W3 | Tue | 📱 iPad App | iPad batch execution — mirror web batch step UI but optimized for tablet. Step-by-step guided workflow with large buttons, haptic feedback on completion. |
| W3 | Wed | 📱 iPad App | Barcode scanning integration — scan supply barcodes to auto-populate component lot, expiry, quantity into batch step. Wrong-item blocking. |
| W3 | Thu | 📱 iPad App | E-signature on iPad — biometric (FaceID/TouchID) + PIN fallback. 21 CFR Part 11 compliant: signer name, timestamp, meaning displayed. Offline signature queue. |
| W3 | Fri | 🔗 Integration | Connect iPad app to web backend. Real-time batch status sync. TanStack Query for data fetching. Test end-to-end: start batch on iPad → review on web. |
| **W4** | Mon | 📦 Inventory | Inventory module — component CRUD (APIs, excipients, vials, stoppers, labels). Lot tracking, expiry dates, vendor assignment. Status lifecycle: Quarantined → Released → In Use → Depleted. |
| W4 | Tue | 📦 Inventory | Barcode scanning for receiving — warehouse clerk scans incoming shipments on iPad. Auto-creates inventory records. FIFO enforcement. |
| W4 | Wed | 📦 Inventory | Stock alerts — safety stock levels per component, automated reorder alerts, consumption rate projections. Dashboard widget showing inventory health. |
| W4 | Thu | 🌐 Website | Marketing landing page (parallel evening work). Hero section, problem statement, feature overview, comparison table vs competitors. Framer Motion animations. |
| W4 | Fri | 🧪 Testing | Integration testing — Vitest for batch record validation logic, inventory calculations. Fix bugs from Month 1. Week 4 review/demo. |

### Month 2 (Weeks 5–8): EM, Deviations, Equipment + Polish

| Week | Day | Focus | Tasks (4–6 hrs) |
|------|-----|-------|-----------------|
| **W5** | Mon | 🧫 EM Module | Environmental monitoring — EM locations (ISO 5/7/8 rooms), sampling schedules, alert/action limits per location. EM sample CRUD with incubation tracking. |
| W5 | Tue | 🧫 EM Module | EM data entry on iPad — scan room QR code, enter viable/non-viable counts, log surface samples, start incubation timer. |
| W5 | Wed | 🧫 EM Module | EM trending — Recharts trend charts per location over time. Auto-alert when approaching limits. Excursion investigation workflow triggered at action limit breach. |
| W5 | Thu | 🧫 EM Module | EM-to-batch linking — when excursion occurs, auto-identify which batches were in the affected room during the window. Impact assessment form. |
| W5 | Fri | ⚠️ Deviations | Deviation management — deviation CRUD, auto-generation from batch OOS or EM excursion. Root cause categories (as pgEnum). Assignment to investigator. |
| **W6** | Mon | ⚠️ CAPA | CAPA workflow — linked to deviations. Due dates, assigned owner, effectiveness verification step. Dashboard showing open CAPAs by severity and age. |
| W6 | Tue | 🔧 Equipment | Equipment module — equipment registry, calibration schedules, maintenance history. Status lifecycle: Qualified → In Use → Due for Cal → Out of Service. |
| W6 | Wed | 🔧 Equipment | Calibration alerts — automated reminders (email + in-app) when calibration is due. Block equipment from being used in batch records if overdue. |
| W6 | Thu | 📱 iPad Polish | iPad app improvements — offline mode with expo-sqlite, sync queue when connectivity returns. Background sync. Large-format step display optimized for ISO 5 hood mounting. |
| W6 | Fri | 📱 iPad Polish | iPad barcode scanning polish — fast scanning UX, vibration/sound feedback, scan history, support for multiple barcode formats (Code128, GS1, QR). |
| **W7** | Mon | 📊 Dashboards | Executive dashboard — KPI tiles: batches today, batches pending QA, open deviations, EM status, inventory health, training compliance %. Recharts visualizations. |
| W7 | Tue | 📊 Dashboards | Production Manager dashboard — daily batch schedule, technician assignments, real-time batch progress, bottleneck identification. |
| W7 | Wed | 📊 Dashboards | QA dashboard — batch review queue, deviation aging chart, CAPA effectiveness metrics, audit readiness score. |
| W7 | Thu | 🌐 Website | Marketing website continued — case study page, compliance features deep-dive, contact/demo request form, SEO optimization. |
| W7 | Fri | 🧪 Testing | Playwright E2E tests for critical workflows: batch creation → execution → review → release. Cross-browser testing. |
| **W8** | Mon | 📄 Documents | Document management basics — SOP storage, version control, approval workflow. Link SOPs to batch steps and training records. |
| W8 | Tue | 📧 Notifications | Email notifications — deviation alerts, calibration reminders, batch review assignments, EM excursion alerts. Using `@repo/email` package. |
| W8 | Wed | 📧 Notifications | In-app notification center — real-time notifications via database polling or Supabase Realtime. Bell icon with unread count. |
| W8 | Thu | 🔒 Security | Security hardening — audit trail review, data encryption at rest, TLS enforcement, session management, role permission matrix testing. |
| W8 | Fri | 🧪 Review | Month 2 review. Demo all modules. Bug fixes. Prioritize Month 3 based on learnings. |

### Month 3 (Weeks 9–12): Training, AI, Polish + Pilot Prep

| Week | Day | Focus | Tasks (4–6 hrs) |
|------|-----|-------|-----------------|
| **W9** | Mon | 👥 Training | Personnel qualification module — training assignments per role, completion tracking, requalification schedules. Media fill qualification tracking. |
| W9 | Tue | 👥 Training | Training integration — block unqualified personnel from executing controlled batch steps. Dashboard showing qualification status per person. |
| W9 | Wed | 🧹 Cleaning | Cleaning & sanitization logs — room-based cleaning schedules, agent rotation tracking, completion e-signatures, link to EM effectiveness data. |
| W9 | Thu | 🧪 Lab Tracking | Mini-LIMS — sample tracking from batch to lab shipment (Eagle Analytical). Status: Sampled → Shipped → In Testing → Results Received → Pass/Fail. |
| W9 | Fri | 🧪 Lab Tracking | Lab results integration — manual COA upload with pass/fail entry. Link results to batch record. Block batch release until all testing passes. |
| **W10** | Mon | 🤖 AI | AI compliance assistant — use Vercel AI SDK + Mastra to build deviation report drafter. Input: deviation data → Output: formatted investigation report draft. |
| W10 | Tue | 🤖 AI | AI inventory forecasting — consumption trend analysis, predict shortfall dates, suggest reorder quantities. Display as chart + alerts. |
| W10 | Wed | 🤖 AI | AI compliance gap scanner — analyze batch records for missing fields, unsigned steps, late entries. Generate "audit readiness" score. |
| W10 | Thu | 📱 iPad Final | iPad app final polish — animation refinements, error states, empty states, loading skeletons. Offline resilience testing in airplane mode. |
| W10 | Fri | 🌐 Website | Marketing website final — testimonial section (placeholder for pilot), pricing page, blog section for compliance content, deploy to Vercel. |
| **W11** | Mon | 📋 Audit Packet | Audit packet generator — one-click export of complete batch records + EM data + deviations + CAPAs + training records for a date range. PDF generation. |
| W11 | Tue | 📋 BUD | BUD calculator — auto-calculate Beyond Use Date based on product category + USP <797> rules + preparation conditions. Integrate into batch record. |
| W11 | Wed | 🏭 Multi-tenant | Multi-facility support — organization-scoped data isolation. Each facility sees only their data. Admin can manage multiple facilities. |
| W11 | Thu | 🧪 E2E Testing | Full E2E testing — complete batch lifecycle, EM workflow, deviation-to-CAPA flow, inventory receiving, equipment calibration. Fix all blockers. |
| W11 | Fri | 🧪 E2E Testing | iPad E2E testing on physical device. Test with cleanroom-style enclosure. Verify barcode scanning, offline mode, gloved-hand usability. |
| **W12** | Mon | 📦 Pilot Prep | Pilot onboarding flow — facility setup wizard, bulk user creation, initial inventory import (CSV), master formula import. |
| W12 | Tue | 📦 Pilot Prep | Demo environment — seed database with realistic batch records, EM data, inventory. Create demo account for prospects. |
| W12 | Wed | 📖 Documentation | User documentation in `apps/docs` — getting started guide, role-specific guides (Technician guide, QA guide, Admin guide). |
| W12 | Thu | 📖 Documentation | API documentation, system architecture diagram, validation documentation outline for 21 CFR Part 11 compliance. |
| W12 | Fri | 🚀 Launch Prep | Final review. Tag v0.1.0. Prepare pilot pitch deck. Identify first 3–5 facility targets for pilot outreach. |

---

## 9. Database Schema Overview

Key tables (Drizzle `pgTable` definitions in `packages/db/src/schema/`):

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `organizations` | Multi-tenant facility isolation | id, name, fdaRegistrationNumber, address |
| `users` | All personnel | id, orgId, name, email, role, qualificationStatus |
| `masterFormulas` | Versioned compounding formulas | id, orgId, productName, version, status, approvedBy |
| `formulaSteps` | Steps within a formula | id, formulaId, stepNumber, instruction, tolerances, requiresSignature |
| `batches` | Active/completed batch records | id, orgId, formulaId, batchNumber, status, startedAt, releasedAt |
| `batchStepRecords` | Execution data per step | id, batchId, stepId, enteredValue, withinTolerance, signedBy, signedAt |
| `inventoryItems` | Component/supply master | id, orgId, name, category, barcode, safetyStockLevel |
| `inventoryLots` | Specific lots received | id, itemId, lotNumber, expiryDate, quantity, status, vendorId |
| `emLocations` | Cleanroom sampling points | id, orgId, roomName, isoClass, alertLimit, actionLimit |
| `emSamples` | EM sampling results | id, locationId, sampleDate, viableCount, nonViableCount, status |
| `deviations` | Quality deviations | id, orgId, sourceType, sourceBatchId, description, rootCause, status |
| `capas` | Corrective/preventive actions | id, deviationId, action, assignedTo, dueDate, effectivenessVerified |
| `equipment` | Equipment registry | id, orgId, name, type, calibrationDueDate, status |
| `cleaningLogs` | Room cleaning records | id, roomId, cleanedBy, agent, completedAt, signedBy |
| `trainingRecords` | Personnel training | id, userId, sopId, completedAt, expiresAt, qualificationType |
| `auditTrail` | Immutable audit log | id, orgId, userId, action, tableName, recordId, oldValue, newValue, timestamp |

---

## 10. Success Metrics (End of Month 3)

| Metric | Target |
|--------|--------|
| Core modules built | Batch Records, E-Signatures, Inventory, EM, Deviations, CAPA, Equipment, Training |
| iPad app | Batch execution, barcode scanning, e-signatures, offline mode — all working |
| Web dashboard | QA review, executive KPIs, EM trending, deviation management — all working |
| Marketing website | Live on Vercel with lead capture form |
| 21 CFR Part 11 | E-signatures, audit trail, access controls — all implemented |
| AI features | Deviation report drafter, inventory forecasting, compliance gap scanner |
| Pilot readiness | Demo environment seeded, onboarding wizard built, documentation written |
| Facility targets | 3–5 503B facilities identified for pilot outreach |
| Test coverage | Critical paths covered by Vitest unit tests + Playwright E2E |

---

## 11. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Solo developer burnout | Strict 4–6 hr/day schedule. Ship in small increments. Use AI coding assistants aggressively. |
| iPad offline complexity | Start with online-first, add offline incrementally. expo-sqlite for critical batch data only. |
| 21 CFR Part 11 validation burden | Document validation approach early. Use audit trail + e-signature patterns consistently. Consult regulatory advisor before pilot. |
| PK Software integration | Start with manual formula entry. Build CSV import. True API integration is Phase 2 (post-pilot). |
| Small TAM (93 facilities) | Each facility is worth $8K–$20K/yr. Even 10% penetration = $75K–$185K ARR. Expand to 503A and international compounders in Phase 2. |
| Competitor response | Seal and MasterControl serve enterprise. Our advantage is speed, affordability, and 503B-specific UX. Move fast. |

---

*Document generated: March 28, 2026*
*Author: Nithin (Solo Developer / Product Lead)*
*Project: Clarix — 503B Digital Batch Record Platform*
