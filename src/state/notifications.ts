import { signal } from '@preact/signals';
import { latestArrival, type Sighting } from './sightings';

/** Recent arrivals (newest first, capped) + unread badge for the spider button. */
export const notifications = signal<Sighting[]>([]);
export const unreadCount = signal(0);
export const notifOpen = signal(false);

latestArrival.subscribe((s) => {
  if (!s) return;
  notifications.value = [s, ...notifications.value.filter((n) => n.id !== s.id)].slice(0, 12);
  if (!notifOpen.value) unreadCount.value++;
});

export function openNotifications(): void {
  notifOpen.value = true;
  unreadCount.value = 0;
}

export function closeNotifications(): void {
  notifOpen.value = false;
}
