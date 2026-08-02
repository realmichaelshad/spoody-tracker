import { Marker, type Map as MLMap } from 'maplibre-gl';

interface IpLoc {
  lat: number;
  lng: number;
  label: string;
  /** true when it came from real GPS rather than a city-level IP guess */
  precise?: boolean;
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

/**
 * The lookup is started at module load, in parallel with the map booting,
 * so the coordinates are usually already resolved by the time the map is
 * ready — the globe starts flying immediately instead of sitting still.
 */
let locationPromise: Promise<IpLoc | null> | null = null;

export function primeLocation(): Promise<IpLoc | null> {
  locationPromise ??= resolveLocation();
  return locationPromise;
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
/** Resolve the best location we can without prompting for permission. */
async function resolveLocation(): Promise<IpLoc | null> {
  /* If geolocation was ALREADY granted, land exactly on them. */
  try {
    const perm = await navigator.permissions?.query({ name: 'geolocation' as PermissionName });
    if (perm?.state === 'granted') {
      const precise = await new Promise<IpLoc | null>((res) =>
        navigator.geolocation.getCurrentPosition(
          (p) => res({ lat: p.coords.latitude, lng: p.coords.longitude, label: 'YOUR LOCATION' }),
          () => res(null),
          { timeout: 4000 },
        ),
      );
      if (precise) return { ...precise, precise: true };
    }
  } catch {
    /* permissions API unavailable — fall through to IP */
  }
  return ipLocate();
}

/**
 * Cinematic boot move: swoop from the globe down to the viewer's area and
 * drop a "YOU ARE HERE" marker. No-op if the location can't be resolved.
 */
export async function flyToHome(map: MLMap): Promise<void> {
  const loc = await primeLocation();
  if (!loc) return;

  map.flyTo({
    center: [loc.lng, loc.lat],
    zoom: loc.precise ? 13 : 9,
    speed: 0.8, /* cinematic swoop from the globe down to home */
    curve: 1.7,
    essential: true,
  });

  map.once('moveend', () => {
    const marker = showYouAreHere(map, loc);
    /* IP position is only city-accurate. Ask for real GPS and snap the
       beacon exactly onto the viewer once they allow it. */
    if (!loc.precise) void refineToExact(map, marker);
  });
}

/** Pixel "YOU ARE HERE" pin + label at the viewer's own position. */
function showYouAreHere(map: MLMap, loc: IpLoc): Marker {
  const el = document.createElement('div');
  el.className = 'you-are-here';
  el.innerHTML = `
    <span class="yah-label">YOU ARE HERE</span>
    <span class="yah-dot"></span>
  `;
  const marker = new Marker({ element: el, anchor: 'bottom' })
    .setLngLat([loc.lng, loc.lat])
    .addTo(map);

  /* Fade the label after a beat; keep the dot as a quiet home reference. */
  setTimeout(() => el.classList.add('settled'), 6000);
  map.once('remove', () => marker.remove());
  return marker;
}

/** Upgrade the city-level guess to the device's exact position. */
async function refineToExact(map: MLMap, marker: Marker): Promise<void> {
  if (!navigator.geolocation) return;
  const exact = await new Promise<{ lat: number; lng: number } | null>((res) =>
    navigator.geolocation.getCurrentPosition(
      (p) => res({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => res(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60_000 },
    ),
  );
  if (!exact) return; // declined or unavailable — the city-level beacon stands

  marker.setLngLat([exact.lng, exact.lat]);
  const el = marker.getElement();
  el.classList.remove('settled');
  el.classList.add('exact');
  const label = el.querySelector('.yah-label');
  if (label) label.textContent = 'YOU ARE HERE';
  map.easeTo({ center: [exact.lng, exact.lat], zoom: 14, duration: 1600 });
  setTimeout(() => el.classList.add('settled'), 7000);
}
