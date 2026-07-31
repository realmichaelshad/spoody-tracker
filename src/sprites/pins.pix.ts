import { sprite, type CharMap, type PaletteName } from './palette';

/**
 * Sighting pins — rounded badge, colored bevel ring (light top / deep bottom),
 * navy core with a white pixel star. 22x22, anchored center.
 */
const PIN_ROWS = [
    '......kkkkkkkkkkkkkkkkk......',
    '.....khhhhhhhllllllllllk.....',
    '....khhhhhhhhlllllllllllk....',
    '...khhhhhhhhhllllllllllllk...',
    '..khhhhhllllllllllllllllllk..',
    '.klllnnnnnnnnnnnnnnnnnnnlllk.',
    'kllllnnnnnnnkkkkknnnnnnnllllk',
    'kllllnnnnnnnkwwwknnnnnnnllllk',
    'kllllnnnnnnkkwwwkknnnnnnllllk',
    'kllllkkkkkkkwwwwwkkkkkkkllllk',
    'kllllkwwwwwwwwwwwwwwwwwkllllk',
    'kllllkkwwwwwwwwwwwwwwwkkllllk',
    'kllllnkkwwwwwwwwwwwwwkknllllk',
    'kllllnnkkwwwwwwwwwwwkknnllllk',
    'kllllnnnkkwwwwwwwwwkknnnllllk',
    'kddddnnnkkwwwwwwwwwkknnnddddk',
    'kddddnnnkwwwwwwwwwwwknnnddddk',
    'kddddnnkkwwwwwkwwwwwkknnddddk',
    'kddddnnkwwwwwkkkwwwwwknnddddk',
    'kddddnkkwwwwkknkkwwwwkknddddk',
    'kddddnkwwwwkknnnkkwwwwknddddk',
    'kddddnkwwwkknnnnnkkwwwknddddk',
    'kddddnkkkkknnnnnnnkkkkknddddk',
    '.kdddnnnnnnnnnnnnnnnnnnndddk.',
    '..kdddddddddddddddddddddddk..',
    '...kdddddddddddddddddddddk...',
    '....kdddddddddddddddddddk....',
    '.....kdddddddddddddddddk.....',
    '......kkkkkkkkkkkkkkkkk......',

];

function pinMap(
  glint: PaletteName,
  light: PaletteName,
  mid: PaletteName,
  dark: PaletteName,
): CharMap {
  return {
    k: 'outline',
    h: glint,
    l: light,
    f: mid,
    d: dark,
    n: 'navy',
    w: 'white',
    e: 'cyanLt',
  };
}

/** The one sighting pin — red badge, white star. */
export const pinSighting = sprite({
  name: 'pin-sighting',
  map: pinMap('badPale', 'badLt', 'bad', 'badDk'),
  rows: PIN_ROWS,
});

/** The viewer's own in-progress report pin (yellow/orange). */
export const pinPending = sprite({
  name: 'pin-pending',
  map: pinMap('white', 'yellow', 'orange', 'orange'),
  rows: PIN_ROWS,
});

/** Cluster marker — spider-web disc; count text is drawn by the symbol layer. */
export const clusterWeb = sprite({
  name: 'cluster-web',
  map: { k: 'outline', e: 'white', n: 'navy' },
  rows: [
    '.........kkkkkkkk.........',
    '.......kkeeeeeeeekk.......',
    '.....kkeeeennnneeeekk.....',
    '....keeennnnnnnnnneeek....',
    '...keennneeeeeeeennneek...',
    '..keeenneeennnneeenneeek..',
    '..kenneeennnnnnnneeennek..',
    '.keenneennnnnnnnnneenneek.',
    '.kenneeneneeeeeeneneennek.',
    'keeneennneeenneeennneeneek',
    'keeneenneeennnneeenneeneek',
    'kennennneenenneneennnennek',
    'kennennnennnnnnnnennnennek',
    'kennennnennnnnnnnennnennek',
    'kennennneenenneneennnennek',
    'keeneenneeennnneeenneeneek',
    'keeneennneeenneeennneeneek',
    '.kenneeneneeeeeeneneennek.',
    '.keenneennnnnnnnnneenneek.',
    '..kenneeennnnnnnneeennek..',
    '..keeenneeennnneeenneeek..',
    '...keennneeeeeeeennneek...',
    '....keeennnnnnnnnneeek....',
    '.....kkeeeennnneeeekk.....',
    '.......kkeeeeeeeekk.......',
    '.........kkkkkkkk.........',
  ],
});
