/**
 * Compiles src/sprites/*.pix.ts pixel-matrix sources into PNGs under
 * public/sprites/ (1x and nearest-neighbor @3x) plus a sprites.json manifest.
 *
 * Rules enforced here:
 *  - every grid char must map to a PALETTE color ('.' = transparent)
 *  - only PALETTE hexes ever reach a PNG (keeps all art on-palette)
 *  - generated PNGs are committed; CI regenerates and fails on drift
 */
import { PNG } from 'pngjs';
import { mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PALETTE, type Sprite } from '../src/sprites/palette';

const ROOT = resolve(import.meta.dirname, '..');
const SRC_DIR = join(ROOT, 'src', 'sprites');
const OUT_DIR = join(ROOT, 'public', 'sprites');
const SCALE = 3;

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`bad hex: ${hex}`);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function renderPng(s: Sprite, scale: number): Buffer {
  const w = s.rows[0].length;
  const h = s.rows.length;
  const png = new PNG({ width: w * scale, height: h * scale });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = s.rows[y][x];
      let rgba: [number, number, number, number];
      if (ch === '.') {
        rgba = [0, 0, 0, 0];
      } else {
        const name = s.map[ch];
        if (!name) throw new Error(`sprite "${s.name}": unmapped char "${ch}" at ${x},${y}`);
        const hex = PALETTE[name];
        if (!hex) throw new Error(`sprite "${s.name}": char "${ch}" maps to unknown palette name "${name}"`);
        const [r, g, b] = hexToRgb(hex);
        rgba = [r, g, b, 255];
      }
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const idx = ((y * scale + sy) * png.width + (x * scale + sx)) << 2;
          png.data[idx] = rgba[0];
          png.data[idx + 1] = rgba[1];
          png.data[idx + 2] = rgba[2];
          png.data[idx + 3] = rgba[3];
        }
      }
    }
  }
  return PNG.sync.write(png);
}

interface ManifestEntry {
  w: number;
  h: number;
  slice?: Sprite['slice'];
  frames?: number;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const manifest: Record<string, ManifestEntry> = {};
  const files = readdirSync(SRC_DIR).filter((f) => f.endsWith('.pix.ts'));
  let count = 0;

  for (const file of files) {
    const mod = await import(pathToFileURL(join(SRC_DIR, file)).href);
    for (const exp of Object.values(mod)) {
      const s = exp as Sprite;
      if (!s || typeof s !== 'object' || !('rows' in s) || !('name' in s)) continue;
      writeFileSync(join(OUT_DIR, `${s.name}.png`), renderPng(s, 1));
      writeFileSync(join(OUT_DIR, `${s.name}@3x.png`), renderPng(s, SCALE));
      manifest[s.name] = {
        w: s.rows[0].length,
        h: s.rows.length,
        ...(s.slice ? { slice: s.slice } : {}),
        ...(s.frames ? { frames: s.frames } : {}),
      };
      count++;
    }
  }

  writeFileSync(join(OUT_DIR, 'sprites.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`built ${count} sprites from ${files.length} files -> public/sprites/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
