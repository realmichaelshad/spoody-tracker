import { useState } from 'preact/hooks';
import { newestFirst, sightings, type Sighting } from '../state/sightings';
import { relativeTime } from '../lib/time';
import { openPanel } from '../state/settings';
import { hasLiked, toggleLike, deleteSighting } from '../lib/social';
import { sfx } from '../audio/sfx';
import { isMine } from '../lib/demoStore';

interface Props {
  onJump: (id: string) => void;
}

function FeedItem({ s, onJump }: { s: Sighting; onJump: (id: string) => void }) {
  const [liked, setLiked] = useState(hasLiked(s.id));
  const [confirming, setConfirming] = useState(false);

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
          <span class="feed-name">
            {s.name}
            {isMine(s.id) && <span class="you-badge">YOU</span>}
          </span>
          <span class="feed-time">
            {relativeTime(s.createdAt)}
            {s.placeLabel ? ` · ${s.placeLabel}` : ''}
          </span>
        </div>
        <div class="feed-msg">{s.message}</div>
        {s.photoUrl && (
          <div class={`feed-photo ${s.photoState === 'unscreened' ? 'blurred' : ''}`}>
            <img
              src={s.photoUrl}
              alt="sighting photo"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLElement).closest('.feed-photo')?.remove();
              }}
            />
          </div>
        )}
      </button>
      <div class="feed-actions">
        <button
          class={`webup-btn ${liked ? 'on' : ''}`}
          aria-label="Web-up this sighting"
          onClick={() => {
            sfx.like();
            setLiked((v) => !v);
            void toggleLike(s.id).then(setLiked);
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
        {isMine(s.id) && (
          <button
            class="feed-delete"
            title="Delete your sighting"
            onClick={async () => {
              if (!confirming) {
                setConfirming(true);
                sfx.blip();
                setTimeout(() => setConfirming(false), 4000);
                return;
              }
              const res = await deleteSighting(s.id);
              res.ok ? sfx.deleted() : sfx.error();
            }}
          >
            {confirming ? 'SURE?' : 'DELETE'}
          </button>
        )}
        <button
          class="feed-goto"
          onClick={() => {
            sfx.blip();
            openPanel.value = 'none';
            onJump(s.id);
          }}
        >
          VIEW ON MAP →
        </button>
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
