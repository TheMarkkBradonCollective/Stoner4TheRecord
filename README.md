# Stoner4TheRecord

**Website:** https://stoner4therecord.com  
**Tagline:** *The Station That Never Stops Smoking.*

A live cannabis culture entertainment network — programmed like an internet radio station, built for livestreaming, community interaction, and nonstop entertainment.

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [Stoner4TheRecord Official Live Broadcast Format.md](Stoner4TheRecord%20Official%20Live%20Broadcast%20Format.md) | Run-of-show timeline, segment lengths, sponsor placement rules |
| [Stoner4TheRecord Podcast.md](Stoner4TheRecord%20Podcast.md) | Full programming guide — segments, games, production rules, values |
| [Stoner4TheRecord Studio Stage & Set Design.md](Stoner4TheRecord%20Studio%20Stage%20%26%20Set%20Design.md) | Studio layout, furniture configurations, lighting, cameras |
| [Stoner4TheRecord Production Platform & Digital Broadcasting Ecosystem](Stoner4TheRecord%20Production%20Platform%20%26%20Digital%20Broadcasting%20Ecosystem) | Production dashboard, roles, games system, streaming engine |
| [Stoner4TheRecord Website Design Blueprint.md](Stoner4TheRecord%20Website%20Design%20Blueprint.md) | Public website, live player, community features, visual style |
| [my messy prompts.md](my%20messy%20prompts.md) | Original creative brainstorming notes |

---

## Quick Reference — Show Flow

```
Pre-Show: Guest DJ Warm-Up
    ↓
Opening Chit Chat Smoke Sesh
    ↓
Live Sponsor → Host DJ → Host Break
    ↓
Live Sponsor → Guest DJ #1 → Host Break
    ↓
Live Sponsor → Comedy Corner → Extended Chit Chat Smoke Sesh
    ↓
Live Sponsor → Stoner Games → Host Break
    ↓
Live Sponsor → Guest DJ #2
    ↓
Closing Chit Chat Smoke Sesh
```

**Approximate runtime:** 4–4.5 hours (including 15–30 min pre-show)

---

## Website MVP (Cloudflare + Neon)

This repo includes a first working slice of [stoner4therecord.com](https://stoner4therecord.com):

| Path | Purpose |
|------|---------|
| [apps/web](apps/web) | Cloudflare **Pages** frontend (Vite, dark studio UI, live embed slot) |
| [apps/api](apps/api) | Cloudflare **Worker** API (Hono + `@neondatabase/serverless`) |
| [db/migrations](db/migrations) | Postgres schema |
| [db/seed](db/seed) | Run-of-show, sponsors, and segment catalog from the planning docs |

Copy [`.env.example`](.env.example) to `.env` locally (names only — never commit secrets).

### 1. Neon Postgres (`stoner4therecord`)

1. Create a Neon project named **`stoner4therecord`** (or use an existing project with that name).
2. Copy the pooled or direct connection string into `DATABASE_URL` (local `.env` for migrations only).
3. From the repo root:

```bash
npm install
export DATABASE_URL="postgresql://..."   # local shell only — do not commit
npm run db:migrate
npm run db:seed
```

### 2. Cloudflare Worker API

```bash
cd apps/api
npx wrangler secret put DATABASE_URL   # paste Neon connection string
# Optional public embed URL (YouTube Live, Mux player URL, etc.):
npx wrangler deploy
# Or set LIVE_STREAM_URL in wrangler.toml [vars] before deploy
```

Local API:

```bash
npm run dev:api
# http://127.0.0.1:8787/api/health
```

Use [`.dev.vars`](https://developers.cloudflare.com/workers/configuration/secrets/#local-development) in `apps/api/` for local `DATABASE_URL` (gitignored pattern: `.dev.vars`).

### 3. Cloudflare Pages frontend

Build and deploy the static site from `apps/web/dist`:

```bash
npm run build
cd apps/web
npx wrangler pages deploy dist --project-name stoner4therecord
```

Set a Pages environment variable **`VITE_API_BASE_URL`** to your deployed Worker URL (e.g. `https://stoner4therecord-api.<account>.workers.dev`) so the site can reach `/api/*` in production.

Local web (proxies `/api` to the Worker on port 8787):

```bash
npm run dev:web
# http://127.0.0.1:5173
```

### API routes

- `GET /api/health` — liveness
- `GET /api/config` — site metadata + `liveStreamUrl` from `LIVE_STREAM_URL`
- `GET /api/run-of-show` — official broadcast timeline (Postgres)
- `GET /api/sponsors` — sponsor list (`?featured=1` for homepage)
- `GET /api/segments` — segment / games catalog (`?category=Games`)

R2 bucket **`stoner4therecord-media`** is bound to the Worker as `MEDIA` (for archives and sponsor assets); upload routes are not built yet.

## Live deployment

| Piece | Where |
|-------|-------|
| Live site (Cloudflare Pages) | https://stoner4therecord.pages.dev |
| API (Cloudflare Worker) | https://stoner4therecord-api.themarkkbrandoncollective-2d9.workers.dev |
| File storage (Cloudflare R2) | bucket `stoner4therecord-media` (binding `MEDIA`) |
| Database (Neon Postgres) | project `stoner4therecord`, database `app` |

Environment variable names (values live only in Cloudflare secrets/env, never in the repo):

- `DATABASE_URL` — Neon connection string (Worker secret)
- `LIVE_STREAM_URL` — public live stream embed URL (Worker var)
- `VITE_API_BASE_URL` — Worker API URL for the Pages build

No APK or mobile build exists for this project.
