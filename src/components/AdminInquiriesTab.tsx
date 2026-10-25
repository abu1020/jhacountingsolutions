/**
 * @deprecated Superseded by the Client Management System
 * (src/components/admin/AdminWorkspace.tsx → RecordsTable).
 * Kept for reference; no longer imported by AdminPortalModal.
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, Download, SearchX } from 'lucide-react';
import { TableRowSkeleton } from './SkeletonLoader';
import { LeadInquiry, createdAtTime, formatCreatedAt } from '../types/admin';
import { EASE_OUT_EXPO } from '../lib/motion';

interface AdminInquiriesTabProps {
  inquiries: LeadInquiry[];
  isLoading: boolean;
  searchQuery: string;
  /** Receives the FILTERED rows so export matches what the admin sees. */
  onExport: (rows: LeadInquiry[]) => void;
  onClearSearch?: () => void;
}

export const AdminInquiriesTab: React.FC<AdminInquiriesTabProps> = ({
  inquiries,
  isLoading,
  searchQuery,
  onExport,
  onClearSearch
}) => {
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const rows = q
      ? inquiries.filter(item =>
          [item.fullName, item.company, item.email, item.phone, item.service]
            .some(field => (field || '').toLowerCase().includes(q))
        )
      : inquiries;
    return [...rows].sort((a, b) => createdAtTime(b.createdAt) - createdAtTime(a.createdAt));
  }, [inquiries, searchQuery]);

  const hasActiveFilter = searchQuery.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#162D4F]">
        <span className="text-xs font-mono font-bold text-slate-300" aria-live="polite">
          Showing {filtered.length} Consultation Submissions
          {hasActiveFilter && inquiries.length > 0 ? ` of ${inquiries.length}` : ''}
        </span>
        <button
          type="button"
          onClick={() => onExport(filtered)}
          disabled={filtered.length === 0}
          className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Export CSV{hasActiveFilter ? ' (filtered)' : ''}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2" aria-busy="true">
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <SearchX className="w-8 h-8 text-slate-500 mx-auto" aria-hidden="true" />
          <p className="text-slate-400 font-mono text-xs">
            {hasActiveFilter
              ? `No lead inquiries match "${searchQuery}".`
              : 'No matching lead inquiries found.'}
          </p>
          {hasActiveFilter && onClearSearch && (
            <button
              type="button"
              onClick={onClearSearch}
              className="px-4 py-2 bg-[#132D52] hover:bg-[#1A3A6B] text-slate-200 text-xs font-mono font-bold border border-[#162D4F] rounded-xl transition-colors cursor-pointer"
            >
              Clear filter &amp; show all
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-3 max-h-[420px] overflow-y-auto overscroll-contain pr-1 list-none">
          {filtered.map((item, idx) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT_EXPO, delay: Math.min(idx * 0.04, 0.32) }}
              className="bg-[#102A4E] rounded-xl p-4 border border-[#1E3B66] space-y-2 hover:border-[#10B981]/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white font-display">
                    {item.fullName || 'Anonymous Client'}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                    {item.company || 'Enterprise'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#10B981]" aria-hidden="true" />
                  <time dateTime={item.createdAt}>{formatCreatedAt(item.createdAt)}</time>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-300 pt-1">
                <a
                  href={`mailto:${item.email}`}
                  className="flex items-center gap-1.5 truncate hover:text-[#10B981] transition-colors"
                  aria-label={`Email ${item.email}`}
                >
                  <Mail className="w-3.5 h-3.5 text-[#10B981] shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.email}</span>
                </a>
                <a
                  href={`tel:${item.phone}`}
                  className="flex items-center gap-1.5 hover:text-[#10B981] transition-colors"
                  aria-label={`Call ${item.phone}`}
                >
                  <Phone className="w-3.5 h-3.5 text-[#10B981] shrink-0" aria-hidden="true" />
                  <span className="tabular-nums">{item.phone}</span>
                </a>
                <div className="text-[#10B981] font-semibold truncate">
                  Service: {item.service || 'General'}
                </div>
              </div>

              {item.message && (
                <p className="text-xs text-slate-300 bg-[#0B1F3A] p-2.5 rounded-lg border border-[#162D4F] leading-relaxed font-sans mt-2">
                  &ldquo;{item.message}&rdquo;
                </p>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};
