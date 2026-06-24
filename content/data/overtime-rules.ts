/**
 * Foundation for FUTURE state-specific overtime pages.
 *
 * This config is intentionally small and data-driven. It is NOT used to mass-
 * generate thin pages today. When we are ready to build genuinely useful
 * state pages, a route can read from this map and render unique guidance.
 *
 * Disclaimer: these are simplified, commonly-cited rules for illustration. They
 * are not legal advice and can change. Always verify against current state law,
 * federal FLSA rules, and employer policy.
 */

import type { OvertimeConfig } from "../../lib/calculations/types";

export interface StateOvertimeRule {
  code: string; // e.g. "CA"
  name: string; // e.g. "California"
  /** A preset config that reflects the headline rule. */
  preset: OvertimeConfig;
  /** Short, human summary shown on a future state page. */
  summary: string;
  /** Notable extras a future page should explain (double-time, 7th-day, etc.). */
  notes: string[];
}

export const FEDERAL_DEFAULT: OvertimeConfig = {
  mode: "weekly",
  weeklyThresholdHours: 40,
  dailyThresholdHours: 8,
  multiplier: 1.5,
};

export const STATE_OVERTIME_RULES: Record<string, StateOvertimeRule> = {
  FED: {
    code: "FED",
    name: "Federal (FLSA)",
    preset: { ...FEDERAL_DEFAULT },
    summary:
      "Under the federal Fair Labor Standards Act, non-exempt employees earn 1.5× pay for hours worked over 40 in a workweek. There is no federal daily overtime rule.",
    notes: [
      "No federal daily overtime threshold.",
      "Workweek is a fixed, recurring 168-hour period.",
    ],
  },
  CA: {
    code: "CA",
    name: "California",
    preset: {
      mode: "daily_weekly",
      weeklyThresholdHours: 40,
      dailyThresholdHours: 8,
      multiplier: 1.5,
    },
    summary:
      "California uses daily and weekly overtime: 1.5× after 8 hours in a day or 40 in a week, with double-time after 12 hours in a day.",
    notes: [
      "Double-time (2×) after 12 hours in a single workday.",
      "Seventh consecutive workday rules can apply.",
      "This calculator models the 1.5× daily+weekly portion; double-time is a future enhancement.",
    ],
  },
  AK: {
    code: "AK",
    name: "Alaska",
    preset: {
      mode: "daily_weekly",
      weeklyThresholdHours: 40,
      dailyThresholdHours: 8,
      multiplier: 1.5,
    },
    summary:
      "Alaska generally requires 1.5× pay after 8 hours in a day or 40 in a week for covered employers.",
    notes: ["Exemptions apply to smaller employers."],
  },
};

export function getStateRule(code: string): StateOvertimeRule | null {
  return STATE_OVERTIME_RULES[code.toUpperCase()] ?? null;
}
