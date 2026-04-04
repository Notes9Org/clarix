/**
 * Observability Health Check — GET /api/observability/health
 *
 * A hello-world route that exercises all 3 observability pillars:
 * 1. Pino structured logging (with trace correlation)
 * 2. OpenTelemetry custom span
 * 3. Error capture path
 *
 * Use this to verify that logs, traces, and error capture are working.
 */

import { NextResponse } from "next/server";
import { logger, withSpan } from "@clarix/observability";

export async function GET() {
  // 1️⃣ Structured log — will include traceId from OTel automatically
  logger.info({ route: "/api/observability/health" }, "Health check requested");

  // 2️⃣ Custom span — shows up in your trace viewer
  const result = await withSpan(
    "observability.health_check",
    { "health.type": "full", "health.version": "1.0" },
    async () => {
      // Simulate a small operation
      const start = Date.now();
      await new Promise((resolve) => setTimeout(resolve, 10));
      const durationMs = Date.now() - start;

      logger.info({ durationMs }, "Health check completed");

      return {
        status: "ok",
        service: "clarix-web",
        timestamp: new Date().toISOString(),
        checks: {
          logger: "✅ Pino structured logging active",
          traces: "✅ OpenTelemetry tracing active",
          spans: "✅ Custom spans working",
        },
        durationMs,
      };
    },
  );

  return NextResponse.json(result);
}
