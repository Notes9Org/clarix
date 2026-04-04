/**
 * Clarix Observability — Constants
 *
 * Service names, log levels, and configuration defaults.
 */

/** Service name used in OTel traces and Sentry */
export const SERVICE_NAME = "clarix" as const;

/** Log domains for child loggers */
export const LogDomain = {
  AUTH: "auth",
  BATCH: "batch",
  INVENTORY: "inventory",
  ENVIRONMENTAL: "environmental",
  QUALITY: "quality",
  EQUIPMENT: "equipment",
  TRAINING: "training",
  COMPLIANCE: "compliance",
} as const;

export type LogDomainValue = (typeof LogDomain)[keyof typeof LogDomain];

/** Default log level per environment */
export function getLogLevel(): string {
  if (process.env.LOG_LEVEL) return process.env.LOG_LEVEL;
  if (process.env.NODE_ENV === "production") return "info";
  if (process.env.NODE_ENV === "test") return "silent";
  return "debug";
}
