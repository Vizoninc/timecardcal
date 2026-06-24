/** Decorative, non-interactive mockup of a filled timesheet for the hero. */
export function HeroPreview() {
  const rows = [
    { d: "Mon", s: "9:00", e: "5:30", t: "8:00" },
    { d: "Tue", s: "9:00", e: "5:30", t: "8:00" },
    { d: "Wed", s: "8:00", e: "4:00", t: "7:30" },
    { d: "Thu", s: "9:00", e: "6:00", t: "8:30" },
    { d: "Fri", s: "9:00", e: "5:00", t: "8:00" },
  ];
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-sm rotate-1 rounded-2xl border border-white/10 bg-white p-4 shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">This week</span>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">Weekly</span>
      </div>
      <div className="mt-3 space-y-1.5">
        {rows.map((r) => (
          <div key={r.d} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-sm">
            <span className="font-medium text-ink-800">{r.d}</span>
            <span className="font-mono text-xs text-ink-700">{r.s}–{r.e}</span>
            <span className="font-mono font-semibold text-ink-900">{r.t}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-brand-600 p-3 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-100">Total</p>
          <p className="font-mono text-2xl font-bold">40:00</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-700">Decimal</p>
          <p className="font-mono text-2xl font-bold text-ink-900">40.00</p>
        </div>
      </div>
    </div>
  );
}
