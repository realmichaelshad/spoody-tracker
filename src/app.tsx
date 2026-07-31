import { FrameChrome } from './hud/FrameChrome';

export function App() {
  return (
    <>
      {/* Map mounts here in M2 — navy placeholder for now */}
      <div id="map" style={{ position: 'absolute', inset: 0, background: 'var(--map-bg)' }} />
      <FrameChrome />
    </>
  );
}
