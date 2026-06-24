/**
 * Minutes <-> decimal-hours conversion. Pure functions.
 *
 * Examples (the classic payroll conversions):
 *   15 min -> 0.25 h
 *   30 min -> 0.50 h
 *   45 min -> 0.75 h
 */

/** Convert minutes to decimal hours, rounded to `dp` decimal places (default 2). */
export function minutesToDecimalHours(minutes: number, dp = 2): number {
  const hours = minutes / 60;
  const factor = Math.pow(10, dp);
  return Math.round(hours * factor) / factor;
}

/** Convert decimal hours back to whole minutes (rounded). */
export function decimalHoursToMinutes(hours: number): number {
  return Math.round(hours * 60);
}
