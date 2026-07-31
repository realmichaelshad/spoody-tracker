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
