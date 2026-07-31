# Contributing

PRs welcome — this is a fun project, keep it fun.

## Ground rules

- **Original art only.** Never commit assets from any film, studio, or other
  project — not even into a scratch folder (git history is forever). All
  sprites are hand-drawn ASCII grids in this repo's palette.
- **$0 stack stays $0.** Don't add services that need a credit card or paid
  tier for the default path.
- **Pixel discipline.** UI sizes are multiples of `--px`; sprites use only
  palette colors (the build enforces this); `image-rendering: pixelated`
  everywhere art is scaled.

## Editing sprites

Sprites live in `src/sprites/*.pix.ts` as ASCII grids — one character per
pixel, `.` = transparent, other chars map to palette names:

```ts
export const thing = sprite({
  name: 'thing',
  map: { k: 'outline', r: 'red' },
  rows: [
    '.kk.',
    'krrk',
    '.kk.',
  ],
});
```

Run `npm run sprites` to compile PNGs into `public/sprites/` (committed).
Rules: every row the same length; colors come from `PALETTE` in
`src/sprites/palette.ts`; outline shapes in `k` — that's what makes the
style read. Check your work at 200% browser zoom: edges must stay crisp.

## Dev commands

```bash
npm run dev        # dev server on :5199
npm run sprites    # rebuild sprite PNGs from .pix.ts sources
npm run typecheck  # tsc --noEmit
npm run build      # sprites + typecheck + production build
```

## Where things live

- `src/map/` — MapLibre style, globe, pins, popups (imperative TS)
- `src/hud/` — Preact components for every panel/overlay
- `src/lib/` — api, social, geocode, screening, demo store
- `src/state/` — signals (sightings, notifications, settings)
- `supabase/` — schema migrations + edge functions (the only write paths)
