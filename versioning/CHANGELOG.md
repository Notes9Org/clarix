# Clarix — Changelog

> All notable changes to the Clarix 503B platform are documented here.
> Format follows [Keep a Changelog](https://keepachangelog.com/).
> Versioning follows [Semantic Versioning](https://semver.org/).

---

## [0.0.1] — 2026-04-02

### 🏷️ Codename: **Genesis**

> First scaffold — monorepo initialized, database schemas designed, all platforms running Hello World simultaneously.

### Summary

Built the entire Clarix platform foundation from scratch in a single session. Established a parallel development strategy where Web (Next.js), iOS (iPad/iPhone via Expo), and Android (Expo) all run concurrently from day one. No platform is left behind.

---

### Added

#### Infrastructure
- **Turborepo monorepo** with 7 workspace packages: `@clarix/web`, `@clarix/mobile`, `@clarix/db`, `@clarix/auth`, `@clarix/ui`, `@clarix/utils`, `@clarix/shared`
- **Bun 1.2.19** as package manager and runtime
- **Supabase** configuration (`supabase/config.toml`)
- **Environment validation** via `envin` + Zod (`packages/db/env.config.ts`)
- **Git repository** pushed to `https://github.com/Notes9Org/clarix`
- **Versioning manual** (`versioning/VERSIONING.md`) with parallel development rules

#### Database (`@clarix/db`) — 31 Tables, 33 Enums
- **Auth domain**: `organizations`, `users`, `session`, `account`, `verification`
- **Formula domain**: `masterFormulas`, `formulaSteps`, `formulaComponents`
- **Batch domain**: `batches`, `batchStepRecords`, `batchComponentsUsed`, `eSignatures`
- **Inventory domain**: `vendors`, `inventoryItems`, `inventoryLots`, `inventoryTransactions`
- **Environment domain**: `rooms`, `emLocations`, `emSamples`, `emExcursions`
- **Quality domain**: `deviations`, `capas`
- **Equipment domain**: `equipment`, `calibrationRecords`, `cleaningLogs`
- **Compliance domain**: `trainingRecords`, `labSamples`, `documents`, `auditTrail`, `notifications`
- **Import domain**: `importLogs`
- **Shared columns**: `idFields`, `orgFields`, `auditAtFields`, `softDeleteFields`, `baseFields`
- **Drizzle config**: `drizzle.config.ts` with snake_case casing
- **Seed script**: Demo facility, admin user, 5 cleanrooms, 3 equipment items
- **Migration script**: `packages/db/scripts/migrate.ts`

#### Auth (`@clarix/auth`)
- **15-role RBAC hierarchy**: admin → pharmacist_in_charge → pharmacist → production_manager → qa_manager → qa_specialist → compounding_supervisor → procurement_manager → training_coordinator → executive → compounding_technician → qc_technician → warehouse_clerk → maintenance_technician → read_only
- **4-tier permission model**: Tier 0 (admin) → Tier 4 (read_only)
- Roles and tiers exported as TypeScript constants

#### Web App (`@clarix/web`)
- **Next.js 16.2.1** with Turbopack
- App Router scaffold: `layout.tsx`, `page.tsx`, `globals.css`
- PostCSS + Tailwind CSS v4 configured
- Dark theme (`#09090b` background, `#fafafa` foreground)
- Running on `http://localhost:3000`

#### Mobile App (`@clarix/mobile`)
- **Expo SDK 55** with Expo Router
- Stack navigator with dark theme
- Platform-aware Hello World (shows iOS/Android/Web)
- Landscape orientation (iPad cleanroom use)
- Running simultaneously on:
  - 📱 iPhone 16e Simulator
  - 📱 iPad Pro 13-inch (M5) Simulator
  - 🤖 Android Medium Phone API 36 Emulator
  - 🌐 Expo Web at `http://localhost:8081`

#### Shared Packages
- `@clarix/ui`: `cn()` utility (clsx + tailwind-merge)
- `@clarix/shared`: App name, description, environment constants
- `@clarix/utils`: `calculateBUD()`, `formatBatchNumber()`, `isWithinTolerance()`

#### Documentation
- **Sprint plan** (424 lines): 3-month roadmap with daily tasks
- **Database schema docs**: Full table reference
- **Design system**: Grayscale-first, Lucide icons, 56px touch targets
- **RBAC & screens mapping**: Role-to-screen access matrix
- **15 role definition docs**: Detailed responsibilities, workflows, permissions per role

### Platforms Verified

| Platform | Device | Status |
|----------|--------|--------|
| Web | Browser (localhost:3000) | ✅ Hello World |
| iOS | iPhone 16e Simulator | ✅ Hello World |
| iOS | iPad Pro 13-inch (M5) Simulator | ✅ Hello World |
| Android | Medium Phone API 36 Emulator | ✅ Hello World |
| Expo Web | Browser (localhost:8081) | ✅ Hello World |

---

### Not Yet Started (Planned for v0.0.2+)

- [ ] Better-Auth server/client wiring
- [ ] Login page & authentication flow
- [ ] shadcn/ui component initialization
- [ ] Database migration push to Supabase
- [ ] Drizzle relations definitions
- [ ] Server actions for batch CRUD
- [ ] Any functional UI beyond Hello World

---

*Released by: fillsai (ceo@fills.ai)*
*Commit: TBD (will be tagged after push)*

<!-- 
TEMPLATE FOR FUTURE VERSIONS:

## [0.0.X] — YYYY-MM-DD

### 🏷️ Codename: **Name**

### Added
- 

### Changed
-

### Fixed
-

### Removed
-

### Platforms Verified
| Platform | Device | Status |
|----------|--------|--------|

-->
