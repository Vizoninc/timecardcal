import type { MetadataRoute } from "next";
import { absoluteUrl, SITE } from "../lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The embeddable widget is a bare frame, not a content page.
        disallow: ["/embed"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE.url,
  };
}
