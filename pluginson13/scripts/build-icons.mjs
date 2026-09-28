/*
 * Renders the favicon and home-screen icons from the two SVGs:
 *   public/favicon.svg     → favicon.ico (16, 32, 48)
 *   scripts/icon-full.svg  → apple-touch-icon.png, icon-192.png, icon-512.png
 * Swap either SVG for your own artwork and run `npm run icons`.
 */
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const favicon = await readFile(new URL('public/favicon.svg', root));
const full = await readFile(new URL('scripts/icon-full.svg', root));

const png = (svg, size) => sharp(svg, { density: 1024 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

// favicon.ico: a small ICO container holding PNG images.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(favicon, s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, i) => {
  const entry = 6 + i * 16;
  header.writeUInt8(size, entry);
  header.writeUInt8(size, entry + 1);
  header.writeUInt8(0, entry + 2);
  header.writeUInt8(0, entry + 3);
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(images[i].length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += images[i].length;
});
await writeFile(new URL('public/favicon.ico', root), Buffer.concat([header, ...images]));

for (const [name, size] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  await writeFile(new URL(`public/${name}`, root), await png(full, size));
}

console.log('icons written to public/');
