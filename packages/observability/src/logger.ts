/**
 * Clarix Observability — Pino Logger
 *
 * Structured JSON logger with automatic OpenTelemetry trace correlation.
 * Every log line includes `traceId` and `spanId` when inside an active span.
 *
 * Usage:
 *   import { logger, batchLogger } from "@clarix/observability";
 *
 *   logger.info({ batchId: "PH-2026-0847" }, "Batch created");
 *   batchLogger.error({ error, stepNumber: 3 }, "Step execution failed");
 */

import pino from "pino";
import { trace, context } from "@opentelemetry/api";
import { SERVICE_NAME, LogDomain, getLogLevel } from "./constants";

/**
 * Pino mixin that auto-injects the active OpenTelemetry trace context
 * into every log line. This lets you search logs by `traceId` and jump
 * from a log entry → the corresponding distributed trace.
 */
function otelMixin(): Record<string, string> {
  const span = trace.getSpan(context.active());
  if (!span) return {};

  const spanContext = span.spanContext();
  return {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
  };
}

/**
 * Root Clarix logger.
 *
 * - In development: pretty-printed colored output
 * - In production: structured JSON (for log backends like Better Stack, Axiom, etc.)
 * - Always includes OTel trace context when available
 */
export const logger = pino({
  name: SERVICE_NAME,
  level: getLogLevel(),
  mixin: otelMixin,
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});

/**
 * Domain-specific child loggers.
 * Each adds a `domain` field to every log line for easy filtering.
 *
 *   batchLogger.info({ batchId }, "Batch released");
 *   → { level: "info", domain: "batch", batchId: "PH-2026-0847", traceId: "...", msg: "Batch released" }
 */
export const authLogger = logger.child({ domain: LogDomain.AUTH });
export const batchLogger = logger.child({ domain: LogDomain.BATCH });
export const inventoryLogger = logger.child({ domain: LogDomain.INVENTORY });
export const emLogger = logger.child({ domain: LogDomain.ENVIRONMENTAL });
export const qualityLogger = logger.child({ domain: LogDomain.QUALITY });
export const equipmentLogger = logger.child({ domain: LogDomain.EQUIPMENT });
export const trainingLogger = logger.child({ domain: LogDomain.TRAINING });
export const complianceLogger = logger.child({ domain: LogDomain.COMPLIANCE });

export type Logger = typeof logger;
