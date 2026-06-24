/**
 * Time parsing & formatting. Pure functions, no globals.
 *
 * Internally we represent a time-of-day as "minutes since midnight" (0..1439).
 */

import type { TimeFormat } from "./types";

export const MINUTES_PER_DAY = 24 * 60;

/**
 * Parse a user-entered time string into minutes since midnight.
 *
 * Accepts, in 12h mode: "9", "9:30", "9:30 AM", "9:30am", "12:00 PM".
 * Accepts, in 24h mode: "0", "9:30", "17:05", "23:59".
 *
 * Returns null for empty or unparseable input. This is deliberately lenient on
 * separators/whitespace but strict on numeric ranges.
 */
export function parseTimeToMinutes(
  raw: string,
  format: TimeFormat
): number | null {
  if (raw == null) return null;
  const value = raw.trim().toLowerCase();
  if (value === "") return null;

  // Pull an optional am/pm suffix.
  const meridiemMatch = value.match(/(am|pm)\s*$/);
  const meridiem = meridiemMatch ? meridiemMatch[1] : null;
  const core = meridiem ? value.slice(0, meridiemMatch!.index).trim() : value;

  // Split on ":" or "." — allow "9", "9:30", "930" is NOT allowed (ambiguous).
  const parts = core.split(/[:.]/);
  if (parts.length > 2) return null;

  const hourStr = parts[0];
  const minStr = parts.length === 2 ? parts[1] : "0";

  if (!/^\d{1,2}$/.test(hourStr)) return null;
  if (!/^\d{1,2}$/.test(minStr)) return null;

  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);
  if (minute > 59) return null;

  if (format === "12h" || meridiem) {
    // 12-hour interpretation.
    if (hour < 1 || hour > 12) return null;
    if (meridiem === "pm" && hour !== 12) hour += 12;
    if (meridiem === "am" && hour === 12) hour = 0;
    if (!meridiem && format === "12h") {
      // No am/pm given in 12h mode: treat 12 as noon, 1-11 as-is (am-ish).
      // We keep the raw hour; ambiguity is surfaced in UI, not here.
      if (hour === 12) hour = 12;
    }
  } else {
    // 24-hour interpretation.
    if (hour > 23) return null;
  }

  return hour * 60 + minute;
}

/** Format minutes-since-midnight back to a display string. */
export function formatMinutesAsClock(
  minutes: number,
  format: TimeFormat
): string {
  const m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h24 = Math.floor(m / 60);
  const min = m % 60;
  const mm = String(min).padStart(2, "0");

  if (format === "24h") {
    return `${String(h24).padStart(2, "0")}:${mm}`;
  }
  const meridiem = h24 >= 12 ? "PM" : "AM";
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${mm} ${meridiem}`;
}

/**
 * Format a duration in minutes as "hh:mm" (e.g. 90 -> "1:30", 605 -> "10:05").
 * Negative inputs are clamped to 0.
 */
export function formatDurationHhmm(minutes: number): string {
  const safe = Math.max(0, Math.round(minutes));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}
