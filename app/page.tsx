import Link from "next/link";
import type { Metadata } from "next";
import { Calculator } from "../components/Calculator";
import { AdSlot } from "../components/AdSlot";
import { JsonLd } from "../components/JsonLd";
import { SITE } from "../lib/seo/site";
import { organizationSchema, webApplicationSchema } from "../lib/schema/jsonld";
import { PAGES } from "../content/data/pages";

export const metadata: Metadata = {
  title: `${SITE.tagline} — Free, Fast, No Sign-In`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

const TOOLS = [
  PAGES["time-card-calculator"],
  PAGES["timesheet-calculator"],
  PAGES["work-hours-calculator"],
  PAGES["time-card-calculator-with-lunch-break"],
  PAGES["biweekly-timesheet-calculator"],
  PAGES["minutes-to-decimal-payroll"],
  PAGES["decimal-hours-calculator"],
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          webApplicationSchema({
            name: "Time Card & Timesheet Calculator",
            description: SITE.description,
            path: "/",
          }),
        ]}
      />
      <div className="mx-auto max-w-content px-4 py-8">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Time Card &amp; Timesheet Calculator
          </h1>
          <p className="mt-3 text-lg text-ink-700">
            Add up hours, subtract breaks, split overtime, and see pay — in hh:mm
            and decimal hours. Free, fast, and private: everything runs in your
            browser with no sign-in.
          </p>
        </header>

        <div className="my-6">
          <AdSlot id="leaderboard-home" size="leaderboard" />
        </div>

        <Calculator initialMode="weekly" />

        <section aria-labelledby="tools-heading" className="mt-14">
          <h2 id="tools-heading" className="text-2xl font-semibold text-ink-900">
            Pick the calculator you need
          </h2>
          <p className="mt-2 max-w-prose text-ink-700">
            Same precise engine, tuned copy and defaults for each job.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/${t.slug}`}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <h3 className="font-semibold text-ink-900">{t.h1}</h3>
                  <p className="mt-1 text-sm text-ink-700">{t.intro[0]}</p>
                  <span className="mt-3 inline-block text-sm font-medium text-brand-600">
                    Open →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
