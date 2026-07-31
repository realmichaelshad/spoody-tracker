import { Popup, type Map as MLMap } from 'maplibre-gl';
import type { Sighting } from '../state/sightings';
import { relativeTime } from '../lib/time';

let current: Popup | null = null;

/** Pixel-framed sighting popup — the single DOM element on the map. */
export function openSightingPopup(map: MLMap, s: Sighting): void {
  current?.remove();

  const el = document.createElement('div');
  el.className = 'sighting-card';
  const badge = s.type === 'confirmed' ? 'CONFIRMED SIGHTING' : 'RUMORED SIGHTING';
  el.innerHTML = `
    <div class="card-head ${s.type}">
      <span class="card-dot"></span>${badge}
    </div>
    ${s.photoUrl ? `<div class="card-photo"><img src="${escapeAttr(s.photoUrl)}" alt="sighting photo" loading="lazy"></div>` : ''}
    <div class="card-msg">${escapeHtml(s.message)}</div>
    <div class="card-meta">
      <span class="card-name">${escapeHtml(s.name)}</span>
      <span class="card-time">${relativeTime(s.createdAt)}${s.placeLabel ? ' · ' + escapeHtml(s.placeLabel) : ''}</span>
    </div>
    <button class="card-flag" title="Report this sighting as inappropriate">FLAG</button>
  `;

  current = new Popup({
    closeButton: true,
    closeOnClick: true,
    maxWidth: 'none',
    offset: 18,
    className: 'pixel-popup',
  })
    .setLngLat([s.lng, s.lat])
    .setDOMContent(el)
    .addTo(map);

  el.querySelector('.card-flag')?.addEventListener('click', () => {
    void import('../lib/flags').then((m) => m.flagSighting(s.id, el));
  });
}

export function closeSightingPopup(): void {
  current?.remove();
  current = null;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
function escapeAttr(s: string): string {
  return escapeHtml(s);
}
