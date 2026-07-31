import { signal } from '@preact/signals';

export interface Sighting {
  id: string;
  lat: number;
  lng: number;
  name: string;
  message: string;
  photoUrl?: string | null;
  photoState?: 'none' | 'screened' | 'unscreened' | 'removed';
  placeLabel?: string | null;
  createdAt: string; // ISO
  likeCount?: number;
  replyCount?: number;
}

export interface Reply {
  id: string;
  sightingId: string;
  name: string;
  message: string;
  createdAt: string;
  /** One level of nesting: set when this is a reply to another reply. */
  parentId?: string | null;
}

/** All visible sightings, newest first. Map keyed by id for dedupe/updates. */
export const sightings = signal<globalThis.Map<string, Sighting>>(new globalThis.Map());

/** Monotonic bump so map layers know to refresh their GeoJSON source. */
export const sightingsVersion = signal(0);

/** The most recently arrived remote sighting (drives radar ping + pulse). */
export const latestArrival = signal<Sighting | null>(null);

export function addSightings(list: Sighting[], opts: { arrival?: boolean } = {}): void {
  if (!list.length) return;
  const next = new globalThis.Map(sightings.value);
  for (const s of list) next.set(s.id, s);
  sightings.value = next;
  sightingsVersion.value++;
  if (opts.arrival) latestArrival.value = list[list.length - 1];
}

export function removeSighting(id: string): void {
  if (!sightings.value.has(id)) return;
  const next = new globalThis.Map(sightings.value);
  next.delete(id);
  sightings.value = next;
  sightingsVersion.value++;
}

export function newestFirst(limit = 100): Sighting[] {
  return [...sightings.value.values()]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
