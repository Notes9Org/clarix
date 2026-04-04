# Observability — Explained Simply 🔭

---

## 🧠 What is Observability?

> **Observability = "Can I figure out what's going wrong inside my app WITHOUT adding a `console.log` and redeploying?"**

It's like having X-ray vision into your running application. Three pillars:

| Pillar | Analogy | Answers |
|--------|---------|---------|
| 📝 **Logs** | A diary | "What happened?" |
| 🔗 **Traces** | A GPS route | "Where did the request go and how long did each stop take?" |
| 📊 **Metrics** | A dashboard gauge | "How is the system doing overall right now?" |

---

## 📝 Pillar 1: Logs — "What Happened?"

A log is a timestamped message your app writes when something happens.

### `console.log` vs Pino — Why It Matters

**❌ What you do today:**

```typescript
console.log("batch created");
console.log("error!", error);
console.log("user logged in", userId);
```

**Problems:**
- No structure — can't search "show me all batch errors for org1"
- No timestamps in a standard format
- No severity levels — is it info? error? critical?
- Disappears when the server restarts
- Blocks the main thread (slow)

**✅ What Pino gives you:**

```typescript
import { logger } from "@clarix/observability";

logger.info({ batchId: "PH-2026-0847", orgId: "org1" }, "Batch created");
logger.error({ error, userId: "u2" }, "Login failed");
logger.warn({ lotId: "L-45", daysLeft: 3 }, "Lot expiring soon");
```

**Output (dev — pretty printed):**

```
[16:41:00] INFO  (clarix): Batch created
    batchId: "PH-2026-0847"
    orgId: "org1"
    traceId: "abc123"

[16:41:01] ERROR (clarix): Login failed
    userId: "u2"
    error: "Invalid credentials"
    traceId: "def456"

[16:41:02] WARN  (clarix): Lot expiring soon
    lotId: "L-45"
    daysLeft: 3
```

**Output (production — JSON, shipped to log service):**

```json
{"level":"info","time":1711990800,"msg":"Batch created","batchId":"PH-2026-0847","orgId":"org1","traceId":"abc123"}
```

### Log Levels — When to Use What

| Level | Emoji | When to Use | Clarix Example |
|-------|:-----:|-------------|----------------|
| `debug` | 🔍 | Detailed dev info, OFF in production | `"RBAC check: technician can read batch = true"` |
| `info` | ℹ️ | Normal business events | `"Batch #847 step 3 completed by Sarah"` |
| `warn` | ⚠️ | Something unusual but not broken | `"Lot L-45 expires in 3 days"` |
| `error` | 🔴 | Something broke | `"Failed to insert e-signature: DB timeout"` |
| `fatal` | 💀 | App is crashing | `"Cannot connect to database — shutting down"` |

**In production, you set `LOG_LEVEL=info`** → only `info`, `warn`, `error`, `fatal` show up. All `debug` is hidden.

---

## 🔗 Pillar 2: Traces — "Where Did the Request Go?"

A trace follows ONE user request from start to finish, across every function and service it touches.

### Real Clarix Example

**Sarah (technician) taps "Complete Step" on her iPad:**

```
📱 iPad tap "Complete Step"
    │
    ▼
🌐 POST /api/batch-steps/execute     ← request starts
    │
    ├── 🔐 Auth middleware            12ms   ██
    │     Check session, verify role
    │
    ├── 📋 Load batch from DB          45ms   ████
    │     SELECT * FROM batch WHERE id = ...
    │
    ├── ✅ Validate permissions         3ms   █
    │     Can technician execute step 3?
    │
    ├── 💾 Insert step record          22ms   ██
    │     INSERT INTO batch_step_record ...
    │
    ├── ✍️  Capture e-signature       180ms   ████████████████  ← SLOW!
    │     PIN verify + INSERT INTO e_signature ...
    │
    ├── 📋 Write audit trail            8ms   █
    │     INSERT INTO audit_trail ...
    │
    └── ✅ Send response                2ms   █
                                     ─────
                               Total: 272ms
```

**Without traces:** "The app feels slow" — no idea why.

**With traces:** "E-signature capture takes 180ms — that's 66% of the request. The PIN verification is the bottleneck."

### Key Trace Vocabulary

| Term | What It Is | Clarix Example |
|------|-----------|----------------|
| **Trace** | The entire journey of one request | `POST /api/batch-steps/execute` start to finish |
| **Span** | One "step" inside a trace | `"db.insert(e_signature)"` = one span |
| **Trace ID** | A unique ID linking all spans together | `traceId: "abc123def456"` |
| **Parent Span** | The span that started this one | The API route is the parent of the DB query span |
| **Duration** | How long one span took | `180ms` for e-signature |

### How Traces Look in a Dashboard

```
┌──────────────────────────────────── Trace: abc123 ──────────────────────┐
│                                                                         │
│  POST /api/batch-steps/execute ████████████████████████████████ 272ms   │
│    ├── auth.middleware          ██ 12ms                                  │
│    ├── db.select(batch)         ████ 45ms                               │
│    ├── rbac.check               █ 3ms                                   │
│    ├── db.insert(step_record)   ██ 22ms                                 │
│    ├── db.insert(e_signature)   ████████████████ 180ms  ⚠️ SLOW        │
│    ├── db.insert(audit_trail)   █ 8ms                                   │
│    └── response                 █ 2ms                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Pillar 3: Metrics — "How Is the System Doing?"

Metrics are **numbers measured over time**. They answer "how many?" and "how fast?"

| Metric | What It Measures | Example Value | Alert If |
|--------|-----------------|---------------|----------|
| **Request rate** | Requests per minute | 240 req/min | < 10 (system down?) |
| **Error rate** | % of requests that fail | 0.3% | > 2% |
| **p95 latency** | 95% of requests are faster than this | 320ms | > 1000ms |
| **DB connections** | Active Postgres connections | 12 / 100 | > 80 |
| **Crash-free rate** | % of iPad sessions without crashes | 99.8% | < 99% |

### What p95 Means (Simple)

```
You have 100 requests:
- 95 of them completed in < 320ms  ← This is your p95
- 4 of them completed in 500ms
- 1 of them completed in 2000ms   ← This is your worst case

p95 = 320ms means "95% of your users have a good experience"
```

---

## 🔴 Sentry — The "What Broke?" Dashboard

Sentry catches errors automatically and shows you everything about them.

### What Happens When Something Crashes

```
1. Sarah's iPad crashes on batch screen
         │
         ▼
2. Sentry SDK captures:
   ┌────────────────────────────────────────────┐
   │  ❌ TypeError: Cannot read property        │
   │     'stepNumber' of undefined              │
   │                                            │
   │  📍 File: batch-execution.tsx:47           │
   │  👤 User: sarah@pharma.com                 │
   │  🏢 Org: PharmaCorp (org1)                 │
   │  📱 Device: iPad Pro 12.9" / iOS 19.2     │
   │  🔋 Memory: 3.2GB used                    │
   │                                            │
   │  🍞 Breadcrumbs (what happened before):    │
   │     16:40:55  Tapped "My Batches"          │
   │     16:40:57  Loaded batch #847            │
   │     16:40:59  Tapped "Step 3"              │
   │     16:41:00  💥 CRASH                     │
   │                                            │
   │  🔗 Trace ID: abc123 (click to see trace)  │
   └────────────────────────────────────────────┘
         │
         ▼
3. You get a Slack notification:
   "🔴 New error in @clarix/mobile — TypeError in batch-execution.tsx"
         │
         ▼
4. You open Sentry, see the stack trace, fix it in 5 minutes
```

**Without Sentry:** Sarah reports "the app crashed." You say "when? what were you doing? what iPad?" — hours of back-and-forth.

**With Sentry:** You already know everything before Sarah even tells you.

---

## 🔵 OpenTelemetry — The "Industry Standard" Protocol

OpenTelemetry (OTel) is NOT a dashboard or service. It's a **standard format** for traces and metrics.

### Why It Matters — The Plug Analogy

```
🔌 Without OTel:

  Your App ──── Datadog format ──→ Datadog
  
  Want to switch to Grafana?
  REWRITE ALL YOUR INSTRUMENTATION CODE 😰


🔌 With OTel:

  Your App ──── OTel format ──→ Sentry
                              ──→ Datadog
                              ──→ Grafana
                              ──→ Any OTel-compatible backend
  
  Want to switch? Just change the DESTINATION. Zero code changes. 🎉
```

| Think of it like... | OTel equivalent |
|---------------------|-----------------|
| USB-C (universal plug) | OpenTelemetry protocol |
| Your laptop (data source) | Your Clarix app |
| Monitor / charger / phone (destination) | Sentry / Datadog / Grafana |

### `@vercel/otel` — The Easy Button

```typescript
// apps/web/instrumentation.ts  — THIS IS THE ENTIRE FILE
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel("clarix-web");  // ← one line, done
}
```

**What this one line does:**
- ✅ Auto-traces every API route
- ✅ Auto-traces every page render
- ✅ Auto-traces middleware
- ✅ Auto-traces fetch() calls
- ✅ Adds trace IDs to all requests

---

## 🟢 Pino — The "Fast Logger"

### Why Not Just `console.log`?

| | `console.log` | Pino |
|--|:---:|:---:|
| Speed | 🐢 Blocks the event loop | 🐇 Async, non-blocking (10x faster) |
| Format | Plain text | Structured JSON |
| Levels | None (everything is the same) | `debug`, `info`, `warn`, `error`, `fatal` |
| Searchable? | ❌ | ✅ Search by `batchId`, `orgId`, `userId` |
| Trace correlation | ❌ | ✅ Auto-injects `traceId` from OTel |
| Production-ready | ❌ | ✅ Industry standard for Node.js |

---

## 🔗 How All Three Connect Together

This is the magic — they're not separate tools, they're one investigation flow:

```
 Step 1: ALERT                    Step 2: ERROR                  Step 3: TRACE                  Step 4: LOGS
 ─────────────                    ──────────────                  ──────────────                 ──────────────

 📊 Metric alert:                 🔴 Sentry shows:               🔵 OTel trace shows:           🟢 Pino logs show:
 "Error rate > 2%"                "TypeError in                   POST /api/batch-steps           { traceId: abc123,
                                   batch-step.ts:47                ├── auth: 12ms                  msg: "step record
  ──── click ───→                  traceId: abc123"                ├── db.select: 45ms             insert failed",
                                                                   ├── db.insert: FAILED ❌        error: "unique
                                   ──── click ───→                 └── 180ms timeout               constraint on
                                                                                                    step_number" }
                                                                   ──── search abc123 ───→

 "Something is wrong"      →     "Here's the crash"       →     "Here's where it broke"    →   "Here's WHY"
```

### Real Scenario: Debugging a Production Bug

```
Monday 9:00 AM — You get a Slack alert:
"🔴 5 new errors in clarix-web — batch step execution"

You open Sentry:
├── Error: "Unique constraint violation on batch_step_record"
├── Happened 5 times in last 10 minutes
├── All from PharmaCorp (org1)
├── All from user Sarah (u2)
├── traceId: abc123

You click the trace ID → opens OTel trace:
├── POST /api/batch-steps/execute
├── auth ✅ 12ms
├── db.select(batch) ✅ 45ms
├── db.insert(step_record) ❌ FAILED — unique constraint
└── "batch_steps_order_uidx" — step_number 3 already exists

You search logs for traceId "abc123":
├── INFO  "Sarah started step 3 of batch #847"
├── INFO  "Step 3 already completed — duplicate request"
├── ERROR "Insert failed: unique constraint batch_steps_order_uidx"

Root cause: Sarah's iPad had a network glitch and retried the request.
The step was already saved but the iPad didn't get the response.

Fix: Add idempotency check — if step already completed, return 200 instead of inserting again.

Total debug time: 3 minutes. ⚡
Without observability: "Sarah says it's broken" → hours of guessing.
```

---

## 🏥 Uptime Monitoring — "Is Clarix Even Running?"

A separate, simple concept. An external service pings your app every few minutes:

```
Every 3 minutes:
  Better Stack → GET https://clarix.app/api/health → 200 OK ✅
  Better Stack → GET https://clarix.app/api/health → 200 OK ✅
  Better Stack → GET https://clarix.app/api/health → TIMEOUT ❌
  
  → Sends you: "🚨 clarix.app is DOWN!"
  → Shows on status page: "Clarix is experiencing issues"
```

---

## 🗺️ The Complete Picture

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR CLARIX APP                              │
│                                                                  │
│   📱 iPad App          🌐 Web App          💾 Database          │
│   (Expo)               (Next.js)           (Supabase/PG)       │
│                                                                  │
│         │                    │                    │              │
│         ▼                    ▼                    ▼              │
│   ┌─────────────────────────────────────────────────────┐       │
│   │          @clarix/observability package               │       │
│   │                                                     │       │
│   │   📝 Pino Logger     🔗 OTel Spans    🔴 Sentry    │       │
│   │   (what happened)    (how long)       (what broke)  │       │
│   └──────────┬───────────────┬──────────────┬───────────┘       │
└──────────────┼───────────────┼──────────────┼───────────────────┘
               │               │              │
               ▼               ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Log      │   │ Trace    │   │ Sentry   │
        │ Backend  │   │ Backend  │   │ Dashboard│
        │ (search) │   │ (view)   │   │ (alert)  │
        └──────────┘   └──────────┘   └──────────┘
               │               │              │
               └───────────────┼──────────────┘
                               │
                          traceId links
                          everything
                          together 🔗
```

---

## ✅ TL;DR — One Sentence Each

| Concept | One Sentence |
|---------|-------------|
| **Observability** | X-ray vision into your running app |
| **Logs** (Pino) | Structured diary entries: "what happened and when" |
| **Traces** (OTel) | GPS route of a request: "where did it go and how long at each stop" |
| **Metrics** | Dashboard gauges: "how fast, how many, how broken" |
| **Sentry** | "An error happened — here's the stack trace, user, device, and breadcrumbs" |
| **OpenTelemetry** | Universal plug format — instrument once, send data anywhere |
| **`@vercel/otel`** | One-line OTel setup for Next.js |
| **Pino** | Fast JSON logger that auto-attaches trace IDs |
| **Uptime monitoring** | External ping: "is the website alive?" |
| **Trace ID** | The string that links a log → to a trace → to a Sentry error |

---

*Everything connects through the `traceId`. That's the magic glue.* ✨
