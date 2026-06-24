/**
 * Overtime split. Pure functions.
 *
 * Modes:
 *  - none:          everything is regular.
 *  - weekly:        hours over the weekly threshold are overtime.
 *  - daily_weekly:  hours over the daily threshold each day are overtime;
 *                   remaining (regular) hours over the weekly threshold are
 *                   also overtime. Daily OT is never double-counted toward
 *                   weekly OT. (Mirrors California-style stacking.)
 *  - custom:        same engine as daily_weekly but with caller-supplied
 *                   daily + weekly thresholds.
 *
 * All inputs/outputs are in MINUTES to avoid floating-point drift.
 */

import type { OvertimeConfig } from "./types";

export interface OvertimeSplit {
  regularMinutes: number;
  overtimeMinutes: number;
}

/**
 * @param dailyMinutes worked minutes per day (already break-adjusted)
 * @param config overtime configuration
 */
export function overtimeSplit(
  dailyMinutes: number[],
  config: OvertimeConfig
): OvertimeSplit {
  const totalMinutes = dailyMinutes.reduce((a, b) => a + Math.max(0, b), 0);

  if (config.mode === "none") {
    return { regularMinutes: totalMinutes, overtimeMinutes: 0 };
  }

  if (config.mode === "weekly") {
    const weeklyThreshold = hoursToMinutes(config.weeklyThresholdHours);
    const overtime = Math.max(0, totalMinutes - weeklyThreshold);
    return {
      regularMinutes: totalMinutes - overtime,
      overtimeMinutes: overtime,
    };
  }

  // daily_weekly and custom share the same stacking logic.
  const dailyThreshold = hoursToMinutes(config.dailyThresholdHours);
  const weeklyThreshold = hoursToMinutes(config.weeklyThresholdHours);

  let dailyOvertime = 0;
  let regularCandidate = 0;
  for (const day of dailyMinutes) {
    const d = Math.max(0, day);
    const reg = Math.min(d, dailyThreshold);
    dailyOvertime += d - reg;
    regularCandidate += reg;
  }

  // Of the non-daily-OT (regular candidate) hours, anything over the weekly
  // threshold becomes weekly overtime.
  const weeklyOvertime = Math.max(0, regularCandidate - weeklyThreshold);
  const regular = regularCandidate - weeklyOvertime;
  const overtime = dailyOvertime + weeklyOvertime;

  return { regularMinutes: regular, overtimeMinutes: overtime };
}

function hoursToMinutes(hours: number): number {
  return Math.max(0, hours) * 60;
}
