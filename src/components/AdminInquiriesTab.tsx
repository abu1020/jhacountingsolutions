import React from 'react';
import { Mail, Phone, Calendar, Download } from 'lucide-react';
import { Skeleton, TableRowSkeleton } from './SkeletonLoader';

interface AdminInquiriesTabProps {
  inquiries: any[];
  isLoading: boolean;
  searchQuery: string;
  onExport: () => void;
}

export const AdminInquiriesTab: React.FC<AdminInquiriesTabProps> = ({
  inquiries,
  isLoading,
  searchQuery,
  onExport
}) => {
  const filtered = inquiries.filter(item =>
    (item.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.service || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#162D4F]">
        <span className="text-xs font-mono font-bold text-slate-300">
          Showing {filtered.length} Consultation Submissions
        </span>
        <button
          onClick={onExport}
          className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-mono text-xs">
          No matching lead inquiries found.
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {filtered.map((item, idx) => (
            <div
              key={item.id || idx}
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
                  <Calendar className="w-3 h-3 text-[#10B981]" />
                  {item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : 'Recent'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-300 pt-1">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span className="truncate">{item.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>{item.phone}</span>
                </div>
                <div className="text-[#10B981] font-semibold truncate">
                  Service: {item.service || 'General'}
                </div>
              </div>

              {item.message && (
                <p className="text-xs text-slate-300 bg-[#0B1F3A] p-2.5 rounded-lg border border-[#162D4F] leading-relaxed font-sans mt-2">
                  &ldquo;{item.message}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
