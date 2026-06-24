import { describe, it, expect } from "vitest";
import { dailyWorkedMinutes } from "../lib/calculations/daily";
import type { CalcOptions, DayInput } from "../lib/calculations/types";

const baseOptions: CalcOptions = {
  timeFormat: "12h",
  rounding: "none",
  overtime: {
    mode: "none",
    weeklyThresholdHours: 40,
    dailyThresholdHours: 8,
    multiplier: 1.5,
  },
  hourlyRate: null,
};

function day(overrides: Partial<DayInput>): DayInput {
  return {
    id: "d",
    label: "Day",
    start: "",
    end: "",
    breakMinutes: 0,
    overnight: false,
    ...overrides,
  };
}

describe("dailyWorkedMinutes", () => {
  it("computes a normal day with a lunch break", () => {
    // 9:00 AM to 5:30 PM with 30-minute lunch = 8h 0m = 480 min
    const r = dailyWorkedMinutes(
      day({ start: "9:00 AM", end: "5:30 PM", breakMinutes: 30 }),
      baseOptions
    );
    expect(r.valid).toBe(true);
    expect(r.workedMinutes).toBe(480);
  });

  it("treats fully blank rows as empty, not errors", () => {
    const r = dailyWorkedMinutes(day({}), baseOptions);
    expect(r.empty).toBe(true);
    expect(r.error).toBeNull();
    expect(r.workedMinutes).toBe(0);
  });

  it("flags incomplete rows", () => {
    const r = dailyWorkedMinutes(day({ start: "9:00 AM" }), baseOptions);
    expect(r.valid).toBe(false);
    expect(r.empty).toBe(false);
    expect(r.error).toMatch(/both/i);
  });

  it("flags invalid times", () => {
    const r = dailyWorkedMinutes(
      day({ start: "nope", end: "5:00 PM" }),
      baseOptions
    );
    expect(r.error).toMatch(/start/i);
  });

  it("handles overnight shifts via auto-detect (end <= start)", () => {
    // 10:00 PM to 6:00 AM = 8h
    const r = dailyWorkedMinutes(
      day({ start: "10:00 PM", end: "6:00 AM" }),
      baseOptions
    );
    expect(r.valid).toBe(true);
    expect(r.workedMinutes).toBe(480);
  });

  it("handles overnight shifts via explicit toggle", () => {
    // 11:00 PM to 11:30 PM next day with toggle = 24h - but that exceeds 24h?
    // Use 11:00 PM to 7:00 AM explicitly.
    const r = dailyWorkedMinutes(
      day({ start: "11:00 PM", end: "7:00 AM", overnight: true }),
      baseOptions
    );
    expect(r.workedMinutes).toBe(8 * 60);
  });

  it("rejects break longer than shift", () => {
    const r = dailyWorkedMinutes(
      day({ start: "9:00 AM", end: "10:00 AM", breakMinutes: 90 }),
      baseOptions
    );
    expect(r.error).toMatch(/break/i);
  });

  it("applies 15-minute punch rounding", () => {
    // 9:07 -> 9:00, 5:08 -> 5:15 (17:08 -> 17:15). Span = 8h15m = 495
    const r = dailyWorkedMinutes(
      day({ start: "9:07 AM", end: "5:08 PM" }),
      { ...baseOptions, rounding: "15" }
    );
    expect(r.workedMinutes).toBe(495);
  });
});
