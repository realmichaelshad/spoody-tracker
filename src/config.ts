/**
 * Site-wide configuration.
 *
 * Everything brandable lives here so forks can rename the whole site
 * by editing env vars (or this file) without touching components.
 */

const env = import.meta.env;

export const config = {
  /** Site title shown in the logo plate, preloader, and ticker. */
  siteName: (env.VITE_SITE_NAME as string) || 'SPOODY TRACKER',
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
  /** Creator credit shown in the ticker. Blank the URL to hide it. */
  creatorHandle: (env.VITE_CREATOR_HANDLE as string) || '@REALMICHAELSHAD',
  creatorUrl: (env.VITE_CREATOR_URL as string) || 'https://x.com/realmichaelshad',
} as const;

/**
 * House lines the ticker mixes in between live sightings.
 * Keep them short — the crawl reads best under ~50 characters.
 */
export const HOUSE_LINES: string[] = [
  'LIFE IS LIKE A DISH',
  'I ONLY DEAL WITH BIG PATATOS SO NOT YOUR MOM',
];

/** True when no backend is configured — the app runs fully client-side with demo data. */
export const isDemoMode = !config.supabaseUrl || !config.supabaseAnonKey;
