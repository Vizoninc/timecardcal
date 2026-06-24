import type { Metadata } from "next";
import { CalculatorPage } from "../../components/CalculatorPage";
import { getPage } from "../../content/data/pages";
import { buildMetadata } from "../../lib/seo/metadata";

const page = getPage("work-hours-calculator")!;

export const metadata: Metadata = buildMetadata({
  title: page.seoTitle,
  description: page.seoDescription,
  path: "/work-hours-calculator",
});

export default function Page() {
  return <CalculatorPage page={page} />;
}
