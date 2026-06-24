import { describe, it, expect } from "vitest";
import {
  minutesToDecimalHours,
  decimalHoursToMinutes,
} from "../lib/calculations/decimal";

describe("minutesToDecimalHours", () => {
  it("converts the classic payroll fractions", () => {
    expect(minutesToDecimalHours(15)).toBe(0.25);
    expect(minutesToDecimalHours(30)).toBe(0.5);
    expect(minutesToDecimalHours(45)).toBe(0.75);
    expect(minutesToDecimalHours(60)).toBe(1);
  });

  it("rounds to 2 decimal places by default", () => {
    expect(minutesToDecimalHours(20)).toBe(0.33);
    expect(minutesToDecimalHours(40)).toBe(0.67);
  });

  it("supports custom precision", () => {
    expect(minutesToDecimalHours(20, 4)).toBe(0.3333);
  });
});

describe("decimalHoursToMinutes", () => {
  it("round-trips", () => {
    expect(decimalHoursToMinutes(0.25)).toBe(15);
    expect(decimalHoursToMinutes(1.5)).toBe(90);
  });
});
