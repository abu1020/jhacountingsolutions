import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  SearchX, Download, Mail, Phone, MessageSquare, Eye,
  ChevronLeft, ChevronRight, ArrowUpDown, X
} from 'lucide-react';
import {
  UnifiedRecord, LeadStatus, LEAD_STATUSES, STATUS_META,
  Priority, PRIORITIES, RecordSource, SOURCE_META, CrmMeta
} from '../../types/admin';
import { MetaMap, getMeta, relativeTime, whatsappLink, exportRecordsCSV } from '../../lib/crm';
import { Avatar, SourceBadge, PriorityBadge, FollowUpChip, EmptyState, selectCls } from './adminUi';
import { EASE_OUT_EXPO } from '../../lib/motion';

interface RecordsTableProps {
  title: string;
  records: UnifiedRecord[];
  metaMap: MetaMap;
  query: string;
  showSourceFilter?: boolean;
  isLoading?: boolean;
  onOpenRecord: (record: UnifiedRecord) => void;
  onUpdateMeta: (key: string, patch: Partial<CrmMeta>) => void;
  onClearQuery: () => void;
}

type SortKey = 'createdAt' | 'name' | 'followUp';

export const RecordsTable: React.FC<RecordsTableProps> = ({
  title, records, metaMap, query, showSourceFilter = false, isLoading = false,
  onOpenRecord, onUpdateMeta, onClearQuery
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | RecordSource>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const enriched = useMemo(() => records.map(r => ({ record: r, meta: getMeta(metaMap, r) })), [records, metaMap]);

  const statusCounts = useMemo(() => {
    const counts = new Map<LeadStatus, number>();
    for (const { meta } of enriched) counts.set(meta.status, (counts.get(meta.status) || 0) + 1);
    return counts;
  }, [enriched]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = enriched.filter(({ record, meta }) => {
      if (statusFilter !== 'all' && meta.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && meta.priority !== priorityFilter) return false;
      if (sourceFilter !== 'all' && record.source !== sourceFilter) return false;
      if (!q) return true;
      return [record.name, record.company, record.email, record.phone, record.service, record.city, ...meta.tags]
        .some(f => (f || '').toLowerCase().includes(q));
    });
    rows = [...rows].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'createdAt') cmp = new Date(a.record.createdAt || 0).getTime() - new Date(b.record.createdAt || 0).getTime();
      else if (sortKey === 'name') cmp = a.record.name.localeCompare(b.record.name);
      else cmp = (a.meta.followUpDate || '9999').localeCompare(b.meta.followUpDate || '9999');
      return cmp * sortDir;
    });
    return rows;
  }, [enriched, query, statusFilter, priorityFilter, sourceFilter, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const hasFilters = statusFilter !== 'all' || priorityFilter !== 'all' || sourceFilter !== 'all' || query.trim();
  const clearAll = () => { setStatusFilter('all'); setPriorityFilter('all'); setSourceFilter('all'); onClearQuery(); setPage(0); };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === 1 ? -1 : 1));
    else { setSortKey(key); setSortDir(key === 'name' ? 1 : -1); }
  };

  const toggleSelect = (key: string) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });
  const allPageSelected = pageRows.length > 0 && pageRows.every(({ record }) => selected.has(record.key));
  const toggleSelectPage = () => setSelected(prev => {
    const next = new Set(prev);
    if (allPageSelected) pageRows.forEach(({ record }) => next.delete(record.key));
    else pageRows.forEach(({ record }) => next.add(record.key));
    return next;
  });

  const bulkSetStatus = (status: LeadStatus) => selected.forEach(key => onUpdateMeta(key, { status }));
  const selectedRecords = records.filter(r => selected.has(r.key));

  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label={`Loading ${title}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-navy-800/70 border border-navy-600 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1" role="group" aria-label="Filter by status">
          <button type="button" aria-pressed={statusFilter === 'all'} onClick={() => { setStatusFilter('all'); setPage(0); }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold border whitespace-nowrap transition-colors cursor-pointer ${statusFilter === 'all' ? 'bg-corporate-emerald text-white border-corporate-emerald' : 'bg-navy-900 text-slate-300 border-navy-600 hover:bg-navy-800'}`}>
            All · {enriched.length}
          </button>
          {LEAD_STATUSES.map(status => (
            <button key={status} type="button" aria-pressed={statusFilter === status} onClick={() => { setStatusFilter(status); setPage(0); }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold border whitespace-nowrap transition-colors cursor-pointer ${statusFilter === status ? STATUS_META[status].chip : 'bg-navy-900 text-slate-400 border-navy-600 hover:text-slate-200'}`}>
              {STATUS_META[status].label} · {statusCounts.get(status) || 0}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {showSourceFilter && (
            <select aria-label="Filter by source" value={sourceFilter} onChange={e => { setSourceFilter(e.target.value as typeof sourceFilter); setPage(0); }} className={selectCls}>
              <option value="all">All Sources</option>
              {(Object.keys(SOURCE_META) as RecordSource[]).map(s => <option key={s} value={s}>{SOURCE_META[s].plural}</option>)}
            </select>
          )}
          <select aria-label="Filter by priority" value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value as typeof priorityFilter); setPage(0); }} className={selectCls}>
            <option value="all">All Priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>)}
          </select>
          <button type="button" onClick={() => exportRecordsCSV(filtered.map(f => f.record), metaMap, `JAS_${title.replace(/\s+/g, '_')}`)}
            disabled={filtered.length === 0}
            className="px-3.5 py-2 bg-corporate-emerald hover:bg-corporate-emerald-hover disabled:opacity-40 text-white text-[11px] font-mono font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap">
            <Download className="w-3.5 h-3.5" aria-hidden="true" /> Export
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
          className="flex flex-wrap items-center gap-2 rounded-2xl border border-corporate-emerald/40 bg-corporate-emerald/[0.07] px-4 py-2.5">
          <span className="text-xs font-mono font-bold text-corporate-emerald tabular-nums">{selected.size} selected</span>
          <select aria-label="Bulk set status" defaultValue="" onChange={e => { if (e.target.value) bulkSetStatus(e.target.value as LeadStatus); e.target.value = ''; }} className={selectCls}>
            <option value="" disabled>Set status…</option>
            {LEAD_STATUSES.map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
          </select>
          <button type="button" onClick={() => exportRecordsCSV(selectedRecords, metaMap, 'JAS_Selected')} className="px-3 py-2 bg-navy-900 border border-navy-600 text-slate-200 text-[11px] font-mono font-bold rounded-xl hover:bg-navy-800 cursor-pointer">Export selected</button>
          <button type="button" onClick={() => setSelected(new Set())} className="ml-auto inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /> Clear</button>
        </motion.div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-navy-600 bg-navy-800/50">
          <EmptyState icon={SearchX} title={records.length === 0 ? `No ${title.toLowerCase()} yet` : 'No matching records'}
            body={records.length === 0 ? 'Records will appear here as soon as submissions arrive. Use Demo mode in the sidebar to explore the workspace meanwhile.' : 'Try a different search or clear the active filters.'}
            action={hasFilters ? <button type="button" onClick={clearAll} className="px-4 py-2 bg-navy-900 border border-navy-600 text-slate-200 text-xs font-mono font-bold rounded-xl hover:bg-navy-800 cursor-pointer">Clear all filters</button> : undefined} />
        </div>
      ) : (
        <div className="rounded-2xl border border-navy-600 bg-navy-800/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b border-navy-600 bg-navy-900/60 text-left">
                  <th className="px-4 py-3 w-10"><input type="checkbox" checked={allPageSelected} onChange={toggleSelectPage} aria-label="Select page" className="accent-emerald-500 w-4 h-4 cursor-pointer" /></th>
                  <th className="px-2 py-3"><button type="button" onClick={() => toggleSort('name')} className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-white cursor-pointer">Client <ArrowUpDown className="w-3 h-3" /></button></th>
                  <th className="px-2 py-3 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Contact</th>
                  <th className="px-2 py-3 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Service</th>
                  <th className="px-2 py-3 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-2 py-3 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Priority</th>
                  <th className="px-2 py-3"><button type="button" onClick={() => toggleSort('followUp')} className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-white cursor-pointer">Follow-up <ArrowUpDown className="w-3 h-3" /></button></th>
                  <th className="px-2 py-3"><button type="button" onClick={() => toggleSort('createdAt')} className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-white cursor-pointer">Added <ArrowUpDown className="w-3 h-3" /></button></th>
                  <th className="px-4 py-3 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map(({ record, meta }, idx) => (
                  <motion.tr key={record.key}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: EASE_OUT_EXPO, delay: Math.min(idx * 0.03, 0.24) }}
                    onClick={() => onOpenRecord(record)}
                    className="border-b border-navy-600/50 last:border-0 hover:bg-navy-900/60 cursor-pointer transition-colors">
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.has(record.key)} onChange={() => toggleSelect(record.key)} aria-label={`Select ${record.name}`} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={record.name} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-white truncate max-w-[220px]">{record.company !== '—' ? record.company : record.name}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[220px]">{record.company !== '—' ? record.name : <SourceBadge source={record.source} />}</p>
                        </div>
                        {record.company !== '—' && <SourceBadge source={record.source} />}
                        {record.isDemo && <span className="text-[9px] font-mono font-bold text-fuchsia-300 bg-fuchsia-400/10 border border-fuchsia-400/30 px-1.5 py-0.5 rounded">DEMO</span>}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <p className="text-[12px] text-slate-200 truncate max-w-[190px]">{record.email || '—'}</p>
                      <p className="text-[11px] font-mono text-slate-500 tabular-nums">{record.phone || '—'}</p>
                    </td>
                    <td className="px-2 py-3"><span className="text-[12px] text-slate-300 line-clamp-2 max-w-[200px] block leading-snug">{record.service}</span></td>
                    <td className="px-2 py-3" onClick={e => e.stopPropagation()}>
                      <select aria-label={`Status for ${record.name}`} value={meta.status}
                        onChange={e => onUpdateMeta(record.key, { status: e.target.value as LeadStatus })}
                        className={`text-[11px] font-mono font-bold rounded-lg border px-2 py-1.5 cursor-pointer bg-navy-900 focus:outline-none focus:border-corporate-emerald ${STATUS_META[meta.status].chip}`}>
                        {LEAD_STATUSES.map(s => <option key={s} value={s} className="bg-navy-900 text-slate-200">{STATUS_META[s].label}</option>)}
                      </select>
                    </td>
                    <td className="px-2 py-3"><PriorityBadge priority={meta.priority} /></td>
                    <td className="px-2 py-3"><FollowUpChip meta={meta} /></td>
                    <td className="px-2 py-3 text-[11px] font-mono text-slate-400 tabular-nums whitespace-nowrap">{relativeTime(record.createdAt)}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <a href={whatsappLink(record)} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${record.name}`} className="p-2 rounded-lg text-slate-400 hover:text-corporate-emerald hover:bg-corporate-emerald/10 transition-colors"><MessageSquare className="w-4 h-4" /></a>
                        {record.email && <a href={`mailto:${record.email}`} aria-label={`Email ${record.name}`} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"><Mail className="w-4 h-4" /></a>}
                        {record.phone && <a href={`tel:${record.phone}`} aria-label={`Call ${record.name}`} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"><Phone className="w-4 h-4" /></a>}
                        <button type="button" onClick={() => onOpenRecord(record)} aria-label={`Open ${record.name}`} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"><Eye className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-600 bg-navy-900/50 px-4 py-3">
            <span className="text-[11px] font-mono text-slate-400 tabular-nums" aria-live="polite">
              Showing {filtered.length === 0 ? 0 : safePage * pageSize + 1}–{Math.min(filtered.length, safePage * pageSize + pageSize)} of {filtered.length}
            </span>
            <div className="flex items-center gap-2">
              <select aria-label="Rows per page" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(0); }} className={selectCls}>
                {[10, 25, 50].map(n => <option key={n} value={n}>{n} / page</option>)}
              </select>
              <button type="button" disabled={safePage === 0} onClick={() => setPage(safePage - 1)} aria-label="Previous page" className="p-2 rounded-lg border border-navy-600 text-slate-300 disabled:opacity-40 hover:bg-navy-800 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums">{safePage + 1} / {pageCount}</span>
              <button type="button" disabled={safePage >= pageCount - 1} onClick={() => setPage(safePage + 1)} aria-label="Next page" className="p-2 rounded-lg border border-navy-600 text-slate-300 disabled:opacity-40 hover:bg-navy-800 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
