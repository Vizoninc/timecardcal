import { describe, it, expect } from "vitest";
import { calcPay, roundCurrency } from "../lib/calculations/pay";

describe("calcPay", () => {
  it("computes regular pay with no overtime", () => {
    const r = calcPay({
      regularMinutes: 40 * 60,
      overtimeMinutes: 0,
      hourlyRate: 20,
      multiplier: 1.5,
    });
    expect(r.regularPay).toBe(800);
    expect(r.overtimePay).toBe(0);
    expect(r.grossPay).toBe(800);
  });

  it("computes overtime pay at the multiplier", () => {
    const r = calcPay({
      regularMinutes: 40 * 60,
      overtimeMinutes: 5 * 60,
      hourlyRate: 20,
      multiplier: 1.5,
    });
    expect(r.regularPay).toBe(800);
    expect(r.overtimePay).toBe(150); // 5 * 20 * 1.5
    expect(r.grossPay).toBe(950);
  });

  it("handles fractional hours and rounds to cents", () => {
    const r = calcPay({
      regularMinutes: 95, // 1.5833... h
      overtimeMinutes: 0,
      hourlyRate: 18.5,
      multiplier: 1.5,
    });
    // 95/60 * 18.5 = 29.2916... -> 29.29
    expect(r.regularPay).toBe(29.29);
  });
});

describe("roundCurrency", () => {
  it("rounds to two decimals", () => {
    expect(roundCurrency(29.291666)).toBe(29.29);
    expect(roundCurrency(12.344)).toBe(12.34);
    expect(roundCurrency(12.346)).toBe(12.35);
  });
});
