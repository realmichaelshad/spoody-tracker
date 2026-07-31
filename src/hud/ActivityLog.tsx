import { newestFirst, sightings } from '../state/sightings';
import { relativeTime } from '../lib/time';
import { openPanel } from '../state/settings';

interface Props {
  onJump: (id: string) => void;
}

/** Latest sightings feed — click an entry to fly to its pin. */
export function ActivityLog({ onJump }: Props) {
  void sightings.value; // subscribe
  const items = newestFirst(60);
  return (
    <div class="panel-body log-body">
      {items.length === 0 && <div class="log-empty">NO SIGHTINGS YET. BE THE FIRST.</div>}
      {items.map((s) => (
        <button
          key={s.id}
          class="log-item"
          onClick={() => {
            openPanel.value = 'none';
            onJump(s.id);
          }}
        >
          <span class="log-star" />
          <span class="log-text">
            <span class="log-msg">{s.message}</span>
            <span class="log-meta">
              {s.name} · {relativeTime(s.createdAt)}
              {s.placeLabel ? ` · ${s.placeLabel}` : ''}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
