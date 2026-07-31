import type { Map as MLMap } from 'maplibre-gl';

/**
 * Replaces smooth wheel zoom with chunky integer steps — the retro-game feel.
 * Steps are fast (160ms) and CHAIN under rapid scrolling: while an animation
 * is in flight, further wheel ticks retarget from the pending zoom, so the
 * map never lags behind the wheel. Pinch zoom stays smooth (mobile usability).
 */
export function installQuantizedZoom(
  map: MLMap,
  onStep?: (dir: 1 | -1) => void,
): void {
  map.scrollZoom.disable();
  map.doubleClickZoom.disable();

  let acc = 0;
  let pendingZoom: number | null = null;
  const canvas = map.getCanvas();

  map.on('zoomend', () => {
    pendingZoom = null;
  });

  const step = (dir: 1 | -1, point?: { x: number; y: number }) => {
    const from = pendingZoom ?? Math.round(map.getZoom());
    const target = Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), from + dir));
    if (target === from && pendingZoom !== null) return;
    pendingZoom = target;
    map.easeTo({
      zoom: target,
      /* 'around' is unsupported under globe projection — center-zoom there. */
      around:
        point && map.getZoom() >= 6
          ? map.unproject([point.x, point.y] as any)
          : map.getCenter(),
      duration: 160,
      easing: (t) => 1 - Math.pow(1 - t, 3), // fast ease-out
    });
    onStep?.(dir);
  };

  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      acc += e.deltaY;
      if (Math.abs(acc) < 25) return;
      const dir = acc > 0 ? -1 : 1;
      acc = 0;
      step(dir, { x: e.offsetX, y: e.offsetY });
    },
    { passive: false },
  );

  canvas.addEventListener('dblclick', (e) => {
    step(e.shiftKey ? -1 : 1, { x: e.offsetX, y: e.offsetY });
  });
}
