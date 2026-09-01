# Anand Techno-Fab LLP — Corporate Website

A premium industrial/infrastructure corporate website for Anand Techno-Fab
LLP (Ahmedabad, Gujarat). Frontend only — no backend, database, or API.

Built with React + TypeScript + Vite + Tailwind CSS v4. All content
(projects, certifications, equipment, team, financials, awards) is sourced
from the company's official Company Profile document and lives in
`src/data/company.ts`.

## Local development

```bash
npm install
npm run dev       # starts the Vite dev server
npm run build      # type-checks and builds to dist/
npm run preview    # serves the production build locally
```

## Deploying to Cloudflare Pages

This project builds to a static `dist/` folder, which deploys directly to
[Cloudflare Pages](https://developers.cloudflare.com/pages/). Client-side
routing (React Router) is handled by `public/_redirects`, which is copied
into `dist/` on build.

### Option A — Connect the repo in the Cloudflare dashboard (recommended)

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages →
   Connect to Git** and select this repository.
2. Framework preset: **Vite**.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Save and deploy. Every push to the connected branch redeploys
   automatically; PRs get their own preview URL.

No further configuration is required — `wrangler.toml` and
`public/_redirects` in this repo are already set up for this.

### Option B — Deploy from the command line with Wrangler

```bash
npx wrangler login          # one-time browser auth
npm run deploy               # builds, then runs: wrangler pages deploy dist
```

`wrangler.toml` pins the project name (`anand-techno-fab`) and build output
directory so `wrangler pages deploy` needs no extra flags.

### Option C — Automatic deploys via GitHub Actions

`.github/workflows/deploy.yml` builds and deploys on every push to `main`
(and can be run manually from the Actions tab). It needs two repository
secrets, set under **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN` — create one in the Cloudflare dashboard under
  **My Profile → API Tokens**, using the "Edit Cloudflare Workers" (or a
  custom Pages: Edit) template.
- `CLOUDFLARE_ACCOUNT_ID` — found on the right-hand sidebar of any page in
  the Cloudflare dashboard.

Until those secrets are added, the workflow's build step still runs (and
passes); only the deploy step is skipped.

## Project structure

```
src/
  data/company.ts     Single source of truth for all site content
  components/          Shared UI (Navbar, Footer, Lightbox, ContactDock, ...)
  pages/                One file per route (Home, About, Services, Projects, ...)
  lib/whatsapp.ts       WhatsApp click-to-chat + enquiry message helpers
public/
  images/               Real project photography, certificates & awards
  _redirects            SPA fallback for Cloudflare Pages
```
