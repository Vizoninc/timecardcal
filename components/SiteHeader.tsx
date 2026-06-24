import Link from "next/link";

const NAV = [
  { href: "/time-card-calculator", label: "Time Card" },
  { href: "/timesheet-calculator", label: "Timesheet" },
  { href: "/work-hours-calculator", label: "Work Hours" },
  { href: "/saved", label: "Saved" },
];

/** Minimal, server-rendered global header. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg text-lg font-black tracking-tight text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-base font-bold text-white shadow-pop"
          >
            ⏱
          </span>
          <span>
            TimeCard<span className="text-brand-600">Calc</span>
          </span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-0.5 text-sm font-semibold sm:gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-ink-700 transition hover:bg-brand-50 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
