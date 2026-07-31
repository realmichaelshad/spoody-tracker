import { addSightings } from '../state/sightings';
import { generateMockSightings } from './mock';

/**
 * Demo-mode live feed: every so often a "new" sighting arrives somewhere in
 * the world, driving the toast, radar ping, ticker, and activity log —
 * the same code paths the realtime backend uses.
 */
export function startDemoFeed(): () => void {
  let timer: ReturnType<typeof setTimeout>;
  let n = 0;

  const tick = () => {
    const [s] = generateMockSightings(1);
    addSightings(
      [
        {
          ...s,
          id: `live-${Date.now()}-${n++}`,
          createdAt: new Date().toISOString(),
        },
      ],
      { arrival: true },
    );
    timer = setTimeout(tick, 15_000 + Math.random() * 25_000);
  };

  timer = setTimeout(tick, 8_000);
  return () => clearTimeout(timer);
}
