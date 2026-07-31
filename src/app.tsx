import { useEffect, useRef, useState } from 'preact/hooks';
import { FrameChrome } from './hud/FrameChrome';
import { ReportForm, reportOpen, pickingOnMap } from './hud/ReportForm';
import { MenuDrawer } from './hud/MenuDrawer';
import { Toasts } from './hud/Toast';
import { NotificationCenter } from './hud/NotificationCenter';
import { Preloader } from './hud/Preloader';
import { Radar } from './hud/Radar';
import { createMap } from './map/createMap';
import { installPins, flyToSighting } from './map/pins';
import { addSightings, sightings, latestArrival } from './state/sightings';
import { isDemoMode } from './config';
import { sfx } from './audio/sfx';
import type { Map as MLMap } from 'maplibre-gl';

export function App() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap>();
  const [booted, setBooted] = useState(false);
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
    });

    /* Remote arrival → sonar ping */
    const unsubPing = latestArrival.subscribe((s) => {
      if (s) sfx.ping();
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
      {pickingOnMap.value && <div class="pick-hint">TAP THE MAP TO DROP YOUR PIN</div>}
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
      {!booted && <Preloader onDone={() => setBooted(true)} />}
    </>
  );
}
