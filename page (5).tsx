import type { Metadata } from "next";
import { CalculatorPage } from "../../components/CalculatorPage";
import { getPage } from "../../content/data/pages";
import { buildMetadata } from "../../lib/seo/metadata";

const page = getPage("decimal-hours-calculator")!;

export const metadata: Metadata = buildMetadata({
  title: page.seoTitle,
  description: page.seoDescription,
  path: "/decimal-hours-calculator",
});

export default function Page() {
  return <CalculatorPage page={page} />;
}
