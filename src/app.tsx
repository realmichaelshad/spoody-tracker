import { config } from './config';

export function App() {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        height: '100%',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      <div>{config.siteName} — BOOTING…</div>
    </div>
  );
}
