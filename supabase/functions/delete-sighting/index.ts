/**
 * Delete your own sighting. Ownership is proven by the salted IP hash
 * recorded when the sighting was created — the same person, from the same
 * network, can remove it. No accounts involved.
 *
 * Admins can delete anything via the admin function; this is only for
 * "I posted that and want it gone".
 *
 * Deploy: supabase functions deploy delete-sighting --no-verify-jwt
 */
import { createClient } from 'npm:@supabase/supabase-js@2';
import { json, preflight, ipHash } from '../_shared/util.ts';

Deno.serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method !== 'POST') return json({ error: 'method' }, 405);

  let body: { sighting_id?: string };
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

  /* Only the original poster's hash may delete. */
  const { data: owner } = await supabase
    .from('sightings_private')
    .select('sighting_id')
    .eq('sighting_id', id)
    .eq('ip_hash', hash)
    .maybeSingle();

  if (!owner) return json({ error: 'not yours' }, 403);

  /* Remove the photo object too, so storage doesn't keep orphans. */
  const { data: row } = await supabase
    .from('sightings')
    .select('photo_path')
    .eq('id', id)
    .single();
  if (row?.photo_path) {
    await supabase.storage.from('photos').remove([row.photo_path]);
  }

  await supabase
    .from('sightings')
    .update({ status: 'deleted', photo_path: null, photo_state: 'removed' })
    .eq('id', id);

  return json({ ok: true });
});
