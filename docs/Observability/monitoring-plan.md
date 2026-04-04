# Clarix Observability Plan — Logs, Traces, Metrics 🔭

> **Goal:** One unified dashboard to see every error, slow query, failed batch step, and crashed iPad screen — across web + mobile — before a customer reports it.

---

## 🧠 TL;DR — The Stack

| Layer | Tool | Why |
|-------|------|-----|
| 🔴 **Errors + Crashes** | **Sentry** (`@sentry/nextjs` + `@sentry/react-native`) | One dashboard for web + iPad. Stack traces, breadcrumbs, session replay. Free tier = 5K events/mo. |
| 🔵 **Traces (Request Lifecycle)** | **OpenTelemetry** via `@vercel/otel` | See "Login → API → DB → Response" as one timeline. Industry standard. Vendor-agnostic. |
| 🟢 **Structured Logs** | **Pino** (in `@clarix/shared`) | Fast JSON logs with `trace_id` correlation. 10x faster than Winston. |
| 🟡 **DB Query Monitoring** | `@opentelemetry/instrumentation-pg` + Drizzle logger | See every SQL query as a span. Catch N+1 queries, slow joins. |
| 📊 **Metrics Dashboard** | **Sentry Performance** (start) → **Grafana** (later) | Web vitals, API latency, batch execution duration. |
| 🏥 **Uptime Monitoring** | **Better Stack** (free tier) | "Is Clarix up?" checks every 3 min. Status page for clients. |
| 📋 **FDA Audit Trail** | Your existing `audit_trail` table (INSERT-only) | NOT observability — this is regulatory compliance. Keep separate. |

> 💡 **This is exactly what Astra uses** — `@vercel/otel` for traces, Sentry for errors, Pino for structured logging. We're following the same pattern but tailored for Clarix's FDA-regulated domain.

---

## 📦 Packages to Install

### New Shared Package: `@clarix/observability`

Create a new package at `packages/observability/` that all apps import from.

```
packages/observability/
├── src/
│   ├── index.ts          # Re-exports
│   ├── logger.ts         # Pino logger with trace correlation
│   ├── sentry.ts         # Sentry init helpers
│   └── constants.ts      # Log levels, service names
├── package.json
└── tsconfig.json
```

### Per-App Dependencies

| Package | App | Purpose | Install |
|---------|-----|---------|---------|
| `@vercel/otel` | `@clarix/web` | OTel traces for Next.js | `bun add @vercel/otel` |
| `@sentry/nextjs` | `@clarix/web` | Error tracking + performance | `bun add @sentry/nextjs` |
| `@sentry/react-native` | `@clarix/mobile` | iPad crash + error tracking | `bun add @sentry/react-native` |
| `pino` | `@clarix/observability` | Structured JSON logger | `bun add pino` |
| `pino-pretty` | `@clarix/observability` (dev) | Human-readable dev logs | `bun add -D pino-pretty` |
| `@opentelemetry/instrumentation-pg` | `@clarix/db` | Auto-trace all Postgres queries | `bun add @opentelemetry/instrumentation-pg` |
| `@opentelemetry/api` | `@clarix/observability` | Manual span creation | `bun add @opentelemetry/api` |

---

## 🏗️ Architecture — How It All Fits

```
┌───────────────────────────────────────────────────────────────────┐
│                        CLARIX APPS                                │
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│  │  @clarix/web │    │ @clarix/mobile│    │  @clarix/db  │        │
│  │  (Next.js)   │    │  (Expo iPad) │    │  (Drizzle)   │        │
│  │              │    │              │    │              │        │
│  │  @vercel/otel│    │ @sentry/rn   │    │  pg instrumt.│        │
│  │  @sentry/next│    │              │    │              │        │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘        │
│         │                   │                    │                │
│         └─────────┬─────────┘                    │                │
│                   │                              │                │
│         ┌─────────▼──────────────────────────────▼───────┐       │
│         │           @clarix/observability                 │       │
│         │                                                │       │
│         │  📝 Pino Logger  (structured JSON logs)        │       │
│         │  🔗 Trace Context (inject trace_id in logs)    │       │
│         │  📊 Custom Spans  (batch_execute, esign, etc.) │       │
│         └──────────┬─────────────────────────────────────┘       │
│                    │                                              │
└────────────────────┼──────────────────────────────────────────────┘
                     │
        ┌────────────▼────────────────┐
        │     EXTERNAL SERVICES       │
        │                             │
        │  🔴 Sentry (errors+perf)   │
        │  🔵 OTLP Collector (traces)│
        │  🏥 Better Stack (uptime)  │
        └─────────────────────────────┘
```

---

## 🎯 What We're Monitoring (Clarix-Specific)

### Layer 1: 🔴 Errors & Crashes (Sentry)

Things that break. Users see something wrong.

| What | Where | Example |
|------|-------|---------|
| Unhandled exceptions | Web + Mobile | `TypeError: Cannot read properties of null` |
| API route failures | Web server | `POST /api/batches/create → 500` |
| React error boundaries | Web + Mobile | Component crash on `/batches/[id]` |
| iPad app crashes | Mobile | App killed by iOS due to memory |
| Auth failures | Web server | `Better-Auth: Invalid session token` |
| Failed e-signatures | Either | PIN verification timeout, biometric rejection |

**Sentry gives you for each error:**
- 📸 Stack trace with source maps
- 🍞 Breadcrumbs (what the user clicked before the crash)
- 🔄 Session Replay (video of what happened — web only)
- 📱 Device info (iPad model, iOS version, orientation)
- 👤 User context (who experienced it, which org)

---

### Layer 2: 🔵 Traces (OpenTelemetry)

See the full lifecycle of a request across services.

| Trace Scenario | Spans Created | What You See |
|---------------|---------------|-------------|
| **Batch step execution** | `POST /api/batch-steps` → `middleware.auth` → `db.select(batch)` → `db.insert(step_record)` → `db.insert(e_signature)` → `response` | Full 350ms breakdown: auth=12ms, batch lookup=45ms, step insert=22ms, esign=180ms |
| **Login flow** | `POST /api/auth/sign-in` → `better-auth.verify` → `db.select(user)` → `db.select(membership)` → `session.create` → `response` | See if login is slow due to password hashing (expected) or DB (problem) |
| **Inventory receiving** | `POST /api/inventory/receive` → `db.insert(lot)` → `db.insert(transaction)` → `notification.send` → `response` | Catch if notification service is slowing down receiving |
| **Formula approval** | `POST /api/formulas/approve` → `db.update(formula)` → `db.insert(e_signature)` → `db.insert(audit_trail)` → `response` | Confirm audit trail write isn't blocking the response |

**What a trace looks like:**

```
[Trace: Batch Step Execute — 347ms]
├── middleware.auth ─────────── 12ms ██
├── db.select(batch) ────────── 45ms ████
├── validate.permissions ───── 3ms █
├── db.insert(step_record) ── 22ms ██
├── db.insert(e_signature) ── 180ms ████████████████  ← SLOW! investigate
├── db.insert(audit_trail) ── 8ms █
└── response ──────────────── 2ms █
```

---

### Layer 3: 🟢 Structured Logs (Pino)

Machine-readable JSON logs with context.

| Log Level | When | Example |
|-----------|------|---------|
| `error` | Something broke | `{ level: "error", msg: "E-signature PIN mismatch", userId: "u1", batchId: "b47", attempts: 3 }` |
| `warn` | Something unusual | `{ level: "warn", msg: "Lot nearing expiry", lotId: "l23", daysLeft: 7, orgId: "org1" }` |
| `info` | Business events | `{ level: "info", msg: "Batch released", batchId: "b47", releasedBy: "u5", orgId: "org1" }` |
| `debug` | Dev troubleshooting | `{ level: "debug", msg: "RBAC check", role: "technician", resource: "batch", action: "read" }` |

**Why Pino not console.log?**

| `console.log` 🚫 | Pino ✅ |
|-------------------|---------|
| `"batch released"` | `{"level":30,"time":1711990800,"msg":"batch released","batchId":"b47","orgId":"org1","userId":"u5","traceId":"abc123"}` |
| No structure | Structured JSON — searchable, filterable |
| No trace correlation | Auto-injects `traceId` from OpenTelemetry |
| No level filtering | Only show `warn`+ in production |
| Slow (blocks event loop) | Async, non-blocking, 10x faster |

---

### Layer 4: 🟡 Database Monitoring

| What | How | Catches |
|------|-----|---------|
| Query duration | `@opentelemetry/instrumentation-pg` auto-spans | Queries > 100ms flagged |
| N+1 queries | Trace view shows repeated same-table queries | `SELECT * FROM batch_step_record` called 12x in a loop |
| Connection pool exhaustion | Postgres metrics | Pool at 90% → alert before it maxes out |
| Slow migrations | Drizzle logger + OTel | Migration taking > 30s → investigate locks |

---

### Layer 5: 📊 Key Metrics to Track

| Metric | Source | Alert Threshold | Why It Matters |
|--------|--------|----------------|----------------|
| **API response time (p95)** | OTel traces | > 500ms | Users stare at loading spinner |
| **Error rate** | Sentry | > 1% of requests | Something is broken |
| **Batch execution time** | Custom span | > 2h for single batch | Technician is stuck or system is slow |
| **E-signature success rate** | Custom metric | < 95% | PIN/biometric issues — technicians can't work |
| **DB query p95** | pg instrumentation | > 200ms | Database needs index or optimization |
| **iPad crash-free rate** | Sentry RN | < 99% | App stability issues for cleanroom iPads |
| **Uptime** | Better Stack | < 99.9% | SLA breach for pharmacy clients |
| **Audit trail write latency** | Custom span | > 50ms | 21 CFR Part 11 compliance — trail must be instant |
| **Active sessions per org** | Custom metric | > 50 concurrent | Capacity planning |
| **Login failure rate** | Sentry + logs | > 5% | Possible brute force or credential issues |

---

## 🛠️ Implementation — File by File

### Step 1: Create `packages/observability/`

```
packages/observability/
├── src/
│   ├── index.ts
│   ├── logger.ts
│   └── constants.ts
├── package.json
└── tsconfig.json
```

**`logger.ts` — The Pino Logger:**

```typescript
import pino from "pino";
import { trace, context } from "@opentelemetry/api";

// Inject trace context into every log line
const mixin = () => {
  const span = trace.getSpan(context.active());
  if (!span) return {};
  const { traceId, spanId } = span.spanContext();
  return { traceId, spanId };
};

export const logger = pino({
  name: "clarix",
  level: process.env.LOG_LEVEL || "info",
  mixin,
  formatters: {
    level: (label) => ({ level: label }),  // "info" not 30
  },
  // Pretty print in dev, JSON in prod
  transport: process.env.NODE_ENV === "development"
    ? { target: "pino-pretty", options: { colorize: true } }
    : undefined,
});

// Convenience: child loggers per domain
export const batchLogger = logger.child({ domain: "batch" });
export const authLogger = logger.child({ domain: "auth" });
export const inventoryLogger = logger.child({ domain: "inventory" });
export const emLogger = logger.child({ domain: "environmental" });
export const qualityLogger = logger.child({ domain: "quality" });
```

**What dev logs look like:**

```
[15:04:12] INFO (clarix/batch): Batch step completed
    batchId: "PH-2026-0847"
    stepNumber: 3
    performedBy: "sarah@pharma.com"
    traceId: "abc123def456"
    duration: 347
```

**What prod logs look like (JSON → shipped to log backend):**

```json
{"level":"info","time":1711990800,"domain":"batch","msg":"Batch step completed","batchId":"PH-2026-0847","stepNumber":3,"performedBy":"sarah@pharma.com","traceId":"abc123def456","duration":347}
```

---

### Step 2: Web App — `instrumentation.ts`

```typescript
// apps/web/instrumentation.ts  (Next.js auto-loads this)
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel("clarix-web");
}
```

That's it. One line. Astra does the exact same thing.

---

### Step 3: Web App — Sentry Init

```typescript
// apps/web/sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,  // 10% of requests traced (saves quota)
  replaysOnErrorSampleRate: 1.0,  // Always replay on error
  replaysSessionSampleRate: 0.01, // 1% random replays
  integrations: [
    Sentry.replayIntegration(),
  ],
  beforeSend(event) {
    // Don't send dev errors
    if (process.env.NODE_ENV === "development") return null;
    return event;
  },
});
```

---

### Step 4: Mobile App — Sentry Init

```typescript
// apps/mobile/app/_layout.tsx
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.2,  // Higher rate for mobile — fewer requests
  enableAutoPerformanceTracing: true,
  enableNativeFramesTracking: true,
});

// Wrap root layout
export default Sentry.wrap(RootLayout);
```

---

### Step 5: Custom Spans for Clarix Business Logic

```typescript
// Example: batch step execution with custom tracing
import { trace } from "@opentelemetry/api";
import { batchLogger } from "@clarix/observability";

const tracer = trace.getTracer("clarix-batch");

async function executeBatchStep(batchId: string, stepNumber: number, userId: string) {
  return tracer.startActiveSpan("batch.step.execute", async (span) => {
    span.setAttributes({
      "batch.id": batchId,
      "batch.step": stepNumber,
      "user.id": userId,
    });

    try {
      // Your existing batch step logic
      const result = await db.insert(batchStepRecords).values({ ... });

      batchLogger.info({ batchId, stepNumber, userId }, "Batch step completed");
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      batchLogger.error({ batchId, stepNumber, error }, "Batch step failed");
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      Sentry.captureException(error, { extra: { batchId, stepNumber } });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

---

## ⚠️ Observability ≠ FDA Audit Trail

This is critical. Do NOT conflate these two systems:

| | 🔭 Observability (This Plan) | 📋 FDA Audit Trail (Existing) |
|--|------|------|
| **Purpose** | Debug issues, monitor performance | Legal compliance, FDA inspections |
| **Table** | NOT in your DB — external services | `audit_trail` table (INSERT-only) |
| **Retention** | 30 days (Sentry free) / 7 days logs | **Years** (per FDA requirement) |
| **Mutable?** | Yes — can purge old logs | **NEVER** — immutable records |
| **Who reads it** | You (the developer) | FDA auditors, QA managers |
| **Contains** | Stack traces, latency, spans | Who changed what, old/new values, reason |
| **Example** | `db.select took 450ms on batch_step_record` | `Sarah updated batch #847 step 3 value from 9.98 to 10.04 at 2026-04-04T15:00:00Z, meaning: "performed_by"` |

> 💡 Your `audit_trail` and `e_signatures` tables are already 21 CFR Part 11 compliant by design (INSERT-only, user-attributed, timestamped). Observability is a SEPARATE operational concern.

---

## 💰 Cost Analysis — What This Costs You

| Service | Free Tier | What You Get Free | When to Pay |
|---------|:---------:|-------------------|-------------|
| **Sentry** | ✅ | 5K events/mo, 1 user, 30-day retention | > 5K errors OR need team access ($26/mo) |
| **@vercel/otel** | ✅ | Package is free and open-source | Never — it's a library |
| **Pino** | ✅ | Library is free and open-source | Never — it's a library |
| **Better Stack** | ✅ | 10 monitors, 1GB logs/mo, 1 status page | > 10 monitors or need longer retention |
| **OTel instrumentation** | ✅ | All `@opentelemetry/*` packages are free | Never — all open-source |

**Total cost to start: $0/month** 🎉

---

## 📅 Rollout Plan

| Phase | What | Effort | When |
|:-----:|------|:------:|------|
| **1** | Create `@clarix/observability` package with Pino logger | 2h | Sprint 1 |
| **1** | Add `instrumentation.ts` with `@vercel/otel` to web app | 15min | Sprint 1 |
| **1** | Replace all `console.log` with `logger.info/warn/error` in existing code | 2h | Sprint 1 |
| **2** | Setup Sentry project + install `@sentry/nextjs` | 1h | Sprint 2 |
| **2** | Add `@opentelemetry/instrumentation-pg` to `@clarix/db` | 30min | Sprint 2 |
| **3** | Install `@sentry/react-native` in mobile app | 1h | Sprint 3 |
| **3** | Add custom spans for batch execution, e-signatures, formula approval | 3h | Sprint 3 |
| **4** | Setup Better Stack uptime monitors (web, Supabase, auth) | 30min | Sprint 4 |
| **4** | Build Sentry alerts → Slack/Discord notifications | 1h | Sprint 4 |
| **5** | Create Clarix-specific Sentry dashboards (batch errors, auth failures, iPad crashes) | 2h | Sprint 5 |

---

## 🗂️ Folder Structure After Implementation

```
clarix/
├── packages/
│   ├── observability/          ← NEW
│   │   ├── src/
│   │   │   ├── index.ts        # Re-exports logger, spans, Sentry helpers
│   │   │   ├── logger.ts       # Pino + OTel trace correlation
│   │   │   ├── sentry.ts       # Sentry init config shared between apps
│   │   │   ├── spans.ts        # Custom span helpers for Clarix business ops
│   │   │   └── constants.ts    # Service names, log levels
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── db/                     ← MODIFY: add pg instrumentation
│   ├── auth/                   ← MODIFY: add auth logging
│   └── shared/
├── apps/
│   ├── web/
│   │   ├── instrumentation.ts  ← NEW (1 line — registerOTel)
│   │   ├── sentry.client.config.ts  ← NEW
│   │   ├── sentry.server.config.ts  ← NEW
│   │   └── sentry.edge.config.ts    ← NEW
│   └── mobile/
│       └── app/_layout.tsx     ← MODIFY: wrap with Sentry.wrap()
└── .env
    ├── NEXT_PUBLIC_SENTRY_DSN=...
    ├── SENTRY_AUTH_TOKEN=...
    ├── EXPO_PUBLIC_SENTRY_DSN=...
    └── LOG_LEVEL=info
```

---

## ✅ Summary — 3 Things to Remember

| # | Rule | Detail |
|---|------|--------|
| 1️⃣ | **Sentry for "what broke"** | Errors, crashes, stack traces. One dashboard for web + iPad. |
| 2️⃣ | **OpenTelemetry for "why it's slow"** | Distributed traces showing request → DB → response timeline. |
| 3️⃣ | **Pino for "what happened"** | Structured logs with trace IDs so you can jump from log → trace → error. |

All three work together. A Sentry error shows a `traceId` → you search that in your logs → you see the full OTel trace → you find the slow DB query that caused the timeout that caused the error. **One investigation flow, three tools.**

---

*Generated: April 4, 2026 — Clarix 503B Observability Plan v1*
*Reference: Astra monorepo (`@vercel/otel` + Sentry + PinoLogger pattern)*
