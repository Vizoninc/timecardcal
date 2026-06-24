import { describe, it, expect } from "vitest";
import { calculateWeek } from "../lib/calculations/engine";
import type { CalcOptions, DayInput } from "../lib/calculations/types";

function makeDays(rows: Array<Partial<DayInput>>): DayInput[] {
  return rows.map((r, i) => ({
    id: `d${i}`,
    label: `Day ${i + 1}`,
    start: "",
    end: "",
    breakMinutes: 0,
    overnight: false,
    ...r,
  }));
}

const opts = (over: Partial<CalcOptions> = {}): CalcOptions => ({
  timeFormat: "12h",
  rounding: "none",
  overtime: {
    mode: "weekly",
    weeklyThresholdHours: 40,
    dailyThresholdHours: 8,
    multiplier: 1.5,
  },
  hourlyRate: null,
  ...over,
});

describe("calculateWeek (integration)", () => {
  it("totals a standard 5-day week with lunches", () => {
    // 9:00 AM - 5:30 PM, 30 min lunch = 8h/day * 5 = 40h.
    const days = makeDays(
      Array(5).fill({ start: "9:00 AM", end: "5:30 PM", breakMinutes: 30 })
    );
    const r = calculateWeek(days, opts());
    expect(r.totalMinutes).toBe(40 * 60);
    expect(r.totalDecimalHours).toBe(40);
    expect(r.overtimeMinutes).toBe(0);
    expect(r.hasErrors).toBe(false);
  });

  it("splits overtime and computes gross pay", () => {
    // Five 9h days = 45h => 40 reg + 5 OT. Rate 20, mult 1.5.
    const days = makeDays(
      Array(5).fill({ start: "8:00 AM", end: "5:00 PM", breakMinutes: 0 })
    );
    const r = calculateWeek(days, opts({ hourlyRate: 20 }));
    expect(r.regularMinutes).toBe(40 * 60);
    expect(r.overtimeMinutes).toBe(5 * 60);
    expect(r.regularPay).toBe(800);
    expect(r.overtimePay).toBe(150);
    expect(r.grossPay).toBe(950);
  });

  it("ignores empty rows but surfaces errors", () => {
    const days = makeDays([
      { start: "9:00 AM", end: "5:00 PM" },
      {}, // empty
      { start: "9:00 AM" }, // incomplete -> error
    ]);
    const r = calculateWeek(days, opts());
    expect(r.hasErrors).toBe(true);
    expect(r.totalMinutes).toBe(8 * 60); // only the first valid day counts
  });

  it("handles a biweekly (14-day) overnight scenario", () => {
    // 14 days, each 10:00 PM -> 6:00 AM (8h overnight). Weekly threshold here
    // is treated as a single 80h period for the demo (biweekly threshold = 80).
    const days = makeDays(
      Array(14).fill({ start: "10:00 PM", end: "6:00 AM" })
    );
    const r = calculateWeek(
      days,
      opts({
        overtime: {
          mode: "weekly",
          weeklyThresholdHours: 80,
          dailyThresholdHours: 8,
          multiplier: 1.5,
        },
      })
    );
    expect(r.totalMinutes).toBe(14 * 8 * 60);
    expect(r.overtimeMinutes).toBe((14 * 8 - 80) * 60); // 112 - 80 = 32h OT
  });
});
