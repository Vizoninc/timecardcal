import type { Metadata } from "next";
import { Calculator } from "../../components/Calculator";

/**
 * Embeddable widget SCAFFOLD for a future release.
 *
 * Renders only the calculator with no ads and minimal chrome, suitable for an
 * <iframe>. The global header/footer are hidden via the scoped style below so
 * we don't have to restructure into multiple root layouts yet. When this ships
 * for real, move it into its own route-group layout (see ARCHITECTURE.md).
 */

export const metadata: Metadata = {
  title: "Embeddable Time Card Calculator (widget)",
  robots: { index: false, follow: false },
};

export default function EmbedPage() {
  return (
    <>
      {/* Scoped chrome reset for iframe usage. */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            body > header, body > footer, a[href="#main"] { display: none !important; }
            body { background: #fff !important; }
          `,
        }}
      />
      <div className="mx-auto max-w-3xl p-3">
        <Calculator initialMode="weekly" />
        <p className="mt-4 text-center text-xs text-slate-400">
          Powered by TimeCardCalc
        </p>
      </div>
    </>
  );
}
