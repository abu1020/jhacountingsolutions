import React from 'react';
import { Mail, Phone, Calendar, Download, Database } from 'lucide-react';
import { TableRowSkeleton } from './SkeletonLoader';

interface AdminAssessmentsTabProps {
  assessments: any[];
  isLoading: boolean;
  searchQuery: string;
  onExport: () => void;
}

export const AdminAssessmentsTab: React.FC<AdminAssessmentsTabProps> = ({
  assessments,
  isLoading,
  searchQuery,
  onExport
}) => {
  const filtered = assessments.filter(item =>
    (item.contactName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.contactEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.contactPhone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.selectedService || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#162D4F]">
        <span className="text-xs font-mono font-bold text-slate-300">
          Showing {filtered.length} Detailed Scope Submissions
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
          No scope assessment records found.
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
                    {item.companyName || 'Corporate Client'}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                    {item.businessType || 'Pvt Ltd'}
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
                  <span className="truncate">{item.contactEmail}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>{item.contactPhone}</span>
                </div>
                <div className="text-[#10B981] font-semibold truncate">
                  Turnover: {item.turnoverBand || 'Unspecified'}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-[#0B1F3A] p-2 rounded-lg border border-[#162D4F]">
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3 text-[#10B981]" />
                  <span>GST Registrations: {item.gstStateCount || '1'} State</span>
                </span>
                <span>Employees: {item.employeeCount || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
