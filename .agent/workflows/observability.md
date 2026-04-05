---
description: How to ensure every new Clarix component has proper observability (logs, traces, error capture)
---

# Observability Checklist for New Components

Every time you build a new feature, API route, server action, or component in Clarix, follow these steps to ensure it is observable.

## 1. Import the Logger

For any server-side code (API routes, server actions, DB operations), import the domain-specific logger:

```typescript
import { batchLogger, authLogger, inventoryLogger, emLogger, qualityLogger, logger } from "@clarix/observability";
```

Pick the logger matching the domain. Use `logger` for generic/cross-domain code.

## 2. Add Structured Logs at Key Points

// turbo

For every new function, add:

- `logger.info(...)` at the start (what's happening)
- `logger.info(...)` at the end (what succeeded, with duration)
- `logger.error(...)` in catch blocks (what failed, with context)
- `logger.warn(...)` for unusual-but-not-broken states

Always include contextual fields: `orgId`, `userId`, `batchId`, `recordId`, etc.

```typescript
authLogger.info({ userId, email }, "Login attempt");
authLogger.error({ userId, error: err.message }, "Login failed");
```

## 3. Add Custom Spans for Business-Critical Operations

For important business logic (batch execution, e-signatures, formula approvals, inventory receiving), wrap with a custom OTel span:

```typescript
import { trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("clarix-batch");

async function myBusinessOperation() {
  return tracer.startActiveSpan("batch.step.execute", async (span) => {
    span.setAttributes({ "batch.id": batchId, "user.id": userId });
    try {
      // ... your logic ...
      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

## 4. Capture Errors in Sentry

In server-side catch blocks for user-facing operations:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.captureException(error, {
  extra: { batchId, stepNumber, orgId },
  tags: { domain: "batch" },
});
```

## 5. Verify Checklist

Before merging any new feature:

- [ ] No raw `console.log` / `console.error` in server code — use Pino logger
- [ ] Key business operations have custom OTel spans
- [ ] Catch blocks call `Sentry.captureException()` with context
- [ ] Log messages include relevant IDs (`orgId`, `userId`, `batchId`)
- [ ] API routes return proper error codes (not 200 for errors)
