import React, { useMemo, useState } from 'react';
import { CalendarDays, AlarmClock, CalendarRange, Landmark } from 'lucide-react';
import {
  getUpcomingDeadlines, getMonthDeadlines, daysLeftLabel, formatDeadlineDate,
  COMPLIANCE_CATEGORIES, type ComplianceCategory, type ComplianceDeadline
} from '../../lib/complianceCalendar';
import { SectionCard } from './adminUi';

const STATE_CHIP: Record<ComplianceDeadline['state'], string> = {
  passed: 'text-slate-400 bg-slate-400/10 border-slate-400/25',
  'due-today': 'text-rose-400 bg-rose-400/10 border-rose-400/30',
  'due-soon': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  upcoming: 'text-sky-400 bg-sky-400/10 border-sky-400/30'
};

const CATEGORY_CHIP: Record<ComplianceCategory, string> = {
  GST: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  'TDS/TCS': 'text-violet-300 bg-violet-400/10 border-violet-400/30',
  'Advance Tax': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  'Income Tax': 'text-sky-400 bg-sky-400/10 border-sky-400/30',
  Other: 'text-slate-300 bg-slate-400/10 border-slate-400/30'
};

/**
 * Compliance Dates — dedicated statutory calendar tab.
 * (Replaces the old always-on deadline banner: dates now live in one
 * place instead of ticking at the top of every page.)
 */
export const ComplianceView: React.FC = () => {
  const [category, setCategory] = useState<'all' | ComplianceCategory>('all');

  const upcoming = useMemo(() => getUpcomingDeadlines(180), []);
  const thisMonth = useMemo(() => getMonthDeadlines(), []);

  const filtered = useMemo(
    () => (category === 'all' ? upcoming : upcoming.filter(d => d.category === category)),
    [upcoming, category]
  );

  const byMonth = useMemo(() => {
    const groups = new Map<string, ComplianceDeadline[]>();
    for (const d of filtered) {
      const key = d.date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      groups.set(key, [...(groups.get(key) || []), d]);
    }
    return [...groups.entries()];
  }, [filtered]);

  const next = upcoming[0];
  const due7 = upcoming.filter(d => d.daysLeft <= 7).length;
  const criticalThisMonth = thisMonth.filter(d => d.state !== 'passed').length;

  const summary = [
    {
      id: 'next', icon: AlarmClock, label: 'Next Deadline',
      value: next ? next.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—',
      sub: next ? `${next.title} · ${daysLeftLabel(next)}` : 'No deadlines found'
    },
    { id: 'due7', icon: CalendarDays, label: 'Due in 7 Days', value: String(due7), sub: 'Across all categories' },
    { id: 'month', icon: CalendarRange, label: 'Remaining This Month', value: String(criticalThisMonth), sub: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) },
    { id: 'horizon', icon: Landmark, label: 'Next 180 Days', value: String(upcoming.length), sub: 'Statutory occurrences tracked' }
  ];

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summary.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="rounded-2xl bg-navy-800/70 border border-navy-600 p-4">
              <span className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-600 flex items-center justify-center text-corporate-emerald mb-3">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </span>
              <p className="text-2xl font-extrabold text-white font-display leading-none tabular-nums truncate">{card.value}</p>
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mt-2">{card.label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
        {(['all', ...COMPLIANCE_CATEGORIES] as const).map(cat => (
          <button
            key={cat}
            type="button"
            aria-pressed={category === cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold border whitespace-nowrap transition-colors cursor-pointer ${
              category === cat
                ? 'bg-corporate-emerald text-white border-corporate-emerald'
                : 'bg-navy-900 text-slate-300 border-navy-600 hover:bg-navy-800'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Timeline by month */}
      <div className="space-y-5">
        {byMonth.length === 0 && (
          <SectionCard title="No deadlines" subtitle="Nothing in this category within 180 days">
            <p className="text-sm text-slate-400">Try another category.</p>
          </SectionCard>
        )}
        {byMonth.map(([monthLabel, deadlines]) => (
          <SectionCard key={monthLabel} title={monthLabel} subtitle={`${deadlines.length} deadline${deadlines.length === 1 ? '' : 's'}`}>
            <ul className="divide-y divide-navy-600/60">
              {deadlines.map(d => (
                <li key={d.id} className="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0">
                  <div className="w-14 shrink-0 rounded-xl bg-navy-900 border border-navy-600 text-center py-2">
                    <span className="block text-lg font-extrabold text-white font-display leading-none tabular-nums">{d.date.getDate()}</span>
                    <span className="block text-[9px] font-mono font-bold uppercase text-slate-500 mt-1">
                      {d.date.toLocaleDateString('en-IN', { month: 'short' })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{d.title}</h4>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${CATEGORY_CHIP[d.category]}`}>{d.category}</span>
                      {d.urgency === 'critical' && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border text-rose-300 bg-rose-400/10 border-rose-400/25">CRITICAL</span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">{d.act} · {d.periodLabel}</p>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">{d.desc}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <span className={`inline-flex text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border tabular-nums ${STATE_CHIP[d.state]}`}>
                      {daysLeftLabel(d)}
                    </span>
                    <p className="text-[10px] font-mono text-slate-600">{formatDeadlineDate(d.date)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </div>

      <p className="text-[11px] text-slate-600 leading-relaxed max-w-3xl">
        Dates are computed from the statutory calendar in the firm's content data. Due dates can shift with
        CBIC/CBDT notifications and state-specific extensions — always confirm against the latest notification before filing.
      </p>
    </div>
  );
};
