import { useEffect, useState } from 'preact/hooks';
import type { Sighting, Reply } from '../state/sightings';
import { sightings } from '../state/sightings';
import { relativeTime } from '../lib/time';
import { hasLiked, toggleLike, getReplies, addReply } from '../lib/social';
import { flagSighting } from '../lib/flags';
import { isMine } from '../lib/demoStore';
import { sfx } from '../audio/sfx';

interface Props {
  sighting: Sighting;
}

/** The popup card: report, photo, likes ("web-ups"), reply thread, flag. */
export function SightingCard({ sighting }: Props) {
  /* live version of the sighting (like/reply counts update in the store) */
  const s = sightings.value.get(sighting.id) ?? sighting;
  const [liked, setLiked] = useState(hasLiked(s.id));
  const [revealed, setRevealed] = useState(s.photoState !== 'unscreened');
  const [replies, setReplies] = useState<Reply[] | null>(null);
  const [showReplies, setShowReplies] = useState(false);
  const [replyName, setReplyName] = useState(localStorage.getItem('spoody:name') ?? '');
  const [replyMsg, setReplyMsg] = useState('');
  const [replyErr, setReplyErr] = useState('');
  const [replyTo, setReplyTo] = useState<Reply | null>(null);
  const [busy, setBusy] = useState(false);
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    if (showReplies && replies === null) {
      void getReplies(s.id).then(setReplies);
    }
  }, [showReplies]);

  const like = () => {
    sfx.blip();
    /* Optimistic: the button must respond on the same frame as the tap.
       The server round-trip settles in the background. */
    setLiked((v) => !v);
    void toggleLike(s.id).then(setLiked);
  };

  const sendReply = async () => {
    setBusy(true);
    setReplyErr('');
    localStorage.setItem('spoody:name', replyName.trim().slice(0, 24));
    const res = await addReply(s.id, replyName, replyMsg, replyTo?.parentId ?? replyTo?.id);
    setBusy(false);
    if (!res.ok) {
      sfx.error();
      setReplyErr(res.error ?? 'FAILED.');
      return;
    }
    sfx.blip();
    setReplyMsg('');
    setReplyTo(null);
    if (res.reply) setReplies([...(replies ?? []), res.reply]);
  };

  /* Thread: top-level replies with their children beneath them. */
  const thread: Array<{ r: Reply; nested: boolean }> = [];
  if (replies) {
    const tops = replies.filter((r) => !r.parentId);
    const children = replies.filter((r) => r.parentId);
    for (const top of tops) {
      thread.push({ r: top, nested: false });
      for (const child of children.filter((c) => c.parentId === top.id)) {
        thread.push({ r: child, nested: true });
      }
    }
    /* orphans (parent missing) render top-level */
    for (const child of children) {
      if (!tops.some((t) => t.id === child.parentId)) thread.push({ r: child, nested: false });
    }
  }

  return (
    <div class="sighting-card">
      <div class="card-head">
        <span class="card-dot" />
        SIGHTING REPORT
      </div>

      {s.photoUrl && (
        <div class={`card-photo ${revealed ? '' : 'unscreened'}`}>
          <img
            src={s.photoUrl}
            alt="sighting photo"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLElement).closest('.card-photo')?.remove();
            }}
          />
          {!revealed && (
            <button class="reveal-btn" onClick={() => setRevealed(true)}>
              UNVERIFIED IMAGE — CLICK TO REVEAL
            </button>
          )}
        </div>
      )}

      <div class="card-msg">{s.message}</div>
      <div class="card-meta">
        <span class="card-name">
          {s.name}
          {isMine(s.id) && <span class="you-badge">YOU</span>}
        </span>
        <span class="card-time">
          {relativeTime(s.createdAt)}
          {s.placeLabel ? ` · ${s.placeLabel}` : ''}
        </span>
      </div>

      <div class="card-actions">
        <button class={`webup-btn ${liked ? 'on' : ''}`} onClick={like}>
          <span class="webup-icon" /> {s.likeCount ?? 0}
        </button>
        <button
          class="px-btn replies-btn"
          onClick={() => {
            sfx.blip();
            setShowReplies(!showReplies);
          }}
        >
          REPLIES ({s.replyCount ?? 0})
        </button>
        <button
          class="card-flag"
          disabled={flagged}
          onClick={() => {
            setFlagged(true);
            void flagSighting(s.id);
          }}
        >
          {flagged ? 'FLAGGED' : 'FLAG'}
        </button>
      </div>

      {showReplies && (
        <div class="reply-thread">
          {replies === null && <div class="reply-loading">LOADING…</div>}
          {thread.map(({ r, nested }) => (
            <div key={r.id} class={`reply ${nested ? 'nested' : ''}`}>
              <span class="reply-name">{r.name}</span>
              <span class="reply-msg">{r.message}</span>
              <span class="reply-time">{relativeTime(r.createdAt)}</span>
              <button
                class="reply-reply"
                title={`Reply to ${r.name}`}
                onClick={() => {
                  setReplyTo(r);
                  sfx.blip();
                }}
              >
                ↩
              </button>
            </div>
          ))}
          {replies?.length === 0 && <div class="reply-loading">NO REPLIES YET.</div>}
          <div class="reply-form">
            {replyTo && (
              <div class="replying-to">
                REPLYING TO {replyTo.name}
                <button class="replying-cancel" onClick={() => setReplyTo(null)} aria-label="Cancel reply target">
                  ×
                </button>
              </div>
            )}
            <input
              class="reply-input"
              maxLength={24}
              placeholder="CODENAME"
              value={replyName}
              onInput={(e) => setReplyName((e.target as HTMLInputElement).value.toUpperCase())}
            />
            <div class="reply-send-row">
              <input
                class="reply-input grow"
                maxLength={140}
                placeholder={replyTo ? `REPLY TO ${replyTo.name}…` : 'ADD A REPLY…'}
                value={replyMsg}
                onInput={(e) => setReplyMsg((e.target as HTMLInputElement).value)}
                onKeyDown={(e) => e.key === 'Enter' && !busy && void sendReply()}
              />
              <button class="px-btn reply-send" disabled={busy} onClick={sendReply}>
                {busy ? '…' : 'SEND'}
              </button>
            </div>
            {replyErr && <div class="reply-err">{replyErr}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
