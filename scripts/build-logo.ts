/**
 * Renders the brand logo from the sprite sources:
 *  - public/logo.png       — big mask-face icon on the navy plate (1024px)
 *  - public/logo.svg       — same as crisp scalable pixel-rect SVG
 *  - public/favicon.png    — 64px favicon
 * Run: npx tsx scripts/build-logo.ts
 */
import { PNG } from 'pngjs';
import { writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { PALETTE } from '../src/sprites/palette';
import { logoFace } from '../src/sprites/logo.pix';

const ROOT = resolve(import.meta.dirname, '..');

const face = logoFace.rows;
const FW = face[0].length; // 16
const FH = face.length; // 13

/* Plate: rounded navy tile with blue bevel ring behind the face */
const PAD = 4;
const W = FW + PAD * 2;
const H = FH + PAD * 2;

function plateAt(x: number, y: number): string | null {
  /* rounded chamfer-2 tile */
  const rx = x < 2 ? 2 - x : x >= W - 2 ? x - (W - 3) : 0;
  const ry = y < 2 ? 2 - y : y >= H - 2 ? y - (H - 3) : 0;
  if (rx + ry > 2) return null;
  const edge =
    x === 0 || y === 0 || x === W - 1 || y === H - 1 || rx + ry === 2;
  if (edge) return PALETTE.outline;
  const inner = x <= 2 || y <= 2 || x >= W - 3 || y >= H - 3;
  if (inner) return y < H / 2 ? PALETTE.frame1 : PALETTE.frame2;
  return PALETTE.navy;
}

function pixelAt(x: number, y: number): string | null {
  const fx = x - PAD;
  const fy = y - PAD;
  if (fx >= 0 && fx < FW && fy >= 0 && fy < FH) {
    const ch = face[fy][fx];
    if (ch !== '.') {
      const name = (logoFace.map as Record<string, keyof typeof PALETTE>)[ch];
      return PALETTE[name];
    }
  }
  return plateAt(x, y);
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function writePng(path: string, scale: number): void {
  const png = new PNG({ width: W * scale, height: H * scale });
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const hex = pixelAt(x, y);
      const rgba: [number, number, number, number] = hex
        ? [...hexToRgb(hex), 255]
        : [0, 0, 0, 0];
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const i = ((y * scale + sy) * png.width + (x * scale + sx)) << 2;
          png.data[i] = rgba[0];
          png.data[i + 1] = rgba[1];
          png.data[i + 2] = rgba[2];
          png.data[i + 3] = rgba[3];
        }
      }
    }
  }
  writeFileSync(path, PNG.sync.write(png));
  console.log(`wrote ${path} (${W * scale}x${H * scale})`);
}

function writeSvg(path: string): void {
  const rects: string[] = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const hex = pixelAt(x, y);
      if (hex) rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${hex}"/>`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${rects.join('')}</svg>\n`;
  writeFileSync(path, svg);
  console.log(`wrote ${path}`);
}

writePng(join(ROOT, 'public', 'logo.png'), 43); // ~1024px
writeSvg(join(ROOT, 'public', 'logo.svg'));

/* The favicon is NOT derived from this plate. At 16-32px the frame and bevel
   swallow the face, so it gets its own drawing — see scripts/build-favicon.ts. */
