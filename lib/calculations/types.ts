/**
 * Shared types for the calculation engine.
 *
 * The engine is intentionally framework-free and side-effect-free so every
 * function can be unit-tested in isolation. UI state should be mapped into
 * these shapes before calling the engine.
 */

export type TimeFormat = "12h" | "24h";

/** Rounding interval, in minutes. "none" disables rounding. */
export type RoundingMode = "none" | "5" | "6" | "15";

export type OvertimeMode = "none" | "weekly" | "daily_weekly" | "custom";

export interface OvertimeConfig {
  mode: OvertimeMode;
  /** Weekly hours after which work is overtime (e.g. 40). */
  weeklyThresholdHours: number;
  /** Daily hours after which work is overtime (e.g. 8). Used by daily_weekly + custom. */
  dailyThresholdHours: number;
  /** Overtime pay multiplier (e.g. 1.5). */
  multiplier: number;
}

export interface CalcOptions {
  timeFormat: TimeFormat;
  rounding: RoundingMode;
  overtime: OvertimeConfig;
  /** Optional hourly pay rate. Undefined / null disables pay output. */
  hourlyRate?: number | null;
}

/** A single day of input. Times are strings as typed by the user. */
export interface DayInput {
  /** Stable id for React keys + presets. */
  id: string;
  /** Human label, e.g. "Monday" or "Day 1". */
  label: string;
  /** Start time string in the active time format. Empty = no entry. */
  start: string;
  /** End time string in the active time format. Empty = no entry. */
  end: string;
  /** Unpaid break in minutes. */
  breakMinutes: number;
  /**
   * Whether the shift crosses midnight (end is on the next calendar day).
   * Explicit toggle avoids guessing wrong on ambiguous inputs.
   */
  overnight: boolean;
}

export interface DayResult {
  id: string;
  label: string;
  /** True if both start and end parsed successfully. */
  valid: boolean;
  /** True if the row was left blank (not an error). */
  empty: boolean;
  /** Validation message when invalid, else null. */
  error: string | null;
  /** Worked minutes after break + rounding. 0 when invalid/empty. */
  workedMinutes: number;
}

export interface WeekResult {
  days: DayResult[];
  /** Total worked minutes across all valid days. */
  totalMinutes: number;
  regularMinutes: number;
  overtimeMinutes: number;
  /** Decimal hours (e.g. 40.25). Rounded to 2 dp. */
  totalDecimalHours: number;
  regularDecimalHours: number;
  overtimeDecimalHours: number;
  /** Pay fields are null when no rate is provided. */
  regularPay: number | null;
  overtimePay: number | null;
  grossPay: number | null;
  /** True if any row had an error. */
  hasErrors: boolean;
}
