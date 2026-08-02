/**
 * Token-gated moderation API for admin.html. The ADMIN_TOKEN secret is
 * compared in constant time; all actions run with the service role which
 * never leaves this function.
 * Deploy: supabase functions deploy admin --no-verify-jwt
 */
import { createClient } from 'npm:@supabase/supabase-js@2';
import { json, preflight } from '../_shared/util.ts';

function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

Deno.serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;

  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  const expected = Deno.env.get('ADMIN_TOKEN') ?? '';
  if (!expected || !timingSafeEqual(token, expected)) return json({ error: 'unauthorized' }, 401);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const url = new URL(req.url);
  const op = url.searchParams.get('op') ?? 'queue';

  if (req.method === 'GET' && op === 'queue') {
    const { data: flagged } = await supabase
      .from('sightings')
      .select('*')
      .gt('report_count', 0)
      .order('report_count', { ascending: false })
      .limit(100);
    const { data: hidden } = await supabase
      .from('sightings')
      .select('*')
      .eq('status', 'hidden')
      .order('created_at', { ascending: false })
      .limit(100);
    const { data: unscreened } = await supabase
      .from('sightings')
      .select('*')
      .eq('photo_state', 'unscreened')
      .order('created_at', { ascending: false })
      .limit(100);
    return json({ flagged: flagged ?? [], hidden: hidden ?? [], unscreened: unscreened ?? [] });
  }

  if (req.method === 'POST') {
    const body = await req.json().catch(() => ({}));

    /* Seed a sighting as the site owner. Skips the per-IP rate limit that
       applies to visitors, because this is the operator posting, not a
       stranger. Token-gated like every other admin action. */
    if (body.action === 'seed') {
      const lat = Number(body.lat);
      const lng = Number(body.lng);
      const name = String(body.name ?? '').trim().slice(0, 24);
      const message = String(body.message ?? '').trim().slice(0, 140);
      const placeLabel = String(body.place_label ?? '').trim().slice(0, 80) || null;
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)
        return json({ error: 'bad location' }, 400);
      if (!name || !message) return json({ error: 'missing fields' }, 400);

      /* Optional generated image, sent as base64 PNG. */
      let photoPath: string | null = null;
      if (typeof body.photo_base64 === 'string' && body.photo_base64.length > 40) {
        try {
          const bytes = Uint8Array.from(atob(body.photo_base64), (c) => c.charCodeAt(0));
          if (bytes.byteLength <= 2 * 1024 * 1024) {
            const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.png`;
            const { error: upErr } = await supabase.storage
              .from('photos')
              .upload(path, bytes, { contentType: 'image/png' });
            if (!upErr) photoPath = path;
          }
        } catch {
          /* bad base64 — post without the image rather than failing */
        }
      }

      const { data: row, error } = await supabase
        .from('sightings')
        .insert({
          lat,
          lng,
          name,
          message,
          place_label: placeLabel,
          photo_path: photoPath,
          photo_state: photoPath ? 'screened' : 'none',
        })
        .select()
        .single();
      if (error) return json({ error: 'insert failed' }, 500);
      return json({ ok: true, id: row.id, photo: !!photoPath });
    }

    const { id, action } = body;
    if (!id || !action) return json({ error: 'bad request' }, 400);

    switch (action) {
      case 'restore':
        await supabase
          .from('sightings')
          .update({ status: 'visible', report_count: 0 })
          .eq('id', id);
        await supabase.from('flags').delete().eq('sighting_id', id);
        return json({ ok: true });
      case 'hide':
        await supabase.from('sightings').update({ status: 'hidden' }).eq('id', id);
        return json({ ok: true });
      case 'delete': {
        const { data: row } = await supabase
          .from('sightings')
          .select('photo_path')
          .eq('id', id)
          .single();
        if (row?.photo_path) await supabase.storage.from('photos').remove([row.photo_path]);
        await supabase.from('sightings').update({ status: 'deleted', photo_path: null }).eq('id', id);
        return json({ ok: true });
      }
      case 'approve_photo':
        await supabase.from('sightings').update({ photo_state: 'screened' }).eq('id', id);
        return json({ ok: true });
      case 'remove_photo': {
        const { data: row } = await supabase
          .from('sightings')
          .select('photo_path')
          .eq('id', id)
          .single();
        if (row?.photo_path) await supabase.storage.from('photos').remove([row.photo_path]);
        await supabase
          .from('sightings')
          .update({ photo_path: null, photo_state: 'removed' })
          .eq('id', id);
        return json({ ok: true });
      }
      default:
        return json({ error: 'unknown action' }, 400);
    }
  }

  return json({ error: 'method' }, 405);
});
