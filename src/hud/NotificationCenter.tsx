import { notifications, notifOpen, closeNotifications } from '../state/notifications';
import { notifMuted } from '../state/settings';
import { relativeTime } from '../lib/time';
import { sfx } from '../audio/sfx';
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
        <span class="notif-head-btns">
          <button
            class={`notif-mute ${notifMuted.value ? 'on' : ''}`}
            onClick={() => {
              notifMuted.value = !notifMuted.value;
              sfx.toggle(!notifMuted.value);
            }}
          >
            {notifMuted.value ? 'MUTED' : 'MUTE'}
          </button>
          <button class="notif-close" onClick={closeNotifications} aria-label="Close alerts">
            ×
          </button>
        </span>
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
