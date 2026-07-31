import { sprite } from './palette';

/**
 * Climbing hero — masked figure clinging to the HUD frame: big eyes,
 * arms out gripping, crouched legs, red boots. Two-frame idle sway.
 * Each frame 20x24; sheet 40x24.
 */
export const hero = sprite({
  name: 'hero',
  frames: 2,
  map: { k: 'outline', r: 'red', w: 'white', n: 'navy' },
  rows: [
    '......kkkkkkkk......' + '......kkkkkkkk......',
    '....kkrrrrrrrrkk....' + '.....kkrrrrrrrrkk...',
    '...krrrrrrrrrrrrk...' + '....krrrrrrrrrrrrk..',
    '...krkkwwrrwwkkrk...' + '....krkkwwrrwwkkrk..',
    '..krkwwwwrrwwwwkrk..' + '...krkwwwwrrwwwwkrk.',
    '..krkwwwwrrwwwwkrk..' + '...krkwwwwrrwwwwkrk.',
    '...krkwwrrrrwwkrk...' + '....krkwwrrrrwwkrk..',
    '....kkrrrrrrrrkk....' + '.....kkrrrrrrrrkk...',
    '....krrrrrrrrrrk....' + '.....krrrrrrrrrrk...',
    '.kk.krrrrrrrrrrk.kk.' + '.kk.krrrrrrrrrrk.kk.',
    'krrkrrrrrrrrrrrrkrrk' + 'krrkrrrrrrrrrrrrkrrk',
    'krrkrrrrkrrkrrrrkrrk' + 'krrkrrrrkrrkrrrrkrrk',
    '.krrrrrrkrrkrrrrrrk.' + '.krrrrrrkrrkrrrrrrk.',
    '..krrrrrkrrkrrrrrk..' + '..krrrrrkrrkrrrrrk..',
    '...krrrnnnnnnrrrk...' + '...krrrnnnnnnrrrk...',
    '....krrnnnnnnrrk....' + '....krrnnnnnnrrk....',
    '....knnnkkkknnnk....' + '....knnnkkkknnnk....',
    '...knnnk....knnnk...' + '...knnnk....knnnk...',
    '...knnk......knnk...' + '...knnk......knnk...',
    '..knnk........knnk..' + '..knnk........knnk..',
    '..krnk........knrk..' + '..krnk........knrk..',
    '.kkrrk........krrkk.' + '.kkrrk........krrkk.',
    '.kkkkk........kkkkk.' + '.kkkkk........kkkkk.',
    '....................' + '....................',
  ],
});
