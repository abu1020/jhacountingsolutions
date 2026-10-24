import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, Download, Database, SearchX } from 'lucide-react';
import { TableRowSkeleton } from './SkeletonLoader';
import {
  ScopeAssessment,
  assessmentEntityType,
  assessmentTurnover,
  createdAtTime,
  formatCreatedAt
} from '../types/admin';
import { EASE_OUT_EXPO } from '../lib/motion';

interface AdminAssessmentsTabProps {
  assessments: ScopeAssessment[];
  isLoading: boolean;
  searchQuery: string;
  /** Receives the FILTERED rows so export matches what the admin sees. */
  onExport: (rows: ScopeAssessment[]) => void;
  /** Lets the empty state offer one-click recovery from a dead-end filter. */
  onClearSearch?: () => void;
}

export const AdminAssessmentsTab: React.FC<AdminAssessmentsTabProps> = ({
  assessments,
  isLoading,
  searchQuery,
  onExport,
  onClearSearch
}) => {
  // Memoised + sorted newest-first (previously: un-memoised .filter() on
  // every keystroke render, in whatever order Firestore returned).
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const rows = q
      ? assessments.filter(item =>
          [item.contactName, item.companyName, item.contactEmail, item.contactPhone, item.selectedService]
            .some(field => (field || '').toLowerCase().includes(q))
        )
      : assessments;
    return [...rows].sort((a, b) => createdAtTime(b.createdAt) - createdAtTime(a.createdAt));
  }, [assessments, searchQuery]);

  const hasActiveFilter = searchQuery.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#162D4F]">
        <span className="text-xs font-mono font-bold text-slate-300" aria-live="polite">
          Showing {filtered.length} Detailed Scope Submissions
          {hasActiveFilter && assessments.length > 0 ? ` of ${assessments.length}` : ''}
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
              ? `No scope submissions match "${searchQuery}".`
              : 'No scope assessment records found.'}
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
                    {item.companyName || item.contactName || 'Corporate Client'}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                    {assessmentEntityType(item)}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#10B981]" aria-hidden="true" />
                  <time dateTime={item.createdAt}>{formatCreatedAt(item.createdAt)}</time>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-300 pt-1">
                <a
                  href={`mailto:${item.contactEmail}`}
                  className="flex items-center gap-1.5 truncate hover:text-[#10B981] transition-colors"
                  aria-label={`Email ${item.contactEmail}`}
                >
                  <Mail className="w-3.5 h-3.5 text-[#10B981] shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.contactEmail}</span>
                </a>
                <a
                  href={`tel:${item.contactPhone}`}
                  className="flex items-center gap-1.5 hover:text-[#10B981] transition-colors"
                  aria-label={`Call ${item.contactPhone}`}
                >
                  <Phone className="w-3.5 h-3.5 text-[#10B981] shrink-0" aria-hidden="true" />
                  <span className="tabular-nums">{item.contactPhone}</span>
                </a>
                <div className="text-[#10B981] font-semibold truncate tabular-nums">
                  Turnover: {assessmentTurnover(item)}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-[#0B1F3A] p-2 rounded-lg border border-[#162D4F]">
                <span className="flex items-center gap-1 truncate">
                  <Database className="w-3 h-3 text-[#10B981] shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {item.gstStateCount
                      ? `GST Registrations: ${item.gstStateCount} State(s)`
                      : `Service: ${item.selectedService || 'General'}`}
                  </span>
                </span>
                <span className="shrink-0">
                  {item.employeeCount
                    ? `Employees: ${item.employeeCount}`
                    : item.preferredCity || item.contactName || ''}
                </span>
              </div>

              {item.notes && (
                <p className="text-xs text-slate-300 bg-[#0B1F3A] p-2.5 rounded-lg border border-[#162D4F] leading-relaxed font-sans">
                  &ldquo;{item.notes}&rdquo;
                </p>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};
