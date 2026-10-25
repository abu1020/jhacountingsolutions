import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, KanbanSquare } from 'lucide-react';
import { UnifiedRecord, LeadStatus, LEAD_STATUSES, STATUS_META, CrmMeta } from '../../types/admin';
import { MetaMap, getMeta, relativeTime } from '../../lib/crm';
import { Avatar, PriorityBadge, FollowUpChip, EmptyState } from './adminUi';

interface PipelineBoardProps {
  records: UnifiedRecord[];
  metaMap: MetaMap;
  query: string;
  onOpenRecord: (record: UnifiedRecord) => void;
  onUpdateMeta: (key: string, patch: Partial<CrmMeta>) => void;
}

/**
 * Drag-and-drop pipeline. Native HTML5 DnD (zero extra deps);
 * dropping a card writes the new status through the CRM meta store.
 * Keyboard users get the same control via the table's status select
 * and the detail drawer.
 */
export const PipelineBoard: React.FC<PipelineBoardProps> = ({ records, metaMap, query, onOpenRecord, onUpdateMeta }) => {
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<LeadStatus | null>(null);

  const columns = useMemo(() => {
    const q = query.trim().toLowerCase();
    const visible = records.filter(r => {
      if (!q) return true;
      return [r.name, r.company, r.email, r.service].some(f => (f || '').toLowerCase().includes(q));
    });
    return LEAD_STATUSES.map(status => ({
      status,
      items: visible
        .map(r => ({ record: r, meta: getMeta(metaMap, r) }))
        .filter(({ meta }) => meta.status === status)
    }));
  }, [records, metaMap, query]);

  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-navy-600 bg-navy-800/50">
        <EmptyState icon={KanbanSquare} title="Pipeline is empty" body="Leads and clients will flow through these stages as they arrive. Enable Demo mode in the sidebar to see the board in action." />
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1" role="list" aria-label="Sales pipeline by stage">
      {columns.map(({ status, items }) => (
        <section
          key={status}
          aria-label={`${STATUS_META[status].label} stage, ${items.length} records`}
          onDragOver={e => { e.preventDefault(); setOverStatus(status); }}
          onDragLeave={() => setOverStatus(prev => (prev === status ? null : prev))}
          onDrop={e => {
            e.preventDefault();
            if (dragKey) onUpdateMeta(dragKey, { status });
            setDragKey(null);
            setOverStatus(null);
          }}
          className={`w-[280px] shrink-0 rounded-2xl border transition-colors ${
            overStatus === status ? 'border-corporate-emerald/60 bg-corporate-emerald/[0.05]' : 'border-navy-600 bg-navy-800/40'
          }`}
        >
          <header className="flex items-center justify-between px-4 py-3 border-b border-navy-600/70">
            <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-white">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_META[status].color }} aria-hidden="true" />
              {STATUS_META[status].label}
            </span>
            <span className="text-[11px] font-mono text-slate-400 tabular-nums">{items.length}</span>
          </header>

          <div className="p-3 space-y-3 min-h-[120px] max-h-[calc(100vh-320px)] overflow-y-auto overscroll-contain">
            {items.length === 0 ? (
              <p className="text-[11px] font-mono text-slate-600 text-center py-6">Drop cards here</p>
            ) : (
              items.map(({ record, meta }) => (
                <motion.article
                  key={record.key}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: dragKey === record.key ? 0.45 : 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  draggable
                  onDragStart={() => setDragKey(record.key)}
                  onDragEnd={() => { setDragKey(null); setOverStatus(null); }}
                  onClick={() => onOpenRecord(record)}
                  className="rounded-xl bg-navy-900/80 border border-navy-600 p-3.5 cursor-grab active:cursor-grabbing hover:border-corporate-emerald/50 transition-colors group"
                >
                  <div className="flex items-start gap-2.5">
                    <Avatar name={record.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-white leading-tight truncate">{record.company !== '—' ? record.company : record.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{record.name}</p>
                    </div>
                    <GripVertical className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0" aria-hidden="true" />
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug mt-2.5">{record.service}</p>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-navy-600/60">
                    <PriorityBadge priority={meta.priority} />
                    <FollowUpChip meta={meta} />
                  </div>
                  <p className="text-[10px] font-mono text-slate-600 mt-2 tabular-nums">Added {relativeTime(record.createdAt)}</p>
                </motion.article>
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
};
