/**
 * Like/unlike ("web-up") a sighting — one per salted IP hash.
 * Deploy: supabase functions deploy like-sighting --no-verify-jwt
 */
import { createClient } from 'npm:@supabase/supabase-js@2';
import { json, preflight, ipHash } from '../_shared/util.ts';

Deno.serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method !== 'POST') return json({ error: 'method' }, 405);

  let body: { sighting_id?: string; unlike?: boolean };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad json' }, 400);
  }
  const id = body.sighting_id;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'bad id' }, 400);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const hash = await ipHash(req);

  if (body.unlike) {
    await supabase.from('likes').delete().eq('sighting_id', id).eq('ip_hash', hash);
  } else {
    await supabase.from('likes').upsert(
      { sighting_id: id, ip_hash: hash },
      { onConflict: 'sighting_id,ip_hash', ignoreDuplicates: true },
    );
  }

  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('sighting_id', id);
  await supabase.from('sightings').update({ like_count: count ?? 0 }).eq('id', id);

  return json({ ok: true, likes: count ?? 0 });
});
