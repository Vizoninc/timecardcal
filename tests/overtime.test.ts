import { describe, it, expect } from "vitest";
import { overtimeSplit } from "../lib/calculations/overtime";
import type { OvertimeConfig } from "../lib/calculations/types";

const H = 60; // minutes per hour

function cfg(over: Partial<OvertimeConfig>): OvertimeConfig {
  return {
    mode: "weekly",
    weeklyThresholdHours: 40,
    dailyThresholdHours: 8,
    multiplier: 1.5,
    ...over,
  };
}

describe("overtimeSplit", () => {
  it("mode none => all regular", () => {
    const r = overtimeSplit([9 * H, 9 * H, 9 * H, 9 * H, 9 * H], cfg({ mode: "none" }));
    expect(r.overtimeMinutes).toBe(0);
    expect(r.regularMinutes).toBe(45 * H);
  });

  it("weekly threshold: 45h => 40 reg + 5 OT", () => {
    const r = overtimeSplit(
      [9 * H, 9 * H, 9 * H, 9 * H, 9 * H],
      cfg({ mode: "weekly", weeklyThresholdHours: 40 })
    );
    expect(r.regularMinutes).toBe(40 * H);
    expect(r.overtimeMinutes).toBe(5 * H);
  });

  it("weekly threshold: exactly 40h crossing point => no OT", () => {
    const r = overtimeSplit(
      [8 * H, 8 * H, 8 * H, 8 * H, 8 * H],
      cfg({ mode: "weekly", weeklyThresholdHours: 40 })
    );
    expect(r.overtimeMinutes).toBe(0);
    expect(r.regularMinutes).toBe(40 * H);
  });

  it("daily_weekly: a 10h day yields 2h daily OT", () => {
    const r = overtimeSplit(
      [10 * H, 0, 0, 0, 0],
      cfg({ mode: "daily_weekly", dailyThresholdHours: 8, weeklyThresholdHours: 40 })
    );
    expect(r.regularMinutes).toBe(8 * H);
    expect(r.overtimeMinutes).toBe(2 * H);
  });

  it("daily_weekly: daily OT is not double-counted in weekly OT", () => {
    // Five 10h days = 50h total. Daily OT = 5 * 2h = 10h.
    // Regular candidate = 5 * 8h = 40h, which is exactly the weekly threshold,
    // so no extra weekly OT. Total OT = 10h, regular = 40h.
    const r = overtimeSplit(
      [10 * H, 10 * H, 10 * H, 10 * H, 10 * H],
      cfg({ mode: "daily_weekly", dailyThresholdHours: 8, weeklyThresholdHours: 40 })
    );
    expect(r.regularMinutes).toBe(40 * H);
    expect(r.overtimeMinutes).toBe(10 * H);
  });

  it("daily_weekly: weekly OT stacks on top of regular days", () => {
    // Six 8h days = 48h. No daily OT (all <= 8h). Weekly OT = 48 - 40 = 8h.
    const r = overtimeSplit(
      [8 * H, 8 * H, 8 * H, 8 * H, 8 * H, 8 * H],
      cfg({ mode: "daily_weekly", dailyThresholdHours: 8, weeklyThresholdHours: 40 })
    );
    expect(r.regularMinutes).toBe(40 * H);
    expect(r.overtimeMinutes).toBe(8 * H);
  });

  it("custom thresholds work like daily_weekly", () => {
    // Daily threshold 10h, weekly 45h. A 12h day => 2h daily OT.
    const r = overtimeSplit(
      [12 * H, 0, 0, 0, 0],
      cfg({ mode: "custom", dailyThresholdHours: 10, weeklyThresholdHours: 45 })
    );
    expect(r.overtimeMinutes).toBe(2 * H);
    expect(r.regularMinutes).toBe(10 * H);
  });
});
