import type { Metadata } from "next";
import { CalculatorPage } from "../../components/CalculatorPage";
import { getPage } from "../../content/data/pages";
import { buildMetadata } from "../../lib/seo/metadata";

const page = getPage("minutes-to-decimal-payroll")!;

export const metadata: Metadata = buildMetadata({
  title: page.seoTitle,
  description: page.seoDescription,
  path: "/minutes-to-decimal-payroll",
});

export default function Page() {
  return <CalculatorPage page={page} />;
}
