# Implementation Guide — Time Card & Timesheet Calculator

This takes the project from your folder to a live, monetized site. Work through
the phases in order. Each step says exactly what to type and what "done" looks
like.

> Time estimate: ~60–90 min to a live site (excluding ad-network approval, which
> takes days and is outside your control).

---

## Phase 0 — Prerequisites (10 min)

1. **Install Node.js 18.18+ (20 LTS recommended).**
   - Download from https://nodejs.org → verify:
     ```bash
     node --version   # v20.x or higher
     npm --version
     ```
2. **Install Git** (https://git-scm.com) → verify `git --version`.
3. **Create accounts** (free tiers are fine):
   - GitHub (code hosting)
   - Vercel (hosting/deploy) — sign in with GitHub
   - A domain registrar (Namecheap, Cloudflare, Porkbun) — buy your domain
   - Google AdSense or Ad Manager (apply later, in Phase 6)
4. **A code editor** — VS Code is recommended.

**Done when:** `node`, `npm`, and `git` all print versions.

---

## Phase 1 — Get it running locally (10 min)

1. Open a terminal in the project folder (`timesheet-calculator/`).
2. Install dependencies:
   ```bash
   npm install
   ```
   This pulls ~160 packages. If it's slow on a network/cloud drive, that's
   normal — let it finish.
3. Create your local env file:
   ```bash
   cp .env.example .env.local
   ```
   For local dev you can leave the placeholder URL; you'll set the real one in
   Phase 5.
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000.

**Verify (do not skip):**
- Home page loads, calculator is visible.
- Type `9:00 AM` / `5:30 PM`, break `30` on Monday → "Worked" shows `8:00`.
- Visit `/time-card-calculator`, `/biweekly-timesheet-calculator`, `/saved`.
- Open `/sitemap.xml` and `/robots.txt` — both should render.

**Done when:** all of the above work with no console errors.

---

## Phase 2 — Run the quality gates (5 min)

Before changing anything, confirm the baseline is green:

```bash
npm test          # expect: 43 passed
npm run typecheck # expect: no output (clean)
npm run build     # expect: "Compiled successfully" + a route table
```

If any fail, fix before continuing — you want a known-good starting point.

**Done when:** tests pass, typecheck is clean, build succeeds.

---

## Phase 3 — Brand & content customization (15–30 min)

Edit these files; the dev server hot-reloads as you save.

1. **Site identity** — `lib/seo/site.ts`
   - `name`, `tagline`, `description`, `twitter`. Leave `url` (env-driven).
2. **Colors / fonts** — `tailwind.config.ts`
   - Swap the `brand` palette hex values. Fonts use a system stack (fast); only
     change if you have a reason to.
3. **Logo / header nav** — `components/SiteHeader.tsx` (the ⏱ glyph + links).
4. **Footer + legal disclaimer** — `components/SiteFooter.tsx`.
5. **Page copy** — `content/data/pages.ts`
   - This is where each landing page's intro, how-to, examples, tips, and FAQ
     live. Make each page's wording genuinely distinct (don't copy/paste between
     slugs) — that's what lets them rank independently.
   - To add a new calculator page later: add an entry here, then create
     `app/<new-slug>/page.tsx` mirroring an existing one. The sitemap picks it
     up automatically.

**Re-run `npm run build` after content edits** to catch any typos that break the
build.

**Done when:** the site reads as yours, not a template.

---

## Phase 4 — Put it on GitHub (10 min)

1. In the project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: time card calculator"
   ```
   (`.gitignore` already excludes `node_modules`, `.next`, and `.env*`.)
2. Create an empty repo on GitHub (no README/license — you have them).
3. Connect and push:
   ```bash
   git remote add origin https://github.com/<you>/<repo>.git
   git branch -M main
   git push -u origin main
   ```

**Done when:** your code shows up on GitHub and `.env.local` is NOT in it.

---

## Phase 5 — Deploy to Vercel + domain (15 min)

1. Go to https://vercel.com → **Add New → Project** → import your GitHub repo.
2. Framework auto-detects as **Next.js**. Leave build settings default.
3. **Environment Variables** → add:
   - Key: `NEXT_PUBLIC_SITE_URL`
   - Value: your real URL with no trailing slash, e.g. `https://www.yourdomain.com`
4. Click **Deploy**. Wait for the build (~1–2 min).
5. **Add your domain:** Project → Settings → Domains → add `yourdomain.com` and
   `www.yourdomain.com`. Follow Vercel's DNS instructions at your registrar
   (usually an A record + CNAME, or point nameservers to Vercel).
6. After DNS propagates, re-deploy if you changed `NEXT_PUBLIC_SITE_URL` so
   canonical tags and the sitemap use the final domain.

**Verify:**
- `https://www.yourdomain.com/sitemap.xml` lists your real domain (not the
  placeholder). If it still shows the placeholder, the env var didn't apply —
  fix it and redeploy.
- Run the live URL through https://pagespeed.web.dev — aim for green Core Web
  Vitals (this build is set up for it).

**Done when:** the site is live on your domain with correct canonical URLs.

---

## Phase 6 — Ad monetization (after you have traffic)

Ad networks (AdSense especially) want real content and some traffic before
approval. Don't gate launch on this.

1. **Apply** to Google AdSense (or Ad Manager). Add the site, complete the
   site-verification step they give you.
2. **Once approved**, wire the real tag into the placeholders:
   - The ad script (one-time): add it in `app/layout.tsx` using `next/script`
     with `strategy="afterInteractive"`.
   - Per-slot: edit `components/AdSlot.tsx` — replace the inner placeholder
     `<div>` with your ad unit markup. **Keep the outer reserved-size wrapper**
     so you don't introduce layout shift (this protects your Core Web Vitals,
     which protect your rankings).
3. **Don't** add ads inside form fields, next to the action buttons, or as
   pop-ups/interstitials — the layout already keeps slots separated; preserve
   that.

**Done when:** ads render in the reserved boxes and PageSpeed CLS stays ~0.

---

## Phase 7 — SEO launch tasks (ongoing)

1. **Google Search Console:** add the property, verify, and submit
   `https://www.yourdomain.com/sitemap.xml`.
2. **Bing Webmaster Tools:** same idea.
3. **Check indexing** after a few days (Search Console → Pages).
4. **Internal links** are already in place (related-calculator chips + footer).
   As you add pages, link them from relevant existing pages.
5. **Distribution is the real work.** As discussed, a clean tool alone won't
   outrank entrenched competitors — plan for backlinks: the embeddable widget
   (`/embed`) as a link magnet, outreach to HR/payroll/small-biz blogs, and
   genuinely useful guide content.

---

## Maintenance & updating

- **Edit content/code locally → commit → push.** Vercel auto-deploys every push
  to `main`. Use a branch + pull request if you want preview deploys first.
- **Before every push**, run the gates: `npm test && npm run build`.
- **Dependency updates:** periodically `npm outdated`, bump, then re-run the
  gates before deploying.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `npm install` errors with `ENOTEMPTY` | a previous install was interrupted | delete `node_modules` + `package-lock.json`, install again |
| Sitemap/canonical shows placeholder domain | `NEXT_PUBLIC_SITE_URL` not set on Vercel | set the env var, redeploy |
| Calculator shows but inputs do nothing | JS blocked / hydration error | check the browser console; ensure you didn't make `Calculator.tsx` a server component |
| Saved timesheets vanish | localStorage cleared or different browser | expected — data is device-local by design |
| Build fails after content edit | unescaped quote/bracket in `pages.ts` | read the build error's file+line; fix the string |

---

## Quick command reference

```bash
npm run dev         # local dev server
npm test            # 43 unit tests
npm run typecheck   # TypeScript check
npm run build       # production build
npm start           # serve the production build locally
git add . && git commit -m "..." && git push   # deploy via Vercel
```
