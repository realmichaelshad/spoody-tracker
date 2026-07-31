import { sprite } from './palette';

/**
 * Main HUD frame — chunky blue bevel tube with rounded corners.
 * 27x27 9-slice tile; cross-section (outside -> in):
 * outline, 3px light bevel, 2px mid, 2px dark, outline seam, hole.
 * Use: border-image: url(/sprites/frame@3x.png) 36 fill / calc(12px * var(--px-ratio)) round;
 */
export const frame = sprite({
  name: 'frame',
  map: { k: 'outline', a: 'frame1', b: 'frame2', c: 'frame3' },
  slice: { top: 12, right: 12, bottom: 12, left: 12 },
  rows: [
    '......kkkkkkkkkkkkkkk......',
    '....kkaaaaaaaaaaaaaaakk....',
    '...kaaaaaaaaaaaaaaaaaaak...',
    '..kaaaaaaaaaaaaaaaaaaaaak..',
    '.kaabbbbbbbbbbbbbbbbbbbaak.',
    '.kaabbbbbbbbbbbbbbbbbbbaak.',
    'kaaabbcccccccccccccccbbaaak',
    'kaaabbcccccccccccccccbbaaak',
    'kaaabbcckkkkkkkkkkkccbbaaak',
    'kaaabbcck.........kccbbaaak',
    'kaaabbcck.........kccbbaaak',
    'kaaabbcck.........kccbbaaak',
    'kaaabbcck.........kccbbaaak',
    'kaaabbcck.........kccbbaaak',
    'kaaabbcck.........kccbbaaak',
    'kaaabbcck.........kccbbaaak',
    'kaaabbcck.........kccbbaaak',
    'kaaabbcck.........kccbbaaak',
    'kaaabbcckkkkkkkkkkkccbbaaak',
    'kaaabbcccccccccccccccbbaaak',
    'kaaabbcccccccccccccccbbaaak',
    '.kaabbbbbbbbbbbbbbbbbbbaak.',
    '.kaabbbbbbbbbbbbbbbbbbbaak.',
    '..kaaaaaaaaaaaaaaaaaaaaak..',
    '...kaaaaaaaaaaaaaaaaaaak...',
    '....kkaaaaaaaaaaaaaaakk....',
    '......kkkkkkkkkkkkkkk......',
  ],
});

/**
 * Panel box — navy fill with a light-blue pixel border and rounded corners,
 * for popups, drawers, and message boxes. 15x15 9-slice, slice 6.
 */
export const panel = sprite({
  name: 'panel',
  map: { k: 'outline', e: 'cyanLt', n: 'navy' },
  slice: { top: 6, right: 6, bottom: 6, left: 6 },
  rows: [
    '..kkkkkkkkkkk..',
    '.keeeeeeeeeeek.',
    'keennnnnnnnneek',
    'kennnnnnnnnnnek',
    'kennnnnnnnnnnek',
    'kennnnnnnnnnnek',
    'kennnnnnnnnnnek',
    'kennnnnnnnnnnek',
    'kennnnnnnnnnnek',
    'kennnnnnnnnnnek',
    'kennnnnnnnnnnek',
    'kennnnnnnnnnnek',
    'keennnnnnnnneek',
    '.keeeeeeeeeeek.',
    '..kkkkkkkkkkk..',
  ],
});

/**
 * Inset well — dark recessed area (ticker track, form inputs).
 * Bevel inverted: dark on top/left, lighter at bottom. 11x11, slice 4.
 */
export const inset = sprite({
  name: 'inset',
  map: { k: 'outline', d: 'tick1', l: 'tick2', m: 'mapBg' },
  slice: { top: 4, right: 4, bottom: 4, left: 4 },
  rows: [
    'kkkkkkkkkkk',
    'kdddddddddk',
    'kdmmmmmmmdk',
    'kdmmmmmmmdk',
    'kdmmmmmmmdk',
    'kdmmmmmmmdk',
    'kdmmmmmmmdk',
    'kdmmmmmmmdk',
    'kdmmmmmmldk',
    'kdllllllllk',
    'kkkkkkkkkkk',
  ],
});
