import type { Map as MLMap } from 'maplibre-gl';

interface IpLoc {
  lat: number;
  lng: number;
  label: string;
}

/**
 * Coarse, permissionless IP geolocation so the tracker boots over the
 * viewer's own country — no browser permission prompt on load.
 * Precise GPS is only requested later, when the user reports a sighting.
 *
 * Providers are keyless + CORS-friendly; each gets a short timeout and we
 * fall through on any failure. Failing entirely just keeps the default view.
 */
async function fetchJson(url: string, ms: number): Promise<any> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctl.signal });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

export async function ipLocate(): Promise<IpLoc | null> {
  /* 1. GeoJS — free, keyless, CORS, HTTPS */
  try {
    const d = await fetchJson('https://get.geojs.io/v1/ip/geo.json', 2500);
    const lat = parseFloat(d.latitude);
    const lng = parseFloat(d.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng, label: [d.city, d.country].filter(Boolean).join(', ') };
    }
  } catch {
    /* fall through */
  }
  /* 2. ipwho.is — free, keyless, CORS */
  try {
    const d = await fetchJson('https://ipwho.is/', 2500);
    if (d.success !== false && Number.isFinite(d.latitude) && Number.isFinite(d.longitude)) {
      return {
        lat: d.latitude,
        lng: d.longitude,
        label: [d.city, d.country].filter(Boolean).join(', '),
      };
    }
  } catch {
    /* fall through */
  }
  return null;
}

/**
 * Cinematic boot move: spin the globe over to the viewer's area and settle
 * at country-ish altitude. No-op if IP lookup fails.
 */
export async function flyToHome(map: MLMap): Promise<void> {
  /* If the user has ALREADY granted geolocation, land exactly on them;
     otherwise the IP puts us over their city. No permission prompt here. */
  let precise: { lat: number; lng: number } | null = null;
  try {
    const perm = await navigator.permissions?.query({ name: 'geolocation' as PermissionName });
    if (perm?.state === 'granted') {
      precise = await new Promise((res) =>
        navigator.geolocation.getCurrentPosition(
          (p) => res({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => res(null),
          { timeout: 4000 },
        ),
      );
    }
  } catch {
    /* permissions API unavailable — stick with IP */
  }

  const loc = precise ?? (await ipLocate());
  if (!loc) return;
  map.flyTo({
    center: [loc.lng, loc.lat],
    zoom: precise ? 13 : 9,
    speed: 0.75, /* slow cinematic swoop from the globe down to home */
    curve: 1.7,
    essential: true,
  });
}
