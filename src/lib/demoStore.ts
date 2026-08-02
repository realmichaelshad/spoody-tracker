import type { Sighting } from '../state/sightings';

const KEY = 'spoody-tracker:my-sightings';

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

const MINE_KEY = 'spoody-tracker:mine';

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
    const trimmed = list.slice(-200);
    /* photos are data URLs — keep only the newest 10 to respect the
       ~5MB localStorage budget */
    const withPhotos = trimmed.filter((x) => x.photoUrl);
    for (const old of withPhotos.slice(0, Math.max(0, withPhotos.length - 10))) {
      old.photoUrl = null;
      old.photoState = 'none';
    }
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    /* storage full/blocked — non-fatal */
  }
}
