/**
 * Sprite framework: pixel art is authored as ASCII grids where each character
 * is one pixel mapped to a named palette color. `scripts/build-sprites.ts`
 * compiles every exported Sprite into crisp PNGs (1x and @3x).
 *
 * The palette below is the ONLY set of colors sprites may use — the build
 * fails on anything else, keeping all art on the extracted HUD palette.
 */

export const PALETTE = {
  outline: '#1e1e14', // warm near-black outline used on every sprite
  frame1: '#3997bb', // frame bevel light
  frame2: '#2976a0', // frame bevel mid
  frame3: '#154f80', // frame bevel dark
  navy: '#132853', // deep panel fill
  mapBg: '#031834', // ocean / app background
  cyan: '#96e0f7',
  cyanLt: '#a8e1fe',
  pale: '#d7f5ff',
  teal: '#09a4c7',
  orange: '#f89d51',
  orangeDk: '#b5622b',
  yellow: '#ffd988',
  ok: '#52b375',
  okLt: '#94c391',
  okPale: '#dcf6da',
  okDk: '#3f7c51',
  bad: '#ec5147',
  badLt: '#feaca6',
  badPale: '#fce5e3',
  badDk: '#9f3e34',
  btn: '#42aa6b',
  btnLt: '#87bb87',
  event: '#7ecff4',
  eventLt: '#abe8ff',
  white: '#e6f5f8', // cream white (character/eye highlights)
  tick1: '#2c2c2c', // ticker inset dark
  tick2: '#3b3b3b', // ticker inset light
  red: '#d8312a', // hero suit red
} as const;

export type PaletteName = keyof typeof PALETTE;

/** Per-sprite mapping from grid character to palette color. '.' is always transparent. */
export type CharMap = Record<string, PaletteName>;

export interface Sprite {
  /** Output file base name, e.g. "frame" -> frame.png + frame@3x.png */
  name: string;
  map: CharMap;
  /** One string per pixel row; every row must be the same length. */
  rows: string[];
  /** 9-slice insets (in 1x pixels) for CSS border-image, if this is a frame. */
  slice?: { top: number; right: number; bottom: number; left: number };
  /** If this is a horizontal animation sheet: number of equal-width frames. */
  frames?: number;
}

export function sprite(s: Sprite): Sprite {
  const w = s.rows[0]?.length ?? 0;
  for (const row of s.rows) {
    if (row.length !== w) {
      throw new Error(`sprite "${s.name}": ragged rows (expected width ${w}, got ${row.length})`);
    }
  }
  if (s.frames && w % s.frames !== 0) {
    throw new Error(`sprite "${s.name}": width ${w} not divisible by ${s.frames} frames`);
  }
  return s;
}
