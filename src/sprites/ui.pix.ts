import { sprite } from './palette';

/**
 * Round orange menu button, 22x22 — yellow rim-light upper-left,
 * dark-orange rim-shade lower-right, three crisp hamburger bars.
 */
export const menuBtn = sprite({
  name: 'menu-btn',
  map: { k: 'outline', o: 'orange', y: 'yellow', x: 'orangeDk' },
  rows: [
    '........kkkkkk........',
    '......kyyyyyyyyk......',
    '....kyyyyyyyyyyyyk....',
    '...kyyyyyoooooooook...',
    '..kyyyyooooooooooook..',
    '..kyyyoooooooooooook..',
    '.kyyyoooooooooooooook.',
    '.kyyookkkkkkkkkkooook.',
    'kyyoookkkkkkkkkkoooook',
    'kyooooooooooooooooooxk',
    'koooooooooooooooooooxk',
    'koooookkkkkkkkkkoooxxk',
    'koooookkkkkkkkkkoooxxk',
    'kooooooooooooooooooxxk',
    '.koooooooooooooooooxk.',
    '.kooookkkkkkkkkkooxxk.',
    '..koookkkkkkkkkkxxxk..',
    '..kooooooooooooxxxxk..',
    '...kooooooooooxxxxk...',
    '....koooooooxxxxxk....',
    '......kxxxxxxxxk......',
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

/** Spider glyph, 17x15 — 2px legs, solid silhouette. Reused everywhere. */
export const spiderGlyph = sprite({
  name: 'spider-glyph',
  map: { k: 'outline' },
  rows: [
    '.kk...........kk.',
    '..kk.........kk..',
    '...kk..kkk..kk...',
    '....k.kkkkk.k....',
    'kk..kkkkkkkkk..kk',
    '.kkkkkkkkkkkkkkk.',
    '..kkkkkkkkkkkkk..',
    '....kkkkkkkkk....',
    '...kkkkkkkkkkk...',
    'kk.kkkkkkkkkkk.kk',
    '.kkkkkkkkkkkkkkk.',
    '..kk.kkkkkkk.kk..',
    '.....kkkkkkk.....',
    '...kk..kkk..kk...',
    '..kk....k....kk..',
  ],
});

/** Green sound button, 16x16 — speaker + wave, rim-lit. */
export const soundBtn = sprite({
  name: 'sound-btn',
  map: { k: 'outline', l: 'btnLt', g: 'btn', x: 'okDk' },
  rows: [
    '......kkkk......',
    '....kllllllk....',
    '...kllllllllk...',
    '..kllllgkggggk..',
    '.klllggkkgggggk.',
    '.kllggkkkgkgggk.',
    'kllkkkkkkggkgggk',
    'kllkkkkkkggkgkgk',
    'kllkkkkkkggkgkgk',
    'kggkkkkkkggkgggk',
    '.kggggkkkgkgggk.',
    '.kgggggkkggggxk.',
    '..kgggggkgggxk..',
    '...kggggggxxk...',
    '....kxxxxxxk....',
    '......kkkk......',
  ],
});

/**
 * Yellow action tab 9-slice — RAISED variant with a baked 2px drop shadow;
 * pairs with yellowTabPressed for the pixel press-down effect. 19x19, slice 7.
 */
export const yellowTab = sprite({
  name: 'yellow-tab',
  map: { k: 'outline', y: 'yellow', o: 'orange', x: 'orangeDk', s: 'navy' },
  slice: { top: 7, right: 7, bottom: 7, left: 7 },
  rows: [
    '...kkkkkkkkkkkkk...',
    '..kyyyyyyyyyyyyyk..',
    '.kyyyyyyyyyyyyyyyk.',
    'kyyyyyyyyyyyyyyyyyk',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'kxxxxxxxxxxxxxxxxxk',
    '.kxxxxxxxxxxxxxxxk.',
    '..kxxxxxxxxxxxxxk..',
    '...kkkkkkkkkkkkk...',
    '..sssssssssssssss..',
    '..sssssssssssssss..',
  ],
});

/** Pressed variant — shadow gone, top shaded (the button sits "down"). */
export const yellowTabPressed = sprite({
  name: 'yellow-tab-pressed',
  map: { k: 'outline', o: 'orange', x: 'orangeDk' },
  slice: { top: 7, right: 7, bottom: 7, left: 7 },
  rows: [
    '...kkkkkkkkkkkkk...',
    '..kxxxxxxxxxxxxxk..',
    '.kxxxxxxxxxxxxxxxk.',
    'kxxxxxxxxxxxxxxxxxk',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    'koooooooooooooooook',
    '.koooooooooooooook.',
    '..koooooooooooook..',
    '...kkkkkkkkkkkkk...',
  ],
});

/**
 * Ruler tick strips for the map edges — minor tick every 4px, major every
 * 16px. Repeat-x along the top edge; the vertical strip is its transpose.
 */
export const rulerH = sprite({
  name: 'ruler-h',
  map: { e: 'cyanLt' },
  rows: [
    'e...............',
    'e.......e.......',
    'e...e...e...e...',
    'e.e.e.e.e.e.e.e.',
  ],
});

export const rulerV = sprite({
  name: 'ruler-v',
  map: { e: 'cyanLt' },
  rows: [
    'eeee',
    '....',
    '..ee',
    '....',
    '.eee',
    '....',
    '..ee',
    '....',
    'eeee',
    '....',
    '..ee',
    '....',
    '.eee',
    '....',
    '..ee',
    '....',
  ],
});

/** Green pill button 9-slice — RAISED with baked shadow. 15x15, slice 5. */
export const greenPill = sprite({
  name: 'green-pill',
  map: { k: 'outline', l: 'btnLt', g: 'btn', d: 'okDk', s: 'navy' },
  slice: { top: 5, right: 5, bottom: 5, left: 5 },
  rows: [
    '..kkkkkkkkkkk..',
    '.klllllllllllk.',
    'klllllllllllllk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kdddddddddddddk',
    '.kdddddddddddk.',
    '..kkkkkkkkkkk..',
    '..sssssssssss..',
    '..sssssssssss..',
  ],
});

/** Pressed green pill — shadow gone, top shaded. */
export const greenPillPressed = sprite({
  name: 'green-pill-pressed',
  map: { k: 'outline', g: 'btn', d: 'okDk' },
  slice: { top: 5, right: 5, bottom: 5, left: 5 },
  rows: [
    '..kkkkkkkkkkk..',
    '.kdddddddddddk.',
    'kdddddddddddddk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    'kgggggggggggggk',
    '.kgggggggggggk.',
    '..kkkkkkkkkkk..',
  ],
});
