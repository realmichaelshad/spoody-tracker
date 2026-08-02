/**
 * One-time rename of persisted storage keys from the project's former name.
 * Runs before any module reads settings, so existing reports, likes, replies,
 * and preferences carry over instead of appearing to vanish.
 *
 * Safe to delete once no installs remain on the old keys.
 */
const PREFIX_MAP: Array<[string, string]> = [
  ['webhead-tracker:', 'spoody-tracker:'],
  ['webhead:', 'spoody:'],
];

function migrate(store: Storage): void {
  for (const key of Object.keys(store)) {
    for (const [from, to] of PREFIX_MAP) {
      if (!key.startsWith(from)) continue;
      const target = to + key.slice(from.length);
      /* never clobber data already written under the new key */
      if (store.getItem(target) === null) {
        const value = store.getItem(key);
        if (value !== null) store.setItem(target, value);
      }
      store.removeItem(key);
      break;
    }
  }
}

try {
  migrate(localStorage);
  migrate(sessionStorage);
} catch {
  /* storage blocked (private mode) — nothing to migrate */
}
