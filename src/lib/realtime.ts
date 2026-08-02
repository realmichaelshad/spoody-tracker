import { addSightings, removeSighting, sightings, type Sighting } from '../state/sightings';
import { config } from '../config';
import { supabase } from './supabaseClient';

function rowToSighting(row: any): Sighting {
  return {
    id: row.id,
    lat: row.lat,
    lng: row.lng,
    name: row.name,
    message: row.message,
    photoUrl: row.photo_path
      ? `${config.supabaseUrl}/storage/v1/object/public/photos/${row.photo_path}`
      : null,
    photoState: row.photo_state ?? 'none',
    placeLabel: row.place_label,
    createdAt: row.created_at,
    /* Without these the social counters render 0 and every realtime
       update wipes the number you just watched go up. */
    likeCount: row.like_count ?? 0,
    replyCount: row.reply_count ?? 0,
  };
}

const POLL_MS = 30_000;

/**
 * Backend mode data flow: initial fetch of the latest 500 visible sightings,
 * then realtime INSERT/UPDATE events push live pins to everyone.
 * If the realtime channel can't join (e.g. free-tier connection cap),
 * degrades to 30s polling of rows newer than the latest local one.
 */
export async function startRealtime(): Promise<void> {
  const sb = supabase();
  let newest = '1970-01-01T00:00:00Z';

  const { data } = await sb
    .from('sightings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);
  if (data?.length) {
    addSightings(data.map(rowToSighting));
    newest = data[0].created_at;
  }

  /* Moderation reconcile.
     When a sighting is hidden (auto-hide at 3 flags, or an admin action) the
     row stops satisfying the anon RLS policy, so Supabase does NOT deliver
     that UPDATE to other viewers — flagged content would linger on their map
     until a reload. Periodically diff our loaded ids against the ids still
     visible and drop the ones that are gone. */
  setInterval(
    async () => {
      if (document.visibilityState !== 'visible') return;
      const localIds = [...sightings.value.keys()];
      if (!localIds.length) return;
      const { data: rows, error } = await sb.from('sightings').select('id').limit(1000);
      if (error || !rows) return;
      const stillVisible = new Set(rows.map((r: { id: string }) => r.id));
      for (const id of localIds) {
        if (!stillVisible.has(id)) removeSighting(id);
      }
    },
    3 * 60_000,
  );

  let pollTimer: ReturnType<typeof setInterval> | null = null;
  const startPolling = () => {
    if (pollTimer) return;
    pollTimer = setInterval(async () => {
      const { data: rows } = await sb
        .from('sightings')
        .select('*')
        .gt('created_at', newest)
        .order('created_at', { ascending: true })
        .limit(100);
      for (const row of rows ?? []) {
        newest = row.created_at;
        addSightings([rowToSighting(row)], { arrival: true });
      }
    }, POLL_MS);
  };

  sb.channel('sightings-live')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'sightings' },
      (payload) => {
        const s = rowToSighting(payload.new);
        newest = s.createdAt;
        addSightings([s], { arrival: true });
      },
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'sightings' },
      (payload) => {
        const row = payload.new as any;
        if (row.status && row.status !== 'visible') removeSighting(row.id);
        else addSightings([rowToSighting(row)]);
      },
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') startPolling();
    });
}
