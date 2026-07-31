import type { Map as MLMap, MapMouseEvent } from 'maplibre-gl';
import { effect } from '@preact/signals';
import { sightings, sightingsVersion, type Sighting } from '../state/sightings';
import { openSightingPopup } from './popup';

const SRC = 'sightings';

/** Load a sprite PNG and register it with the map at @3x density. */
async function addSpriteImage(map: MLMap, name: string): Promise<void> {
  const img = await map.loadImage(`/sprites/${name}@3x.png`);
  if (!map.hasImage(name)) map.addImage(name, img.data, { pixelRatio: 3 });
}

interface PinCollection {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: { id: string };
    geometry: { type: 'Point'; coordinates: [number, number] };
  }>;
}

function toGeoJSON(): PinCollection {
  return {
    type: 'FeatureCollection',
    features: [...sightings.value.values()].map((s) => ({
      type: 'Feature' as const,
      properties: { id: s.id },
      geometry: { type: 'Point' as const, coordinates: [s.lng, s.lat] as [number, number] },
    })),
  };
}

/**
 * Clustered sighting pins: one GeoJSON source, symbol layers only
 * (thousands of pins = single WebGL pass, no DOM).
 */
export async function installPins(map: MLMap): Promise<void> {
  await Promise.all(
    ['pin-sighting', 'pin-pending', 'cluster-web'].map((n) => addSpriteImage(map, n)),
  );

  map.addSource(SRC, {
    type: 'geojson',
    data: toGeoJSON() as any,
    cluster: true,
    clusterRadius: 44,
    clusterMaxZoom: 14,
  });

  map.addLayer({
    id: 'clusters',
    type: 'symbol',
    source: SRC,
    filter: ['has', 'point_count'],
    layout: {
      'icon-image': 'cluster-web',
      'icon-allow-overlap': true,
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['Noto Sans Bold'],
      'text-size': 13,
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': '#e6f5f8',
      'text-halo-color': '#1e1e14',
      'text-halo-width': 1.6,
    },
  });

  map.addLayer({
    id: 'pins',
    type: 'symbol',
    source: SRC,
    filter: ['!', ['has', 'point_count']],
    layout: {
      'icon-image': 'pin-sighting',
      'icon-allow-overlap': true,
      /* Smaller far out (less clutter), full-size once diving in. */
      'icon-size': ['step', ['zoom'], 0.75, 6, 1],
    },
  });

  /* Live data → source refresh (signals effect). */
  effect(() => {
    void sightingsVersion.value;
    const src = map.getSource(SRC) as any;
    if (src) src.setData(toGeoJSON());
  });

  /* Cluster click → expand. */
  map.on('click', 'clusters', async (e: MapMouseEvent) => {
    const f = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })[0];
    if (!f) return;
    const src = map.getSource(SRC) as any;
    const zoom = await src.getClusterExpansionZoom(f.properties!.cluster_id);
    map.easeTo({ center: (f.geometry as any).coordinates, zoom, duration: 320 });
  });

  /* Pin click → popup. */
  map.on('click', 'pins', (e: MapMouseEvent) => {
    const f = (e as any).features?.[0];
    if (!f) return;
    const s = sightings.value.get(f.properties.id);
    if (s) openSightingPopup(map, s);
  });
  for (const layer of ['pins', 'clusters']) {
    map.on('mouseenter', layer, () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''));
  }
}

/** Fly the camera to a sighting and open its popup on arrival. */
export function flyToSighting(map: MLMap, s: Sighting): void {
  map.flyTo({ center: [s.lng, s.lat], zoom: Math.max(map.getZoom(), 13), speed: 1.7, curve: 1.4 });
  map.once('moveend', () => openSightingPopup(map, s));
}
