import { sprite } from './palette';

/**
 * Climbing hero — small masked figure clinging to the HUD frame.
 * Two-frame idle animation (head sway); each frame is 18x22,
 * sheet is 36x22. Rows are written as frame1 + frame2 halves.
 */
export const hero = sprite({
  name: 'hero',
  frames: 2,
  map: { k: 'outline', r: 'red', w: 'white', n: 'navy' },
  rows: [
    '......kkkkkk......' + '.......kkkkkk.....',
    '....kkrrrrrrkk....' + '.....kkrrrrrrkk...',
    '...krrrrrrrrrrk...' + '....krrrrrrrrrrk..',
    '..krkwwrrrrwwkrk..' + '...krkwwrrrrwwkrk.',
    '..krwwwwrrwwwwrk..' + '...krwwwwrrwwwwrk.',
    '..krkwwrrrrwwkrk..' + '...krkwwrrrrwwkrk.',
    '...krrrrrrrrrrk...' + '....krrrrrrrrrrk..',
    '....kkrrrrrrkk....' + '.....kkrrrrrrkk...',
    'kk...krrrrrrk...kk' + 'kk...krrrrrrk...kk',
    'krk.krrrrrrrrk.krk' + 'krk.krrrrrrrrk.krk',
    'krrkkrrrrrrrrkkrrk' + 'krrkkrrrrrrrrkkrrk',
    '.krrrrrrrrrrrrrrk.' + '.krrrrrrrrrrrrrrk.',
    '..krrrrnnnnrrrrk..' + '..krrrrnnnnrrrrk..',
    '..krrrnnnnnnrrrk..' + '..krrrnnnnnnrrrk..',
    '...krrnnnnnnrrk...' + '...krrnnnnnnrrk...',
    '...krrnnnnnnrrk...' + '...krrnnnnnnrrk...',
    '...krnnkkkknnrk...' + '...krnnkkkknnrk...',
    '..krnnk....knnrk..' + '..krnnk....knnrk..',
    '..krnk......knrk..' + '..krnk......knrk..',
    '.kknk........knkk.' + '.kknk........knkk.',
    'kknk..........knkk' + 'kknk..........knkk',
    'kkk............kkk' + 'kkk............kkk',
  ],
});
