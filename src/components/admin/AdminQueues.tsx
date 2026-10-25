import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck2, KeyRound, Check, X, MessageSquare } from 'lucide-react';
import { UnifiedRecord, CrmMeta } from '../../types/admin';
import { MetaMap, getMeta, followUpState, formatDateIN, relativeTime, whatsappLink } from '../../lib/crm';
import { Avatar, StatusPill, FollowUpChip, EmptyState, SectionCard } from './adminUi';
import { staggerContainer, fadeUp } from '../../lib/motion';

interface QueueProps {
  records: UnifiedRecord[];
  metaMap: MetaMap;
  onOpenRecord: (record: UnifiedRecord) => void;
  onUpdateMeta: (key: string, patch: Partial<CrmMeta>) => void;
}

/** Follow-up work queue: what does the partner act on today? */
export const TasksView: React.FC<QueueProps> = ({ records, metaMap, onOpenRecord, onUpdateMeta }) => {
  const groups = useMemo(() => {
    const enriched = records
      .map(r => ({ record: r, meta: getMeta(metaMap, r) }))
      .filter(({ meta }) => meta.followUpDate && meta.status !== 'lost' && meta.status !== 'onboarded');
    const byDate = (a: typeof enriched[number], b: typeof enriched[number]) =>
      (a.meta.followUpDate || '').localeCompare(b.meta.followUpDate || '');
    return {
      overdue: enriched.filter(e => followUpState(e.meta) === 'overdue').sort(byDate),
      today: enriched.filter(e => followUpState(e.meta) === 'today').sort(byDate),
      upcoming: enriched.filter(e => followUpState(e.meta) === 'upcoming').sort(byDate)
    };
  }, [records, metaMap]);

  const total = groups.overdue.length + groups.today.length + groups.upcoming.length;

  const markContacted = (key: string) =>
    onUpdateMeta(key, { status: 'contacted', lastContactedAt: new Date().toISOString(), followUpDate: '' });

  const renderGroup = (title: string, items: typeof groups.overdue, tone: string) =>
    items.length > 0 && (
      <SectionCard title={`${title} · ${items.length}`} className={tone}>
        <ul className="space-y-2">
          {items.map(({ record, meta }) => (
            <motion.li key={record.key} variants={fadeUp} className="flex flex-wrap items-center gap-3 rounded-xl bg-navy-900/70 border border-navy-600/70 px-4 py-3">
              <button type="button" onClick={() => onOpenRecord(record)} className="flex items-center gap-3 flex-1 min-w-[220px] text-left cursor-pointer group">
                <Avatar name={record.name} />
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-white truncate group-hover:text-corporate-emerald transition-colors">{record.company !== '—' ? record.company : record.name}</span>
                  <span className="block text-[11px] font-mono text-slate-500 truncate">{record.service} · due {formatDateIN(meta.followUpDate)}</span>
                </span>
              </button>
              <StatusPill status={meta.status} />
              <FollowUpChip meta={meta} />
              <div className="flex items-center gap-1.5">
                <a href={whatsappLink(record)} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${record.name}`} className="p-2 rounded-lg text-slate-400 hover:text-corporate-emerald hover:bg-corporate-emerald/10 transition-colors"><MessageSquare className="w-4 h-4" /></a>
                <button type="button" onClick={() => markContacted(record.key)} className="px-3 py-2 bg-corporate-emerald/15 border border-corporate-emerald/40 text-corporate-emerald text-[11px] font-mono font-bold rounded-lg hover:bg-corporate-emerald/25 transition-colors cursor-pointer">
                  Mark contacted
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      </SectionCard>
    );

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-navy-600 bg-navy-800/50">
        <EmptyState icon={CalendarCheck2} title="No follow-ups scheduled" body="Open any client and set a follow-up date — it will surface here, grouped by overdue, today and upcoming." />
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5 max-w-5xl">
      {renderGroup('Overdue', groups.overdue, 'border-rose-400/30')}
      {renderGroup('Due Today', groups.today, 'border-amber-400/30')}
      {renderGroup('Upcoming', groups.upcoming, '')}
    </motion.div>
  );
};

interface AccessProps extends QueueProps {
  onReviewAccess: (record: UnifiedRecord, decision: 'approved' | 'rejected') => void;
}

/** Software unlock approvals queue. */
export const AccessRequestsView: React.FC<AccessProps> = ({ records, metaMap, onOpenRecord, onReviewAccess }) => {
  const requests = useMemo(() => {
    const list = records.filter(r => r.source === 'access');
    const rank = (s?: string) => (s === 'pending' ? 0 : s === 'approved' ? 1 : 2);
    return [...list].sort((a, b) => rank(a.requestStatus) - rank(b.requestStatus) || new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [records]);

  const pending = requests.filter(r => (r.requestStatus || 'pending') === 'pending').length;

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-navy-600 bg-navy-800/50">
        <EmptyState icon={KeyRound} title="No access requests" body="When clients request premium software unlocks from their portal, approvals will land here." />
      </div>
    );
  }

  const statusChip = (s?: string) =>
    s === 'approved'
      ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
      : s === 'rejected'
        ? 'text-rose-400 bg-rose-400/10 border-rose-400/30'
        : 'text-amber-400 bg-amber-400/10 border-amber-400/30';

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4 max-w-5xl">
      <p className="text-sm text-slate-400">
        <span className="text-white font-bold tabular-nums">{pending}</span> request{pending === 1 ? '' : 's'} awaiting review.
        Approving records your decision{records[0]?.isDemo ? ' (demo mode — saved locally)' : ' to Firestore'}; the client is then unlocked from their workspace.
      </p>
      <ul className="space-y-3">
        {requests.map(record => {
          const meta = getMeta(metaMap, record);
          const isPending = (record.requestStatus || 'pending') === 'pending';
          return (
            <motion.li key={record.key} variants={fadeUp} className="flex flex-wrap items-center gap-3 rounded-2xl bg-navy-800/70 border border-navy-600 px-5 py-4">
              <button type="button" onClick={() => onOpenRecord(record)} className="flex items-center gap-3 flex-1 min-w-[240px] text-left cursor-pointer group">
                <span className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0"><KeyRound className="w-5 h-5" aria-hidden="true" /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-white truncate group-hover:text-corporate-emerald transition-colors">{record.softwareName} unlock — {record.company !== '—' ? record.company : record.name}</span>
                  <span className="block text-[11px] font-mono text-slate-500 truncate">{record.name} · {record.email} · {relativeTime(record.createdAt)}</span>
                </span>
              </button>
              <span className={`inline-flex text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${statusChip(record.requestStatus)}`}>
                {(record.requestStatus || 'pending').toUpperCase()}
              </span>
              <StatusPill status={meta.status} />
              {isPending && (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => onReviewAccess(record, 'approved')} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-corporate-emerald hover:bg-corporate-emerald-hover text-white text-[11px] font-mono font-bold rounded-xl transition-colors cursor-pointer">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" /> Approve
                  </button>
                  <button type="button" onClick={() => onReviewAccess(record, 'rejected')} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy-900 border border-rose-400/40 text-rose-400 text-[11px] font-mono font-bold rounded-xl hover:bg-rose-400/10 transition-colors cursor-pointer">
                    <X className="w-3.5 h-3.5" aria-hidden="true" /> Reject
                  </button>
                </div>
              )}
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
};
