import { describe, it, expect } from "vitest";

/**
 * @clarix/observability — Unit tests for observability exports
 */

describe("@clarix/observability exports", () => {
  it("exports the main logger", async () => {
    const obs = await import("../../packages/observability/src/index");
    expect(obs.logger).toBeDefined();
    expect(typeof obs.logger.info).toBe("function");
    expect(typeof obs.logger.error).toBe("function");
    expect(typeof obs.logger.warn).toBe("function");
  });

  it("exports all 8 domain child loggers", async () => {
    const obs = await import("../../packages/observability/src/index");
    const loggers = [
      "authLogger",
      "batchLogger",
      "inventoryLogger",
      "emLogger",
      "qualityLogger",
      "equipmentLogger",
      "trainingLogger",
      "complianceLogger",
    ];
    for (const name of loggers) {
      expect((obs as Record<string, unknown>)[name]).toBeDefined();
      expect(typeof (obs as Record<string, unknown>)[name]).toBe("object");
    }
  });

  it("exports withSpan helper", async () => {
    const obs = await import("../../packages/observability/src/index");
    expect(obs.withSpan).toBeDefined();
    expect(typeof obs.withSpan).toBe("function");
  });

  it("exports SERVICE_NAME constant", async () => {
    const { SERVICE_NAME } = await import("../../packages/observability/src/constants");
    expect(SERVICE_NAME).toBe("clarix");
  });
});
