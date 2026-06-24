/**
 * JSON-LD structured data builders. These return plain objects that components
 * serialize into <script type="application/ld+json"> tags.
 *
 * We intentionally emit WebApplication/SoftwareApplication, BreadcrumbList, and
 * Organization. FAQ is rendered for humans on-page but we do NOT emit FAQPage
 * schema (per strategy: avoid relying on FAQ rich results).
 */

import { SITE, absoluteUrl } from "../seo/site";

export interface Breadcrumb {
  name: string;
  path: string;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    url: SITE.url,
    logo: absoluteUrl("/logo.png"),
    description: SITE.description,
  };
}

export function webApplicationSchema(opts: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    name: opts.name,
    url: absoluteUrl(opts.path),
    description: opts.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript for calculations.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isAccessibleForFree: true,
  };
}

export function breadcrumbSchema(items: Breadcrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
