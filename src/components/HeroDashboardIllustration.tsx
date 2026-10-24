import React from 'react';
import { ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';

export const HeroDashboardIllustration: React.FC = () => {
  return (
    <div className="relative">
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#10B981]/30 to-[#0B1F3A]/20 rounded-3xl blur-xl opacity-70 pointer-events-none" />

      {/* Main Console Window */}
      <div className="relative bg-[#0B1F3A] rounded-2xl p-5 sm:p-6 shadow-soft-lg border border-[#162D4F] text-white space-y-5">
        
        {/* Window Bar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#162D4F]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-300 ml-2">
              JAS Statutory Desk
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-md border border-[#10B981]/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>4 Approved Services</span>
            </span>
          </div>
        </div>

        {/* Dual Metric Tiles */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#102A4E] rounded-xl p-3.5 border border-[#1E3B66] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>GSTR-2B ITC Match</span>
              <span className="text-[#10B981] font-bold">Reconciled</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-white font-mono">
              Purchase Register Sync
            </div>
            <span className="text-[10px] text-slate-400 block font-sans">
              Monthly Credit Verification
            </span>
          </div>

          <div className="bg-[#102A4E] rounded-xl p-3.5 border border-[#1E3B66] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Section 139 ITR</span>
              <span className="text-[#10B981] font-bold">Computed</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#10B981] font-mono">
              Advance Tax Ready
            </div>
            <span className="text-[10px] text-slate-400 block font-sans">
              Quarterly Tax Liability Sched.
            </span>
          </div>
        </div>

        {/* Live Statutory Filing Pipeline Status */}
        <div className="bg-[#102A4E] rounded-xl p-4 border border-[#1E3B66] space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
            <span>Approved Service Deliverable</span>
            <span>Applicability</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1E3B66]/60">
              <span className="flex items-center gap-1.5 text-slate-200">
                <FileCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>GSTR-1 &amp; GSTR-3B Filing</span>
              </span>
              <span className="font-mono text-[#10B981] font-bold text-[11px]">
                Monthly / Quarterly
              </span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-[#1E3B66]/60">
              <span className="flex items-center gap-1.5 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>TDS Returns (24Q, 26Q, 27Q, 27EQ)</span>
              </span>
              <span className="font-mono text-slate-300 font-bold text-[11px]">
                Chapter XVII-B
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Balance Sheet &amp; P&amp;L Finalisation</span>
              </span>
              <span className="font-mono text-slate-300 font-bold text-[11px]">
                Periodic Review
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
