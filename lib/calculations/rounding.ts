/**
 * Rounding helpers. Pure functions.
 *
 * Payroll commonly rounds clock punches to the nearest 5, 6 (tenth of an hour),
 * or 15 minutes. We round to the NEAREST interval (round-half-up), which is the
 * neutral, legally-common approach.
 */

import type { RoundingMode } from "./types";

/** Convert a rounding mode to an interval in minutes (0 = no rounding). */
export function roundingIntervalMinutes(mode: RoundingMode): number {
  switch (mode) {
    case "5":
      return 5;
    case "6":
      return 6;
    case "15":
      return 15;
    case "none":
    default:
      return 0;
  }
}

/**
 * Round a minute value to the nearest interval.
 * Half rounds up (e.g. interval 15, value 7.5 -> 15).
 */
export function applyRounding(minutes: number, mode: RoundingMode): number {
  const interval = roundingIntervalMinutes(mode);
  if (interval <= 0) return minutes;
  return Math.round(minutes / interval) * interval;
}
