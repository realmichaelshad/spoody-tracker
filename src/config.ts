/**
 * Site-wide configuration.
 *
 * Everything brandable lives here so forks can rename the whole site
 * by editing env vars (or this file) without touching components.
 */

const env = import.meta.env;

export const config = {
  /** Site title shown in the logo plate, preloader, and ticker. */
  siteName: (env.VITE_SITE_NAME as string) || 'WEBHEAD TRACKER',
  /** Short tagline used by the preloader boot sequence. */
  tagline:
    (env.VITE_TAGLINE as string) ||
    'INTERACT WITH THE MAP TO VIEW SIGHTINGS ALL OVER THE WORLD.',
  /** Vector tile style base — OpenFreeMap public instance by default (keyless, no limits). */
  tilesUrl: (env.VITE_TILES_URL as string) || 'https://tiles.openfreemap.org/planet',
  /** Supabase — leave unset to run in local demo mode (no backend, localStorage only). */
  supabaseUrl: (env.VITE_SUPABASE_URL as string) || '',
  supabaseAnonKey: (env.VITE_SUPABASE_ANON_KEY as string) || '',
  /** Optional Cloudflare Turnstile site key (anti-bot). Empty = disabled. */
  turnstileSiteKey: (env.VITE_TURNSTILE_SITE_KEY as string) || '',
} as const;

/** True when no backend is configured — the app runs fully client-side with demo data. */
export const isDemoMode = !config.supabaseUrl || !config.supabaseAnonKey;
