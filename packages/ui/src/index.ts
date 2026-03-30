import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Clarix UI package — shared components and design tokens.
 *
 * TODO: Add shadcn/ui components after Next.js app scaffold.
 * Design tokens defined in docs/design-system.md:
 * - Grayscale-first palette (no color except semantic status)
 * - 56px touch targets for iPad cleanroom use
 * - Lucide icons only (no emoji)
 * - Landscape-only iPad layout
 */
