/**
 * Pay calculation. Pure functions.
 */

import { minutesToDecimalHours } from "./decimal";

export interface PayInput {
  regularMinutes: number;
  overtimeMinutes: number;
  hourlyRate: number;
  /** Overtime multiplier (e.g. 1.5). */
  multiplier: number;
}

export interface PayResult {
  regularPay: number;
  overtimePay: number;
  grossPay: number;
}

/** Round a currency amount to cents. */
export function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function calcPay(input: PayInput): PayResult {
  const rate = Math.max(0, input.hourlyRate);
  const mult = Math.max(0, input.multiplier);

  // Use full-precision decimal hours (not the 2dp display value) for money.
  const regularHours = input.regularMinutes / 60;
  const overtimeHours = input.overtimeMinutes / 60;

  const regularPay = roundCurrency(regularHours * rate);
  const overtimePay = roundCurrency(overtimeHours * rate * mult);
  const grossPay = roundCurrency(regularPay + overtimePay);

  return { regularPay, overtimePay, grossPay };
}

/** Convenience for displaying decimal hours alongside pay. */
export function payDecimalHours(minutes: number): number {
  return minutesToDecimalHours(minutes, 2);
}
