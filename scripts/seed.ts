/**
 * Drip the opening-week sightings onto the live map.
 *
 * Posts arrive one at a time with a widening gap, so launch night is busy
 * and the days after taper off — the shape real activity has, rather than
 * a bulk import that reads as fake.
 *
 *   npx tsx scripts/seed.ts --list        # preview the schedule, post nothing
 *   npx tsx scripts/seed.ts --drip        # start now
 *   npx tsx scripts/seed.ts --drip --at "2026-08-02T19:30"
 *   npx tsx scripts/seed.ts --now         # dump them all (testing only)
 *
 * These post through the token-gated admin route, so they are not subject
 * to the per-visitor rate limit — they are the operator's own posts.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { PNG } from 'pngjs';
import { SEEDS, type Seed } from './seed-data';

const ROOT = resolve(import.meta.dirname, '..');
const PROGRESS = resolve(ROOT, '.seed-progress.local.json');

/* Gap between posts grows as the week goes on: launch night feels alive,
   then it settles down. Minutes, [min, max] per wave. */
const WAVES: Array<{ upTo: number; gap: [number, number]; label: string }> = [
  { upTo: 12, gap: [3, 7], label: 'launch night' },
  { upTo: 28, gap: [12, 25], label: 'later that night' },
  { upTo: 38, gap: [45, 90], label: 'next day' },
  { upTo: 999, gap: [120, 240], label: 'tapering off' },
];

function waveFor(i: number) {
  return WAVES.find((w) => i < w.upTo) ?? WAVES[WAVES.length - 1];
}

function loadAdminToken(): string {
  const txt = readFileSync(resolve(ROOT, 'ADMIN-TOKEN.local.txt'), 'utf8');
  const token = txt.trim().split(/\r?\n/).pop()?.trim();
  if (!token || token.length < 20) throw new Error('Could not read ADMIN-TOKEN.local.txt');
  return token;
}

function loadEnv(): { url: string; key: string } {
  for (const file of ['.env', '.env.production']) {
    try {
      const txt = readFileSync(resolve(ROOT, file), 'utf8');
      const url = /VITE_SUPABASE_URL="?([^"\n]+)"?/.exec(txt)?.[1];
      const key = /VITE_SUPABASE_ANON_KEY="?([^"\n]+)"?/.exec(txt)?.[1];
      if (url && key && key.startsWith('eyJ')) return { url: url.trim(), key: key.trim() };
    } catch {
      /* try the next file */
    }
  }
  throw new Error('Could not read Supabase config from .env or .env.production');
}

/**
 * A generated pixel "photo" — a night skyline with a small red figure on a
 * rooftop. Deterministic per seed so each place looks different. Original
 * artwork, nothing scraped.
 */
function makePhoto(seed: Seed): Buffer {
  const W = 160;
  const H = 100;
  const png = new PNG({ width: W, height: H });

  let h = 0;
  for (const ch of seed.place) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => ((h = (h * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

  const put = (x: number, y: number, c: [number, number, number]) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) << 2;
    png.data[i] = c[0];
    png.data[i + 1] = c[1];
    png.data[i + 2] = c[2];
    png.data[i + 3] = 255;
  };

  /* sky gradient, deep navy to a lighter horizon */
  for (let y = 0; y < H; y++) {
    const t = y / H;
    const c: [number, number, number] = [
      Math.round(3 + t * 18),
      Math.round(24 + t * 46),
      Math.round(52 + t * 60),
    ];
    for (let x = 0; x < W; x++) put(x, y, c);
  }

  /* a few stars */
  for (let i = 0; i < 40; i++) {
    put(Math.floor(rnd() * W), Math.floor(rnd() * H * 0.5), [215, 245, 255]);
  }

  /* skyline: blocks of varying height with lit windows */
  let x = 0;
  while (x < W) {
    const bw = 10 + Math.floor(rnd() * 18);
    const bh = 25 + Math.floor(rnd() * 45);
    const top = H - bh;
    for (let bx = x; bx < Math.min(W, x + bw); bx++) {
      for (let by = top; by < H; by++) put(bx, by, [13, 37, 71]);
      put(bx, top, [21, 79, 128]);
    }
    for (let wy = top + 4; wy < H - 4; wy += 6) {
      for (let wx = x + 3; wx < x + bw - 3; wx += 5) {
        if (rnd() > 0.45) {
          put(wx, wy, [255, 217, 136]);
          put(wx + 1, wy, [255, 217, 136]);
        }
      }
    }
    x += bw + 2;
  }

  /* the figure: a small red shape on a rooftop, mid-swing */
  const fx = 60 + Math.floor(rnd() * 45);
  const fy = 30 + Math.floor(rnd() * 20);
  const RED: [number, number, number] = [216, 49, 42];
  const BLUE: [number, number, number] = [19, 40, 83];
  for (const [dx, dy, col] of [
    [0, 0, RED], [1, 0, RED], [-1, 0, RED],
    [0, -1, RED], [0, 1, BLUE], [0, 2, BLUE],
    [-1, 2, BLUE], [1, 2, BLUE], [-2, 1, RED], [2, 1, RED],
  ] as Array<[number, number, [number, number, number]]>) {
    put(fx + dx, fy + dy, col);
  }
  /* web line up to the corner */
  for (let i = 0; i < 30; i++) {
    put(fx - Math.floor(i * 0.8), fy - 1 - i, [215, 245, 255]);
  }

  return PNG.sync.write(png);
}

async function post(
  seed: Seed,
  cfg: { url: string; key: string },
  token: string,
): Promise<string> {
  const res = await fetch(`${cfg.url}/functions/v1/admin?op=action`, {
    method: 'POST',
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'seed',
      lat: seed.lat,
      lng: seed.lng,
      name: seed.name,
      message: seed.message,
      place_label: seed.place,
      ...(seed.photo ? { photo_base64: makePhoto(seed).toString('base64') } : {}),
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (res.status === 401) return 'UNAUTHORIZED — check ADMIN-TOKEN.local.txt';
  if (!res.ok || !body.ok) return `FAILED (${res.status}) ${JSON.stringify(body).slice(0, 90)}`;
  return `ok ${String(body.id).slice(0, 8)}${body.photo ? ' +photo' : ''}`;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Remember how far we got, so a restart doesn't repost everything. */
function readProgress(): number {
  try {
    return existsSync(PROGRESS) ? JSON.parse(readFileSync(PROGRESS, 'utf8')).done ?? 0 : 0;
  } catch {
    return 0;
  }
}
function writeProgress(done: number) {
  try {
    writeFileSync(PROGRESS, JSON.stringify({ done, at: new Date().toISOString() }));
  } catch {
    /* non-fatal */
  }
}

async function main() {
  const args = process.argv.slice(2);
  const drip = args.includes('--drip');
  const now = args.includes('--now');
  const reset = args.includes('--reset');
  const atArg = args[args.indexOf('--at') + 1];

  if (reset) writeProgress(0);

  if (!drip && !now) {
    let mins = 0;
    console.log(`${SEEDS.length} seeds. Schedule from start:\n`);
    SEEDS.forEach((s, i) => {
      const w = waveFor(i);
      const withPhoto = s.photo ? ' [photo]' : '';
      const hrs = Math.floor(mins / 60);
      const stamp = hrs ? `+${hrs}h${String(Math.round(mins % 60)).padStart(2, '0')}m` : `+${Math.round(mins)}m`;
      console.log(`  ${stamp.padEnd(9)} ${w.label.padEnd(18)} ${s.place.padEnd(26)} ${s.name}${withPhoto}`);
      mins += (w.gap[0] + w.gap[1]) / 2;
    });
    console.log(`\nTotal span: about ${Math.round(mins / 60)} hours.`);
    console.log('Run it:  --drip   |   start later:  --drip --at "2026-08-02T19:30"');
    return;
  }

  const cfg = loadEnv();
  const token = loadAdminToken();

  if (atArg && !atArg.startsWith('--')) {
    const start = new Date(atArg).getTime();
    if (Number.isNaN(start)) throw new Error(`Could not read a date from "${atArg}"`);
    const wait = start - Date.now();
    if (wait > 0) {
      console.log(`Holding until ${new Date(start).toLocaleString()} (${(wait / 3600000).toFixed(1)}h)…`);
      await sleep(wait);
    }
  }

  const startAt = readProgress();
  if (startAt) console.log(`Resuming from seed ${startAt + 1}.`);
  console.log(`Posting ${SEEDS.length - startAt} sightings${drip ? ', spaced out' : ''}…\n`);

  for (let i = startAt; i < SEEDS.length; i++) {
    const seed = SEEDS[i];
    const w = waveFor(i);
    const result = await post(seed, cfg, token);
    console.log(
      `[${String(i + 1).padStart(2)}/${SEEDS.length}] ${new Date().toLocaleTimeString()} ` +
        `${seed.place.padEnd(26)} ${result}`,
    );
    writeProgress(i + 1);

    if (drip && i < SEEDS.length - 1) {
      const [lo, hi] = w.gap;
      const gapMin = lo + Math.random() * (hi - lo);
      await sleep(gapMin * 60_000);
    }
  }

  console.log('\nDone — the map has a week of history on it.');
}

main().catch((e) => {
  console.error(e?.message ?? e);
  process.exit(1);
});
