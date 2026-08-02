/**
 * Builds the favicon set from a purpose-drawn 16x16 mask.
 *
 * The site logo is a framed plate, which is right on the page but turns to
 * mush at favicon size — the border eats the canvas and the face shrinks to
 * a dot. Search results and browser tabs render this at 16-32px, often
 * cropped to a circle, so this version is drawn for that: the mask fills
 * the frame edge to edge, two shapes, maximum contrast.
 *
 *   npx tsx scripts/build-favicon.ts
 */
import { PNG } from 'pngjs';
import { writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'public');

/* k = outline, r = suit red, w = eye white. Drawn on a 16x16 grid so every
   pixel survives at the size this is actually viewed. */
const MASK = [
  '.....kkkkkk.....',
  '...kkrrrrrrkk...',
  '..krrrrrrrrrrk..',
  '.krrrrrrrrrrrrk.',
  'krrrrrrrrrrrrrrk',
  'krwwwwrrrrwwwwrk',
  'krwwwwwrrwwwwwrk',
  'krwwwwwrrwwwwwrk',
  'krrwwwwrrwwwwrrk',
  'krrrwwwrrwwwrrrk',
  'krrrrwwrrwwrrrrk',
  'krrrrrrrrrrrrrrk',
  'krrrrrrrrrrrrrrk',
  '.krrrrrrrrrrrrk.',
  '..kkrrrrrrrrkk..',
  '....kkkkkkkk....',
];

const COLORS: Record<string, [number, number, number, number]> = {
  k: [30, 30, 20, 255],
  r: [216, 49, 42, 255],
  w: [230, 245, 248, 255],
  '.': [0, 0, 0, 0],
};

function render(scale: number): Buffer {
  const S = MASK.length;
  const png = new PNG({ width: S * scale, height: S * scale });
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const c = COLORS[MASK[y][x]] ?? COLORS['.'];
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const i = ((y * scale + sy) * png.width + (x * scale + sx)) << 2;
          png.data[i] = c[0];
          png.data[i + 1] = c[1];
          png.data[i + 2] = c[2];
          png.data[i + 3] = c[3];
        }
      }
    }
  }
  return PNG.sync.write(png);
}

/* Sanity: every row must be the grid width, or the art is silently skewed. */
for (const [i, row] of MASK.entries()) {
  if (row.length !== MASK.length) {
    throw new Error(`favicon row ${i} is ${row.length}, expected ${MASK.length}`);
  }
}

const sizes: Array<[string, number]> = [
  ['favicon.png', 2], // 32px — what tabs and search results use
  ['favicon-48.png', 3], // 48px
  ['apple-touch-icon.png', 12], // 192px — home screen
  ['icon-512.png', 32], // 512px — PWA / share targets
];

for (const [file, scale] of sizes) {
  writeFileSync(join(OUT, file), render(scale));
  console.log(`wrote ${file} (${MASK.length * scale}px)`);
}

/**
 * Packs the small sizes into a multi-resolution .ico.
 *
 * Googlebot asks for /favicon.ico when it can't use the <link> tag, and
 * without one the search result falls back to a generic globe. ICO has
 * allowed raw PNG payloads since Vista, so no BMP encoding is needed.
 */
function writeIco(path: string, images: Array<{ px: number; data: Buffer }>): void {
  const dir = Buffer.alloc(6 + 16 * images.length);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // type: icon
  dir.writeUInt16LE(images.length, 4);

  let offset = dir.length;
  images.forEach((img, i) => {
    const e = 6 + i * 16;
    dir.writeUInt8(img.px >= 256 ? 0 : img.px, e); // 0 encodes 256
    dir.writeUInt8(img.px >= 256 ? 0 : img.px, e + 1);
    dir.writeUInt8(0, e + 2); // palette size (0 = truecolor)
    dir.writeUInt8(0, e + 3); // reserved
    dir.writeUInt16LE(1, e + 4); // color planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(img.data.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += img.data.length;
  });

  writeFileSync(path, Buffer.concat([dir, ...images.map((i) => i.data)]));
  console.log(`wrote favicon.ico (${images.map((i) => i.px).join('/')}px)`);
}

writeIco(join(OUT, 'favicon.ico'), [
  { px: 16, data: render(1) },
  { px: 32, data: render(2) },
  { px: 48, data: render(3) },
]);
