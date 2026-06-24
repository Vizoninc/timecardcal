import type { MetadataRoute } from "next";
import { absoluteUrl } from "../lib/seo/site";
import { PAGE_SLUGS } from "../content/data/pages";

/** XML sitemap generated from the page registry. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // /saved is intentionally noindex, so it is excluded from the sitemap.
  const staticPaths = ["/", "/how-to-use", "/embed-widget"];
  const calculatorPaths = PAGE_SLUGS.map((slug) => `/${slug}`);

  return [...staticPaths, ...calculatorPaths].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
