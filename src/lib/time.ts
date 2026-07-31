/** "JUST NOW", "4 MIN AGO", "2 HR AGO", "3 DAYS AGO" — HUD-style caps. */
export function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return 'JUST NOW';
  if (min < 60) return `${min} MIN AGO`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} HR AGO`;
  const d = Math.floor(hr / 24);
  return d === 1 ? '1 DAY AGO' : `${d} DAYS AGO`;
}
