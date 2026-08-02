# Publishing SPOODY TRACKER

Two independent things you can publish. Do either, or both.

- **A. The website** — a live URL anyone can visit.
- **B. The source code** — the open-source repo on GitHub.

Both are free. You need to sign in to the services yourself (that part
can't be automated for you).

---

## A. Put the website online (~5 minutes)

The site works with **no backend** — visitors get the map, the demo
sightings, and can post locally. Do this first, add the shared backend
later (Part C) whenever you want.

### Option 1 — Cloudflare Pages (recommended, unlimited bandwidth)

```bash
npm run build
npx wrangler pages deploy dist --project-name spoody-tracker
```

The first run opens your browser to sign in to Cloudflare (free account,
no card). When it finishes it prints your live URL, something like
`https://spoody-tracker.pages.dev`.

To update the site later, run those same two commands again.

### Option 2 — Netlify

```bash
npm run build
npx netlify-cli deploy --prod --dir dist
```

### Option 3 — drag and drop

Run `npm run build`, then drag the generated `dist` folder onto
[app.netlify.com/drop](https://app.netlify.com/drop). No terminal, no
account required to start.

---

## B. Open-source the code on GitHub

1. Create an empty repo at [github.com/new](https://github.com/new).
   Name it `spoody-tracker`. **Don't** let it add a README or license —
   this project already has both.
2. Then run, replacing `YOUR-USERNAME`:

```bash
git remote add origin https://github.com/YOUR-USERNAME/spoody-tracker.git
git push -u origin main
```

The repo is already clean for publishing: MIT licensed, no secrets
committed, `.env` ignored, README with setup instructions, CONTRIBUTING
guide, and CI that verifies every push.

---

## C. Turn on the shared live backend (optional, later)

Until you do this, each visitor only sees demo sightings plus their own
posts. This step is what makes sightings shared worldwide in real time.

Full walkthrough is in [README.md](README.md) — the short version:

1. Create a free project at [database.new](https://database.new) (no card).
2. In its SQL editor run `supabase/migrations/0001_init.sql`, then
   `0002_social.sql`.
3. Deploy the edge functions (see README for the exact commands).
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your host's
   environment variables, then redeploy.

---

## Before you share the link

- Post a test sighting from your phone and from a computer.
- Keep the `ADMIN_TOKEN` you generate private — it unlocks `/admin.html`,
  where you moderate flagged posts.
- The footer disclaimer stays: this is an unofficial fan project, all art
  is original, and it isn't affiliated with any studio.
