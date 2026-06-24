# Architecture

## File tree

```
timesheet-calculator/
├─ app/
│  ├─ layout.tsx                       # Root layout: header, footer, skip link, global metadata
│  ├─ page.tsx                         # Home hub: hero + calculator + tool cards
│  ├─ globals.css                      # Tailwind + focus/touch/print styles
│  ├─ not-found.tsx                    # 404
│  ├─ robots.ts                        # robots.txt (disallows /embed)
│  ├─ sitemap.ts                       # XML sitemap from the page registry
│  ├─ saved/page.tsx                   # "Saved timesheets" (noindex)
│  ├─ embed/page.tsx                   # Embeddable widget scaffold (noindex)
│  ├─ time-card-calculator/page.tsx
│  ├─ timesheet-calculator/page.tsx
│  ├─ work-hours-calculator/page.tsx
│  ├─ time-card-calculator-with-lunch-break/page.tsx
│  ├─ biweekly-timesheet-calculator/page.tsx
│  ├─ minutes-to-decimal-payroll/page.tsx
│  └─ decimal-hours-calculator/page.tsx
├─ components/
│  ├─ Calculator.tsx                   # CLIENT — the interactive calculator
│  ├─ SavedManager.tsx                 # CLIENT — saved timesheets/presets manager
│  ├─ CalculatorPage.tsx               # SERVER — composes a full landing page
│  ├─ SiteHeader.tsx                   # SERVER
│  ├─ SiteFooter.tsx                   # SERVER
│  ├─ Breadcrumbs.tsx                  # SERVER
│  ├─ Faq.tsx                          # SERVER — <details>, zero JS
│  ├─ AdSlot.tsx                       # CLIENT — reserved, lazy ad placeholder
│  └─ JsonLd.tsx                       # SERVER — JSON-LD <script>
├─ lib/
│  ├─ calculations/                    # PURE, framework-free engine
│  │  ├─ types.ts
│  │  ├─ time.ts                        # parseTimeToMinutes, formatters
│  │  ├─ rounding.ts                    # applyRounding
│  │  ├─ daily.ts                       # dailyWorkedMinutes (overnight, breaks)
│  │  ├─ overtime.ts                    # overtimeSplit (none/weekly/daily+weekly/custom)
│  │  ├─ decimal.ts                     # minutes <-> decimal hours
│  │  ├─ pay.ts                         # calcPay, roundCurrency
│  │  ├─ engine.ts                      # calculateWeek orchestrator
│  │  └─ index.ts                       # barrel
│  ├─ export.ts                         # buildCsv (pure)
│  ├─ storage.ts                        # localStorage presets + recent (SSR-safe)
│  ├─ url.ts                            # shareable-URL encode/decode (non-sensitive)
│  ├─ seo/
│  │  ├─ site.ts                        # SITE constants + absoluteUrl
│  │  └─ metadata.ts                    # buildMetadata (canonical + OG + twitter)
│  └─ schema/
│     └─ jsonld.ts                      # Organization / WebApplication / BreadcrumbList
├─ content/
│  └─ data/
│     ├─ pages.ts                       # Unique copy/examples/FAQ per landing page
│     └─ overtime-rules.ts              # Foundation for FUTURE state pages (not generated)
├─ tests/                              # Vitest unit tests
│  ├─ time.test.ts
│  ├─ rounding.test.ts
│  ├─ daily.test.ts
│  ├─ overtime.test.ts
│  ├─ decimal.test.ts
│  ├─ pay.test.ts
│  ├─ export.test.ts
│  └─ engine.test.ts
├─ package.json
├─ tsconfig.json
├─ next.config.mjs
├─ tailwind.config.ts
├─ postcss.config.mjs
├─ vitest.config.ts
├─ .env.example
├─ .gitignore
├─ README.md
└─ ARCHITECTURE.md
```

## Key decisions

**Engine separated from UI.** Everything in `lib/calculations/` is a pure
function with no React, DOM, or storage dependency. `calculateWeek` composes the
smaller functions. This is why the engine is fully unit-testable (43 tests) and
why the same engine backs every page with no duplication.

**Server-first rendering, one client island.** All marketing copy, FAQs,
breadcrumbs, and JSON-LD are server components and ship as static HTML (every
route prerenders to static at build time). Only `Calculator.tsx` and
`SavedManager.tsx` are `"use client"`. First Load JS is ~111 kB and content
sections carry no hydration cost. `Faq.tsx` uses native `<details>` so the FAQ
needs zero JavaScript.

**Unique pages, shared engine.** `content/data/pages.ts` holds distinct
intros, how-to steps, examples, conversion tips, and FAQs per slug so each page
can rank independently, while `CalculatorPage.tsx` provides the shared shell and
the calculator. Each page sets canonical, title, description, and OG via
`buildMetadata`.

**Overnight shifts.** Handled explicitly with a per-row toggle, plus an
auto-detect safety net (if end ≤ start, the shift is assumed to cross midnight).
Spans over 24h are rejected with a clear error rather than silently miscounted.

**Overtime model.** `weekly` flags hours over the weekly threshold. `daily_weekly`
flags daily-threshold overage per day, then applies the weekly threshold to the
remaining regular hours without double-counting (California-style stacking).
`custom` exposes both thresholds and the multiplier.

**Ad safety + CWV.** `AdSlot.tsx` reserves fixed dimensions (min-heights) so a
real ad tag causes no layout shift, and below-the-fold slots mount lazily via
IntersectionObserver. Ads are never placed inside form controls or beside the
action buttons, and they are removed entirely in print.

**Local-first + privacy.** No backend, no sign-in. Presets and recent timesheets
live in `localStorage` via SSR-safe helpers. Shareable links encode only
non-sensitive settings (mode + options) by default; punch times are opt-in.

**State overtime pages, deliberately not generated.** `overtime-rules.ts` is a
typed config (federal, CA, AK as examples) ready for genuinely useful future
pages. We do not mass-generate thin pages from it today.

## Productionizing the embed widget

`/embed` currently hides global chrome with a scoped style for iframe use. For a
real release, convert to multiple root layouts: a `(site)` route group holding
header/footer and an `(embed)` route group with a bare `<html><body>` layout, so
the widget ships no marketing chrome at all.
```
