import { notifications, notifOpen, closeNotifications } from '../state/notifications';
import { relativeTime } from '../lib/time';
import type { Sighting } from '../state/sightings';

interface Props {
  onJump: (s: Sighting) => void;
}

/** Dropdown under the spider button: recent sightings, click to fly there. */
export function NotificationCenter({ onJump }: Props) {
  if (!notifOpen.value) return null;
  const items = notifications.value;
  return (
    <div class="notif-panel">
      <div class="notif-head">
        SIGHTING ALERTS
        <button class="notif-close" onClick={closeNotifications} aria-label="Close alerts">
          ×
        </button>
      </div>
      {items.length === 0 && (
        <div class="notif-empty">ALL QUIET… FOR NOW. NEW SIGHTINGS LAND HERE.</div>
      )}
      {items.map((s) => (
        <button
          key={s.id}
          class="notif-item"
          onClick={() => {
            closeNotifications();
            onJump(s);
          }}
        >
          <span class="toast-pin" />
          <span class="toast-body">
            <span class="toast-msg">{s.message}</span>
            <span class="toast-meta">
              {s.name}
              {s.placeLabel ? ` · ${s.placeLabel}` : ''} · {relativeTime(s.createdAt)}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
