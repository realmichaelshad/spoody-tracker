import { useEffect, useState } from 'preact/hooks';
import { latestArrival, type Sighting } from '../state/sightings';
import { relativeTime } from '../lib/time';

interface Props {
  onJump: (s: Sighting) => void;
}

interface ToastItem {
  s: Sighting;
  born: number;
}

const TOAST_MS = 9000;

/**
 * "NEW SIGHTING" notification cards — slide in top-right when a sighting
 * arrives while you're on the app; click to fly to the pin.
 */
export function Toasts({ onJump }: Props) {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsub = latestArrival.subscribe((s) => {
      if (!s) return;
      setItems((prev) => [...prev.slice(-2), { s, born: Date.now() }]);
    });
    const sweep = setInterval(() => {
      setItems((prev) => prev.filter((t) => Date.now() - t.born < TOAST_MS));
    }, 1000);
    return () => {
      unsub();
      clearInterval(sweep);
    };
  }, []);

  if (!items.length) return null;
  return (
    <div class="toasts">
      {items.map((t) => (
        <button
          key={t.s.id}
          class="toast"
          onClick={() => {
            setItems((prev) => prev.filter((x) => x !== t));
            onJump(t.s);
          }}
        >
          <span class="toast-pin" />
          <span class="toast-body">
            <span class="toast-head">
              <span class="toast-dot" />
              NEW SIGHTING
            </span>
            <span class="toast-msg">{t.s.message}</span>
            <span class="toast-meta">
              {t.s.name}
              {t.s.placeLabel ? ` · ${t.s.placeLabel}` : ''} · {relativeTime(t.s.createdAt)}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
