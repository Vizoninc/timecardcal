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
      {/* Bold dark hero band */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-hero-grid [background-size:22px_22px] opacity-60"
        />
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand-600/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-content px-4 py-16 sm:py-20">
          <div className="max-w-3xl animate-fade-up">
            <span className="eyebrow border-white/15 bg-white/10 text-brand-300">
              Free • No sign-in • Private
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              Add up your hours in <span className="accent-text">seconds</span>.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300 sm:text-xl">
              A fast time card &amp; timesheet calculator for hourly workers and
              managers. Subtract breaks, split overtime, and see pay — in hh:mm
              and decimal hours. Everything runs in your browser.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#main-calc" className="btn-primary">
                Start calculating →
              </a>
              <Link
                href="/biweekly-timesheet-calculator"
                className="btn-ghost border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/15"
              >
                Biweekly mode
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-4 py-8">
        <div className="my-6">
          <AdSlot id="leaderboard-home" size="leaderboard" />
        </div>

        <div id="main-calc" className="scroll-mt-20">
          <Calculator initialMode="weekly" />
        </div>

        <section aria-labelledby="tools-heading" className="mt-16">
          <h2
            id="tools-heading"
            className="text-3xl font-black tracking-tight text-ink-900"
          >
            Pick the calculator you need
          </h2>
          <p className="mt-2 max-w-prose text-ink-700">
            Same precise engine, tuned copy and defaults for each job.
          </p>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/${t.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <h3 className="text-lg font-bold text-ink-900 group-hover:text-brand-700">
                    {t.h1}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm text-ink-700">{t.intro[0]}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-600">
                    Open
                    <span className="transition-transform group-hover:translate-x-1">→</span>
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
