/**
 * Global site constants used across SEO metadata, schema, and the sitemap.
 */

export const SITE = {
  name: "TimeCardCalc",
  legalName: "TimeCardCalc",
  shortName: "TimeCardCalc",
  tagline: "Free Time Card & Timesheet Calculator",
  description:
    "Free, fast time card and timesheet calculator. Add daily hours with lunch breaks, get hh:mm and decimal totals, overtime, and gross pay. No sign-in.",
  // Read at build time; falls back to a placeholder for local dev.
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.timecardcalc.example",
  locale: "en_US",
  twitter: "@timecardcalc",
} as const;

export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${clean === "/" ? "" : clean}`;
}
