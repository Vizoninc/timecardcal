/**
 * Local-only persistence helpers. Everything lives in the browser's
 * localStorage; nothing is sent to a server. All functions are SSR-safe
 * (they no-op when `window` is undefined).
 */

import type { CalcOptions, DayInput } from "./calculations/types";

const KEYS = {
  presets: "tcc:employee-presets:v1",
  recent: "tcc:recent:v1",
} as const;

export interface EmployeePreset {
  id: string;
  name: string;
  hourlyRate: number | null;
  options: CalcOptions;
}

export interface RecentTimesheet {
  id: string;
  savedAt: number;
  label: string;
  mode: "weekly" | "biweekly";
  days: DayInput[];
  options: CalcOptions;
  totalDecimalHours: number;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or privacy mode — fail silently; the app still works in-memory.
  }
}

/* ----- Employee presets ----- */

export function getPresets(): EmployeePreset[] {
  return read<EmployeePreset[]>(KEYS.presets, []);
}

export function savePreset(preset: EmployeePreset): EmployeePreset[] {
  const all = getPresets().filter((p) => p.id !== preset.id);
  const next = [preset, ...all].slice(0, 50);
  write(KEYS.presets, next);
  return next;
}

export function deletePreset(id: string): EmployeePreset[] {
  const next = getPresets().filter((p) => p.id !== id);
  write(KEYS.presets, next);
  return next;
}

/* ----- Recent timesheets ----- */

export function getRecent(): RecentTimesheet[] {
  return read<RecentTimesheet[]>(KEYS.recent, []);
}

export function addRecent(entry: RecentTimesheet): RecentTimesheet[] {
  const all = getRecent();
  const next = [entry, ...all].slice(0, 25);
  write(KEYS.recent, next);
  return next;
}

export function deleteRecent(id: string): RecentTimesheet[] {
  const next = getRecent().filter((r) => r.id !== id);
  write(KEYS.recent, next);
  return next;
}

export function clearRecent(): void {
  write(KEYS.recent, []);
}
