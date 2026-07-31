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

export function saveLocalSighting(s: Sighting): void {
  try {
    const list = loadLocalSightings();
    list.push(s);
    localStorage.setItem(KEY, JSON.stringify(list.slice(-200)));
  } catch {
    /* storage full/blocked — non-fatal */
  }
}
