/**
 * Clarix Observability — Custom Span Helpers
 *
 * Convenience wrappers for creating OpenTelemetry spans
 * around Clarix business-critical operations.
 *
 * Usage:
 *   import { withSpan } from "@clarix/observability";
 *
 *   const result = await withSpan("batch.step.execute", { "batch.id": batchId }, async () => {
 *     return db.insert(batchStepRecords).values({ ... });
 *   });
 */

import { trace, SpanStatusCode, type Span } from "@opentelemetry/api";
import { SERVICE_NAME } from "./constants";

const tracer = trace.getTracer(SERVICE_NAME);

/**
 * Wraps an async function in an OpenTelemetry span.
 * Automatically sets status to OK or ERROR and records exceptions.
 *
 * @param name   - Span name, e.g. "batch.step.execute", "auth.login", "inventory.receive"
 * @param attrs  - Key-value attributes attached to the span
 * @param fn     - The async function to execute within the span
 */
export async function withSpan<T>(
  name: string,
  attrs: Record<string, string | number | boolean>,
  fn: (span: Span) => Promise<T>,
): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    span.setAttributes(attrs);

    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : "Unknown error",
      });
      if (error instanceof Error) {
        span.recordException(error);
      }
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Creates a child tracer for a specific Clarix domain.
 * Useful when you want all spans in a file to share a tracer name.
 *
 *   const batchTracer = createTracer("clarix-batch");
 */
export function createTracer(name: string) {
  return trace.getTracer(name);
}
