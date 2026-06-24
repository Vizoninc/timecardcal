import type { Metadata } from "next";
import Link from "next/link";
import { EmbedBuilder } from "../../components/EmbedBuilder";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { JsonLd } from "../../components/JsonLd";
import { buildMetadata } from "../../lib/seo/metadata";
import { breadcrumbSchema, organizationSchema } from "../../lib/schema/jsonld";
import type { Breadcrumb } from "../../lib/schema/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Embed a Free Time Card Calculator on Your Website (Widget)",
  description:
    "Add a free, responsive time card & timesheet calculator to your site with one line of code. Auto-resizing, mobile-friendly, no sign-up — ideal for HR, payroll, and small-business pages.",
  path: "/embed-widget",
});

const crumbs: Breadcrumb[] = [
  { name: "Home", path: "/" },
  { name: "Embed Widget", path: "/embed-widget" },
];

const BENEFITS = [
  {
    title: "One line of code",
    body: "Paste a single iframe snippet anywhere — WordPress, Squarespace, Webflow, plain HTML. No build step, no account.",
  },
  {
    title: "Auto-resizing & responsive",
    body: "The widget reports its height so the frame grows with the content — no awkward inner scrollbars on any screen size.",
  },
  {
    title: "Private by design",
    body: "All calculations run in the visitor's browser. Nothing your readers type is sent to a server, so there's no data-handling burden on you.",
  },
  {
    title: "Always up to date",
    body: "Improvements ship automatically to every embed. You never have to update the snippet you pasted.",
  },
];

export default function EmbedWidgetPage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), breadcrumbSchema(crumbs)]} />
      <div className="mx-auto max-w-content px-4 py-6">
        <Breadcrumbs items={crumbs} />

        <header className="mt-5 max-w-3xl animate-fade-up">
          <span className="eyebrow">Free • One line of code</span>
          <h1 className="mt-4 text-4xl font-black leading-[1.08] tracking-tight text-ink-900 sm:text-5xl">
            Put the calculator on <span className="accent-text">your</span> site
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-700">
            Give your visitors a fast time card &amp; timesheet calculator without
            building one. Pick your options, copy the code, paste it in. It&rsquo;s
            free, responsive, and works on any platform.
          </p>
        </header>

        <div className="mt-8">
          <EmbedBuilder />
        </div>

        <section aria-labelledby="why" className="mt-14">
          <h2 id="why" className="text-2xl font-bold tracking-tight text-ink-900">
            Why embed it
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <h3 className="font-bold text-ink-900">{b.title}</h3>
                <p className="mt-1.5 text-ink-700">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="how" className="mt-12 max-w-prose">
          <h2 id="how" className="text-2xl font-bold tracking-tight text-ink-900">
            How to add it
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-700">
            <li>Choose the default pay period (weekly or biweekly) above.</li>
            <li>Click <strong>Copy embed code</strong>.</li>
            <li>
              Paste it into your page&rsquo;s HTML where you want the calculator to
              appear (in WordPress, use a &ldquo;Custom HTML&rdquo; block).
            </li>
            <li>Publish. The calculator is live and resizes itself automatically.</li>
          </ol>
        </section>

        <section aria-labelledby="terms" className="mt-12 max-w-prose">
          <h2 id="terms" className="text-2xl font-bold tracking-tight text-ink-900">
            Usage
          </h2>
          <p className="mt-2 text-ink-700">
            The widget is free for personal and commercial sites. Please keep the
            small attribution link beneath it — it helps more people find the tool
            and keeps it free to maintain. Don&rsquo;t modify the widget to remove
            the privacy notice or misrepresent the calculations.
          </p>
        </section>

        <section aria-labelledby="related" className="mt-10">
          <h2 id="related" className="text-lg font-semibold text-ink-900">
            Prefer the full pages?
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {[
              { href: "/time-card-calculator", label: "Time Card Calculator" },
              { href: "/timesheet-calculator", label: "Timesheet Calculator" },
              { href: "/biweekly-timesheet-calculator", label: "Biweekly Timesheet Calculator" },
            ].map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="inline-block rounded-full border border-slate-300 px-3 py-1.5 text-sm text-ink-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                >
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
