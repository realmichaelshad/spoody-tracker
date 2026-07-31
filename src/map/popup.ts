import { Popup, type Map as MLMap } from 'maplibre-gl';
import { render } from 'preact';
import { h } from 'preact';
import type { Sighting } from '../state/sightings';
import { SightingCard } from '../hud/SightingCard';

let current: Popup | null = null;
let mount: HTMLElement | null = null;

/** Pixel-framed sighting popup — a Preact-rendered card in a MapLibre Popup. */
export function openSightingPopup(map: MLMap, s: Sighting): void {
  closeSightingPopup();

  mount = document.createElement('div');
  render(h(SightingCard, { sighting: s }), mount);

  current = new Popup({
    closeButton: true,
    closeOnClick: true,
    maxWidth: 'none',
    offset: 18,
    className: 'pixel-popup',
  })
    .setLngLat([s.lng, s.lat])
    .setDOMContent(mount)
    .addTo(map);

  current.on('close', () => {
    if (mount) render(null, mount);
    mount = null;
    current = null;
  });
}

export function closeSightingPopup(): void {
  if (mount) render(null, mount);
  mount = null;
  current?.remove();
  current = null;
}
