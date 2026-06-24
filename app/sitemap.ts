import type { MetadataRoute } from "next";
import { absoluteUrl } from "../lib/seo/site";
import { PAGE_SLUGS } from "../content/data/pages";

/** XML sitemap generated from the page registry. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = ["/", "/saved"];
  const calculatorPaths = PAGE_SLUGS.map((slug) => `/${slug}`);

  return [...staticPaths, ...calculatorPaths].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
