/**
 * Helpers that turn a page's content config into Next.js Metadata, including
 * canonical URLs and Open Graph tags.
 */

import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";

export interface PageSeo {
  title: string;
  description: string;
  /** Path without domain, e.g. "/time-card-calculator". */
  path: string;
}

export function buildMetadata(seo: PageSeo): Metadata {
  const canonical = absoluteUrl(seo.path);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      site: SITE.twitter,
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
