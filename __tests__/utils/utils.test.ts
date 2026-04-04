import { describe, it, expect } from "vitest";

/**
 * @clarix/utils — Unit tests
 */

describe("@clarix/utils", () => {
  it("calculateBUD returns correct BUD for category_1 CRT", async () => {
    const { calculateBUD } = await import("../../packages/utils/src/index");
    expect(calculateBUD("category_1", "crt")).toBe(12);
  });

  it("calculateBUD returns correct BUD for category_2 refrigerated", async () => {
    const { calculateBUD } = await import("../../packages/utils/src/index");
    expect(calculateBUD("category_2", "refrigerated")).toBe(4);
  });

  it("calculateBUD returns correct BUD for category_3 frozen", async () => {
    const { calculateBUD } = await import("../../packages/utils/src/index");
    expect(calculateBUD("category_3", "frozen")).toBe(45);
  });

  it("formatBatchNumber generates correct format", async () => {
    const { formatBatchNumber } = await import("../../packages/utils/src/index");
    const batch = formatBatchNumber("DEMO", new Date("2026-04-04"), 42);
    expect(batch).toBe("DEMO-20260404-0042");
  });

  it("isWithinTolerance validates correctly", async () => {
    const { isWithinTolerance } = await import("../../packages/utils/src/index");
    expect(isWithinTolerance(100, 100, 95, 105)).toBe(true);
    expect(isWithinTolerance(103, 100, 95, 105)).toBe(true);
    expect(isWithinTolerance(106, 100, 95, 105)).toBe(false);
    expect(isWithinTolerance(94, 100, 95, 105)).toBe(false);
  });
});
