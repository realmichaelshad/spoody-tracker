/*
 * Build-time only: works out the Yom Tov days (diaspora, two-day) for the
 * next few years with Hebcal, so the browser just looks dates up in a small
 * table. Rebuild the site at least once every couple of years to extend it.
 */
import { HebrewCalendar } from '@hebcal/core';
import { business, stores } from '../data/business';
import { addDays, dowOf, type ClosureCalendar, type HoursStore } from './hours';

const YEARS_AHEAD = 3;

/** "Sukkos II" → "Sukkos", "Rosh Hashana 5787" → "Rosh Hashana". */
const cleanName = (name: string) => name.replace(/\s+(?:[IVX]+|\d{4})$/, '').trim();

const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function buildClosureCalendar(from: Date = new Date()): ClosureCalendar {
  const start = new Date(from.getFullYear(), from.getMonth(), 1);
  const end = new Date(from.getFullYear() + YEARS_AHEAD, 11, 31);
  const events = HebrewCalendar.calendar({ start, end, il: false });

  const yomTov: Record<string, string> = {};
  for (const ev of events) {
    if (!ev.hasFlag('CHAG')) continue;
    yomTov[isoDate(ev.greg())] = cleanName(ev.render('ashkenazi'));
  }

  // The day before a Yom Tov closes early, unless it is itself Yom Tov or
  // Shabbos (then the store is closed anyway).
  const erev: Record<string, string> = {};
  for (const date of Object.keys(yomTov)) {
    const before = addDays(date, -1);
    if (yomTov[before] || dowOf(before) === 6) continue;
    erev[before] = yomTov[date];
  }

  return {
    yomTov,
    erev,
    special: business.specialDays.map((s) => ({ ...s, stores: s.stores ? [...s.stores] : undefined })),
    closedOnYomTov: business.calendar.closedOnYomTov,
    erevUsesFridayHours: business.calendar.erevYomTovUsesFridayHours,
  };
}

/** What the browser needs for the live badges, serialized once per page. */
export function clientCalendarPayload(): { cal: ClosureCalendar; stores: HoursStore[] } {
  return {
    cal: buildClosureCalendar(),
    stores: stores.map((s) => ({ id: s.id, hours: s.hours })),
  };
}
