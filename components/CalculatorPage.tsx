/**
 * Server component that composes a full landing page around the client
 * Calculator: breadcrumbs, hero, ad slots, unique copy, examples, FAQ, and
 * JSON-LD. Only <Calculator /> hydrates; everything else is static HTML.
 */

import Link from "next/link";
import type { PageContent } from "../content/data/pages";
import { VERIFY_DISCLAIMER } from "../content/data/pages";
import { Calculator } from "./Calculator";
import { AdSlot } from "./AdSlot";
import { Breadcrumbs } from "./Breadcrumbs";
import { Faq } from "./Faq";
import { TrustStrip } from "./TrustStrip";
import { CtaBand } from "./CtaBand";
import { JsonLd } from "./JsonLd";
import {
  breadcrumbSchema,
  organizationSchema,
  webApplicationSchema,
  type Breadcrumb,
} from "../lib/schema/jsonld";

export function CalculatorPage({ page }: { page: PageContent }) {
  const path = `/${page.slug}`;
  const showDecimalTable =
    page.slug === "minutes-to-decimal-payroll" ||
    page.slug === "decimal-hours-calculator";
  const crumbs: Breadcrumb[] = [
    { name: "Home", path: "/" },
    { name: page.breadcrumb, path },
  ];

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          webApplicationSchema({
            name: page.h1,
            description: page.seoDescription,
            path,
          }),
          breadcrumbSchema(crumbs),
        ]}
      />

      <div className="mx-auto max-w-content px-4 py-6">
        <Breadcrumbs items={crumbs} />

        {/* Hero */}
        <header className="mt-5 animate-fade-up">
          <span className="eyebrow">Free • No sign-in</span>
          <h1 className="mt-4 text-4xl font-black leading-[1.08] tracking-tight text-ink-900 sm:text-5xl">
            {page.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold text-ink-900">
            {page.answer}
          </p>
          {page.intro.map((p, i) => (
            <p key={i} className="mt-3 max-w-prose text-lg text-ink-700">
              {p}
            </p>
          ))}
        </header>

        <div className="mt-6">
          <TrustStrip />
        </div>

        {/* Ad slot 1: leaderboard below the hero (above the fold -> not lazy) */}
        <div className="my-6">
          <AdSlot id="leaderboard-top" size="leaderboard" />
        </div>

        {/* Calculator + optional desktop right rail */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
          <div className="min-w-0">
            <Calculator
              initialMode={page.defaults.mode}
              initialOptions={page.defaults.options}
            />
          </div>
          <aside className="mt-8 hidden lg:mt-0 lg:block" aria-label="Sponsored">
            <div className="sticky top-6">
              <AdSlot id="rail-sticky" size="rail" lazy />
            </div>
          </aside>
        </div>

        {/* Explainer */}
        <section aria-labelledby="how-heading" className="mt-12 max-w-prose">
          <h2 id="how-heading" className="text-2xl font-semibold text-ink-900">
            How to use this calculator
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-700">
            {page.howTo.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>

        {/* Ad slot 2: in-content, below explainer (below the fold -> lazy) */}
        <div className="my-8">
          <AdSlot id="incontent-mid" size="inContent" lazy />
        </div>

        {/* How overtime + breaks are handled */}
        <div className="grid gap-8 md:grid-cols-2">
          <section aria-labelledby="ot-heading" className="max-w-prose">
            <h2 id="ot-heading" className="text-xl font-semibold text-ink-900">
              How overtime is handled
            </h2>
            <p className="mt-2 text-ink-700">{page.overtimeNote}</p>
          </section>
          <section aria-labelledby="breaks-heading" className="max-w-prose">
            <h2 id="breaks-heading" className="text-xl font-semibold text-ink-900">
              How breaks are handled
            </h2>
            <p className="mt-2 text-ink-700">{page.breaksNote}</p>
          </section>
        </div>

        {/* Examples */}
        <section aria-labelledby="examples-heading" className="mt-12">
          <h2 id="examples-heading" className="text-2xl font-semibold text-ink-900">
            Examples
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {page.examples.map((ex, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="font-medium text-ink-900">{ex.title}</h3>
                <p className="mt-1 text-ink-700">{ex.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Page-specific tips */}
        <section aria-labelledby="tips-heading" className="mt-12 max-w-prose">
          <h2 id="tips-heading" className="text-2xl font-semibold text-ink-900">
            Tips
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-700">
            {page.conversionTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
          {!showDecimalTable && (
            <p className="mt-3 text-ink-700">
              Need to turn minutes into decimals (15 = 0.25, 30 = 0.50, 45 = 0.75)?
              Use the{" "}
              <Link href="/minutes-to-decimal-payroll" className="text-brand-700 underline">
                minutes-to-decimal guide
              </Link>{" "}
              or the{" "}
              <Link href="/decimal-hours-calculator" className="text-brand-700 underline">
                decimal hours calculator
              </Link>
              .
            </p>
          )}
        </section>

        {/* Minutes-to-decimal table (only on the decimal-focused pages) */}
        {showDecimalTable && (
          <section aria-labelledby="conv-heading" className="mt-12 max-w-prose">
            <h2 id="conv-heading" className="text-2xl font-semibold text-ink-900">
              Minutes to decimal hours
            </h2>
            <p className="mt-2 text-ink-700">
              Payroll usually wants decimal hours. Divide minutes by 60:
            </p>
            <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-ink-700">
                  <tr>
                    <th scope="col" className="px-3 py-2">Minutes</th>
                    <th scope="col" className="px-3 py-2">Decimal</th>
                  </tr>
                </thead>
                <tbody className="font-mono tabular-nums">
                  {[
                    [15, "0.25"],
                    [30, "0.50"],
                    [45, "0.75"],
                    [60, "1.00"],
                  ].map(([m, d]) => (
                    <tr key={m} className="border-t border-slate-100">
                      <td className="px-3 py-1.5">{m}</td>
                      <td className="px-3 py-1.5">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Printable / export guidance */}
        <section aria-labelledby="print-heading" className="mt-12 max-w-prose">
          <h2 id="print-heading" className="text-2xl font-semibold text-ink-900">
            Printing &amp; exporting your timesheet
          </h2>
          <p className="mt-2 text-ink-700">
            Use <strong>Print / save as PDF</strong> for a clean report — ads,
            navigation, and controls are removed automatically by the print
            styles, leaving just your hours and totals. Use <strong>Export CSV</strong>{" "}
            to download a spreadsheet you can import into payroll or open in Excel
            or Google Sheets.
          </p>
        </section>

        {/* FAQ (on-page for humans; no FAQ rich-result schema) */}
        <Faq items={page.faqs} />

        {/* Ad slot 3: lower-content, below FAQ (lazy) */}
        <div className="my-8">
          <AdSlot id="incontent-low" size="inContent" lazy />
        </div>

        {/* Related tools — internal linking */}
        <section aria-labelledby="related-heading" className="mt-8">
          <h2 id="related-heading" className="text-lg font-semibold text-ink-900">
            Related calculators
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {page.related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="inline-block rounded-full border border-slate-300 px-3 py-1.5 text-sm text-ink-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <CtaBand />

        <p className="mt-10 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Please verify your numbers.</strong> {VERIFY_DISCLAIMER}
        </p>
      </div>
    </>
  );
}
