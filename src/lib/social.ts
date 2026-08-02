import { addSightings, sightings, type Reply } from '../state/sightings';
import { isDemoMode } from '../config';

/* ── Likes ("web-ups") ──────────────────────────────────────────────────── */

const LIKED_KEY = 'spoody:liked';

function likedSet(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

export function hasLiked(id: string): boolean {
  return likedSet().has(id);
}

/** One like per browser/user; optimistic count bump. Returns new liked state. */
export async function toggleLike(id: string): Promise<boolean> {
  const set = likedSet();
  const s = sightings.value.get(id);
  if (!s) return false;
  const liking = !set.has(id);
  liking ? set.add(id) : set.delete(id);
  localStorage.setItem(LIKED_KEY, JSON.stringify([...set]));
  addSightings([{ ...s, likeCount: Math.max(0, (s.likeCount ?? 0) + (liking ? 1 : -1)) }]);

  if (!isDemoMode) {
    const { supabase } = await import('./supabaseClient');
    await supabase()
      .functions.invoke('like-sighting', { body: { sighting_id: id, unlike: !liking } })
      .catch(() => undefined);
  }
  return liking;
}

/* ── Replies ────────────────────────────────────────────────────────────── */

const REPLIES_KEY = (id: string) => `spoody:replies:${id}`;

const DEMO_REPLY_SEED: Array<[string, string]> = [
  ['ROOFTOP-RITA', 'I SAW HIM TOO. HE WENT EAST.'],
  ['DAILY-BUGLER', 'PICS OR IT DIDNT HAPPEN.'],
  ['NIGHT-OWL-NYC', 'CONFIRMED. HEARD THE THWIP FROM MY BLOCK.'],
  ['CAM-KID-2099', 'HE DOES THAT EVERY TUESDAY.'],
];

function seededReplies(id: string): Reply[] {
  /* deterministic per-id pseudo-random seed so demo pins feel lived-in */
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const count = h % 3; // 0-2 seeded replies
  return Array.from({ length: count }, (_, i) => {
    const [name, message] = DEMO_REPLY_SEED[(h + i) % DEMO_REPLY_SEED.length];
    return {
      id: `seed-${id}-${i}`,
      sightingId: id,
      name,
      message,
      createdAt: new Date(Date.now() - ((h % 40) + i * 7) * 60_000).toISOString(),
    };
  });
}

export async function getReplies(id: string): Promise<Reply[]> {
  if (isDemoMode) {
    let mine: Reply[] = [];
    try {
      mine = JSON.parse(localStorage.getItem(REPLIES_KEY(id)) ?? '[]');
    } catch {
      /* ignore */
    }
    const seeds = id.startsWith('demo-') ? seededReplies(id) : [];
    return [...seeds, ...mine].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  const { supabase } = await import('./supabaseClient');
  const { data } = await supabase()
    .from('replies')
    .select('*')
    .eq('sighting_id', id)
    .order('created_at', { ascending: true })
    .limit(100);
  return (data ?? []).map((r: any) => ({
    id: r.id,
    sightingId: r.sighting_id,
    name: r.name,
    message: r.message,
    createdAt: r.created_at,
    parentId: r.parent_reply_id ?? null,
  }));
}

export async function addReply(
  id: string,
  name: string,
  message: string,
  parentId?: string | null,
): Promise<{ ok: boolean; error?: string; reply?: Reply }> {
  const cleanName = name.trim().slice(0, 24) || 'ANONYMOUS-WATCHER';
  const cleanMsg = message.trim().slice(0, 140);
  if (!cleanMsg) return { ok: false, error: 'SAY SOMETHING.' };

  if (isDemoMode) {
    const reply: Reply = {
      id: crypto.randomUUID(),
      sightingId: id,
      name: cleanName,
      message: cleanMsg,
      createdAt: new Date().toISOString(),
      parentId: parentId ?? null,
    };
    const list = await getReplies(id);
    const mine = list.filter((r) => !r.id.startsWith('seed-'));
    localStorage.setItem(REPLIES_KEY(id), JSON.stringify([...mine, reply].slice(-50)));
    bumpReplyCount(id, 1);
    return { ok: true, reply };
  }

  const { supabase } = await import('./supabaseClient');
  const { data, error } = await supabase()
    .functions.invoke('reply-sighting', {
      body: {
        sighting_id: id,
        name: cleanName,
        message: cleanMsg,
        parent_reply_id: parentId ?? null,
      },
    })
    .catch(() => ({ data: null, error: { message: 'network' } as any }));
  if (error) {
    const status = (error as any)?.context?.status;
    if (status === 429) return { ok: false, error: 'TOO MANY REPLIES. COOL DOWN.' };
    return { ok: false, error: 'TRANSMISSION FAILED.' };
  }
  bumpReplyCount(id, 1);
  const r = (data as any)?.reply;
  return {
    ok: true,
    reply: r
      ? { id: r.id, sightingId: id, name: r.name, message: r.message, createdAt: r.created_at }
      : undefined,
  };
}

function bumpReplyCount(id: string, delta: number): void {
  const s = sightings.value.get(id);
  if (s) addSightings([{ ...s, replyCount: Math.max(0, (s.replyCount ?? 0) + delta) }]);
}
