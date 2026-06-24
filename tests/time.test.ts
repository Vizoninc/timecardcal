import { describe, it, expect } from "vitest";
import {
  parseTimeToMinutes,
  formatMinutesAsClock,
  formatDurationHhmm,
} from "../lib/calculations/time";

describe("parseTimeToMinutes (12h)", () => {
  it("parses am/pm times", () => {
    expect(parseTimeToMinutes("9:00 AM", "12h")).toBe(540);
    expect(parseTimeToMinutes("5:30 PM", "12h")).toBe(17 * 60 + 30);
    expect(parseTimeToMinutes("12:00 PM", "12h")).toBe(720); // noon
    expect(parseTimeToMinutes("12:00 AM", "12h")).toBe(0); // midnight
  });

  it("is lenient on spacing and case", () => {
    expect(parseTimeToMinutes("9:30am", "12h")).toBe(570);
    expect(parseTimeToMinutes("  9:30   PM ", "12h")).toBe(21 * 60 + 30);
  });

  it("rejects invalid 12h hours and minutes", () => {
    expect(parseTimeToMinutes("13:00 PM", "12h")).toBeNull();
    expect(parseTimeToMinutes("9:75 AM", "12h")).toBeNull();
  });
});

describe("parseTimeToMinutes (24h)", () => {
  it("parses 24h times", () => {
    expect(parseTimeToMinutes("0", "24h")).toBe(0);
    expect(parseTimeToMinutes("17:05", "24h")).toBe(17 * 60 + 5);
    expect(parseTimeToMinutes("23:59", "24h")).toBe(23 * 60 + 59);
  });

  it("rejects out-of-range and garbage", () => {
    expect(parseTimeToMinutes("24:00", "24h")).toBeNull();
    expect(parseTimeToMinutes("abc", "24h")).toBeNull();
    expect(parseTimeToMinutes("", "24h")).toBeNull();
    expect(parseTimeToMinutes("9:30:00", "24h")).toBeNull();
  });
});

describe("formatMinutesAsClock", () => {
  it("formats 24h", () => {
    expect(formatMinutesAsClock(0, "24h")).toBe("00:00");
    expect(formatMinutesAsClock(1025, "24h")).toBe("17:05");
  });
  it("formats 12h", () => {
    expect(formatMinutesAsClock(0, "12h")).toBe("12:00 AM");
    expect(formatMinutesAsClock(720, "12h")).toBe("12:00 PM");
    expect(formatMinutesAsClock(1025, "12h")).toBe("5:05 PM");
  });
});

describe("formatDurationHhmm", () => {
  it("formats durations", () => {
    expect(formatDurationHhmm(90)).toBe("1:30");
    expect(formatDurationHhmm(605)).toBe("10:05");
    expect(formatDurationHhmm(0)).toBe("0:00");
    expect(formatDurationHhmm(-10)).toBe("0:00");
  });
});
