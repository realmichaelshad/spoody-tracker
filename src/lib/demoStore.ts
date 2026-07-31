import type { Sighting } from '../state/sightings';

const KEY = 'webhead-tracker:my-sightings';

/** Demo mode: the viewer's own reports persist locally across reloads. */
export function loadLocalSightings(): Sighting[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

const MINE_KEY = 'webhead-tracker:mine';

/** Register a sighting id as the viewer's own (drives gold pins + YOU badges). */
export function markMine(id: string): void {
  try {
    const set = new Set(JSON.parse(localStorage.getItem(MINE_KEY) ?? '[]'));
    set.add(id);
    localStorage.setItem(MINE_KEY, JSON.stringify([...set].slice(-300)));
  } catch {
    /* non-fatal */
  }
}

export function isMine(id: string): boolean {
  try {
    if ((JSON.parse(localStorage.getItem(MINE_KEY) ?? '[]') as string[]).includes(id)) {
      return true;
    }
    /* demo reports saved before the registry existed still count as yours */
    return loadLocalSightings().some((s) => s.id === id);
  } catch {
    return false;
  }
}

export function saveLocalSighting(s: Sighting): void {
  try {
    const list = loadLocalSightings();
    list.push(s);
    localStorage.setItem(KEY, JSON.stringify(list.slice(-200)));
  } catch {
    /* storage full/blocked — non-fatal */
  }
}
