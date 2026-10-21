import React from 'react';
import { Building, FileCheck, Scale, ArrowRight } from 'lucide-react';
import { StateGstProfile } from '../data/stateGstData';

interface GstStateDetailCardProps {
  state: StateGstProfile;
  onOpenBookingModal: (service?: string) => void;
  titlePrefix?: string;
}

export const GstStateDetailCard: React.FC<GstStateDetailCardProps> = ({
  state,
  onOpenBookingModal,
  titlePrefix = ''
}) => {
  return (
    <div className="bg-[#0B1F3A] rounded-2xl p-6 sm:p-8 text-white border border-[#162D4F] shadow-soft-lg space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#162D4F] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded border border-[#10B981]/30">
              State Code: {state.code}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Region: {state.region}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display mt-1">
            {titlePrefix}{state.name} GST Compliance Profile
          </h3>
        </div>

        <span className="text-xs font-mono font-bold text-slate-300 bg-[#102A4E] px-3 py-1 rounded-lg border border-[#1E3B66] self-start sm:self-auto">
          Hub: {state.deliveryHub}
        </span>
      </div>

      {/* Primary Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#102A4E] rounded-xl p-4 border border-[#1E3B66] space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase">
            <Building className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Intra-State e-Way Bill</span>
          </div>
          <p className="text-sm font-bold text-white font-display">
            Limit: {state.ewayBillThresholdIntraState}
          </p>
          <span className="text-[11px] text-slate-400 block font-sans line-clamp-1">
            {state.ewayBillExemptions}
          </span>
        </div>

        <div className="bg-[#102A4E] rounded-xl p-4 border border-[#1E3B66] space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase">
            <FileCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Professional Tax (PT)</span>
          </div>
          <p className="text-sm font-bold text-white font-mono">
            Deadline: {state.ptReturnDeadline}
          </p>
          <span className="text-[11px] text-[#10B981] block font-semibold font-sans line-clamp-1">
            {state.professionalTaxRules}
          </span>
        </div>
      </div>

      {/* Sector Rules & Audit Directives */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Scale className="w-4 h-4" />
          <span>Key Compliance Nuances</span>
        </h4>

        <div className="bg-[#102A4E] rounded-xl p-4 border border-[#1E3B66] space-y-2">
          <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
            {state.keyComplianceNuances.map((nuance, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#10B981] font-bold font-mono">•</span>
                <span>{nuance}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-[#1E3B66] text-[11px] font-mono text-slate-400">
            Jurisdiction: {state.localTaxOffice}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          onClick={() => onOpenBookingModal(`${state.name} GST Compliance Desk`)}
          className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] rounded-xl transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Retain {state.name} GST Desk</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
