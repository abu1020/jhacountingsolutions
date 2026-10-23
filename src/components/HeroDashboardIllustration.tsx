import React from 'react';
import { ShieldCheck, FileCheck, Zap } from 'lucide-react';

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
              <span>Audit-Ready · 100% Compliant</span>
            </span>
          </div>
        </div>

        {/* Dual Metric Tiles */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#102A4E] rounded-xl p-3.5 border border-[#1E3B66] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>ITC Reconciled (2B)</span>
              <span className="text-[#10B981] font-bold">+99.8%</span>
            </div>
            <div className="text-lg font-extrabold text-white font-mono">
              ₹48.6 Lakhs
            </div>
            <span className="text-[10px] text-slate-400 block font-sans">
              Zero Tax Credit Mismatch
            </span>
          </div>

          <div className="bg-[#102A4E] rounded-xl p-3.5 border border-[#1E3B66] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>On-Time GST SLA</span>
              <span className="text-[#10B981] font-bold">100%</span>
            </div>
            <div className="text-lg font-extrabold text-[#10B981] font-mono">
              0 Penalties
            </div>
            <span className="text-[10px] text-slate-400 block font-sans">
              Pan-India 28 States Active
            </span>
          </div>
        </div>

        {/* Vector SVG Growth Curve Chart */}
        <div className="bg-[#102A4E] rounded-xl p-4 border border-[#1E3B66] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span>Corporate Tax Runway Trajectory</span>
            <span className="text-[#10B981] font-bold">FY 2025-26</span>
          </div>

          <div className="h-28 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 90">
              <defs>
                <linearGradient id="heroChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#1E3B66" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#1E3B66" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="#1E3B66" />

              {/* Area Path */}
              <path
                d="M 0,75 Q 75,60 150,35 T 300,10 L 300,80 L 0,80 Z"
                fill="url(#heroChartGradient)"
              />

              {/* Line Curve */}
              <path
                d="M 0,75 Q 75,60 150,35 T 300,10"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Live Statutory Filing Pipeline Status */}
        <div className="bg-[#102A4E] rounded-xl p-3 border border-[#1E3B66] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
            <span>Filing Status</span>
            <span>Target Deadline</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-200">
                <FileCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>GSTR-1 &amp; GSTR-3B</span>
              </span>
              <span className="font-mono text-[#10B981] font-bold text-[11px]">
                Filed &amp; Verified
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-200">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Advance Tax &amp; TDS 26Q</span>
              </span>
              <span className="font-mono text-slate-300 font-bold text-[11px]">
                Schedule Active
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
