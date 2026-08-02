import type { Map as MLMap } from 'maplibre-gl';

const IDLE_MS = 10_000;
const DEG_PER_SEC = 2.4; // full rotation in ~2.5 min
const MAX_SPIN_ZOOM = 4;

export interface GlobeSpin {
  /** Stop spinning and stay stopped until resume() — e.g. while picking a spot. */
  suspend(): void;
  resume(): void;
}

/* There is one map, so the HUD can reach its spin controls without threading
   the handle through every component. */
let installed: GlobeSpin | null = null;
export const globeSpin = (): GlobeSpin | null => installed;

/**
 * Slowly rotates the globe after a period of no interaction, at low zoom only.
 * Any pointer/wheel/key interaction cancels and re-arms the idle timer.
 */
export function installGlobeSpin(map: MLMap): GlobeSpin {
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  let raf = 0;
  let lastT = 0;
  let spinning = false;
  let suspended = false;

  const spin = (t: number) => {
    if (!spinning) return;
    if (map.getZoom() >= MAX_SPIN_ZOOM) {
      stop();
      return;
    }
    const dt = lastT ? (t - lastT) / 1000 : 0;
    lastT = t;
    const c = map.getCenter();
    map.jumpTo({ center: [c.lng + DEG_PER_SEC * dt, c.lat] });
    raf = requestAnimationFrame(spin);
  };

  const start = () => {
    if (suspended || spinning || map.getZoom() >= MAX_SPIN_ZOOM) return;
    spinning = true;
    lastT = 0;
    raf = requestAnimationFrame(spin);
  };

  const stop = () => {
    spinning = false;
    cancelAnimationFrame(raf);
  };

  const rearm = () => {
    stop();
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(start, IDLE_MS);
  };

  const canvas = map.getCanvasContainer();
  for (const ev of ['pointerdown', 'wheel', 'touchstart'] as const) {
    canvas.addEventListener(ev, rearm, { passive: true });
  }
  window.addEventListener('keydown', rearm);
  map.on('movestart', (e: any) => {
    /* User-driven moves cancel the spin; our own jumpTo has no originalEvent. */
    if (e.originalEvent) rearm();
  });

  /* Any zoom change outranks the ambient spin, including programmatic ones
     from HUD buttons — those fire no originalEvent, so movestart above misses
     them and the per-frame jumpTo used to eat the whole zoom animation. The
     spin only ever changes centre, so it can never fire zoomstart itself and
     this cannot feed back on itself. */
  map.on('zoomstart', rearm);

  rearm();

  installed = {
    suspend() {
      suspended = true;
      stop();
      if (idleTimer) clearTimeout(idleTimer);
    },
    resume() {
      suspended = false;
      rearm();
    },
  };
  return installed;
}
