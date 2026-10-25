import React from 'react';
import { LeadStatus, Priority, STATUS_META, PRIORITY_META, RecordSource, SOURCE_META, CrmMeta } from '../../types/admin';
import { initials, followUpState } from '../../lib/crm';

export const Avatar: React.FC<{ name: string; size?: 'sm' | 'md' | 'lg' }> = ({ name, size = 'md' }) => {
  const cls = size === 'sm' ? 'w-7 h-7 text-[10px]' : size === 'lg' ? 'w-12 h-12 text-sm' : 'w-9 h-9 text-xs';
  return (
    <span
      aria-hidden="true"
      className={`${cls} rounded-xl bg-corporate-emerald/15 border border-corporate-emerald/30 text-corporate-emerald font-bold font-mono inline-flex items-center justify-center shrink-0`}
    >
      {initials(name)}
    </span>
  );
};

export const StatusPill: React.FC<{ status: LeadStatus }> = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border whitespace-nowrap ${STATUS_META[status].chip}`}>
    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_META[status].color }} aria-hidden="true" />
    {STATUS_META[status].label}
  </span>
);

export const SourceBadge: React.FC<{ source: RecordSource }> = ({ source }) => (
  <span className={`inline-flex text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border whitespace-nowrap ${SOURCE_META[source].chip}`}>
    {SOURCE_META[source].label}
  </span>
);

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => (
  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-300 whitespace-nowrap">
    <span className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_META[priority].dot}`} aria-hidden="true" />
    {PRIORITY_META[priority].label}
  </span>
);

export const FollowUpChip: React.FC<{ meta: CrmMeta }> = ({ meta }) => {
  const state = followUpState(meta);
  if (state === 'none') return <span className="text-[11px] font-mono text-slate-500">—</span>;
  const label = new Date(`${meta.followUpDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const cls =
    state === 'overdue'
      ? 'text-rose-400 bg-rose-400/10 border-rose-400/30'
      : state === 'today'
        ? 'text-amber-400 bg-amber-400/10 border-amber-400/30'
        : 'text-slate-300 bg-navy-700/60 border-navy-600';
  return (
    <span className={`inline-flex text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border tabular-nums whitespace-nowrap ${cls}`}>
      {state === 'overdue' ? `Overdue · ${label}` : state === 'today' ? 'Today' : label}
    </span>
  );
};

export const EmptyState: React.FC<{
  icon: React.ElementType;
  title: string;
  body: string;
  action?: React.ReactNode;
}> = ({ icon: Icon, title, body, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6 space-y-3">
    <div className="w-14 h-14 rounded-2xl bg-navy-800 border border-navy-600 flex items-center justify-center text-corporate-emerald">
      <Icon className="w-7 h-7" aria-hidden="true" />
    </div>
    <h3 className="text-base font-bold text-white font-display">{title}</h3>
    <p className="text-sm text-slate-400 max-w-sm leading-relaxed">{body}</p>
    {action}
  </div>
);

export const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, children, className = '' }) => (
  <section className={`bg-navy-800/70 rounded-2xl border border-navy-600 p-5 ${className}`}>
    <header className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h3 className="text-sm font-bold text-white font-display">{title}</h3>
        {subtitle && <p className="text-[11px] font-mono text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </header>
    {children}
  </section>
);

export const inputCls =
  'w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-corporate-emerald focus:ring-1 focus:ring-corporate-emerald transition-colors';

export const selectCls =
  'bg-navy-900 border border-navy-600 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-corporate-emerald cursor-pointer';

export const labelCls = 'block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5';
