/**
 * Supabase integration (real backend mode). Fleshed out in M4 —
 * this module is only imported when isDemoMode is false.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!client) {
    client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export async function supabaseFlag(sightingId: string): Promise<void> {
  await supabase().functions.invoke('flag-sighting', { body: { sighting_id: sightingId } });
}
