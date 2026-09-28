/*
 * Live store status. Reads the hours + Yom Tov table the layout embeds and
 * keeps every badge, "today" row and closure notice on the page current.
 */
import {
  computeStatus,
  nowInNewYork,
  upcomingNotices,
  type ClosureCalendar,
  type HoursStore,
} from '../lib/hours';

const source = document.getElementById('store-calendar');

if (source?.textContent) {
  const { cal, stores } = JSON.parse(source.textContent) as { cal: ClosureCalendar; stores: HoursStore[] };
  const byId = new Map(stores.map((s) => [s.id, s]));

  const render = () => {
    const now = nowInNewYork();

    for (const node of document.querySelectorAll<HTMLElement>('[data-store-status]')) {
      const store = byId.get(node.dataset.storeStatus ?? '');
      if (!store) continue;
      const status = computeStatus(store, cal, now);
      node.dataset.state = status.state;
      const headline = node.querySelector('.status__headline');
      const detail = node.querySelector('.status__detail');
      if (headline) headline.textContent = status.headline;
      if (detail) detail.textContent = status.detail;
      node.title = `${status.headline} · ${status.detail}`;
      node.removeAttribute('data-pending');
    }

    for (const row of document.querySelectorAll<HTMLElement>('[data-days]')) {
      const days = (row.dataset.days ?? '').split(',').map(Number);
      const today = days.includes(now.dow);
      row.toggleAttribute('data-today', today);
      if (today) row.setAttribute('aria-current', 'date');
      else row.removeAttribute('aria-current');
    }

    for (const box of document.querySelectorAll<HTMLElement>('[data-upcoming]')) {
      const store = byId.get(box.dataset.upcoming ?? '');
      const list = box.querySelector('ul');
      if (!store || !list) continue;
      const notices = upcomingNotices(store, cal, now);
      list.replaceChildren(
        ...notices.map((n) => {
          const li = document.createElement('li');
          li.dataset.kind = n.kind;
          const when = document.createElement('strong');
          when.textContent = n.when;
          li.append(when, ` — ${n.what}`);
          return li;
        }),
      );
      box.hidden = notices.length === 0;
    }
  };

  render();

  // Tick on the minute so "Closing soon" flips exactly when it should.
  const schedule = () => setTimeout(() => (render(), schedule()), 60_000 - (Date.now() % 60_000) + 50);
  schedule();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) render();
  });
}
