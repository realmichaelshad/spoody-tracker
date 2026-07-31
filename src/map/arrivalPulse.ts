import type { Map as MLMap } from 'maplibre-gl';
import { latestArrival } from '../state/sightings';

const SRC = 'arrival-pulse';
const LAYER = 'arrival-pulse';
const DURATION_MS = 2600;

/**
 * When a new sighting arrives, an expanding red ring pulses at its location
 * on the map for a few seconds — so live activity is visible even without
 * clicking the toast.
 */
export function installArrivalPulse(map: MLMap): void {
  map.addSource(SRC, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  });
  map.addLayer({
    id: LAYER,
    type: 'circle',
    source: SRC,
    paint: {
      'circle-radius': 0,
      'circle-color': 'rgba(0,0,0,0)',
      'circle-stroke-color': '#ec5147',
      'circle-stroke-width': 3,
      'circle-stroke-opacity': 0.9,
    },
  });

  let raf = 0;
  let start = 0;

  const animate = (now: number) => {
    const t = (now - start) / DURATION_MS;
    if (t >= 1) {
      map.setPaintProperty(LAYER, 'circle-stroke-opacity', 0);
      return;
    }
    /* three overlapping ripples via sawtooth */
    const phase = (t * 3) % 1;
    map.setPaintProperty(LAYER, 'circle-radius', 6 + phase * 42);
    map.setPaintProperty(LAYER, 'circle-stroke-opacity', 0.9 * (1 - phase) * (1 - t * 0.5));
    raf = requestAnimationFrame(animate);
  };

  latestArrival.subscribe((s) => {
    if (!s || !map.getSource(SRC)) return;
    (map.getSource(SRC) as any).setData({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
        },
      ],
    });
    cancelAnimationFrame(raf);
    start = performance.now();
    raf = requestAnimationFrame(animate);
  });
}
