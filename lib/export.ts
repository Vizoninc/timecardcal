/**
 * Pure CSV builder for a calculated week. Kept framework-free and testable.
 */

import type { DayInput, WeekResult } from "./calculations/types";
import { formatDurationHhmm } from "./calculations/time";
import { minutesToDecimalHours } from "./calculations/decimal";

function csvEscape(value: string | number): string {
  const s = String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function buildCsv(
  days: DayInput[],
  result: WeekResult,
  meta: { rateLabel?: string } = {}
): string {
  const header = [
    "Day",
    "Start",
    "End",
    "Break (min)",
    "Overnight",
    "Worked (hh:mm)",
    "Worked (decimal)",
    "Status",
  ];

  const rows = days.map((d, i) => {
    const r = result.days[i];
    return [
      d.label,
      d.start,
      d.end,
      d.breakMinutes,
      d.overnight ? "yes" : "no",
      r.valid ? formatDurationHhmm(r.workedMinutes) : "",
      r.valid ? minutesToDecimalHours(r.workedMinutes).toFixed(2) : "",
      r.empty ? "empty" : r.error ? `error: ${r.error}` : "ok",
    ];
  });

  const totals: (string | number)[][] = [
    [],
    ["Regular", "", "", "", "", formatDurationHhmm(result.regularMinutes), result.regularDecimalHours.toFixed(2), ""],
    ["Overtime", "", "", "", "", formatDurationHhmm(result.overtimeMinutes), result.overtimeDecimalHours.toFixed(2), ""],
    ["Total", "", "", "", "", formatDurationHhmm(result.totalMinutes), result.totalDecimalHours.toFixed(2), ""],
  ];

  if (result.grossPay != null) {
    totals.push([]);
    if (meta.rateLabel) totals.push(["Rate", meta.rateLabel]);
    totals.push(["Regular pay", result.regularPay?.toFixed(2) ?? ""]);
    totals.push(["Overtime pay", result.overtimePay?.toFixed(2) ?? ""]);
    totals.push(["Gross pay", result.grossPay.toFixed(2)]);
  }

  const all = [header, ...rows, ...totals];
  return all.map((row) => row.map(csvEscape).join(",")).join("\n");
}

export function csvFilename(prefix = "timesheet"): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return `${prefix}-${stamp}.csv`;
}
