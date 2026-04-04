/**
 * @clarix/observability
 *
 * Unified observability for the Clarix 503B platform.
 *
 * Provides:
 * - Structured Pino logger with OpenTelemetry trace correlation
 * - Domain-specific child loggers (batch, auth, inventory, etc.)
 * - Custom span helpers for business-critical operations
 * - Constants for service naming and log levels
 *
 * @example
 * ```typescript
 * import { logger, batchLogger, withSpan } from "@clarix/observability";
 *
 * // Simple logging
 * logger.info({ orgId, userId }, "User logged in");
 *
 * // Domain logging
 * batchLogger.info({ batchId }, "Batch step completed");
 *
 * // Custom traced operation
 * const result = await withSpan("batch.release", { "batch.id": batchId }, async () => {
 *   return db.update(batches).set({ status: "released" });
 * });
 * ```
 */

// Logger
export {
  logger,
  authLogger,
  batchLogger,
  inventoryLogger,
  emLogger,
  qualityLogger,
  equipmentLogger,
  trainingLogger,
  complianceLogger,
  type Logger,
} from "./logger";

// Span helpers
export { withSpan, createTracer } from "./spans";

// Constants
export { SERVICE_NAME, LogDomain, getLogLevel } from "./constants";
