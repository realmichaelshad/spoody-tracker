import { sprite } from './palette';

/**
 * Logo mascot — red mask face with two big angled white eyes,
 * sits between the two words of the site name. 16x14.
 */
export const logoFace = sprite({
  name: 'logo-face',
  map: { k: 'outline', r: 'red', w: 'white' },
  rows: [
    '.....kkkkkk.....',
    '...kkrrrrrrkk...',
    '..krrrrrrrrrrk..',
    '.krkkwwrrwwkkrk.',
    'krkwwwwrrwwwwkrk',
    'krkwwwwrrwwwwkrk',
    'krkwwwwrrwwwwkrk',
    'krrkwwwrrwwwkrrk',
    '.krrkwwrrwwkrrk.',
    '.krrrkwrrwkrrrk.',
    '..krrrkkkkrrrk..',
    '...kkrrrrrrkk...',
    '.....kkkkkk.....',
  ],
});

/**
 * Logo plate 9-slice — navy plate with blue bevel border for the site title.
 * 19x19, slice 7.
 */
export const logoPlate = sprite({
  name: 'logo-plate',
  map: { k: 'outline', a: 'frame1', c: 'frame3', n: 'navy' },
  slice: { top: 7, right: 7, bottom: 7, left: 7 },
  rows: [
    '...kkkkkkkkkkkkk...',
    '..kaaaaaaaaaaaaak..',
    '.kaaaaaaaaaaaaaaak.',
    'kaaakkkkkkkkkkkaaak',
    'kaakcnnnnnnnnnckaak',
    'kaaknnnnnnnnnnnkaak',
    'kaaknnnnnnnnnnnkaak',
    'kaaknnnnnnnnnnnkaak',
    'kaaknnnnnnnnnnnkaak',
    'kaaknnnnnnnnnnnkaak',
    'kaaknnnnnnnnnnnkaak',
    'kaaknnnnnnnnnnnkaak',
    'kaaknnnnnnnnnnnkaak',
    'kaaknnnnnnnnnnnkaak',
    'kaakcnnnnnnnnnckaak',
    'kaaakkkkkkkkkkkaaak',
    '.kaaaaaaaaaaaaaaak.',
    '..kaaaaaaaaaaaaak..',
    '...kkkkkkkkkkkkk...',
  ],
});
