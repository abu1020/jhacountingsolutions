import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X, Mail, Phone, MessageSquare, CalendarPlus, Tag, StickyNote,
  Check, Building2, MapPin, Clock, User
} from 'lucide-react';
import {
  UnifiedRecord, CrmMeta, LeadStatus, LEAD_STATUSES, STATUS_META,
  Priority, PRIORITIES
} from '../../types/admin';
import { whatsappLink, formatDateIN, relativeTime } from '../../lib/crm';
import { Avatar, StatusPill, SourceBadge, inputCls, selectCls, labelCls } from './adminUi';
import { EASE_OUT_EXPO, DURATION } from '../../lib/motion';

interface ClientDetailDrawerProps {
  record: UnifiedRecord;
  meta: CrmMeta;
  authorName: string;
  onClose: () => void;
  onUpdateMeta: (key: string, patch: Partial<CrmMeta>) => void;
  onReviewAccess?: (record: UnifiedRecord, decision: 'approved' | 'rejected') => void;
}

export const ClientDetailDrawer: React.FC<ClientDetailDrawerProps> = ({
  record, meta, authorName, onClose, onUpdateMeta, onReviewAccess
}) => {
  const [tagInput, setTagInput] = useState('');
  const [noteInput, setNoteInput] = useState('');

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || meta.tags.includes(tag)) { setTagInput(''); return; }
    onUpdateMeta(record.key, { tags: [...meta.tags, tag] });
    setTagInput('');
  };

  const addNote = () => {
    const text = noteInput.trim();
    if (!text) return;
    onUpdateMeta(record.key, {
      notes: [
        { id: `note-${Date.now()}`, text, author: authorName, createdAt: new Date().toISOString() },
        ...meta.notes
      ],
      lastContactedAt: new Date().toISOString()
    });
    setNoteInput('');
  };

  const isPendingAccess = record.source === 'access' && (record.requestStatus || 'pending') === 'pending';

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={`Client details: ${record.name}`}>
      <motion.button
        type="button"
        aria-label="Close details"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm cursor-pointer"
      />
      <motion.aside
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ duration: DURATION.panel, ease: EASE_OUT_EXPO }}
        className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-navy-850 border-l border-navy-600 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <header className="p-5 border-b border-navy-600 bg-navy-800/60">
          <div className="flex items-start gap-3.5">
            <Avatar name={record.name} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-extrabold text-white font-display leading-tight truncate">
                {record.company !== '—' ? record.company : record.name}
              </h3>
              <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                <User className="w-3 h-3 shrink-0" aria-hidden="true" /> {record.name}
                {record.city && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" aria-hidden="true" />{record.city}</span>}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <SourceBadge source={record.source} />
                <StatusPill status={meta.status} />
                {record.isDemo && <span className="text-[9px] font-mono font-bold text-fuchsia-300 bg-fuchsia-400/10 border border-fuchsia-400/30 px-1.5 py-0.5 rounded">DEMO DATA</span>}
                <span className="text-[10px] font-mono text-slate-500 inline-flex items-center gap-1"><Clock className="w-3 h-3" aria-hidden="true" /> Added {relativeTime(record.createdAt)}</span>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" autoFocus className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <a href={whatsappLink(record)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 py-2.5 bg-corporate-emerald hover:bg-corporate-emerald-hover text-white text-[11px] font-mono font-bold rounded-xl transition-colors">
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" /> WhatsApp
            </a>
            <a href={record.email ? `mailto:${record.email}` : undefined} aria-disabled={!record.email} className={`flex items-center justify-center gap-1.5 py-2.5 bg-navy-900 border border-navy-600 text-slate-200 text-[11px] font-mono font-bold rounded-xl transition-colors ${record.email ? 'hover:bg-navy-800' : 'opacity-40 pointer-events-none'}`}>
              <Mail className="w-3.5 h-3.5" aria-hidden="true" /> Email
            </a>
            <a href={record.phone ? `tel:${record.phone}` : undefined} aria-disabled={!record.phone} className={`flex items-center justify-center gap-1.5 py-2.5 bg-navy-900 border border-navy-600 text-slate-200 text-[11px] font-mono font-bold rounded-xl transition-colors ${record.phone ? 'hover:bg-navy-800' : 'opacity-40 pointer-events-none'}`}>
              <Phone className="w-3.5 h-3.5" aria-hidden="true" /> Call
            </a>
          </div>

          {isPendingAccess && onReviewAccess && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button type="button" onClick={() => onReviewAccess(record, 'approved')} className="py-2.5 bg-corporate-emerald hover:bg-corporate-emerald-hover text-white text-[11px] font-mono font-bold rounded-xl cursor-pointer">Approve Unlock</button>
              <button type="button" onClick={() => onReviewAccess(record, 'rejected')} className="py-2.5 bg-navy-900 border border-rose-400/40 text-rose-400 text-[11px] font-mono font-bold rounded-xl hover:bg-rose-400/10 cursor-pointer">Reject Request</button>
            </div>
          )}
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-6">
          {/* Manage */}
          <section aria-label="Manage record">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-corporate-emerald mb-3">Manage</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="drawer-status" className={labelCls}>Pipeline Status</label>
                <select id="drawer-status" value={meta.status} onChange={e => onUpdateMeta(record.key, { status: e.target.value as LeadStatus })} className={`${selectCls} w-full py-2.5 ${STATUS_META[meta.status].chip}`}>
                  {LEAD_STATUSES.map(s => <option key={s} value={s} className="bg-navy-900 text-slate-200">{STATUS_META[s].label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="drawer-priority" className={labelCls}>Priority</label>
                <select id="drawer-priority" value={meta.priority} onChange={e => onUpdateMeta(record.key, { priority: e.target.value as Priority })} className={`${selectCls} w-full py-2.5`}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="drawer-followup" className={labelCls}>Follow-up Date</label>
                <input id="drawer-followup" type="date" value={meta.followUpDate || ''} onChange={e => onUpdateMeta(record.key, { followUpDate: e.target.value })} className={`${inputCls} [color-scheme:dark]`} />
              </div>
              <div>
                <label htmlFor="drawer-owner" className={labelCls}>Owner</label>
                <input id="drawer-owner" type="text" value={meta.owner || ''} placeholder="Rishi Jha"
                  onChange={e => onUpdateMeta(record.key, { owner: e.target.value })} className={inputCls} />
              </div>
            </div>
            <button type="button"
              onClick={() => onUpdateMeta(record.key, { lastContactedAt: new Date().toISOString(), status: meta.status === 'new' ? 'contacted' : meta.status })}
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-corporate-emerald hover:underline cursor-pointer">
              <CalendarPlus className="w-3.5 h-3.5" aria-hidden="true" />
              {meta.lastContactedAt ? `Last contacted ${relativeTime(meta.lastContactedAt)} — log again` : 'Log contact now'}
            </button>
          </section>

          {/* Tags */}
          <section aria-label="Tags">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-corporate-emerald mb-3 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" aria-hidden="true" /> Tags</h4>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {meta.tags.length === 0 && <span className="text-[11px] font-mono text-slate-600">No tags yet</span>}
              {meta.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-200 bg-navy-800 border border-navy-600 px-2.5 py-1 rounded-lg">
                  {tag}
                  <button type="button" aria-label={`Remove tag ${tag}`} onClick={() => onUpdateMeta(record.key, { tags: meta.tags.filter(t => t !== tag) })} className="text-slate-500 hover:text-rose-400 cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Add tag & press Enter (e.g. GST, Notice)" className={inputCls} aria-label="Add a tag" />
              <button type="button" onClick={addTag} className="px-3.5 bg-navy-800 border border-navy-600 text-slate-200 rounded-xl text-xs font-mono font-bold hover:bg-navy-700 cursor-pointer shrink-0">Add</button>
            </div>
          </section>

          {/* Facts */}
          <section aria-label="Record details">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-corporate-emerald mb-3 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" aria-hidden="true" /> Details</h4>
            <dl className="rounded-2xl bg-navy-800/70 border border-navy-600 divide-y divide-navy-600/60">
              {[
                { label: 'Service', value: record.service },
                { label: 'Email', value: record.email || '—' },
                { label: 'Phone', value: record.phone || '—' },
                { label: 'Company', value: record.company },
                ...(record.city ? [{ label: 'City', value: record.city }] : []),
                ...record.details,
                { label: 'Record ID', value: record.id },
                { label: 'Created', value: formatDateIN(record.createdAt) }
              ].map(fact => (
                <div key={fact.label} className="flex items-start justify-between gap-4 px-4 py-2.5">
                  <dt className="text-[11px] font-mono text-slate-500 uppercase shrink-0 pt-0.5">{fact.label}</dt>
                  <dd className="text-[13px] text-slate-100 text-right font-medium break-words min-w-0">{fact.value}</dd>
                </div>
              ))}
            </dl>
            {record.message && (
              <blockquote className="mt-3 rounded-2xl bg-navy-800/70 border border-navy-600 p-4 text-sm text-slate-200 leading-relaxed">
                <span className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1.5">Client Message</span>
                “{record.message}”
              </blockquote>
            )}
          </section>

          {/* Notes */}
          <section aria-label="Notes">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-corporate-emerald mb-3 flex items-center gap-1.5"><StickyNote className="w-3.5 h-3.5" aria-hidden="true" /> Notes & Activity</h4>
            <div className="space-y-2">
              <textarea value={noteInput} onChange={e => setNoteInput(e.target.value)} rows={3}
                placeholder="Log a call, quote sent, documents received…" className={`${inputCls} resize-none`} aria-label="Add a note" />
              <button type="button" onClick={addNote} disabled={!noteInput.trim()}
                className="w-full py-2.5 bg-corporate-emerald hover:bg-corporate-emerald-hover disabled:opacity-40 text-white text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" aria-hidden="true" /> Save Note
              </button>
            </div>
            <ul className="mt-4 space-y-3">
              {meta.notes.length === 0 && <li className="text-[11px] font-mono text-slate-600">No notes yet — your activity log starts here.</li>}
              {meta.notes.map(note => (
                <li key={note.id} className="rounded-xl bg-navy-800/70 border border-navy-600 p-3.5">
                  <p className="text-[13px] text-slate-100 leading-relaxed">{note.text}</p>
                  <p className="text-[10px] font-mono text-slate-500 mt-2 tabular-nums">{note.author} · {relativeTime(note.createdAt)}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </motion.aside>
    </div>
  );
};
