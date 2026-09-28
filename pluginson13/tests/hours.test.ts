import { describe, expect, it } from 'vitest';
import { storeById } from '../src/data/business';
import { buildClosureCalendar } from '../src/lib/calendar';
import {
  computeStatus,
  dowOf,
  formatClock,
  groupWeek,
  nowInNewYork,
  planFor,
  upcomingNotices,
  type NYNow,
} from '../src/lib/hours';

const boroPark = storeById('boro-park');
const williamsburg = storeById('williamsburg');
const cal = buildClosureCalendar(new Date(2026, 7, 1));

/** A New York wall-clock moment: at('2026-09-29', '15:30'). */
const at = (date: string, time: string): NYNow => {
  const [h, m] = time.split(':').map(Number);
  return { date, dow: dowOf(date), minutes: h * 60 + m };
};

describe('formatting', () => {
  it('prints clock times the way a store sign does', () => {
    expect(formatClock('19:00')).toBe('7 PM');
    expect(formatClock('13:30')).toBe('1:30 PM');
    expect(formatClock('10:00')).toBe('10 AM');
    expect(formatClock('00:15')).toBe('12:15 AM');
    expect(formatClock('12:00')).toBe('12 PM');
  });

  it('groups the week with Sunday first and Shabbos last', () => {
    expect(groupWeek(williamsburg.hours).map((r) => `${r.label}: ${r.range}`)).toEqual([
      'Sun – Thu: 11 AM – 7 PM',
      'Friday: 10 AM – 1:30 PM',
      'Saturday: Closed for Shabbos',
    ]);
    expect(groupWeek(boroPark.hours).map((r) => r.label)).toEqual(['Sunday', 'Mon – Thu', 'Friday', 'Saturday']);
  });
});

describe('New York time', () => {
  it('follows daylight saving time', () => {
    // Nov 1, 2026: clocks fall back at 2 AM EDT (06:00 UTC).
    expect(nowInNewYork(new Date('2026-11-01T05:30:00Z'))).toMatchObject({ date: '2026-11-01', minutes: 90 });
    expect(nowInNewYork(new Date('2026-11-01T07:30:00Z'))).toMatchObject({ date: '2026-11-01', minutes: 150 });
    // Just before midnight in New York is already tomorrow in UTC.
    expect(nowInNewYork(new Date('2026-09-30T03:45:00Z'))).toMatchObject({ date: '2026-09-29', dow: 2, minutes: 23 * 60 + 45 });
  });
});

describe('Yom Tov calendar', () => {
  it('knows the diaspora Yom Tov days by their Ashkenazi names', () => {
    expect(cal.yomTov['2026-09-12']).toBe('Rosh Hashana');
    expect(cal.yomTov['2026-09-21']).toBe('Yom Kippur');
    expect(cal.yomTov['2026-09-26']).toBe('Sukkos');
    expect(cal.yomTov['2026-09-27']).toBe('Sukkos');
    expect(cal.yomTov['2026-09-28']).toBeUndefined(); // Chol Hamoed
    expect(cal.yomTov['2026-10-03']).toBe('Shmini Atzeres');
    expect(cal.yomTov['2026-10-04']).toBe('Simchas Torah');
    expect(cal.yomTov['2027-04-22']).toBe('Pesach');
    expect(cal.yomTov['2027-04-29']).toBe('Pesach');
    expect(cal.yomTov['2027-06-12']).toBe('Shavuos');
  });

  it('marks the weekday before Yom Tov as erev, but not Shabbos or a first day', () => {
    expect(cal.erev['2026-09-20']).toBe('Yom Kippur'); // Sunday
    expect(cal.erev['2026-10-02']).toBe('Shmini Atzeres'); // Hoshana Raba, a Friday
    expect(cal.erev['2027-04-21']).toBe('Pesach');
    expect(cal.erev['2026-09-26']).toBeUndefined(); // Sukkos I is itself Yom Tov
  });

  it('closes erev Yom Tov as early as a Friday without opening earlier than usual', () => {
    expect(planFor(williamsburg, '2027-04-21', cal).hours).toEqual({ open: '11:00', close: '13:30' });
    expect(planFor(boroPark, '2026-09-20', cal).hours).toEqual({ open: '11:00', close: '13:30' });
  });
});

describe('live status', () => {
  it('is open on a regular weekday afternoon', () => {
    expect(computeStatus(boroPark, cal, at('2026-10-06', '15:30'))).toEqual({
      state: 'open',
      headline: 'Open now',
      detail: 'Until 7 PM',
    });
  });

  it('warns shortly before closing', () => {
    expect(computeStatus(boroPark, cal, at('2026-10-06', '18:30'))).toMatchObject({
      state: 'closing',
      detail: 'Closes at 7 PM',
    });
  });

  it('counts down to opening in the morning', () => {
    expect(computeStatus(boroPark, cal, at('2026-10-06', '09:15'))).toMatchObject({
      state: 'opening',
      detail: 'Opens today at 10 AM',
    });
    expect(computeStatus(williamsburg, cal, at('2026-10-06', '07:00'))).toMatchObject({
      state: 'closed',
      headline: 'Closed now',
      detail: 'Opens today at 11 AM',
    });
  });

  it('closes for Shabbos after the Friday early close', () => {
    expect(computeStatus(boroPark, cal, at('2026-10-09', '14:00'))).toEqual({
      state: 'closed',
      headline: 'Closed for Shabbos',
      detail: 'Opens Sunday at 11 AM',
    });
    expect(computeStatus(boroPark, cal, at('2026-10-10', '12:00'))).toMatchObject({
      headline: 'Closed for Shabbos',
      detail: 'Opens tomorrow at 11 AM',
    });
  });

  it('closes for Yom Tov and skips ahead to the next open day', () => {
    // Hoshana Raba afternoon, with Shmini Atzeres on Shabbos and Simchas Torah on Sunday.
    expect(computeStatus(boroPark, cal, at('2026-10-02', '14:10'))).toEqual({
      state: 'closed',
      headline: 'Closed for Shmini Atzeres',
      detail: 'Opens Monday at 10 AM',
    });
    expect(computeStatus(williamsburg, cal, at('2026-10-03', '12:00'))).toMatchObject({
      headline: 'Closed for Shmini Atzeres',
      detail: 'Opens Monday at 11 AM',
    });
    expect(computeStatus(boroPark, cal, at('2026-10-04', '12:00'))).toMatchObject({
      headline: 'Closed for Simchas Torah',
      detail: 'Opens tomorrow at 10 AM',
    });
  });

  it('shows erev Yom Tov hours', () => {
    expect(computeStatus(boroPark, cal, at('2026-09-20', '12:00'))).toEqual({
      state: 'open',
      headline: 'Open now',
      detail: 'Until 1:30 PM · Erev Yom Tov',
    });
    expect(computeStatus(boroPark, cal, at('2026-09-20', '14:00'))).toEqual({
      state: 'closed',
      headline: 'Closed for Yom Kippur',
      detail: 'Opens Tuesday at 10 AM',
    });
  });

  it('uses one-off special days from the business settings', () => {
    const withClosure = {
      ...cal,
      special: [{ date: '2026-10-07', hours: null, note: 'Inventory day', stores: ['williamsburg'] }],
    };
    expect(computeStatus(williamsburg, withClosure, at('2026-10-07', '12:00'))).toMatchObject({
      headline: 'Closed · Inventory day',
      detail: 'Opens tomorrow at 11 AM',
    });
    expect(computeStatus(boroPark, withClosure, at('2026-10-07', '12:00')).state).toBe('open');
  });
});

describe('coming-up notices', () => {
  it('lists the Yom Tov closure after Sukkos', () => {
    expect(upcomingNotices(boroPark, cal, at('2026-09-28', '12:00'))).toEqual([
      { kind: 'closed', when: 'Closed Sat, Oct 3 – Sun, Oct 4', what: 'Shmini Atzeres & Simchas Torah' },
    ]);
  });

  it('lists early closings and closures around Pesach', () => {
    expect(upcomingNotices(boroPark, cal, at('2027-04-12', '12:00'))).toEqual([
      { kind: 'early', when: 'Wed, Apr 21: closing 1:30 PM', what: 'Erev Pesach' },
      { kind: 'closed', when: 'Closed Thu, Apr 22 – Fri, Apr 23', what: 'Pesach' },
      { kind: 'early', when: 'Tue, Apr 27: closing 1:30 PM', what: 'Erev Pesach' },
      { kind: 'closed', when: 'Closed Wed, Apr 28 – Thu, Apr 29', what: 'Pesach' },
    ]);
  });

  it('stays quiet in an ordinary stretch', () => {
    expect(upcomingNotices(boroPark, cal, at('2026-11-02', '12:00'))).toEqual([]);
  });
});
