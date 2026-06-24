/**
 * Per-day worked-time calculation. Pure functions.
 */

import type { CalcOptions, DayInput, DayResult } from "./types";
import { parseTimeToMinutes, MINUTES_PER_DAY } from "./time";
import { applyRounding } from "./rounding";

/**
 * Compute worked minutes for a single day.
 *
 * Rules:
 *  - Empty row (both start & end blank) => empty, 0 minutes, no error.
 *  - One of start/end blank => invalid (incomplete).
 *  - Overnight shifts: if `overnight` is true OR end <= start, we add 24h to end.
 *    The explicit toggle wins; we also auto-detect end<=start as a safety net.
 *  - Break minutes are subtracted from the worked span.
 *  - Rounding is applied to start and end punches independently (punch rounding),
 *    which matches how most timeclocks round, then break is deducted.
 *  - Result is clamped to >= 0.
 */
export function dailyWorkedMinutes(
  day: DayInput,
  options: CalcOptions
): DayResult {
  const base: Omit<DayResult, "valid" | "empty" | "error" | "workedMinutes"> = {
    id: day.id,
    label: day.label,
  };

  const startBlank = day.start.trim() === "";
  const endBlank = day.end.trim() === "";

  if (startBlank && endBlank) {
    return { ...base, valid: false, empty: true, error: null, workedMinutes: 0 };
  }

  if (startBlank || endBlank) {
    return {
      ...base,
      valid: false,
      empty: false,
      error: "Enter both a start and an end time.",
      workedMinutes: 0,
    };
  }

  const startMin = parseTimeToMinutes(day.start, options.timeFormat);
  const endMin = parseTimeToMinutes(day.end, options.timeFormat);

  if (startMin === null) {
    return {
      ...base,
      valid: false,
      empty: false,
      error: "Start time is not a valid time.",
      workedMinutes: 0,
    };
  }
  if (endMin === null) {
    return {
      ...base,
      valid: false,
      empty: false,
      error: "End time is not a valid time.",
      workedMinutes: 0,
    };
  }

  // Apply punch rounding before computing the span.
  const roundedStart = applyRounding(startMin, options.rounding);
  let roundedEnd = applyRounding(endMin, options.rounding);

  const crossesMidnight = day.overnight || roundedEnd <= roundedStart;
  if (crossesMidnight) {
    roundedEnd += MINUTES_PER_DAY;
  }

  let span = roundedEnd - roundedStart;

  // Guard against absurd spans (> 24h) caused by bad overnight toggles.
  if (span > MINUTES_PER_DAY) {
    return {
      ...base,
      valid: false,
      empty: false,
      error: "Shift is longer than 24 hours. Check the overnight setting.",
      workedMinutes: 0,
    };
  }

  const breakMin = Number.isFinite(day.breakMinutes)
    ? Math.max(0, day.breakMinutes)
    : 0;

  if (breakMin > span) {
    return {
      ...base,
      valid: false,
      empty: false,
      error: "Break is longer than the shift.",
      workedMinutes: 0,
    };
  }

  const worked = Math.max(0, span - breakMin);

  return {
    ...base,
    valid: true,
    empty: false,
    error: null,
    workedMinutes: worked,
  };
}
