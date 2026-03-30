/**
 * Clarix shared constants and types.
 * Used across web, mobile, and packages.
 */

export const APP_NAME = "Clarix";
export const APP_DESCRIPTION =
  "503B Digital Batch Record & Facility Management Platform";

/** Node environment enum */
export const NodeEnv = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;
export type NodeEnvType = (typeof NodeEnv)[keyof typeof NodeEnv];
