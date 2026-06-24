"use client";

/**
 * "Saved timesheets" experience. Reads the local-only store and lets the user
 * review or delete saved timesheets and employee presets. Nothing leaves the
 * device.
 */

import { useEffect, useState } from "react";
import {
  clearRecent,
  deletePreset,
  deleteRecent,
  getPresets,
  getRecent,
  type EmployeePreset,
  type RecentTimesheet,
} from "../lib/storage";

export function SavedManager() {
  const [recent, setRecent] = useState<RecentTimesheet[]>([]);
  const [presets, setPresets] = useState<EmployeePreset[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRecent(getRecent());
    setPresets(getPresets());
    setReady(true);
  }, []);

  if (!ready) {
    return <p className="text-ink-700">Loading your saved items…</p>;
  }

  const empty = recent.length === 0 && presets.length === 0;

  return (
    <div className="space-y-10">
      {empty && (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-ink-700">
          You haven&rsquo;t saved anything yet. Open any calculator, fill it in,
          then use <strong>Save timesheet</strong> or <strong>Save employee
          preset</strong>. Saved items live only in this browser.
        </p>
      )}

      {recent.length > 0 && (
        <section aria-labelledby="recent-h">
          <div className="flex items-center justify-between">
            <h2 id="recent-h" className="text-xl font-semibold text-ink-900">
              Recent timesheets
            </h2>
            <button
              type="button"
              onClick={() => {
                clearRecent();
                setRecent([]);
              }}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-ink-700 hover:bg-slate-100"
            >
              Clear all
            </button>
          </div>
          <ul className="mt-4 space-y-2">
            {recent.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4"
              >
                <div>
                  <p className="font-medium text-ink-900">{r.label}</p>
                  <p className="text-sm text-ink-700">
                    {r.mode === "biweekly" ? "Biweekly" : "Weekly"} ·{" "}
                    {r.totalDecimalHours.toFixed(2)} decimal hours · saved{" "}
                    {new Date(r.savedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRecent(deleteRecent(r.id))}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  aria-label={`Delete ${r.label}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {presets.length > 0 && (
        <section aria-labelledby="presets-h">
          <h2 id="presets-h" className="text-xl font-semibold text-ink-900">
            Employee presets
          </h2>
          <ul className="mt-4 space-y-2">
            {presets.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4"
              >
                <div>
                  <p className="font-medium text-ink-900">{p.name}</p>
                  <p className="text-sm text-ink-700">
                    {p.hourlyRate != null ? `$${p.hourlyRate.toFixed(2)}/hr · ` : ""}
                    {p.options.overtime.mode} overtime · {p.options.timeFormat}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPresets(deletePreset(p.id))}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  aria-label={`Delete preset ${p.name}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
