export type ArtKind = 'fridge' | 'mixer' | 'pots' | 'electronics' | 'washer' | 'urn' | 'range';

/** viewBox width × height of each department drawing, for laying several out together. */
export const artSize: Record<ArtKind, [number, number]> = {
  fridge: [120, 172],
  mixer: [132, 132],
  pots: [156, 124],
  electronics: [156, 124],
  washer: [120, 142],
  urn: [96, 152],
  range: [152, 134],
};
