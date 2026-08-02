/**
 * Reverse-geocode a reported location to a short "CITY, CC" label.
 * BigDataCloud's client API is free/keyless; its fair-use policy requires
 * client-side calls tied to the user's own action — which this is (called
 * once, at report time). Failure just yields a coordinate label.
 */
/**
 * Labels are pre-resolved the moment a location is chosen, so submitting a
 * report never waits on this network call. Keyed by rounded coordinates.
 */
const cache = new Map<string, Promise<string>>();
const key = (lat: number, lng: number) => `${lat.toFixed(3)},${lng.toFixed(3)}`;

/** Kick off (and cache) the lookup early — call when coordinates are picked. */
export function primePlaceLabel(lat: number, lng: number): void {
  const k = key(lat, lng);
  if (!cache.has(k)) cache.set(k, placeLabel(lat, lng));
}

/**
 * Label for a submit: uses the primed value if ready, otherwise waits only
 * briefly so a slow geocoder can never stall the post.
 */
export async function placeLabelFast(lat: number, lng: number, waitMs = 900): Promise<string> {
  const k = key(lat, lng);
  const pending = cache.get(k) ?? placeLabel(lat, lng);
  cache.set(k, pending);
  const fallback = new Promise<string>((res) => setTimeout(() => res(''), waitMs));
  return (await Promise.race([pending, fallback])) || '';
}

export async function placeLabel(lat: number, lng: number): Promise<string> {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 2500);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: ctl.signal },
    );
    clearTimeout(t);
    if (res.ok) {
      const d = await res.json();
      const city = d.city || d.locality || d.principalSubdivision;
      if (city && d.countryCode) return `${String(city).toUpperCase()}, ${d.countryCode}`;
      if (d.countryName) return String(d.countryName).toUpperCase();
    }
  } catch {
    /* fall through */
  }
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(1)}°${ns} ${Math.abs(lng).toFixed(1)}°${ew}`;
}
