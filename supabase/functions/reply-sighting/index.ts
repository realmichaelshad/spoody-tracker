/**
 * Add a reply to a sighting — validated, rate-limited by salted IP hash.
 * Deploy: supabase functions deploy reply-sighting --no-verify-jwt
 */
import { createClient } from 'npm:@supabase/supabase-js@2';
import { json, preflight, ipHash } from '../_shared/util.ts';

Deno.serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method !== 'POST') return json({ error: 'method' }, 405);

  let body: {
    sighting_id?: string;
    name?: string;
    message?: string;
    parent_reply_id?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad json' }, 400);
  }
  const id = body.sighting_id;
  const name = String(body.name ?? '').trim().slice(0, 24);
  const message = String(body.message ?? '').trim().slice(0, 140);
  const parentId = body.parent_reply_id ?? null;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'bad id' }, 400);
  if (parentId && !/^[0-9a-f-]{36}$/i.test(parentId)) return json({ error: 'bad parent' }, 400);
  if (!name || !message) return json({ error: 'missing fields' }, 400);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const hash = await ipHash(req);

  const { data: allowed, error: rateErr } = await supabase.rpc('can_reply', { p_ip_hash: hash });
  if (rateErr) return json({ error: 'rate check failed' }, 500);
  if (!allowed) return json({ error: 'rate limited' }, 429);

  const { data: sighting } = await supabase
    .from('sightings')
    .select('id, reply_count, status')
    .eq('id', id)
    .single();
  if (!sighting || sighting.status !== 'visible') return json({ error: 'not found' }, 404);

  /* Nested replies: one level only — the parent must be a top-level reply
     on the same sighting. */
  let parentOk: string | null = null;
  if (parentId) {
    const { data: parent } = await supabase
      .from('replies')
      .select('id, sighting_id, parent_reply_id')
      .eq('id', parentId)
      .single();
    if (!parent || parent.sighting_id !== id) return json({ error: 'bad parent' }, 400);
    parentOk = parent.parent_reply_id ?? parent.id; // flatten deeper nesting to the root
  }

  const { data: reply, error: insErr } = await supabase
    .from('replies')
    .insert({ sighting_id: id, name, message, parent_reply_id: parentOk })
    .select()
    .single();
  if (insErr) return json({ error: 'insert failed' }, 500);

  await supabase.from('replies_private').insert({ reply_id: reply.id, ip_hash: hash });
  await supabase
    .from('sightings')
    .update({ reply_count: (sighting.reply_count ?? 0) + 1 })
    .eq('id', id);

  return json({ ok: true, reply });
});
