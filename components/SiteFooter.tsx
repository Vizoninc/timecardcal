import Link from "next/link";
import { SITE } from "../lib/seo/site";
import { VERIFY_DISCLAIMER } from "../content/data/pages";

const TOOLS = [
  { href: "/time-card-calculator", label: "Time Card Calculator" },
  { href: "/timesheet-calculator", label: "Timesheet Calculator" },
  { href: "/work-hours-calculator", label: "Work Hours Calculator" },
  { href: "/time-card-calculator-with-lunch-break", label: "Time Card with Lunch Break" },
  { href: "/biweekly-timesheet-calculator", label: "Biweekly Timesheet Calculator" },
  { href: "/minutes-to-decimal-payroll", label: "Minutes to Decimal (Payroll)" },
  { href: "/decimal-hours-calculator", label: "Decimal Hours Calculator" },
  { href: "/embed-widget", label: "Embed on Your Site" },
  { href: "/how-to-use", label: "How to Use the Calculator" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 print:hidden">
      <div className="mx-auto max-w-content px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-ink-900">{SITE.name}</p>
            <p className="mt-2 max-w-prose text-sm text-ink-700">
              {SITE.description}
            </p>
          </div>
          <nav aria-label="All calculators">
            <p className="text-sm font-semibold text-ink-900">Calculators</p>
            <ul className="mt-2 grid gap-1 text-sm">
              {TOOLS.map((t) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="rounded text-ink-700 hover:text-brand-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-500">
          {VERIFY_DISCLAIMER}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          © {new Date().getFullYear()} {SITE.name}. Calculations run locally in
          your browser.
        </p>
      </div>
    </footer>
  );
}
