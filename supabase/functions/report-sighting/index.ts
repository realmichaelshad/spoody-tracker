/**
 * The single write path for sightings. Validates, rate-limits by salted
 * IP hash, optionally verifies Turnstile, stores the photo, inserts the row.
 * Deploy: supabase functions deploy report-sighting --no-verify-jwt
 */
import { createClient } from 'npm:@supabase/supabase-js@2';
import { json, preflight, ipHash, verifyTurnstile } from '../_shared/util.ts';

Deno.serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method !== 'POST') return json({ error: 'method' }, 405);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ error: 'bad form' }, 400);
  }

  const lat = Number(form.get('lat'));
  const lng = Number(form.get('lng'));
  const name = String(form.get('name') ?? '').trim().slice(0, 24);
  const message = String(form.get('message') ?? '').trim().slice(0, 140);
  const placeLabel = String(form.get('place_label') ?? '').trim().slice(0, 80) || null;
  const turnstileToken = form.get('turnstile_token');
  const photo = form.get('photo');

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)
    return json({ error: 'bad location' }, 400);
  if (!name || !message) return json({ error: 'missing fields' }, 400);

  if (!(await verifyTurnstile(req, typeof turnstileToken === 'string' ? turnstileToken : null)))
    return json({ error: 'bot check failed' }, 403);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const hash = await ipHash(req);
  const { data: allowed, error: rateErr } = await supabase.rpc('can_post', { p_ip_hash: hash });
  if (rateErr) return json({ error: 'rate check failed' }, 500);
  if (!allowed) return json({ error: 'rate limited' }, 429);

  /* Photo: size/mime guard; NSFW screening happens client-side pre-upload,
     server keeps a paper trail via photo_state for the admin queue. */
  let photoPath: string | null = null;
  let photoState = 'none';
  if (photo instanceof File && photo.size > 0) {
    if (photo.size > 2 * 1024 * 1024) return json({ error: 'photo too large' }, 413);
    if (!['image/webp', 'image/jpeg', 'image/png'].includes(photo.type))
      return json({ error: 'photo type' }, 415);
    const id = crypto.randomUUID();
    const ext = photo.type === 'image/webp' ? 'webp' : photo.type === 'image/png' ? 'png' : 'jpg';
    photoPath = `${new Date().getFullYear()}/${id}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('photos')
      .upload(photoPath, photo, { contentType: photo.type });
    if (upErr) {
      photoPath = null;
      photoState = 'none';
    } else {
      /* Client screened it; admins can re-review anything flagged. */
      photoState = Deno.env.get('TRUST_CLIENT_SCREEN') === 'off' ? 'unscreened' : 'screened';
    }
  }

  const { data: row, error: insErr } = await supabase
    .from('sightings')
    .insert({
      lat,
      lng,
      name,
      message,
      place_label: placeLabel,
      photo_path: photoPath,
      photo_state: photoState,
    })
    .select()
    .single();
  if (insErr) return json({ error: 'insert failed' }, 500);

  await supabase.from('sightings_private').insert({ sighting_id: row.id, ip_hash: hash });

  return json({ ok: true, id: row.id });
});
