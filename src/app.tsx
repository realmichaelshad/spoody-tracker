import { useEffect, useRef } from 'preact/hooks';
import { FrameChrome } from './hud/FrameChrome';
import { createMap } from './map/createMap';
import type { Map as MLMap } from 'maplibre-gl';

export function App() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap>();

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    mapRef.current = createMap(mapEl.current);
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
