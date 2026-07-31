import { sprite } from './palette';

/** Round orange menu button, 22x22 — hamburger lines on an orange disc, yellow arc highlight. */
export const menuBtn = sprite({
  name: 'menu-btn',
  map: { k: 'outline', o: 'orange', y: 'yellow' },
  rows: [
    '........kkkkkk........',
    '.....kkkyyyyyykkk.....',
    '....kyyyyyyyyooook....',
    '...kyyyyooooooooook...',
    '..kyyyoooooooooooook..',
    '.kyyyoooooooooooooook.',
    '.kyyooooooooooooooook.',
    '.kyyookkkkkkkkkkooook.',
    'kyyoookkkkkkkkkkoooook',
    'kyyooooooooooooooooook',
    'kyyoookkkkkkkkkkoooook',
    'kyyoookkkkkkkkkkoooook',
    'kyyooooooooooooooooook',
    'kyooookkkkkkkkkkoooook',
    '.kooookkkkkkkkkkooook.',
    '.kooooooooooooooooook.',
    '.kooooooooooooooooook.',
    '..kooooooooooooooook..',
    '...kooooooooooooook...',
    '....kooooooooooook....',
    '.....kkkooooookkk.....',
    '........kkkkkk........',
  ],
});

/** Cream plate for icon buttons (spider button), 24x24 rounded with soft bevel. */
export const iconPlate = sprite({
  name: 'icon-plate',
  map: { k: 'outline', p: 'pale', w: 'white', e: 'cyanLt' },
  slice: { top: 6, right: 6, bottom: 6, left: 6 },
  rows: [
    '....kkkkkkkkkkkkkkkk....',
    '...kppppppppppppppppk...',
    '..kppppppppppppppppppk..',
    '.kpwwwwwwwwwwwwwwwwwwek.',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    'kppwwwwwwwwwwwwwwwwwweek',
    '.kpwwwwwwwwwwwwwwwwwwek.',
    '..keeeeeeeeeeeeeeeeeek..',
    '...keeeeeeeeeeeeeeeek...',
    '....kkkkkkkkkkkkkkkk....',
  ],
});

/**
 * Spider glyph, 15x14 — reused across the spider button, chips, clusters.
 * Round abdomen, small head, four legs per side.
 */
export const spiderGlyph = sprite({
  name: 'spider-glyph',
  map: { k: 'outline' },
  rows: [
    '.k...........k.',
    '..k.........k..',
    '..k..kkkkk..k..',
    '...kkkkkkkkk...',
    'kk.kkkkkkkkk.kk',
    '..kkkkkkkkkkk..',
    '....kkkkkkk....',
    '..kkkkkkkkkkk..',
    'kk.kkkkkkkkk.kk',
    '...kkkkkkkkk...',
    '..k..kkkkk..k..',
    '.k...k...k...k.',
    '.k...k...k...k.',
    'k....k...k....k',
  ],
});

/** Filter chip base — green (confirmed). 22x16 rounded plate. */
export const chipGreen = sprite({
  name: 'chip-green',
  map: { k: 'outline', l: 'okLt', f: 'ok', d: 'okDk' },
  rows: [
    '...kkkkkkkkkkkkkkkk...',
    '..kllllllllllllllllk..',
    '.kffffffffffffffffffk.',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    '.kddddddddddddddddddk.',
    '..kddddddddddddddddk..',
    '...kkkkkkkkkkkkkkkk...',
  ],
});

/** Filter chip base — red (rumored). */
export const chipRed = sprite({
  name: 'chip-red',
  map: { k: 'outline', l: 'badLt', f: 'bad', d: 'badDk' },
  rows: [
    '...kkkkkkkkkkkkkkkk...',
    '..kllllllllllllllllk..',
    '.kffffffffffffffffffk.',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    'kffffffffffffffffffffk',
    '.kddddddddddddddddddk.',
    '..kddddddddddddddddk..',
    '...kkkkkkkkkkkkkkkk...',
  ],
});

/** Green sound button, 16x16 disc with speaker glyph. */
export const soundBtn = sprite({
  name: 'sound-btn',
  map: { k: 'outline', l: 'btnLt', g: 'btn' },
  rows: [
    '.....kkkkkk.....',
    '...kkllllggkk...',
    '..kllllllggggk..',
    '.klllllllgggggk.',
    '.kllllllkgggggk.',
    'kggggggkkggggggk',
    'kgggkkkkkggkgggk',
    'kgggkkkkkgggkggk',
    'kgggkkkkkgggkggk',
    'kgggkkkkkggkgggk',
    'kggggggkkggggggk',
    '.kggggggkgggggk.',
    '.kggggggggggggk.',
    '..kggggggggggk..',
    '...kkggggggkk...',
    '.....kkkkkk.....',
  ],
});

/** Yellow action tab 9-slice (call-to-action plates), 15x15, slice 5. */
export const yellowTab = sprite({
  name: 'yellow-tab',
  map: { k: 'outline', y: 'yellow', o: 'orange', d: 'navy' },
  slice: { top: 5, right: 5, bottom: 5, left: 5 },
  rows: [
    '..kkkkkkkkkkk..',
    '.kyyyyyyyyyyyk.',
    'kyyyyyyyyyyyyyk',
    'koooooooooooook',
    'koooooooooooook',
    'koooooooooooook',
    'koooooooooooook',
    'koooooooooooook',
    'koooooooooooook',
    'koooooooooooook',
    'koooooooooooook',
    'koooooooooooook',
    'kdddddddddddddk',
    '.kdddddddddddk.',
    '..kkkkkkkkkkk..',
  ],
});

/** Green pill button 9-slice, 13x13, slice 4. */
export const greenPill = sprite({
  name: 'green-pill',
  map: { k: 'outline', l: 'btnLt', g: 'btn', d: 'okDk' },
  slice: { top: 4, right: 4, bottom: 4, left: 4 },
  rows: [
    '..kkkkkkkkk..',
    '.klllllllllk.',
    'klllllllllllk',
    'kgggggggggggk',
    'kgggggggggggk',
    'kgggggggggggk',
    'kgggggggggggk',
    'kgggggggggggk',
    'kgggggggggggk',
    'kgggggggggggk',
    'kdddddddddddk',
    '.kdddddddddk.',
    '..kkkkkkkkk..',
  ],
});
