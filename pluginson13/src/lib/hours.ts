/*
 * Opening-hours logic shared by the build (hours tables) and the browser
 * (the live "Open now" badges). Everything is computed in New York time, so
 * a customer checking from Lakewood or Jerusalem sees the store's real state.
 */
import type { Clock, DayHours, WeekHours } from '../data/business';

export interface ClosureCalendar {
  /** New York date → Yom Tov name, e.g. { '2026-10-03': 'Shmini Atzeres' }. */
  yomTov: Record<string, string>;
  /** Weekday before a Yom Tov → the Yom Tov it leads into. */
  erev: Record<string, string>;
  special: { date: string; hours: DayHours; note: string; stores?: string[] }[];
  closedOnYomTov: boolean;
  erevUsesFridayHours: boolean;
}

export interface HoursStore {
  id: string;
  hours: WeekHours;
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const toMinutes = (t: Clock | string): number => {
  const [hh, mm] = t.split(':').map(Number);
  return hh * 60 + mm;
};

/** "13:30" → "1:30 PM", "19:00" → "7 PM". */
export function formatClock(t: Clock | string): string {
  const [hh, mm] = t.split(':').map(Number);
  const suffix = hh >= 12 ? 'PM' : 'AM';
  const h12 = ((hh + 11) % 12) + 1;
  return mm === 0 ? `${h12} ${suffix}` : `${h12}:${String(mm).padStart(2, '0')} ${suffix}`;
}

export function formatRange(d: DayHours): string {
  if (!d) return 'Closed';
  return `${formatClock(d.open)} – ${formatClock(d.close)}`;
}

export interface HoursRow {
  label: string;
  days: number[];
  range: string;
  closed: boolean;
}

/**
 * Collapses the week into rows like "Mon – Thu  10 AM – 7 PM". Sunday comes
 * first — it is a full shopping day here — and Saturday reads as Shabbos.
 */
export function groupWeek(hours: WeekHours): HoursRow[] {
  const rows: HoursRow[] = [];
  for (let dow = 0; dow < 7; dow++) {
    const range = hours[dow] ? formatRange(hours[dow]) : dow === 6 ? 'Closed for Shabbos' : 'Closed';
    const last = rows[rows.length - 1];
    if (last && last.range === range && last.days[last.days.length - 1] === dow - 1) {
      last.days.push(dow);
    } else {
      rows.push({ label: '', days: [dow], range, closed: !hours[dow] });
    }
  }
  for (const row of rows) {
    const first = row.days[0];
    const end = row.days[row.days.length - 1];
    row.label = row.days.length === 1 ? DAY_NAMES[first] : `${DAY_SHORT[first]} – ${DAY_SHORT[end]}`;
  }
  return rows;
}

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

export interface NYNow {
  /** YYYY-MM-DD */
  date: string;
  /** 0 = Sunday */
  dow: number;
  /** Minutes since midnight. */
  minutes: number;
}

let nyFormatter: Intl.DateTimeFormat | undefined;

export function nowInNewYork(at: Date = new Date()): NYNow {
  nyFormatter ??= new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const parts: Record<string, string> = {};
  for (const p of nyFormatter.formatToParts(at)) parts[p.type] = p.value;
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  // Some engines print midnight as "24" even with h23.
  const hour = Number(parts.hour) % 24;
  return { date, dow: dowOf(date), minutes: hour * 60 + Number(parts.minute) };
}

const utcOf = (date: string) => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const dowOf = (date: string) => utcOf(date).getUTCDay();

export function addDays(date: string, n: number): string {
  const t = utcOf(date);
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
}

/** "Sun, Oct 4" */
export function shortDate(date: string): string {
  const t = utcOf(date);
  return `${DAY_SHORT[t.getUTCDay()]}, ${MONTH_SHORT[t.getUTCMonth()]} ${t.getUTCDate()}`;
}

/* ------------------------------------------------------------------ */
/* Hours on a given day                                                */
/* ------------------------------------------------------------------ */

export type ClosedReason = 'shabbos' | 'yomtov' | 'special' | 'closed';

export interface DayPlan {
  hours: DayHours;
  reason?: ClosedReason;
  /** Yom Tov name or the note of a special day. */
  note?: string;
  /** Set on erev Yom Tov: the Yom Tov that starts that evening. */
  erev?: string;
}

export function planFor(store: HoursStore, date: string, cal: ClosureCalendar): DayPlan {
  const dow = dowOf(date);
  const special = cal.special.find((s) => s.date === date && (!s.stores || s.stores.includes(store.id)));
  if (special) {
    return special.hours ? { hours: special.hours, note: special.note } : { hours: null, reason: 'special', note: special.note };
  }
  if (cal.closedOnYomTov && cal.yomTov[date]) {
    return { hours: null, reason: 'yomtov', note: cal.yomTov[date] };
  }
  const regular = store.hours[dow];
  if (!regular) return { hours: null, reason: dow === 6 ? 'shabbos' : 'closed' };

  const erev = cal.erev[date];
  const friday = store.hours[5];
  if (erev && cal.erevUsesFridayHours && friday && dow !== 5) {
    // Close as early as on a Friday, but never open earlier than usual.
    const close = toMinutes(friday.close) < toMinutes(regular.close) ? friday.close : regular.close;
    return { hours: { open: regular.open, close }, erev };
  }
  return erev ? { hours: regular, erev } : { hours: regular };
}

/* ------------------------------------------------------------------ */
/* Live status                                                         */
/* ------------------------------------------------------------------ */

export type StatusState = 'open' | 'closing' | 'opening' | 'closed';

export interface Status {
  state: StatusState;
  /** "Open now", "Closed for Shabbos" … */
  headline: string;
  /** "Until 7 PM", "Opens Sunday at 11 AM" … */
  detail: string;
}

const CLOSING_SOON = 45;
const OPENING_SOON = 60;

function relativeDay(from: string, to: string): string {
  if (from === to) return 'today';
  if (addDays(from, 1) === to) return 'tomorrow';
  for (let i = 2; i < 7; i++) if (addDays(from, i) === to) return DAY_NAMES[dowOf(to)];
  return shortDate(to);
}

function nextOpening(store: HoursStore, cal: ClosureCalendar, now: NYNow): { date: string; open: string } | null {
  for (let i = 1; i <= 21; i++) {
    const date = addDays(now.date, i);
    const plan = planFor(store, date, cal);
    if (plan.hours) return { date, open: plan.hours.open };
  }
  return null;
}

export function computeStatus(store: HoursStore, cal: ClosureCalendar, now: NYNow = nowInNewYork()): Status {
  const today = planFor(store, now.date, cal);

  if (today.hours) {
    const open = toMinutes(today.hours.open);
    const close = toMinutes(today.hours.close);
    if (now.minutes >= open && now.minutes < close) {
      const at = formatClock(today.hours.close);
      if (close - now.minutes <= CLOSING_SOON) {
        return { state: 'closing', headline: 'Closing soon', detail: `Closes at ${at}` };
      }
      return {
        state: 'open',
        headline: 'Open now',
        detail: today.erev ? `Until ${at} · Erev Yom Tov` : `Until ${at}`,
      };
    }
    if (now.minutes < open) {
      const soon = open - now.minutes <= OPENING_SOON;
      return {
        state: soon ? 'opening' : 'closed',
        headline: soon ? 'Opening soon' : 'Closed now',
        detail: `Opens today at ${formatClock(today.hours.open)}`,
      };
    }
  }

  // Closed for the rest of today.
  let headline = 'Closed now';
  const tomorrow = planFor(store, addDays(now.date, 1), cal);
  if (today.reason === 'yomtov') headline = `Closed for ${today.note}`;
  else if (today.reason === 'shabbos') headline = 'Closed for Shabbos';
  else if (today.reason === 'special') headline = today.note ? `Closed · ${today.note}` : 'Closed today';
  else if (today.erev) headline = `Closed for ${today.erev}`;
  else if (tomorrow.reason === 'shabbos') headline = 'Closed for Shabbos';
  else if (tomorrow.reason === 'yomtov') headline = `Closed for ${tomorrow.note}`;

  const next = nextOpening(store, cal, now);
  return {
    state: 'closed',
    headline,
    detail: next ? `Opens ${relativeDay(now.date, next.date)} at ${formatClock(next.open)}` : 'Call for hours',
  };
}

/* ------------------------------------------------------------------ */
/* Coming-up notices                                                   */
/* ------------------------------------------------------------------ */

export interface Notice {
  /** "Closed Sat, Oct 3 – Sun, Oct 4" */
  when: string;
  /** "Shmini Atzeres & Simchas Torah" */
  what: string;
  kind: 'closed' | 'early';
}

/**
 * Yom Tov closures and early closings in the next few weeks, so people can
 * plan a trip. Plain Shabbos is left out — everyone knows about Shabbos.
 */
export function upcomingNotices(store: HoursStore, cal: ClosureCalendar, now: NYNow = nowInNewYork(), days = 21): Notice[] {
  const notices: Notice[] = [];
  let run: { start: string; end: string; names: string[] } | null = null;

  const flush = () => {
    if (!run) return;
    const when = run.start === run.end ? shortDate(run.start) : `${shortDate(run.start)} – ${shortDate(run.end)}`;
    notices.push({ kind: 'closed', when: `Closed ${when}`, what: run.names.join(' & ') });
    run = null;
  };

  for (let i = 0; i <= days; i++) {
    const date = addDays(now.date, i);
    const plan = planFor(store, date, cal);
    const isClosure = !plan.hours && (plan.reason === 'yomtov' || plan.reason === 'special');
    if (isClosure) {
      const name = plan.note || 'Closed';
      if (run) {
        run.end = date;
        if (!run.names.includes(name)) run.names.push(name);
      } else {
        run = { start: date, end: date, names: [name] };
      }
      continue;
    }
    // A Shabbos between two Yom Tov days doesn't split the closure.
    if (run && plan.reason === 'shabbos' && !planFor(store, addDays(date, 1), cal).hours) {
      run.end = date;
      continue;
    }
    flush();
    if (plan.hours && plan.erev && dowOf(date) !== 5) {
      notices.push({
        kind: 'early',
        when: `${shortDate(date)}: closing ${formatClock(plan.hours.close)}`,
        what: `Erev ${plan.erev}`,
      });
    }
  }
  flush();
  return notices;
}
