/**
 * Next.js Instrumentation Hook
 *
 * This file is auto-loaded by Next.js BEFORE any application code.
 * It registers OpenTelemetry to trace all API routes, pages,
 * middleware, and fetch calls automatically.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry
 */
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel("clarix-web");
}
