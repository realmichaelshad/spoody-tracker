import { addSightings, type Sighting } from '../state/sightings';
import { saveLocalSighting, markMine } from './demoStore';
import { placeLabelFast } from './geocode';
import { isDemoMode } from '../config';

export interface ReportInput {
  lat: number;
  lng: number;
  name: string;
  message: string;
  photo?: Blob | null;
}

export interface ReportResult {
  ok: boolean;
  error?: string;
}

/**
 * Submit a sighting. Demo mode: local-only (persists in this browser).
 * Backend mode: goes through the report-sighting edge function, and the
 * realtime channel delivers it to everyone (including us).
 */
export async function submitSighting(input: ReportInput): Promise<ReportResult> {
  const name = input.name.trim().slice(0, 24) || 'ANONYMOUS-WATCHER';
  const message = input.message.trim().slice(0, 140);
  if (!message) return { ok: false, error: 'SAY WHAT YOU SAW.' };
  if (Math.abs(input.lat) > 90 || Math.abs(input.lng) > 180) {
    return { ok: false, error: 'LOCATION OUT OF RANGE.' };
  }

  if (isDemoMode) {
    const label = await placeLabelFast(input.lat, input.lng);
    /* Store the photo as a data URL so it survives reloads (object URLs
       die with the page). Compressed WebP is small enough for localStorage. */
    let photoUrl: string | null = null;
    if (input.photo) {
      photoUrl = await new Promise<string | null>((res) => {
        const r = new FileReader();
        r.onload = () => res(typeof r.result === 'string' ? r.result : null);
        r.onerror = () => res(null);
        r.readAsDataURL(input.photo!);
      });
    }
    const s: Sighting = {
      id: crypto.randomUUID(),
      lat: input.lat,
      lng: input.lng,
      name,
      message,
      photoUrl,
      photoState: photoUrl ? 'screened' : 'none',
      placeLabel: label,
      createdAt: new Date().toISOString(),
    };
    addSightings([s], { arrival: true });
    saveLocalSighting(s);
    markMine(s.id);
    return { ok: true };
  }

  try {
    const label = await placeLabelFast(input.lat, input.lng);
    const fd = new FormData();
    fd.set('lat', String(input.lat));
    fd.set('lng', String(input.lng));
    fd.set('name', name);
    fd.set('message', message);
    fd.set('place_label', label);
    const tsToken = (window as any).turnstile?.getResponse?.();
    if (tsToken) fd.set('turnstile_token', tsToken);
    if (input.photo) fd.set('photo', input.photo, 'photo.webp');
    const { supabase } = await import('./supabaseClient');
    const { data, error } = await supabase().functions.invoke('report-sighting', { body: fd });
    if (error) {
      const status = (error as any)?.context?.status;
      if (status === 429) return { ok: false, error: 'TOO MANY REPORTS. COOL DOWN A MINUTE.' };
      return { ok: false, error: 'TRANSMISSION FAILED. TRY AGAIN.' };
    }
    const newId = (data as any)?.id;
    if (typeof newId === 'string') markMine(newId);
    return { ok: true };
  } catch {
    return { ok: false, error: 'TRANSMISSION FAILED. TRY AGAIN.' };
  }
}
