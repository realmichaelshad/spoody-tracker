/**
 * Community flagging: dedupes by salted IP hash; 3 unique flags auto-hide
 * the sighting (the realtime UPDATE removes the pin on every client).
 * Deploy: supabase functions deploy flag-sighting --no-verify-jwt
 */
import { createClient } from 'npm:@supabase/supabase-js@2';
import { json, preflight, ipHash } from '../_shared/util.ts';

const AUTO_HIDE_AT = 3;

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
  await supabase.from('flags').upsert(
    { sighting_id: id, ip_hash: hash },
    { onConflict: 'sighting_id,ip_hash', ignoreDuplicates: true },
  );

  const { count } = await supabase
    .from('flags')
    .select('*', { count: 'exact', head: true })
    .eq('sighting_id', id);

  const updates: Record<string, unknown> = { report_count: count ?? 0 };
  if ((count ?? 0) >= AUTO_HIDE_AT) updates.status = 'hidden';
  await supabase.from('sightings').update(updates).eq('id', id).eq('status', 'visible');

  return json({ ok: true, flags: count ?? 0 });
});
