/**
 * Clarix Auth — Better-Auth configuration with RBAC.
 *
 * This package will configure Better-Auth with:
 * - 15-role RBAC hierarchy (admin → read_only)
 * - Organization-scoped multi-tenancy
 * - 21 CFR Part 11 e-signature support (PIN + biometric)
 * - Session management with device tracking
 *
 * TODO: Implement after Supabase + DB setup is verified.
 */

export const CLARIX_ROLES = [
  "admin",
  "pharmacist_in_charge",
  "pharmacist",
  "production_manager",
  "qa_manager",
  "qa_specialist",
  "qc_technician",
  "compounding_technician",
  "compounding_supervisor",
  "warehouse_clerk",
  "procurement_manager",
  "training_coordinator",
  "maintenance_technician",
  "executive",
  "read_only",
] as const;

export type ClarixRole = (typeof CLARIX_ROLES)[number];

/** Role tier mapping for permission inheritance */
export const ROLE_TIERS: Record<ClarixRole, number> = {
  admin: 0,
  pharmacist_in_charge: 1,
  pharmacist: 1,
  production_manager: 1,
  qa_manager: 2,
  qa_specialist: 2,
  compounding_supervisor: 2,
  procurement_manager: 2,
  training_coordinator: 2,
  executive: 2,
  compounding_technician: 3,
  qc_technician: 3,
  warehouse_clerk: 3,
  maintenance_technician: 3,
  read_only: 4,
};
