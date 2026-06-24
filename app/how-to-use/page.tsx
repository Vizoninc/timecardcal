import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Faq } from "../../components/Faq";
import { JsonLd } from "../../components/JsonLd";
import { buildMetadata } from "../../lib/seo/metadata";
import { breadcrumbSchema, organizationSchema } from "../../lib/schema/jsonld";
import type { Breadcrumb } from "../../lib/schema/jsonld";
import { absoluteUrl } from "../../lib/seo/site";
import type { FaqItem } from "../../content/data/pages";

export const metadata: Metadata = buildMetadata({
  title: "How to Use the Time Card Calculator — Full Guide",
  description:
    "A simple, friendly guide to the Time Card Calculator: enter your hours, handle lunch breaks and overnight shifts, set overtime, see pay, and print or export your timesheet.",
  path: "/how-to-use",
});

const crumbs: Breadcrumb[] = [
  { name: "Home", path: "/" },
  { name: "How to Use", path: "/how-to-use" },
];

const CAN_DO = [
  { t: "Total your hours", d: "Add a whole week (or two weeks) of shifts and get the total instantly — no math on your part." },
  { t: "Subtract lunch breaks", d: "Enter unpaid break minutes per day and they're removed automatically." },
  { t: "Handle overnight shifts", d: "Shifts that cross midnight (e.g. 10 PM–6 AM) are calculated correctly." },
  { t: "Split overtime", d: "Choose weekly, daily+weekly, or custom overtime rules and see regular vs. overtime hours." },
  { t: "Estimate pay", d: "Add an hourly rate to see regular pay, overtime pay, and gross pay." },
  { t: "Show hh:mm and decimal", d: "Get totals both as hours:minutes and as decimal hours for payroll." },
  { t: "Print or export", d: "Print a clean report (or save as PDF) and export a CSV for your records." },
  { t: "Save on your device", d: "Save timesheets and employee presets locally — no account, nothing uploaded." },
];

const STEPS = [
  { name: "Choose your pay period", text: "Pick Weekly (7 days) or Biweekly (14 days) at the top of the calculator." },
  { name: "Pick your time format", text: "Choose 12-hour (AM/PM) or 24-hour, whichever matches how you read the clock." },
  { name: "Enter each day's times", text: "For every day you worked, type a start time and an end time. Leave days you didn't work blank." },
  { name: "Add unpaid breaks", text: "In the Break column, enter unpaid minutes (e.g. 30 for a half-hour lunch). Leave it at 0 for paid breaks." },
  { name: "Flag overnight shifts if needed", text: "If a shift ran past midnight, tick the Overnight box on that row (it also auto-detects when the end time is earlier than the start)." },
  { name: "Set overtime and rate (optional)", text: "Choose an overtime rule, and add your hourly rate if you want to see pay." },
  { name: "Read your totals", text: "Your daily totals, weekly totals, overtime split, and pay update instantly as you type." },
  { name: "Print, export, or save", text: "Print a clean report, export a CSV, or save the timesheet to your device." },
];

const FAQS: FaqItem[] = [
  { q: "Do I need an account?", a: "No. The calculator is free and works with no sign-in. Anything you save is stored only in your own browser." },
  { q: "Is my data private?", a: "Yes. All calculations happen in your browser. Nothing you type is sent to or stored on a server." },
  { q: "Why are my totals slightly different from my employer's?", a: "The two most common reasons are the rounding setting and the unpaid-break minutes. Match those to your employer's rules and the numbers should line up." },
  { q: "How do I total an overnight shift?", a: "Enter the start and end times normally. If the end is earlier than the start, it's treated as crossing midnight. You can also tick the Overnight box to be explicit." },
  { q: "What's the difference between hh:mm and decimal hours?", a: "hh:mm is hours and minutes (like 8:30). Decimal hours is the same time as a number (8.5), which is what most payroll systems use. The tool shows both." },
  { q: "Can I save more than one employee?", a: "Yes. Save an employee preset for each person's rate and overtime rule, then reuse it next pay period. Presets live in your browser only." },
];

function howToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to use the Time Card Calculator",
    description:
      "Total your work hours, subtract breaks, split overtime, and see pay using the free Time Card Calculator.",
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: absoluteUrl("/how-to-use"),
    })),
  };
}

export default function HowToUsePage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumbSchema(crumbs), howToSchema()]} />
      <div className="mx-auto max-w-content px-4 py-6">
        <Breadcrumbs items={crumbs} />

        <header className="mt-5 max-w-3xl animate-fade-up">
          <span className="eyebrow">Guide</span>
          <h1 className="mt-4 text-4xl font-black leading-[1.08] tracking-tight text-ink-900 sm:text-5xl">
            How to use the calculator
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-700">
            Everything the Time Card Calculator can do, in plain English — and
            exactly how to use each part. It takes about a minute to total a week.
          </p>
          <div className="mt-6">
            <Link href="/time-card-calculator" className="btn-primary">
              Open the calculator →
            </Link>
          </div>
        </header>

        {/* What it can do */}
        <section aria-labelledby="cando" className="mt-14">
          <h2 id="cando" className="text-2xl font-bold tracking-tight text-ink-900">
            What it can do for you
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {CAN_DO.map((c) => (
              <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <h3 className="font-bold text-ink-900">{c.t}</h3>
                <p className="mt-1.5 text-ink-700">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick start */}
        <section aria-labelledby="quick" className="mt-14 max-w-prose">
          <h2 id="quick" className="text-2xl font-bold tracking-tight text-ink-900">
            Quick start (the 60-second version)
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-700">
            <li>Type a <strong>start</strong> and <strong>end</strong> time for each day you worked.</li>
            <li>Enter any <strong>unpaid break</strong> minutes (like 30 for lunch).</li>
            <li>Read your <strong>total</strong> at the bottom — in both hh:mm and decimal hours.</li>
          </ol>
          <p className="mt-3 text-ink-700">
            That&rsquo;s it. Everything below is for when you want overtime, pay, or
            to save and share your timesheet.
          </p>
        </section>

        {/* Step by step */}
        <section aria-labelledby="steps" className="mt-14 max-w-prose">
          <h2 id="steps" className="text-2xl font-bold tracking-tight text-ink-900">
            Step by step
          </h2>
          <ol className="mt-5 space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.name} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-ink-900">{s.name}</h3>
                  <p className="mt-0.5 text-ink-700">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Every setting explained */}
        <section aria-labelledby="settings" className="mt-14 max-w-prose">
          <h2 id="settings" className="text-2xl font-bold tracking-tight text-ink-900">
            Every setting, explained
          </h2>

          <h3 className="mt-5 font-bold text-ink-900">Pay period</h3>
          <p className="mt-1 text-ink-700">
            <strong>Weekly</strong> shows 7 day rows; <strong>Biweekly</strong> shows
            14 for two-week pay periods. Switch any time — your other settings carry over.
          </p>

          <h3 className="mt-4 font-bold text-ink-900">Time format</h3>
          <p className="mt-1 text-ink-700">
            <strong>12-hour</strong> uses AM/PM (e.g. 9:00 AM, 5:30 PM).{" "}
            <strong>24-hour</strong> uses a 0–23 clock (e.g. 09:00, 17:30). Pick whichever you find easier.
          </p>

          <h3 className="mt-4 font-bold text-ink-900">Rounding</h3>
          <p className="mt-1 text-ink-700">
            Leave on <strong>None</strong> for exact minutes. Or round punches to the
            nearest <strong>5</strong>, <strong>6</strong> (a tenth of an hour), or{" "}
            <strong>15</strong> minutes — set this to match your employer&rsquo;s policy.
          </p>

          <h3 className="mt-4 font-bold text-ink-900">Overtime</h3>
          <p className="mt-1 text-ink-700">Pick the rule that fits your situation:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-700">
            <li><strong>None</strong> — every hour is regular.</li>
            <li><strong>Weekly threshold</strong> — hours over your weekly limit (often 40) become overtime.</li>
            <li><strong>Daily + weekly</strong> — hours over a daily limit (often 8) are overtime too, without double-counting toward the weekly total.</li>
            <li><strong>Custom</strong> — set your own daily and weekly thresholds.</li>
          </ul>
          <p className="mt-2 text-ink-700">
            The <strong>OT multiplier</strong> is the overtime pay rate (commonly 1.5×).
          </p>

          <h3 className="mt-4 font-bold text-ink-900">Hourly rate (optional)</h3>
          <p className="mt-1 text-ink-700">
            Enter your pay rate to also see <strong>regular pay</strong>,{" "}
            <strong>overtime pay</strong>, and <strong>gross pay</strong>. Leave it
            blank if you only want hours.
          </p>
        </section>

        {/* Breaks & overnight */}
        <section aria-labelledby="breaks" className="mt-14 max-w-prose">
          <h2 id="breaks" className="text-2xl font-bold tracking-tight text-ink-900">
            Breaks &amp; overnight shifts
          </h2>
          <p className="mt-2 text-ink-700">
            <strong>Breaks:</strong> the number in the Break column is unpaid minutes
            removed from that day. A 9:00 AM–5:30 PM shift with a 30-minute lunch
            counts as 8 hours worked. Set it to 0 if your breaks are paid.
          </p>
          <p className="mt-2 text-ink-700">
            <strong>Overnight:</strong> for a shift like 10:00 PM to 6:00 AM, just
            enter both times — the calculator sees the end is earlier than the start
            and counts it as crossing midnight (8 hours). If you want to be explicit,
            tick the Overnight box on that row.
          </p>
        </section>

        {/* Reading results */}
        <section aria-labelledby="results" className="mt-14 max-w-prose">
          <h2 id="results" className="text-2xl font-bold tracking-tight text-ink-900">
            Reading your results
          </h2>
          <p className="mt-2 text-ink-700">
            The result cards show your <strong>total in hh:mm</strong> (hours and
            minutes) and <strong>total in decimal hours</strong> (e.g. 38.75) side by
            side, plus your <strong>regular</strong> and <strong>overtime</strong>
            split. If you entered a rate, you&rsquo;ll also see regular pay, overtime
            pay, and gross pay. Copy whichever format your payroll needs.
          </p>
        </section>

        {/* Save / export / print */}
        <section aria-labelledby="save" className="mt-14 max-w-prose">
          <h2 id="save" className="text-2xl font-bold tracking-tight text-ink-900">
            Saving, printing &amp; exporting
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-700">
            <li><strong>Print / save as PDF</strong> — prints a clean report with ads and menus removed; choose &ldquo;Save as PDF&rdquo; in the print dialog to keep a file.</li>
            <li><strong>Export CSV</strong> — downloads a spreadsheet you can open in Excel or Google Sheets, or import into payroll.</li>
            <li><strong>Save timesheet</strong> — stores the current timesheet on your device; find it later on the <Link href="/saved" className="text-brand-700 underline">Saved</Link> page.</li>
            <li><strong>Save employee preset</strong> — remembers a person&rsquo;s rate and overtime rule to reuse next time.</li>
            <li><strong>Copy share link</strong> — copies a link that reproduces your <em>settings</em> (not your private times) so you can pick up on another device.</li>
          </ul>
          <p className="mt-2 text-ink-700">
            Everything saved lives only in your browser. Clearing your browser data removes it.
          </p>
        </section>

        <Faq items={FAQS} />

        <section aria-labelledby="related" className="mt-12">
          <h2 id="related" className="text-lg font-semibold text-ink-900">Jump in</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {[
              { href: "/time-card-calculator", label: "Time Card Calculator" },
              { href: "/biweekly-timesheet-calculator", label: "Biweekly Timesheet" },
              { href: "/time-card-calculator-with-lunch-break", label: "With Lunch Break" },
            ].map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="inline-block rounded-full border border-slate-300 px-3 py-1.5 text-sm text-ink-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
