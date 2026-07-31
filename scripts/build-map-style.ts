/**
 * Generates src/map/style/spidy-dark.json — the retro navy/teal map style —
 * by fetching OpenFreeMap's open "dark" style and recoloring/simplifying it
 * to the tracker palette. Committed output; re-run to pick up upstream fixes:
 *
 *   npx tsx scripts/build-map-style.ts
 *
 * Style/data credits: OpenFreeMap © OpenMapTiles, Data from OpenStreetMap.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'src', 'map', 'style', 'spidy-dark.json');
const SRC = 'https://tiles.openfreemap.org/styles/dark';

/* Tracker palette (see src/styles/tokens.css) */
const C = {
  ocean: '#031834',
  land: '#0d2547',
  landAlt: '#10294d',
  park: '#0f2e4a',
  wood: '#0e2a45',
  building: '#132853',
  buildingLine: '#154f80',
  roadCasing: '#02101f',
  roadMinor: '#0d3f66',
  roadMajor: '#1273a5',
  roadGlow: '#09a4c7',
  rail: '#0d3a5c',
  waterwayLine: '#0a4a75',
  boundary: '#154f80',
  boundaryCountry: '#2b6b9a',
  label: '#96e0f7',
  labelBig: '#a8e1fe',
  labelDim: '#7cc4e0',
  halo: '#031834',
};

/** Layer-id → paint overrides. Anything not listed keeps recolored defaults. */
const DROP_LAYERS = new Set([
  'road_oneway',
  'road_oneway_opposite',
  'landcover_ice_shelf',
  'landcover_glacier',
  /* Declutter + perf: rails add noise at every zoom, never read on navy */
  'railway_transit',
  'railway_transit_dashline',
  'railway_minor',
  'railway_minor_dashline',
  'railway',
  'railway_dashline',
]);

/**
 * Declutter: the reference world view is just landmass + ocean + city names —
 * roads only appear once you dive toward a city. Later minzooms also mean
 * fewer tiles parsed and fewer symbols laid out = faster rendering.
 */
const MIN_ZOOM_OVERRIDES: Record<string, number> = {
  highway_motorway_casing: 7,
  highway_motorway_inner: 7,
  highway_motorway_subtle: 7,
  highway_major_casing: 9,
  highway_major_inner: 9,
  highway_major_subtle: 9,
  highway_minor: 12,
  highway_path: 14,
  highway_name_other: 14,
  highway_name_motorway: 13,
  waterway: 8,
  'aeroway-taxiway': 12,
  'aeroway-runway-casing': 12,
  'aeroway-area': 12,
  'aeroway-runway': 12,
  place_other: 12,
  place_suburb: 12,
  place_village: 11,
  place_town: 9,
};

function recolorLayer(layer: any): any | null {
  if (DROP_LAYERS.has(layer.id)) return null;
  const l = structuredClone(layer);
  const paint = (l.paint ??= {});
  if (MIN_ZOOM_OVERRIDES[l.id] !== undefined) {
    l.minzoom = Math.max(l.minzoom ?? 0, MIN_ZOOM_OVERRIDES[l.id]);
  }

  switch (l.id) {
    case 'background':
      /* Lighter land at globe zoom so continents pop against the ocean,
         settling to the city-view base as you dive in. */
      paint['background-color'] = [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        '#14335f',
        5,
        '#14335f',
        7,
        C.land,
      ];
      break;
    case 'water':
      paint['fill-color'] = C.ocean;
      delete paint['fill-pattern'];
      break;
    case 'landuse_residential':
      paint['fill-color'] = C.landAlt;
      paint['fill-opacity'] = 0.6;
      break;
    case 'landcover_wood':
      paint['fill-color'] = C.wood;
      paint['fill-opacity'] = 0.6;
      break;
    case 'landuse_park':
      paint['fill-color'] = C.park;
      break;
    case 'waterway':
      paint['line-color'] = C.waterwayLine;
      break;
    case 'water_name':
      paint['text-color'] = C.labelDim;
      paint['text-halo-color'] = C.halo;
      break;
    case 'building':
      paint['fill-color'] = C.building;
      paint['fill-outline-color'] = C.buildingLine;
      delete paint['fill-antialias'];
      break;
    default:
      break;
  }

  /* Category-wide passes */
  if (l.id.startsWith('aeroway') || l.id.startsWith('road_pier') || l.id === 'road_area_pier') {
    if (l.type === 'fill') paint['fill-color'] = C.landAlt;
    if (l.type === 'line') paint['line-color'] = C.roadMinor;
  }
  if (l.id === 'highway_path') {
    paint['line-color'] = C.roadMinor;
    paint['line-opacity'] = 0.5;
  }
  if (l.id === 'highway_minor') {
    paint['line-color'] = C.roadMinor;
  }
  if (l.id.startsWith('highway_major')) {
    paint['line-color'] = l.id.includes('casing') ? C.roadCasing : C.roadMajor;
  }
  if (l.id.startsWith('highway_motorway')) {
    paint['line-color'] = l.id.includes('casing') ? C.roadCasing : C.roadGlow;
  }
  if (l.id.startsWith('railway')) {
    paint['line-color'] = C.rail;
  }
  if (l.id.startsWith('highway_name')) {
    paint['text-color'] = C.labelDim;
    paint['text-halo-color'] = C.halo;
    paint['text-halo-width'] = 1.5;
  }
  if (l.id === 'boundary_state') {
    paint['line-color'] = C.boundary;
  }
  if (l.id.startsWith('boundary_country')) {
    paint['line-color'] = C.boundaryCountry;
  }
  if (l.id.startsWith('place_')) {
    const big = /city_large|state|country/.test(l.id);
    paint['text-color'] = big ? C.labelBig : C.label;
    paint['text-halo-color'] = C.halo;
    paint['text-halo-width'] = 1.5;
    if (l.layout?.['text-transform'] !== undefined) l.layout['text-transform'] = 'uppercase';
  }

  return l;
}

async function main() {
  const res = await fetch(SRC);
  if (!res.ok) throw new Error(`fetch ${SRC}: ${res.status}`);
  const style = await res.json();

  /* Drop the natural-earth shading raster — retro look wants flat fills. */
  delete style.sources.ne2_shaded;
  style.layers = style.layers
    .filter((l: any) => l.source !== 'ne2_shaded')
    .map(recolorLayer)
    .filter(Boolean);

  style.name = 'Spidy Dark';
  style.projection = { type: 'globe' };
  /* Deep-space navy sky with a thin teal atmosphere rim on the globe limb. */
  style.sky = {
    'sky-color': '#02101f',
    'horizon-color': '#09a4c7',
    'fog-color': '#0d2547',
    'sky-horizon-blend': 0.8,
    'horizon-fog-blend': 0.3,
    'fog-ground-blend': 0.98,
    'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.5, 5, 0.3, 7, 0],
  };
  style.light = { anchor: 'map', color: '#ffffff', intensity: 0.1 };

  mkdirSync(join(ROOT, 'src', 'map', 'style'), { recursive: true });
  writeFileSync(OUT, JSON.stringify(style, null, 2) + '\n');
  console.log(`wrote ${OUT} (${style.layers.length} layers)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
