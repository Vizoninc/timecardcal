# Time Card & Timesheet Calculator

A fast, mobile-first, local-first time card / timesheet calculator built with
Next.js (App Router), TypeScript, and Tailwind CSS. The calculation engine is a
set of pure, unit-tested functions; the marketing/SEO content is server-rendered
and only the calculator hydrates on the client.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure the public site URL (used for canonical tags, sitemap, OG)
cp .env.example .env.local
# edit NEXT_PUBLIC_SITE_URL in .env.local

# 3. Run the dev server
npm run dev
# open http://localhost:3000
```

## Scripts

| Command            | What it does                                |
| ------------------ | ------------------------------------------- |
| `npm run dev`      | Start the dev server                        |
| `npm run build`    | Production build                            |
| `npm start`        | Serve the production build                  |
| `npm run typecheck`| TypeScript check (no emit)                  |
| `npm test`         | Run the unit test suite (Vitest)            |
| `npm run test:watch` | Run tests in watch mode                   |

## Testing

The calculation engine is covered by Vitest unit tests in `tests/`:

```bash
npm test
```

Edge cases covered: overnight shifts, invalid/empty rows, break deductions,
overtime threshold crossing (weekly, daily+weekly, custom), minutes↔decimal
conversion, pay rounding, and CSV export.

## Project layout

See `ARCHITECTURE.md` for the full tree and design rationale.

- `app/` — routes (home, 7 SEO landing pages, saved, embed, sitemap, robots)
- `components/` — UI; only `Calculator.tsx` / `SavedManager.tsx` are client
- `lib/calculations/` — the pure, testable engine
- `lib/seo/`, `lib/schema/` — metadata + JSON-LD helpers
- `content/data/` — page copy + overtime rules config
- `tests/` — Vitest unit tests

## Privacy

There is no backend and no sign-in. Calculations, saved timesheets, and employee
presets are stored only in the browser via `localStorage`.

## Ads

Ad slots are **placeholders only** (`components/AdSlot.tsx`). They reserve fixed
dimensions to avoid layout shift and lazy-load below the fold. Replace the inner
placeholder with your ad network tag when going live; keep the reserved-size
wrapper to preserve Core Web Vitals.

## Disclaimer

This tool produces estimates. Overtime rules, rounding, and break laws vary by
jurisdiction and employer. Always verify the numbers against your own pay rules.
