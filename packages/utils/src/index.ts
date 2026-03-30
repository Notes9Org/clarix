/**
 * BUD (Beyond-Use Date) calculator per USP <797>.
 * Category-based BUD assignment for sterile compounding.
 */
export function calculateBUD(
  compoundingCategory: "category_1" | "category_2" | "category_3",
  storageCondition: "crt" | "refrigerated" | "frozen"
): number {
  const budMatrix: Record<string, Record<string, number>> = {
    category_1: { crt: 12, refrigerated: 12, frozen: 12 }, // hours
    category_2: { crt: 1, refrigerated: 4, frozen: 45 }, // days
    category_3: { crt: 1, refrigerated: 4, frozen: 45 }, // days (with sterility testing: extended)
  };
  return budMatrix[compoundingCategory]?.[storageCondition] ?? 1;
}

/**
 * Format a batch number with org prefix and date.
 * Example: "CLX-20260329-0001"
 */
export function formatBatchNumber(
  prefix: string,
  date: Date,
  sequence: number
): string {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = String(sequence).padStart(4, "0");
  return `${prefix}-${dateStr}-${seq}`;
}

/**
 * Check if a numeric value is within tolerance range.
 */
export function isWithinTolerance(
  value: number,
  target: number,
  toleranceLow: number,
  toleranceHigh: number
): boolean {
  return value >= toleranceLow && value <= toleranceHigh;
}
