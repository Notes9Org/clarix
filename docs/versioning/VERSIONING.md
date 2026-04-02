# Clarix — Versioning Manual

> **503B Digital Batch Record & Facility Management Platform**
> Parallel Development Strategy — Version Control Rules & Regulations

---

## 1. Versioning Scheme

Clarix follows **Semantic Versioning (SemVer)** with a parallel development modifier:

```
MAJOR.MINOR.PATCH-platform
```

| Segment   | Meaning                                                | Example        |
|-----------|--------------------------------------------------------|----------------|
| `MAJOR`   | Breaking changes, regulatory-impacting schema changes  | `1.0.0`        |
| `MINOR`   | New feature module (batch records, EM, inventory, etc) | `0.1.0`        |
| `PATCH`   | Bug fixes, UI polish, non-breaking improvements        | `0.0.1`        |
| Platform  | Optional suffix when a release targets a specific app  | `0.1.0-web`    |

### Pre-1.0 Rules

- All versions below `1.0.0` are **pre-release / MVP development**
- Breaking schema changes are allowed without major version bump
- `1.0.0` is reserved for **first pilot-ready release**

---

## 2. Parallel Development Strategy

Clarix develops **three platforms simultaneously** from Day 1:

```
┌─────────────────────────────────────────────────────┐
│                  Shared Packages                     │
│  @clarix/db  @clarix/auth  @clarix/ui  @clarix/utils │
│  @clarix/shared                                      │
└──────────┬──────────────┬──────────────┬────────────┘
           │              │              │
      ┌────▼────┐   ┌─────▼─────┐  ┌────▼────┐
      │  Web    │   │   iPad    │  │ Android │
      │ Next.js │   │   Expo    │  │  Expo   │
      │ :3000   │   │ Simulator │  │ Emulator│
      └─────────┘   └───────────┘  └─────────┘
```

### 2.1 Core Rules

1. **Schema-first development** — Database schemas are designed and finalized before any UI work begins for a module.
2. **Package-driven architecture** — All business logic lives in shared `packages/`. Apps are thin UI shells.
3. **Single source of truth** — Types, enums, and validation schemas are defined once in `@clarix/db` and shared across all platforms.
4. **Version parity** — All platforms must reach feature parity within the same minor version. No platform ships ahead.
5. **Trunk-based development** — All work happens on `main`. Feature branches are short-lived (< 2 days).

### 2.2 Commit Conventions

All commits follow **Conventional Commits**:

```
<type>(<scope>): <description>

Types:    feat | fix | refactor | docs | chore | test | ci
Scopes:   db | auth | web | mobile | ui | utils | shared | infra
```

**Examples:**
```
feat(db): add batch_step_records schema with tolerance validation
feat(web): implement batch review dashboard for QA role
feat(mobile): add barcode scanning for supply verification
fix(auth): correct RBAC tier mapping for qa_specialist
refactor(ui): extract e-signature dialog to shared component
docs(versioning): update changelog for v0.0.2
```

### 2.3 Release Process

1. All tests pass (`bun run typecheck && bun run test`)
2. Both `web` and `mobile` apps build without errors
3. Version bumped in root `package.json`
4. Entry added to `CHANGELOG.md` (below)
5. Git tag created: `git tag v0.X.Y`
6. Push to `origin main` with tags

### 2.4 Platform-Specific Rules

| Rule | Web (`apps/web`) | Mobile (`apps/mobile`) |
|------|-----------------|----------------------|
| Framework | Next.js 16 (App Router) | Expo SDK 55 + Expo Router |
| Styling | Tailwind CSS v4 | React Native StyleSheet (NativeWind later) |
| State | Zustand + nuqs (URL state) | Zustand |
| Data fetching | Server Actions + TanStack Query | TanStack Query |
| Auth | Better-Auth (server) | Better-Auth (client) + biometric |
| Offline | Not required | Required (expo-sqlite) |
| Min target | Modern browsers | iPad (iOS 17+), Android 14+ |

### 2.5 Database Migration Rules

- **Never** modify a migration file after it has been committed
- All schema changes go through `drizzle-kit generate` → review → `drizzle-kit migrate`
- Breaking changes require a migration plan documented in `versioning/migrations/`
- Audit trail table (`audit_trail`) is **INSERT-only** — never update or delete

### 2.6 Regulatory Versioning (21 CFR Part 11)

Since Clarix handles FDA-regulated data:

- Every version change must be traceable in the audit trail
- Schema changes affecting batch records require QA sign-off (post-pilot)
- E-signature logic changes require validation documentation
- All versions must be reproducible from git history

---

## 3. Technology Versions (Locked)

| Dependency | Version | Lock Reason |
|-----------|---------|-------------|
| Bun | 1.2.19 | Package manager / runtime |
| Turborepo | 2.8.20 | Monorepo orchestration |
| Next.js | 16.2.1 | Web framework |
| React | 19.2.4 (web) / 19.2.0 (mobile) | UI library |
| Expo SDK | 55 | Mobile framework |
| React Native | 0.83.4 | Mobile runtime |
| Drizzle ORM | 0.45.1 | Database ORM |
| TypeScript | 6.0.2 (web) / 5.9.2 (mobile) | Type safety |
| PostgreSQL | 17 (via Supabase) | Database |
| Tailwind CSS | 4.2.2 | Web styling |

---

## 4. File Structure

```
versioning/
├── VERSIONING.md        ← This file — rules & regulations
├── CHANGELOG.md         ← Chronological release log
└── migrations/          ← Breaking change migration guides (future)
```

---

*Document created: April 2, 2026*
*Maintainer: fillsai (ceo@fills.ai)*
*Repository: https://github.com/Notes9Org/clarix*
