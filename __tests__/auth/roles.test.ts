import { describe, it, expect } from "vitest";

/**
 * @clarix/auth — Unit tests for auth exports
 */

describe("@clarix/auth exports", () => {
  it("exports CLARIX_ROLES with 15 roles", async () => {
    const { CLARIX_ROLES } = await import("../../packages/auth/src/index");
    expect(CLARIX_ROLES).toHaveLength(15);
    expect(CLARIX_ROLES).toContain("admin");
    expect(CLARIX_ROLES).toContain("read_only");
    expect(CLARIX_ROLES).toContain("pharmacist_in_charge");
  });

  it("exports ROLE_TIERS with correct tier levels", async () => {
    const { ROLE_TIERS } = await import("../../packages/auth/src/index");
    expect(ROLE_TIERS.admin).toBe(0);
    expect(ROLE_TIERS.read_only).toBe(4);
    expect(ROLE_TIERS.qa_manager).toBe(2);
    expect(ROLE_TIERS.compounding_technician).toBe(3);
  });

  it("admin is tier 0 (highest privilege)", async () => {
    const { ROLE_TIERS } = await import("../../packages/auth/src/index");
    const tiers = Object.values(ROLE_TIERS);
    expect(Math.min(...tiers)).toBe(0);
    expect(ROLE_TIERS.admin).toBe(0);
  });
});
