import type { FaqItem } from "../content/data/pages";

/**
 * On-page FAQ for humans. Uses native <details>/<summary> so it is keyboard
 * accessible and needs zero client JS. We do NOT emit FAQPage JSON-LD here
 * (per strategy — FAQ rich results are not relied upon).
 */
export function Faq({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="faq-heading" className="mt-10">
      <h2 id="faq-heading" className="text-xl font-semibold text-ink-900">
        Frequently asked questions
      </h2>
      <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
        {items.map((item, i) => (
          <details key={i} className="group p-4 open:bg-slate-50">
            <summary className="cursor-pointer list-none font-medium text-ink-900 marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
              <span className="flex items-center justify-between gap-3">
                {item.q}
                <span
                  aria-hidden="true"
                  className="text-slate-400 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-2 text-ink-700">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
