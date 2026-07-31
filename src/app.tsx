import { useEffect, useRef } from 'preact/hooks';
import { FrameChrome } from './hud/FrameChrome';
import { createMap } from './map/createMap';
import { installPins } from './map/pins';
import { addSightings } from './state/sightings';
import { isDemoMode } from './config';
import type { Map as MLMap } from 'maplibre-gl';

export function App() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap>();

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = (mapRef.current = createMap(mapEl.current));
    map.once('load', async () => {
      if (isDemoMode) {
        const { generateMockSightings } = await import('./lib/mock');
        addSightings(generateMockSightings(1200));
      }
      await installPins(map);
    });
    return () => {
      mapRef.current?.remove();
      mapRef.current = undefined;
    };
  }, []);

  return (
    <>
      <div
        id="map"
        ref={mapEl}
        style={{ position: 'absolute', inset: 0, background: 'var(--map-bg)' }}
      />
      <FrameChrome />
    </>
  );
}
