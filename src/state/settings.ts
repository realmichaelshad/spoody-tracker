import { signal, effect } from '@preact/signals';

function persisted(key: string, initial: boolean) {
  const stored = localStorage.getItem(key);
  const s = signal(stored === null ? initial : stored === '1');
  effect(() => localStorage.setItem(key, s.value ? '1' : '0'));
  return s;
}

/** Master sound switch (SFX engine checks this before playing anything). */
export const soundOn = persisted('spoody:sound', true);

/** Mute sighting notifications (no toasts, no ping; alerts panel still works). */
export const notifMuted = persisted('spoody:notif-muted', false);

/** Which HUD panel is open (drawer navigation). */
export const openPanel = signal<'none' | 'menu' | 'log' | 'help'>('none');
