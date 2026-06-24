import type { Metadata } from "next";
import { Calculator } from "../../components/Calculator";
import { EmbedAutosize } from "../../components/EmbedAutosize";
import { SITE } from "../../lib/seo/site";

/**
 * The embeddable widget itself (rendered inside a partner site's iframe).
 * Chrome is hidden via the scoped style; it reports its height for auto-resize
 * and carries a single branded link back to the homepage.
 */
export const metadata: Metadata = {
  title: "Time Card Calculator (embeddable widget)",
  robots: { index: false, follow: true },
};

export default async function EmbedPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const initialMode = mode === "biweekly" ? "biweekly" : "weekly";

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body > header, body > footer, a[href="#main"] { display: none !important; }
            body { background: #fff !important; }
            main { min-height: 0 !important; }
          `,
        }}
      />
      <EmbedAutosize />
      <div className="mx-auto max-w-3xl p-3">
        <Calculator initialMode={initialMode} />
        <p className="mt-4 text-center text-xs text-slate-500">
          <a
            href={SITE.url}
            target="_blank"
            rel="noopener"
            className="font-semibold text-brand-600 hover:underline"
          >
            Time Card Calculator
          </a>{" "}
          by {SITE.name}
        </p>
      </div>
    </>
  );
}
