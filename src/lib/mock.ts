import type { Sighting } from '../state/sightings';

/** Weighted world hotspots [lng, lat, weight] — pins cluster around real cities. */
const HOTSPOTS: [number, number, number][] = [
  [-74.006, 40.7128, 10], // New York
  [-118.2437, 34.0522, 6], // Los Angeles
  [-87.6298, 41.8781, 5], // Chicago
  [-0.1276, 51.5072, 8], // London
  [2.3522, 48.8566, 6], // Paris
  [13.405, 52.52, 4], // Berlin
  [139.6917, 35.6895, 8], // Tokyo
  [126.978, 37.5665, 5], // Seoul
  [151.2093, -33.8688, 4], // Sydney
  [-43.1729, -22.9068, 5], // Rio
  [-99.1332, 19.4326, 5], // Mexico City
  [28.0473, -26.2041, 4], // Johannesburg
  [36.8219, -1.2921, 4], // Nairobi
  [3.3792, 6.5244, 5], // Lagos
  [31.2357, 30.0444, 4], // Cairo
  [77.209, 28.6139, 6], // Delhi
  [72.8777, 19.076, 6], // Mumbai
  [103.8198, 1.3521, 4], // Singapore
  [116.4074, 39.9042, 5], // Beijing
  [37.6173, 55.7558, 4], // Moscow
  [-58.3816, -34.6037, 4], // Buenos Aires
  [-79.3832, 43.6532, 4], // Toronto
  [12.4964, 41.9028, 4], // Rome
  [-3.7038, 40.4168, 4], // Madrid
  [4.9041, 52.3676, 3], // Amsterdam
  [55.2708, 25.2048, 4], // Dubai
  [100.5018, 13.7563, 4], // Bangkok
  [106.8456, -6.2088, 4], // Jakarta
  [-46.6333, -23.5505, 6], // São Paulo
  [30.0444, -1.9441, 2], // Kigali
];

const NAMES = [
  'WEB-WATCHER-77', 'ROOFTOP-RITA', 'DAILY-BUGLER', 'NIGHT-OWL-NYC', 'PIXEL-PETE',
  'SWING-SPOTTER', 'MASKED-MARIA', 'CAM-KID-2099', 'BODEGA-BEN', 'TRAIN-TRACKER',
  'SKY-EYES-KEN', 'ALLEY-ANNA', 'FERRY-FAN-42', 'CROSSWALK-CARL', 'LAMPPOST-LIZ',
];

const MSGS = [
  'SAW HIM SWING PAST MY WINDOW. NOT A DRILL.',
  'WEB LINE STILL STUCK TO THE TRAFFIC LIGHT.',
  'HE WAVED AT MY KID. LEGEND.',
  'STOPPED A BIKE THIEF THEN VANISHED UP THE WALL.',
  'CLEAR VIEW FROM THE ROOFTOP. RED AND BLUE.',
  'HEARD THE THWIP. LOOKED UP. THERE HE WAS.',
  'CAUGHT THE WHOLE THING ON CAMERA.',
  'HE TOOK A SELFIE WITH THE HOT DOG GUY.',
  'SOMETHING FAST WENT OVER THE BRIDGE. TOO FAST.',
  'BLURRY PHOTO BUT THE POSE IS UNMISTAKABLE.',
  'MY NEIGHBOR SAW HIM AT THE MARKET. IM SURE OF IT.',
  'HE CAUGHT MY DROPPED PHONE MID-AIR. TEN OUT OF TEN.',
];

let seedState = 1234567;
function rand(): number {
  /* deterministic LCG so demo pins are stable across reloads */
  seedState = (seedState * 1103515245 + 12345) % 2147483648;
  return seedState / 2147483648;
}

function pickWeighted(): [number, number] {
  const total = HOTSPOTS.reduce((s, h) => s + h[2], 0);
  let roll = rand() * total;
  for (const [lng, lat, w] of HOTSPOTS) {
    roll -= w;
    if (roll <= 0) return [lng, lat];
  }
  return [HOTSPOTS[0][0], HOTSPOTS[0][1]];
}

/** Gaussian-ish scatter (km-scale) around a hotspot. */
function scatter(v: number, spread: number): number {
  return v + (rand() + rand() + rand() - 1.5) * spread;
}

export function generateMockSightings(count: number): Sighting[] {
  const out: Sighting[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const [lng, lat] = pickWeighted();
    out.push({
      id: `demo-${i}`,
      lng: scatter(lng, 0.25),
      lat: scatter(lat, 0.18),
      name: NAMES[Math.floor(rand() * NAMES.length)],
      message: MSGS[Math.floor(rand() * MSGS.length)],
      photoUrl: null,
      photoState: 'none',
      placeLabel: null,
      createdAt: new Date(now - rand() * 72 * 3600_000).toISOString(),
    });
  }
  return out;
}
