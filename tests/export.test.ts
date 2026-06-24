import { describe, it, expect } from "vitest";
import { buildCsv } from "../lib/export";
import { calculateWeek } from "../lib/calculations/engine";
import type { CalcOptions, DayInput } from "../lib/calculations/types";

const opts: CalcOptions = {
  timeFormat: "12h",
  rounding: "none",
  overtime: {
    mode: "weekly",
    weeklyThresholdHours: 40,
    dailyThresholdHours: 8,
    multiplier: 1.5,
  },
  hourlyRate: 20,
};

function days(): DayInput[] {
  return Array.from({ length: 2 }, (_, i) => ({
    id: `d${i}`,
    label: `Day ${i + 1}`,
    start: "9:00 AM",
    end: "5:00 PM",
    breakMinutes: 0,
    overnight: false,
  }));
}

describe("buildCsv", () => {
  it("includes headers, rows, totals, and pay", () => {
    const d = days();
    const result = calculateWeek(d, opts);
    const csv = buildCsv(d, result, { rateLabel: "$20.00/hr" });

    expect(csv).toContain("Day,Start,End,Break (min),Overnight,Worked (hh:mm)");
    expect(csv).toContain("Day 1,9:00 AM,5:00 PM,0,no,8:00,8.00,ok");
    expect(csv).toContain("Total");
    expect(csv).toContain("Gross pay,320.00");
  });

  it("escapes values containing commas", () => {
    const d = days();
    d[0].label = "Day, one";
    const result = calculateWeek(d, opts);
    const csv = buildCsv(d, result);
    expect(csv).toContain('"Day, one"');
  });
});
