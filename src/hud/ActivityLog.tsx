import { useState } from 'preact/hooks';
import { newestFirst, sightings, type Sighting } from '../state/sightings';
import { relativeTime } from '../lib/time';
import { openPanel } from '../state/settings';
import { hasLiked, toggleLike } from '../lib/social';
import { sfx } from '../audio/sfx';

interface Props {
  onJump: (id: string) => void;
}

function FeedItem({ s, onJump }: { s: Sighting; onJump: (id: string) => void }) {
  const [liked, setLiked] = useState(hasLiked(s.id));

  return (
    <article class="feed-item">
      <button
        class="feed-main"
        onClick={() => {
          openPanel.value = 'none';
          onJump(s.id);
        }}
      >
        <div class="feed-head">
          <span class="feed-name">{s.name}</span>
          <span class="feed-time">
            {relativeTime(s.createdAt)}
            {s.placeLabel ? ` · ${s.placeLabel}` : ''}
          </span>
        </div>
        <div class="feed-msg">{s.message}</div>
        {s.photoUrl && (
          <div class={`feed-photo ${s.photoState === 'unscreened' ? 'blurred' : ''}`}>
            <img src={s.photoUrl} alt="sighting photo" loading="lazy" />
          </div>
        )}
      </button>
      <div class="feed-actions">
        <button
          class={`webup-btn ${liked ? 'on' : ''}`}
          aria-label="Web-up this sighting"
          onClick={async () => {
            sfx.blip();
            setLiked(await toggleLike(s.id));
          }}
        >
          <span class="webup-icon" />
          <span class="webup-count">{s.likeCount ?? 0}</span>
        </button>
        <button
          class="feed-replies"
          onClick={() => {
            openPanel.value = 'none';
            onJump(s.id);
          }}
        >
          {(s.replyCount ?? 0) > 0 ? `${s.replyCount} REPLIES` : 'REPLY'}
        </button>
        <span class="feed-goto">VIEW ON MAP →</span>
      </div>
    </article>
  );
}

/** Social feed of the latest sightings — like, reply, jump to the map. */
export function ActivityLog({ onJump }: Props) {
  void sightings.value; // subscribe
  const items = newestFirst(60);
  return (
    <div class="panel-body log-body">
      {items.length === 0 && <div class="log-empty">NO SIGHTINGS YET. BE THE FIRST.</div>}
      {items.map((s) => (
        <FeedItem key={s.id} s={s} onJump={onJump} />
      ))}
    </div>
  );
}
