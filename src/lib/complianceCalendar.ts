import { JHA_ACCOUNTING_DATA } from '../data/firmData';

/**
 * Compliance calendar engine — turns the editorial `taxCalendar`
 * entries in firmData.ts ("7th · Every Month", "15th · June · Sept ·
 * Dec · March", "31st Dec · Annual Return") into concrete upcoming
 * statutory dates. Shared by the Admin CMS Compliance tab and the
 * Client Dashboard Compliance tab so both always agree.
 */

export type ComplianceCategory = 'GST' | 'TDS/TCS' | 'Advance Tax' | 'Income Tax' | 'Other';
export type DeadlineState = 'passed' | 'due-today' | 'due-soon' | 'upcoming';

export interface ComplianceDeadline {
  id: string;
  title: string;
  act: string;
  desc: string;
  category: ComplianceCategory;
  urgency: 'critical' | 'upcoming';
  periodLabel: string;
  date: Date;
  daysLeft: number;
  state: DeadlineState;
}

const DAY_MS = 86_400_000;

const MONTH_PATTERNS: { re: RegExp; month: number }[] = [
  { re: /jan/, month: 0 }, { re: /feb/, month: 1 }, { re: /mar/, month: 2 },
  { re: /apr/, month: 3 }, { re: /may/, month: 4 }, { re: /jun/, month: 5 },
  { re: /jul/, month: 6 }, { re: /aug/, month: 7 }, { re: /sep/, month: 8 },
  { re: /oct/, month: 9 }, { re: /nov/, month: 10 }, { re: /dec/, month: 11 }
];

interface ParsedEntry {
  title: string;
  act: string;
  desc: string;
  urgency: 'critical' | 'upcoming';
  periodLabel: string;
  day: number;
  /** null = every month; otherwise the months it falls in each year. */
  months: number[] | null;
  category: ComplianceCategory;
}

function categoryFor(title: string): ComplianceCategory {
  const t = title.toLowerCase();
  if (t.includes('advance tax')) return 'Advance Tax';
  if (t.includes('tds') || t.includes('tcs')) return 'TDS/TCS';
  if (t.includes('gstr') || t.includes('gst')) return 'GST';
  if (t.includes('income') || t.includes('itr')) return 'Income Tax';
  return 'Other';
}

function parseEntries(): ParsedEntry[] {
  return JHA_ACCOUNTING_DATA.taxCalendar.map(item => {
    const day = parseInt(item.day, 10) || 20;
    const haystack = `${item.period} ${item.day}`.toLowerCase();
    let months: number[] | null = null;
    if (!item.period.toLowerCase().includes('every month')) {
      months = MONTH_PATTERNS.filter(m => m.re.test(haystack)).map(m => m.month);
      if (months.length === 0) months = null; // unknown cadence — treat as monthly
    }
    return {
      title: item.title,
      act: item.act,
      desc: item.desc,
      urgency: item.urgency as 'critical' | 'upcoming',
      periodLabel: item.period,
      day,
      months,
      category: categoryFor(item.title)
    };
  });
}

function dateInMonth(year: number, month: number, day: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay), 23, 59, 59);
}

function stateFor(daysLeft: number): DeadlineState {
  if (daysLeft < 0) return 'passed';
  if (daysLeft === 0) return 'due-today';
  if (daysLeft <= 3) return 'due-soon';
  return 'upcoming';
}

function toDeadline(entry: ParsedEntry, date: Date, todayStart: Date): ComplianceDeadline {
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const daysLeft = Math.round((dateStart.getTime() - todayStart.getTime()) / DAY_MS);
  return {
    id: `${entry.title}-${date.toISOString().slice(0, 10)}`,
    title: entry.title,
    act: entry.act,
    desc: entry.desc,
    category: entry.category,
    urgency: entry.urgency,
    periodLabel: entry.periodLabel,
    date,
    daysLeft,
    state: stateFor(daysLeft)
  };
}

const startOfToday = (from: Date) => new Date(from.getFullYear(), from.getMonth(), from.getDate());

/** Every occurrence from today up to `daysAhead` days out, chronological. */
export function getUpcomingDeadlines(daysAhead = 180, from = new Date()): ComplianceDeadline[] {
  const todayStart = startOfToday(from);
  const horizon = new Date(todayStart.getTime() + daysAhead * DAY_MS);
  const out: ComplianceDeadline[] = [];

  for (const entry of parseEntries()) {
    if (entry.months === null) {
      // Monthly: walk month by month to the horizon.
      let cursor = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
      while (cursor <= horizon) {
        const d = dateInMonth(cursor.getFullYear(), cursor.getMonth(), entry.day);
        if (d >= todayStart && d <= horizon) out.push(toDeadline(entry, d, todayStart));
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      }
    } else {
      // Annual-in-specific-months: check this year and next.
      for (const year of [todayStart.getFullYear(), todayStart.getFullYear() + 1]) {
        for (const month of entry.months) {
          const d = dateInMonth(year, month, entry.day);
          if (d >= todayStart && d <= horizon) out.push(toDeadline(entry, d, todayStart));
        }
      }
    }
  }

  return out.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** Deadlines falling in a given month (defaults to current), with passed/upcoming states. */
export function getMonthDeadlines(year?: number, month?: number, from = new Date()): ComplianceDeadline[] {
  const y = year ?? from.getFullYear();
  const m = month ?? from.getMonth();
  const todayStart = startOfToday(from);
  return parseEntries()
    .filter(e => e.months === null || e.months.includes(m))
    .map(e => toDeadline(e, dateInMonth(y, m, e.day), todayStart))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getNextDeadline(from = new Date()): ComplianceDeadline | null {
  return getUpcomingDeadlines(400, from)[0] ?? null;
}

export const COMPLIANCE_CATEGORIES: ComplianceCategory[] = ['GST', 'TDS/TCS', 'Advance Tax', 'Income Tax', 'Other'];

export const formatDeadlineDate = (d: Date): string =>
  d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

export function daysLeftLabel(deadline: ComplianceDeadline): string {
  if (deadline.daysLeft < 0) return `${Math.abs(deadline.daysLeft)}d ago`;
  if (deadline.daysLeft === 0) return 'Due today';
  if (deadline.daysLeft === 1) return 'Due tomorrow';
  return `In ${deadline.daysLeft} days`;
}
