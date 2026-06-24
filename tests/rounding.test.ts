import { describe, it, expect } from "vitest";
import {
  applyRounding,
  roundingIntervalMinutes,
} from "../lib/calculations/rounding";

describe("roundingIntervalMinutes", () => {
  it("maps modes to intervals", () => {
    expect(roundingIntervalMinutes("none")).toBe(0);
    expect(roundingIntervalMinutes("5")).toBe(5);
    expect(roundingIntervalMinutes("6")).toBe(6);
    expect(roundingIntervalMinutes("15")).toBe(15);
  });
});

describe("applyRounding", () => {
  it("returns input unchanged when none", () => {
    expect(applyRounding(523, "none")).toBe(523);
  });

  it("rounds to nearest 15", () => {
    expect(applyRounding(7, "15")).toBe(0);
    expect(applyRounding(8, "15")).toBe(15);
    expect(applyRounding(521, "15")).toBe(525); // 521 -> nearest 15 = 525
  });

  it("rounds half up", () => {
    // 7.5 is the midpoint for interval 15 -> rounds up to 15
    expect(applyRounding(7.5, "15")).toBe(15);
  });

  it("rounds to nearest 6 (tenths of an hour)", () => {
    expect(applyRounding(3, "6")).toBe(6); // half rounds up
    expect(applyRounding(2, "6")).toBe(0);
    expect(applyRounding(9, "6")).toBe(12);
  });

  it("rounds to nearest 5", () => {
    expect(applyRounding(12, "5")).toBe(10);
    expect(applyRounding(13, "5")).toBe(15);
  });
});
