"use client";

/**
 * The flagship interactive calculator. This is the ONLY substantial client
 * component on a page; all marketing copy around it stays server-rendered.
 *
 * It maps UI state into the pure calculation engine and renders results with
 * accessible, screen-reader-friendly summaries. Persistence (presets / recent)
 * and shareable URLs are local-only.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type {
  CalcOptions,
  DayInput,
  OvertimeConfig,
  OvertimeMode,
  RoundingMode,
  TimeFormat,
} from "../lib/calculations/types";
import { calculateWeek } from "../lib/calculations/engine";
import { formatDurationHhmm } from "../lib/calculations/time";
import { buildCsv, csvFilename } from "../lib/export";
import {
  addRecent,
  getPresets,
  getRecent,
  savePreset,
  type EmployeePreset,
  type RecentTimesheet,
} from "../lib/storage";
import { buildShareUrl, readShareParam } from "../lib/url";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type Mode = "weekly" | "biweekly";

const DEFAULT_OVERTIME: OvertimeConfig = {
  mode: "none",
  weeklyThresholdHours: 40,
  dailyThresholdHours: 8,
  multiplier: 1.5,
};

function makeDays(mode: Mode): DayInput[] {
  const count = mode === "biweekly" ? 14 : 7;
  return Array.from({ length: count }, (_, i) => ({
    id: `day-${i}`,
    label:
      mode === "biweekly"
        ? `Day ${i + 1} (${WEEKDAYS[i % 7].slice(0, 3)})`
        : WEEKDAYS[i],
    start: "",
    end: "",
    breakMinutes: 0,
    overnight: false,
  }));
}

export interface CalculatorProps {
  initialMode?: Mode;
  initialOptions?: Partial<CalcOptions>;
}

export function Calculator({
  initialMode = "weekly",
  initialOptions = {},
}: CalculatorProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(
    initialOptions.timeFormat ?? "12h"
  );
  const [rounding, setRounding] = useState<RoundingMode>(
    initialOptions.rounding ?? "none"
  );
  const [overtime, setOvertime] = useState<OvertimeConfig>({
    ...DEFAULT_OVERTIME,
    ...(initialOptions.overtime ?? {}),
  });
  const [rateText, setRateText] = useState<string>(
    initialOptions.hourlyRate != null ? String(initialOptions.hourlyRate) : ""
  );
  const [days, setDays] = useState<DayInput[]>(() => makeDays(initialMode));

  const [presets, setPresets] = useState<EmployeePreset[]>([]);
  const [recent, setRecent] = useState<RecentTimesheet[]>([]);
  const [shareMsg, setShareMsg] = useState<string>("");

  const liveRef = useRef<HTMLDivElement | null>(null);

  // Hydrate persistence + any shared settings from the URL on mount.
  useEffect(() => {
    setPresets(getPresets());
    setRecent(getRecent());

    const shared = readShareParam(window.location.search);
    if (shared) {
      setMode(shared.mode);
      if (shared.options.timeFormat) setTimeFormat(shared.options.timeFormat);
      if (shared.options.rounding) setRounding(shared.options.rounding);
      if (shared.options.overtime)
        setOvertime({ ...DEFAULT_OVERTIME, ...shared.options.overtime });
      if (shared.options.hourlyRate != null)
        setRateText(String(shared.options.hourlyRate));
      if (shared.days && shared.days.length) setDays(shared.days);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switching mode rebuilds the day grid (preserving entries where possible).
  function changeMode(next: Mode) {
    setMode(next);
    setDays((prev) => {
      const base = makeDays(next);
      return base.map((d, i) => (prev[i] ? { ...d, ...prev[i], id: d.id, label: d.label } : d));
    });
  }

  const hourlyRate = useMemo<number | null>(() => {
    if (rateText.trim() === "") return null;
    const n = Number(rateText);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }, [rateText]);

  const options: CalcOptions = useMemo(
    () => ({ timeFormat, rounding, overtime, hourlyRate }),
    [timeFormat, rounding, overtime, hourlyRate]
  );

  const result = useMemo(() => calculateWeek(days, options), [days, options]);

  // Announce totals when they change.
  useEffect(() => {
    if (!liveRef.current) return;
    liveRef.current.textContent = `Total ${formatDurationHhmm(
      result.totalMinutes
    )}, ${result.totalDecimalHours.toFixed(2)} decimal hours.`;
  }, [result.totalMinutes, result.totalDecimalHours]);

  function updateDay(id: string, patch: Partial<DayInput>) {
    setDays((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }

  function resetAll() {
    setDays(makeDays(mode));
    setRateText("");
    setOvertime(DEFAULT_OVERTIME);
    setShareMsg("");
  }

  function handleExportCsv() {
    const csv = buildCsv(days, result, {
      rateLabel: hourlyRate != null ? `$${hourlyRate.toFixed(2)}/hr` : undefined,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = csvFilename(mode === "biweekly" ? "biweekly-timesheet" : "timesheet");
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleSaveRecent() {
    const entry: RecentTimesheet = {
      id: `ts-${Date.now()}`,
      savedAt: Date.now(),
      label: `${mode === "biweekly" ? "Biweekly" : "Weekly"} • ${formatDurationHhmm(
        result.totalMinutes
      )}`,
      mode,
      days,
      options,
      totalDecimalHours: result.totalDecimalHours,
    };
    setRecent(addRecent(entry));
    setShareMsg("Saved to this device.");
  }

  function handleSavePreset() {
    const name = window.prompt("Name this employee preset (e.g. 'Jordan – Cashier'):");
    if (!name) return;
    const preset: EmployeePreset = {
      id: `preset-${Date.now()}`,
      name,
      hourlyRate,
      options,
    };
    setPresets(savePreset(preset));
    setShareMsg(`Preset "${name}" saved.`);
  }

  function applyPreset(p: EmployeePreset) {
    setTimeFormat(p.options.timeFormat);
    setRounding(p.options.rounding);
    setOvertime({ ...DEFAULT_OVERTIME, ...p.options.overtime });
    setRateText(p.hourlyRate != null ? String(p.hourlyRate) : "");
  }

  function loadRecent(r: RecentTimesheet) {
    setMode(r.mode);
    setDays(r.days);
    setTimeFormat(r.options.timeFormat);
    setRounding(r.options.rounding);
    setOvertime({ ...DEFAULT_OVERTIME, ...r.options.overtime });
    setRateText(r.options.hourlyRate != null ? String(r.options.hourlyRate) : "");
    setShareMsg("Loaded a saved timesheet.");
  }

  async function handleShare() {
    const base = `${window.location.origin}${window.location.pathname}`;
    const url = buildShareUrl(base, { mode, options });
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("Shareable link (settings only) copied to clipboard.");
    } catch {
      setShareMsg(url);
    }
  }

  const timePlaceholder = timeFormat === "12h" ? "9:00 AM" : "09:00";
  const showPay = hourlyRate != null;

  return (
    <section aria-label="Time card calculator" className="calc-root">
      {/* Settings */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
        <h2 className="sr-only">Calculator settings</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <fieldset>
            <legend className="text-sm font-medium text-ink-900">Pay period</legend>
            <div className="mt-1 flex rounded-lg border border-slate-300 p-0.5">
              {(["weekly", "biweekly"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => changeMode(m)}
                  aria-pressed={mode === m}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition ${
                    mode === m
                      ? "bg-brand-500 text-white"
                      : "text-ink-700 hover:bg-slate-100"
                  }`}
                >
                  {m === "weekly" ? "Weekly (7)" : "Biweekly (14)"}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="timeFormat" className="text-sm font-medium text-ink-900">
              Time format
            </label>
            <select
              id="timeFormat"
              value={timeFormat}
              onChange={(e) => setTimeFormat(e.target.value as TimeFormat)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </div>

          <div>
            <label htmlFor="rounding" className="text-sm font-medium text-ink-900">
              Rounding
            </label>
            <select
              id="rounding"
              value={rounding}
              onChange={(e) => setRounding(e.target.value as RoundingMode)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="none">None (exact)</option>
              <option value="5">Nearest 5 min</option>
              <option value="6">Nearest 6 min (1/10 hr)</option>
              <option value="15">Nearest 15 min</option>
            </select>
          </div>

          <div>
            <label htmlFor="rate" className="text-sm font-medium text-ink-900">
              Hourly rate (optional)
            </label>
            <div className="mt-1 flex items-center rounded-lg border border-slate-300 px-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
              <span aria-hidden="true" className="text-slate-400">$</span>
              <input
                id="rate"
                inputMode="decimal"
                value={rateText}
                onChange={(e) => setRateText(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent px-1 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Overtime controls */}
        <fieldset className="mt-4 border-t border-slate-100 pt-4">
          <legend className="text-sm font-medium text-ink-900">Overtime</legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="otMode" className="text-xs font-medium text-ink-700">
                Rule
              </label>
              <select
                id="otMode"
                value={overtime.mode}
                onChange={(e) =>
                  setOvertime((o) => ({ ...o, mode: e.target.value as OvertimeMode }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                <option value="none">None</option>
                <option value="weekly">Weekly threshold</option>
                <option value="daily_weekly">Daily + weekly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label htmlFor="weeklyT" className="text-xs font-medium text-ink-700">
                Weekly hours
              </label>
              <input
                id="weeklyT"
                type="number"
                min={0}
                step={0.5}
                value={overtime.weeklyThresholdHours}
                disabled={overtime.mode === "none"}
                onChange={(e) =>
                  setOvertime((o) => ({
                    ...o,
                    weeklyThresholdHours: Number(e.target.value) || 0,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label htmlFor="dailyT" className="text-xs font-medium text-ink-700">
                Daily hours
              </label>
              <input
                id="dailyT"
                type="number"
                min={0}
                step={0.5}
                value={overtime.dailyThresholdHours}
                disabled={overtime.mode === "none" || overtime.mode === "weekly"}
                onChange={(e) =>
                  setOvertime((o) => ({
                    ...o,
                    dailyThresholdHours: Number(e.target.value) || 0,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label htmlFor="otMult" className="text-xs font-medium text-ink-700">
                OT multiplier
              </label>
              <input
                id="otMult"
                type="number"
                min={1}
                step={0.1}
                value={overtime.multiplier}
                disabled={overtime.mode === "none"}
                onChange={(e) =>
                  setOvertime((o) => ({
                    ...o,
                    multiplier: Number(e.target.value) || 1,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
        </fieldset>
      </div>

      {/* Day grid */}
      {/* Mobile: stacked day cards (table shows at >= sm) */}
      <div className="mt-5 space-y-3 sm:hidden">
        {days.map((d, i) => {
          const r = result.days[i];
          const hasError = !!r.error;
          return (
            <div
              key={d.id}
              className={`rounded-2xl border p-4 shadow-card ${
                hasError ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-900">{d.label}</span>
                <span className="font-mono tabular-nums text-ink-900">
                  {r.empty ? (
                    <span className="text-slate-300">—</span>
                  ) : hasError ? (
                    <span className="font-sans text-xs text-red-600" role="alert">
                      {r.error}
                    </span>
                  ) : (
                    formatDurationHhmm(r.workedMinutes)
                  )}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="block text-xs font-medium text-ink-700">
                  Start
                  <input
                    aria-label={`${d.label} start time`}
                    value={d.start}
                    onChange={(e) => updateDay(d.id, { start: e.target.value })}
                    placeholder={timePlaceholder}
                    aria-invalid={hasError}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </label>
                <label className="block text-xs font-medium text-ink-700">
                  End
                  <input
                    aria-label={`${d.label} end time`}
                    value={d.end}
                    onChange={(e) => updateDay(d.id, { end: e.target.value })}
                    placeholder={timePlaceholder}
                    aria-invalid={hasError}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </label>
              </div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <label className="block text-xs font-medium text-ink-700">
                  Break (min)
                  <input
                    type="number"
                    min={0}
                    step={5}
                    aria-label={`${d.label} unpaid break minutes`}
                    value={d.breakMinutes === 0 ? "" : d.breakMinutes}
                    onChange={(e) =>
                      updateDay(d.id, { breakMinutes: Number(e.target.value) || 0 })
                    }
                    placeholder="0"
                    className="mt-1 w-24 rounded-md border border-slate-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </label>
                <label className="inline-flex items-center gap-2 py-2 text-sm text-ink-800">
                  <input
                    type="checkbox"
                    checked={d.overnight}
                    onChange={(e) => updateDay(d.id, { overnight: e.target.checked })}
                    className="h-5 w-5 rounded border-slate-300 text-brand-500 focus:ring-brand-100"
                  />
                  Overnight
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card sm:block">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">
            Enter start time, end time, and unpaid break minutes for each day.
          </caption>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-ink-700">
              <th scope="col" className="px-3 py-2">Day</th>
              <th scope="col" className="px-3 py-2">Start</th>
              <th scope="col" className="px-3 py-2">End</th>
              <th scope="col" className="px-3 py-2">Break (min)</th>
              <th scope="col" className="px-3 py-2">Overnight</th>
              <th scope="col" className="px-3 py-2 text-right">Worked</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d, i) => {
              const r = result.days[i];
              const hasError = !!r.error;
              return (
                <tr
                  key={d.id}
                  className={`border-b border-slate-100 ${hasError ? "bg-red-50" : ""}`}
                >
                  <th scope="row" className="whitespace-nowrap px-3 py-2 text-left font-medium text-ink-900">
                    {d.label}
                  </th>
                  <td className="px-3 py-2">
                    <label className="sr-only" htmlFor={`${d.id}-start`}>
                      {d.label} start time
                    </label>
                    <input
                      id={`${d.id}-start`}
                      value={d.start}
                      onChange={(e) => updateDay(d.id, { start: e.target.value })}
                      placeholder={timePlaceholder}
                      aria-invalid={hasError}
                      className="w-24 rounded-md border border-slate-300 px-2 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <label className="sr-only" htmlFor={`${d.id}-end`}>
                      {d.label} end time
                    </label>
                    <input
                      id={`${d.id}-end`}
                      value={d.end}
                      onChange={(e) => updateDay(d.id, { end: e.target.value })}
                      placeholder={timePlaceholder}
                      aria-invalid={hasError}
                      className="w-24 rounded-md border border-slate-300 px-2 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <label className="sr-only" htmlFor={`${d.id}-break`}>
                      {d.label} unpaid break minutes
                    </label>
                    <input
                      id={`${d.id}-break`}
                      type="number"
                      min={0}
                      step={5}
                      value={d.breakMinutes === 0 ? "" : d.breakMinutes}
                      onChange={(e) =>
                        updateDay(d.id, { breakMinutes: Number(e.target.value) || 0 })
                      }
                      placeholder="0"
                      className="w-20 rounded-md border border-slate-300 px-2 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={d.overnight}
                        onChange={(e) => updateDay(d.id, { overnight: e.target.checked })}
                        className="h-5 w-5 rounded border-slate-300 text-brand-500 focus:ring-brand-100"
                      />
                      <span className="sr-only">{d.label} crosses midnight</span>
                    </label>
                  </td>
                  <td className="px-3 py-2 text-right font-mono tabular-nums">
                    {r.empty ? (
                      <span className="text-slate-300">—</span>
                    ) : hasError ? (
                      <span className="text-xs font-sans text-red-600" role="alert">
                        {r.error}
                      </span>
                    ) : (
                      <span className="text-ink-900">{formatDurationHhmm(r.workedMinutes)}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Controls — placed away from ad slots and after the inputs they affect. */}
      <div className="sticky-actions mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={resetAll}
          className="btn-ghost"
        >
          Reset / clear
        </button>
        <button
          type="button"
          onClick={handleExportCsv}
          className="btn-ghost"
        >
          Export CSV
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-ghost"
        >
          Print / save as PDF
        </button>
        <button
          type="button"
          onClick={handleSaveRecent}
          className="btn-ghost"
        >
          Save timesheet
        </button>
        <button
          type="button"
          onClick={handleSavePreset}
          className="btn-ghost"
        >
          Save employee preset
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="btn-ghost"
        >
          Copy share link
        </button>
      </div>
      {shareMsg && (
        <p className="mt-2 break-all text-sm text-brand-700" role="status">
          {shareMsg}
        </p>
      )}

      {/* Totals — the report summary, also what prints. */}
      <div id="report" className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Total label="Total (hh:mm)" value={formatDurationHhmm(result.totalMinutes)} primary />
        <Total
          label="Total (decimal)"
          value={<AnimatedNumber value={result.totalDecimalHours} decimals={2} />}
          primary
        />
        <Total
          label="Regular"
          value={`${formatDurationHhmm(result.regularMinutes)} · ${result.regularDecimalHours.toFixed(2)}`}
        />
        <Total
          label="Overtime"
          value={`${formatDurationHhmm(result.overtimeMinutes)} · ${result.overtimeDecimalHours.toFixed(2)}`}
        />
        {showPay && (
          <>
            <Total label="Regular pay" value={currency(result.regularPay)} />
            <Total label="Overtime pay" value={currency(result.overtimePay)} />
            <Total
              label="Gross pay"
              value={<AnimatedNumber value={result.grossPay ?? 0} decimals={2} prefix="$" />}
              primary
            />
          </>
        )}
      </div>

      {result.hasErrors && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          Some rows have errors and were not counted. Fix the highlighted rows above.
        </p>
      )}

      {/* Screen-reader live region for totals. */}
      <div ref={liveRef} aria-live="polite" className="sr-only" />

      {/* Saved data panels */}
      {(presets.length > 0 || recent.length > 0) && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 print:hidden">
          {presets.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-ink-900">Employee presets</h3>
              <ul className="mt-2 space-y-1">
                {presets.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      <span className="font-medium text-ink-900">{p.name}</span>
                      {p.hourlyRate != null && (
                        <span className="text-ink-700"> · ${p.hourlyRate.toFixed(2)}/hr</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recent.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-ink-900">Recent timesheets</h3>
              <ul className="mt-2 space-y-1">
                {recent.slice(0, 6).map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => loadRecent(r)}
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      <span className="font-medium text-ink-900">{r.label}</span>
                      <span className="text-ink-700">
                        {" "}· {new Date(r.savedAt).toLocaleDateString()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function AnimatedNumber({
  value,
  decimals = 2,
  prefix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const to = value;
    const from = fromRef.current;
    if (reduce || from === to) {
      setDisplay(to);
      fromRef.current = to;
      return;
    }
    const dur = 450;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <>
      {prefix}
      {display.toFixed(decimals)}
    </>
  );
}

function Total({
  label,
  value,
  primary = false,
}: {
  label: string;
  value: ReactNode;
  primary?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition ${
        primary
          ? "border-transparent bg-brand-600 text-white shadow-pop"
          : "border-slate-200 bg-white shadow-card"
      }`}
    >
      <p
        className={`text-xs font-bold uppercase tracking-widest ${
          primary ? "text-brand-100" : "text-ink-700"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-1.5 font-mono text-3xl font-bold tabular-nums ${
          primary ? "text-white" : "text-ink-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function currency(value: number | null): string {
  if (value == null) return "—";
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
