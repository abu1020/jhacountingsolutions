import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, CalendarClock, KeyRound, TrendingUp, Inbox,
  ArrowRight, BellRing
} from 'lucide-react';
import { UnifiedRecord, LEAD_STATUSES, STATUS_META } from '../../types/admin';
import { MetaMap, getMeta, relativeTime, followUpState } from '../../lib/crm';
import { Avatar, StatusPill, FollowUpChip, SectionCard } from './adminUi';
import { CountingNumber } from '../CountingNumber';
import { staggerContainer, fadeUp } from '../../lib/motion';
import type { AdminView } from './AdminWorkspace';

interface OverviewViewProps {
  records: UnifiedRecord[];
  metaMap: MetaMap;
  onOpenRecord: (record: UnifiedRecord) => void;
  onNavigate: (view: AdminView) => void;
}

const DAY_MS = 86_400_000;

export const OverviewView: React.FC<OverviewViewProps> = ({ records, metaMap, onOpenRecord, onNavigate }) => {
  const stats = useMemo(() => {
    const now = Date.now();
    const enriched = records.map(r => ({ record: r, meta: getMeta(metaMap, r) }));
    const clients = records.filter(r => r.source === 'client').length;
    const newThisWeek = records.filter(r => {
      const t = new Date(r.createdAt || 0).getTime();
      return t && now - t <= 7 * DAY_MS;
    }).length;
    const dueFollowUps = enriched.filter(({ meta }) => {
      const s = followUpState(meta);
      return s === 'overdue' || s === 'today';
    });
    const pendingAccess = records.filter(r => r.source === 'access' && (r.requestStatus || 'pending') === 'pending').length;
    const leads = enriched.filter(({ record }) => record.source !== 'access');
    const onboarded = leads.filter(({ meta }) => meta.status === 'onboarded').length;
    const lost = leads.filter(({ meta }) => meta.status === 'lost').length;
    const closed = onboarded + lost;
    const conversion = closed > 0 ? Math.round((onboarded / closed) * 100) : 0;

    const byStatus = LEAD_STATUSES.map(status => ({
      status,
      count: enriched.filter(({ meta }) => meta.status === status).length
    }));
    const maxStatus = Math.max(1, ...byStatus.map(s => s.count));

    // Last 14 days intake
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now - (13 - i) * DAY_MS);
      const key = d.toDateString();
      return {
        label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        count: records.filter(r => new Date(r.createdAt || 0).toDateString() === key).length
      };
    });
    const maxDay = Math.max(1, ...days.map(d => d.count));

    const serviceCounts = new Map<string, number>();
    for (const r of records) {
      const s = r.service.replace(/^Unlock: /, '');
      serviceCounts.set(s, (serviceCounts.get(s) || 0) + 1);
    }
    const topServices = [...serviceCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const maxService = Math.max(1, ...topServices.map(([, c]) => c));

    return {
      clients, newThisWeek, dueFollowUps, pendingAccess, conversion,
      byStatus, maxStatus, days, maxDay, topServices, maxService,
      recent: records.slice(0, 6)
    };
  }, [records, metaMap]);

  const kpis = [
    { id: 'total', icon: Users, label: 'Total Records', value: records.length, sub: `${stats.clients} client accounts`, view: 'records' as AdminView },
    { id: 'new', icon: UserPlus, label: 'New (7 Days)', value: stats.newThisWeek, sub: 'Leads, clients & requests', view: 'records' as AdminView },
    { id: 'due', icon: CalendarClock, label: 'Follow-ups Due', value: stats.dueFollowUps.length, sub: 'Overdue + due today', view: 'tasks' as AdminView, alert: stats.dueFollowUps.length > 0 },
    { id: 'access', icon: KeyRound, label: 'Pending Access', value: stats.pendingAccess, sub: 'Software unlock requests', view: 'access' as AdminView, alert: stats.pendingAccess > 0 },
    { id: 'conv', icon: TrendingUp, label: 'Win Rate', value: stats.conversion, suffix: '%', sub: 'Onboarded vs lost', view: 'pipeline' as AdminView }
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <motion.button
              key={kpi.id}
              variants={fadeUp}
              type="button"
              onClick={() => onNavigate(kpi.view)}
              className={`text-left rounded-2xl border p-4 transition-colors cursor-pointer group ${
                kpi.alert
                  ? 'bg-amber-400/[0.06] border-amber-400/30 hover:border-amber-400/60'
                  : 'bg-navy-800/70 border-navy-600 hover:border-corporate-emerald/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`w-8 h-8 rounded-lg border flex items-center justify-center ${kpi.alert ? 'bg-amber-400/10 border-amber-400/30 text-amber-400' : 'bg-navy-900 border-navy-600 text-corporate-emerald'}`}>
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-corporate-emerald group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
              </div>
              <p className="text-2xl font-extrabold text-white font-display leading-none tabular-nums">
                <CountingNumber value={kpi.value} suffix={kpi.suffix || ''} duration={0.9} />
              </p>
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mt-2">{kpi.label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{kpi.sub}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Pipeline funnel */}
        <motion.div variants={fadeUp}>
          <SectionCard title="Pipeline by Stage" subtitle="Live from CRM status" className="h-full"
            action={<button type="button" onClick={() => onNavigate('pipeline')} className="text-[11px] font-mono font-bold text-corporate-emerald hover:underline cursor-pointer">Open board →</button>}>
            <ul className="space-y-3">
              {stats.byStatus.map(({ status, count }) => (
                <li key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <StatusPill status={status} />
                    <span className="text-slate-400 tabular-nums font-bold">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-900 border border-navy-600/60 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full origin-left"
                      style={{ backgroundColor: STATUS_META[status].color }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: count / stats.maxStatus }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </motion.div>

        {/* 14-day intake */}
        <motion.div variants={fadeUp}>
          <SectionCard title="Intake — Last 14 Days" subtitle="New records per day" className="h-full">
            <div className="flex items-end gap-1.5 h-36 pt-2" role="img" aria-label={`Intake last 14 days, peak ${stats.maxDay} in a day`}>
              {stats.days.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 min-w-0 group relative">
                  <span className="text-[9px] font-mono text-slate-500 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">{d.count}</span>
                  <motion.div
                    className="w-full rounded-t-md bg-gradient-to-t from-emerald-700 to-corporate-emerald min-h-[3px]"
                    initial={{ height: 3 }}
                    animate={{ height: `${Math.max(4, (d.count / stats.maxDay) * 100)}%` }}
                    transition={{ duration: 0.6, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                    title={`${d.label}: ${d.count}`}
                  />
                  <span className="text-[8px] font-mono text-slate-600 truncate w-full text-center hidden sm:block">{d.label.split(' ')[0]}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-navy-600/60">
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5">Top Services</p>
              <ul className="space-y-2">
                {stats.topServices.map(([service, count]) => (
                  <li key={service} className="flex items-center gap-2 text-[11px]">
                    <span className="text-slate-300 truncate flex-1">{service}</span>
                    <span className="w-20 h-1.5 rounded-full bg-navy-900 overflow-hidden shrink-0">
                      <span className="block h-full bg-corporate-emerald rounded-full" style={{ width: `${(count / stats.maxService) * 100}%` }} />
                    </span>
                    <span className="font-mono text-slate-400 tabular-nums w-6 text-right">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        </motion.div>

        {/* Follow-ups due + recent activity */}
        <motion.div variants={fadeUp} className="space-y-5">
          <SectionCard title="Follow-ups Due" subtitle="Overdue & today"
            action={<BellRing className="w-4 h-4 text-amber-400" aria-hidden="true" />}>
            {stats.dueFollowUps.length === 0 ? (
              <p className="text-sm text-slate-400 py-2">All clear — nothing due right now.</p>
            ) : (
              <ul className="space-y-2">
                {stats.dueFollowUps.slice(0, 4).map(({ record, meta }) => (
                  <li key={record.key}>
                    <button type="button" onClick={() => onOpenRecord(record)} className="w-full flex items-center gap-3 rounded-xl bg-navy-900/70 border border-navy-600/70 px-3 py-2.5 hover:border-amber-400/50 transition-colors text-left cursor-pointer">
                      <Avatar name={record.name} size="sm" />
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-white truncate">{record.company !== '—' ? record.company : record.name}</span>
                        <span className="block text-[10px] font-mono text-slate-500 truncate">{record.service}</span>
                      </span>
                      <FollowUpChip meta={meta} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Recent Activity" subtitle="Latest records across sources"
            action={<Inbox className="w-4 h-4 text-corporate-emerald" aria-hidden="true" />}>
            <ul className="space-y-1">
              {stats.recent.map(record => (
                <li key={record.key}>
                  <button type="button" onClick={() => onOpenRecord(record)} className="w-full flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-navy-900/70 transition-colors text-left cursor-pointer">
                    <Avatar name={record.name} size="sm" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs font-bold text-white truncate">{record.name}</span>
                      <span className="block text-[10px] font-mono text-slate-500 truncate">{record.service}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 tabular-nums shrink-0">{relativeTime(record.createdAt)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </motion.div>
      </div>
    </motion.div>
  );
};
