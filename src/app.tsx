import { useEffect, useRef, useState } from 'preact/hooks';
import { FrameChrome } from './hud/FrameChrome';
import { ReportForm, reportOpen, pickingOnMap } from './hud/ReportForm';
import { MenuDrawer } from './hud/MenuDrawer';
import { Toasts } from './hud/Toast';
import { NotificationCenter } from './hud/NotificationCenter';
import { Radar } from './hud/Radar';
import { createMap } from './map/createMap';
import { installPins, flyToSighting } from './map/pins';
import { globeSpin } from './map/globeSpin';
import { addSightings, sightings, latestArrival } from './state/sightings';
import { isDemoMode } from './config';
import { sfx, unlockAudio } from './audio/sfx';
import type { Map as MLMap } from 'maplibre-gl';

export function App() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap>();
  const [mapReady, setMapReady] = useState<MLMap | null>(null);

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = (mapRef.current = createMap(mapEl.current, {
      onZoomStep: (dir) => sfx.zoom(dir),
    }));

    let stopFeed: (() => void) | undefined;
    map.once('load', async () => {
      if (isDemoMode) {
        const { generateMockSightings } = await import('./lib/mock');
        const { loadLocalSightings } = await import('./lib/demoStore');
        addSightings([...generateMockSightings(1200), ...loadLocalSightings()]);
        const { startDemoFeed } = await import('./lib/demoFeed');
        stopFeed = startDemoFeed();
      } else {
        const { startRealtime } = await import('./lib/realtime');
        void startRealtime();
      }
      await installPins(map);
      setMapReady(map);
      /* Dev-only handle so the map can be inspected from the console. Named
         __map, not map: the container carries id="map", which already claims
         window.map via named access on the global. Stripped from prod builds. */
      if (import.meta.env.DEV) (window as unknown as { __map?: unknown }).__map = map;
    });

    /* No startup gate: audio unlocks on the first real interaction. */
    const unlockOnce = () => {
      unlockAudio();
      window.removeEventListener('pointerdown', unlockOnce);
      window.removeEventListener('keydown', unlockOnce);
    };
    window.addEventListener('pointerdown', unlockOnce);
    window.addEventListener('keydown', unlockOnce);

    /* Remote arrival → sonar ping (unless notifications are muted) */
    const unsubPing = latestArrival.subscribe(async (s) => {
      if (!s) return;
      const { notifMuted } = await import('./state/settings');
      if (!notifMuted.value) sfx.ping();
    });

    /* Pick-on-map: one-shot click sets report coords and reopens the form. */
    map.on('click', (e) => {
      if (!pickingOnMap.value) return;
      pickingOnMap.value = false;
      document.body.classList.remove('picking');
      reportOpen.value = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      sfx.blip();
    });

    return () => {
      unsubPing();
      stopFeed?.();
      mapRef.current?.remove();
      mapRef.current = undefined;
    };
  }, []);

  /* Hold the globe still while the user is aiming at it. Without this the
     idle spin restarts after 10s of deliberating and slides the map out from
     under the tap. */
  useEffect(() => {
    const spin = globeSpin();
    if (!spin) return;
    if (pickingOnMap.value) spin.suspend();
    else spin.resume();
  }, [pickingOnMap.value]);

  const openReport = () => {
    sfx.blip();
    reportOpen.value = {};
  };

  return (
    <>
      <div
        id="map"
        ref={mapEl}
        style={{ position: 'absolute', inset: 0, background: 'var(--map-bg)' }}
      />
      <FrameChrome onReport={openReport} />
      <Radar map={mapReady} />
      <MenuDrawer
        onReport={openReport}
        onJump={(id) => {
          const s = sightings.value.get(id);
          if (s && mapRef.current) flyToSighting(mapRef.current, s);
        }}
      />
      <Toasts
        onJump={(s) => {
          if (mapRef.current) flyToSighting(mapRef.current, s);
        }}
      />
      <NotificationCenter
        onJump={(s) => {
          if (mapRef.current) flyToSighting(mapRef.current, s);
        }}
      />
      {pickingOnMap.value && (
        <>
          <div class="pick-hint">TAP THE MAP TO DROP YOUR PIN</div>
          {/* Wheel zoom is quantised and there is no nav control, so on a phone
              there was no way to zoom out far enough to find your own street.
              These only exist while picking, so they never crowd the HUD. */}
          <div class="pick-zoom">
            <button
              class="pick-zoom-btn"
              aria-label="Zoom in"
              onClick={() => {
                mapRef.current?.zoomIn({ duration: 220 });
                sfx.zoom(1);
              }}
            >
              +
            </button>
            <button
              class="pick-zoom-btn"
              aria-label="Zoom out"
              onClick={() => {
                mapRef.current?.zoomOut({ duration: 220 });
                sfx.zoom(-1);
              }}
            >
              −
            </button>
            <button
              class="pick-zoom-btn pick-cancel"
              aria-label="Cancel picking"
              onClick={() => {
                pickingOnMap.value = false;
                document.body.classList.remove('picking');
                sfx.blip();
              }}
            >
              ×
            </button>
          </div>
        </>
      )}
      <ReportForm
        onPickOnMap={() => {
          document.body.classList.add('picking');
        }}
        onDone={(lat, lng) => {
          sfx.pinDrop();
          const map = mapRef.current;
          if (!map) return;
          map.flyTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 14), speed: 1.6 });
        }}
      />
    </>
  );
}
