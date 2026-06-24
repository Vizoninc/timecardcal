import type { Metadata } from "next";
import { SavedManager } from "../../components/SavedManager";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { buildMetadata } from "../../lib/seo/metadata";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Saved Timesheets & Employee Presets",
    description:
      "Review the timesheets and employee presets you've saved on this device. Everything is stored locally in your browser — nothing is uploaded.",
    path: "/saved",
  }),
  // This is a personal, device-local view; keep it out of the index.
  robots: { index: false, follow: true },
};

export default function SavedPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Saved", path: "/saved" },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-900">
        Saved timesheets
      </h1>
      <p className="mt-2 max-w-prose text-ink-700">
        These are stored only in this browser using local storage. Clearing your
        browser data will remove them.
      </p>
      <div className="mt-8">
        <SavedManager />
      </div>
    </div>
  );
}
