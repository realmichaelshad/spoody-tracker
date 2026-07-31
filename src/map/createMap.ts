import { Map as MLMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styleJson from './style/spidy-dark.json';
import { config } from '../config';
import { installQuantizedZoom } from './quantizedZoom';
import { installGlobeSpin } from './globeSpin';
import { flyToHome } from './ipLocate';

/**
 * Boots the MapLibre map: committed retro style, globe projection,
 * env-overridable tile source, idle globe spin, stepped zoom.
 */
export function createMap(container: HTMLElement): MLMap {
  const style = structuredClone(styleJson) as any;
  /* Tile source is env-overridable (self-host escape hatch). */
  style.sources.openmaptiles.url = config.tilesUrl;

  const map = new MLMap({
    container,
    style,
    center: [-40, 30],
    zoom: 1.8,
    minZoom: 1,
    maxZoom: 17,
    attributionControl: { compact: true },
    fadeDuration: 0,
    /* Cap the backing-store resolution — big perf win on hiDPI screens,
       and a subtly chunkier render fits the retro look. */
    pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
  });

  map.on('style.load', () => addGraticule(map));
  /* Boot over the viewer's own country (coarse IP lookup, no permission). */
  map.once('load', () => void flyToHome(map));

  installQuantizedZoom(map);
  installGlobeSpin(map);

  if (import.meta.env.DEV) {
    (window as any).__map = map; // debugging convenience in dev only
  }

  return map;
}

/**
 * Subtle cyan lat/lng grid over the globe — orientation aid at world zoom,
 * fades out as you dive in. Generated inline (no dataset).
 */
function addGraticule(map: MLMap): void {
  const features: Array<{
    type: 'Feature';
    properties: Record<string, never>;
    geometry: { type: 'LineString'; coordinates: [number, number][] };
  }> = [];
  for (let lng = -180; lng <= 180; lng += 15) {
    const coords: [number, number][] = [];
    for (let lat = -85; lat <= 85; lat += 2) coords.push([lng, lat]);
    features.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } });
  }
  for (let lat = -75; lat <= 75; lat += 15) {
    const coords: [number, number][] = [];
    for (let lng = -180; lng <= 180; lng += 2) coords.push([lng, lat]);
    features.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } });
  }
  map.addSource('graticule', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  });
  map.addLayer(
    {
      id: 'graticule',
      type: 'line',
      source: 'graticule',
      paint: {
        'line-color': '#96e0f7',
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 0, 0.16, 4, 0.1, 6, 0],
        'line-width': 1,
      },
    },
    /* under all labels: insert before the first symbol layer */
    map.getStyle().layers.find((l) => l.type === 'symbol')?.id,
  );
}
