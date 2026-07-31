# WEBHEAD TRACKER

A retro pixel-art **community sightings map**. Anyone on Earth can drop a
sighting — codename, message, optional photo, no account — and everyone else
watches it pop onto a spinning globe live. Like reports, reply in threads,
and keep an eye on the spider button for new alerts.

Unofficial fan project inspired by a certain web-slinger's tracker. All art
is original hand-drawn pixel work; no studio assets are used. Not affiliated
with or endorsed by any film studio or comics publisher.

**100% free to run.** No API keys for the map, no credit card anywhere in the
default stack, MIT licensed.

---

## Quick start (demo mode — zero setup)

```bash
git clone <your-fork-url> webhead-tracker
cd webhead-tracker
npm install
npm run dev
```

Open http://localhost:5199. That's the whole thing: with no backend
configured the app runs in **demo mode** — simulated worldwide sightings,
your own reports persist in your browser, and every feature works locally.

## Going live (free backend)

Demo mode is local-only. To make reports visible to *everyone*, add a free
[Supabase](https://supabase.com) project (no card required):

1. **Create a project** at database.new, then in the SQL editor run, in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_social.sql`
2. **Deploy the edge functions** (install the [Supabase CLI](https://supabase.com/docs/guides/cli) first):

   ```bash
   supabase link --project-ref <your-project-ref>
   supabase secrets set IP_SALT=$(openssl rand -hex 24) ADMIN_TOKEN=$(openssl rand -hex 24)
   supabase functions deploy report-sighting --no-verify-jwt
   supabase functions deploy flag-sighting --no-verify-jwt
   supabase functions deploy like-sighting --no-verify-jwt
   supabase functions deploy reply-sighting --no-verify-jwt
   supabase functions deploy admin --no-verify-jwt
   ```

3. **Point the app at it** — copy `.env.example` to `.env`:

   ```ini
   VITE_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
   VITE_SUPABASE_ANON_KEY="YOUR-ANON-KEY"
   ```

4. `npm run dev` again. Open two browsers, report in one, watch the pin pop
   into the other. That's the realtime path everyone on your deployment shares.

### Keeping the free project awake

Supabase free projects pause after ~7 idle days. This repo ships
`.github/workflows/keepalive.yml` — add `SUPABASE_URL` and
`SUPABASE_ANON_KEY` as GitHub Actions secrets and it pings every 3 days.

## Deploying the site (free)

Any static host works. [Cloudflare Pages](https://pages.cloudflare.com) is a
good default (unmetered bandwidth): connect the repo, build command
`npm run build`, output directory `dist`, and add your `VITE_*` variables in
the Pages environment settings.

## Moderation

- Users can **FLAG** any sighting; 3 unique flags auto-hide it everywhere.
- The hidden admin page lives at `/admin.html` — paste your `ADMIN_TOKEN`
  to see flagged/hidden/unscreened queues and restore/hide/delete.
- Photos are screened in the browser (bundled NSFW model) before upload;
  anything that slips through can be flagged and removed.
- Fallback: the Supabase Studio table editor can do everything manually.

## Optional hardening

| Feature | How |
| --- | --- |
| Bot check on reports | Create a free [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) site, set `VITE_TURNSTILE_SITE_KEY` (client) and `supabase secrets set TURNSTILE_SECRET=...` (server) |
| Stricter photo policy | `supabase secrets set TRUST_CLIENT_SCREEN=off` — photos land blurred until you approve them in the admin queue |

## Rebrand it

Everything brandable is config: set `VITE_SITE_NAME` and `VITE_TAGLINE`, swap
the palette in `src/styles/tokens.css`, and redraw sprites in
`src/sprites/*.pix.ts` (ASCII grids — see CONTRIBUTING). The default identity
is intentionally our own.

## Tech (all free tiers)

- [MapLibre GL JS](https://maplibre.org) — BSD, globe projection, no key
- [OpenFreeMap](https://openfreemap.org) tiles — no key, no limits
  (`VITE_TILES_URL` overrides for self-hosting)
- Vite + Preact + signals; WebAudio-synthesized SFX (no audio assets)
- Supabase free tier — Postgres + RLS, Realtime, Storage, Edge Functions
- [nsfwjs](https://github.com/infinitered/nsfwjs) — in-browser photo screening
- Geocoding: BigDataCloud free client API at report time, offline fallback

## Sprite pipeline

Pixel art is authored as ASCII grids in `src/sprites/*.pix.ts` — one char per
pixel, palette-locked. `npm run sprites` compiles them to crisp PNGs (1x/@3x)
in `public/sprites/`. Off-palette colors fail the build; diffs stay readable.

## License

MIT — see [LICENSE](LICENSE). Please keep your deployment's own branding
honest about being an unofficial fan project.
