import Link from "next/link";
import { SITE } from "../lib/seo/site";

const NAV = [
  { href: "/time-card-calculator", label: "Time Card" },
  { href: "/timesheet-calculator", label: "Timesheet" },
  { href: "/work-hours-calculator", label: "Work Hours" },
  { href: "/saved", label: "Saved" },
];

/** Minimal, server-rendered global header. */
export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white print:hidden">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded font-bold text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-md bg-brand-500 text-sm font-bold text-white"
          >
            ⏱
          </span>
          <span>{SITE.name}</span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-1 text-sm sm:gap-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded px-2 py-1 text-ink-700 hover:bg-slate-100 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
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
