/**
 * Orchestrator: turns a week of raw day inputs + options into a full WeekResult.
 *
 * This is the single entry point the UI calls. It composes the smaller pure
 * functions (daily, overtime, decimal, pay) so each remains independently
 * testable.
 */

import type { CalcOptions, DayInput, WeekResult } from "./types";
import { dailyWorkedMinutes } from "./daily";
import { overtimeSplit } from "./overtime";
import { minutesToDecimalHours } from "./decimal";
import { calcPay } from "./pay";

export function calculateWeek(
  days: DayInput[],
  options: CalcOptions
): WeekResult {
  const dayResults = days.map((d) => dailyWorkedMinutes(d, options));

  const hasErrors = dayResults.some((d) => d.error !== null);

  // Only valid, non-empty days contribute minutes.
  const minutesPerDay = dayResults.map((d) => (d.valid ? d.workedMinutes : 0));

  const { regularMinutes, overtimeMinutes } = overtimeSplit(
    minutesPerDay,
    options.overtime
  );
  const totalMinutes = regularMinutes + overtimeMinutes;

  const hasRate =
    options.hourlyRate != null &&
    Number.isFinite(options.hourlyRate) &&
    options.hourlyRate >= 0;

  let regularPay: number | null = null;
  let overtimePay: number | null = null;
  let grossPay: number | null = null;

  if (hasRate) {
    const pay = calcPay({
      regularMinutes,
      overtimeMinutes,
      hourlyRate: options.hourlyRate as number,
      multiplier: options.overtime.multiplier,
    });
    regularPay = pay.regularPay;
    overtimePay = pay.overtimePay;
    grossPay = pay.grossPay;
  }

  return {
    days: dayResults,
    totalMinutes,
    regularMinutes,
    overtimeMinutes,
    totalDecimalHours: minutesToDecimalHours(totalMinutes),
    regularDecimalHours: minutesToDecimalHours(regularMinutes),
    overtimeDecimalHours: minutesToDecimalHours(overtimeMinutes),
    regularPay,
    overtimePay,
    grossPay,
    hasErrors,
  };
}
