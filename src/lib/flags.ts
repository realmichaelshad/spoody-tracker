import { isDemoMode } from '../config';

/**
 * Flag a sighting as inappropriate. In demo mode this only acknowledges
 * locally; with a backend it calls the flag-sighting edge function (M8).
 */
export async function flagSighting(id: string, cardEl?: HTMLElement): Promise<void> {
  if (!isDemoMode) {
    const { supabaseFlag } = await import('./supabaseClient');
    await supabaseFlag(id).catch(() => undefined);
  }
  if (cardEl) {
    const btn = cardEl.querySelector<HTMLButtonElement>('.card-flag');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'FLAGGED — THANKS';
    }
  }
}
