import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Building2,
  MapPin,
  Lock,
  Sparkles,
  FileCheck,
  Zap
} from 'lucide-react';

interface HeroSectionProps {
  onOpenBookingModal: (service?: string) => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBookingModal,
  onExploreServices
}) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-white border-b border-slate-100">
      
      {/* Background Subtle Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-slate-100/80 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2-Column Responsive Layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Subheadline, Buttons & Trust Strip */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            
            <div className="space-y-6">
              {/* Optional subtle status note */}
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/20">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>GST &amp; Tax Consultant · Lead Partner Rishi Jha</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0B1F3A] leading-[1.15] tracking-tight font-display [text-wrap:balance]">
                Corporate Accounting, GST &amp; Virtual CFO for India&apos;s Growing Businesses
              </h1>

              {/* One-line Subheading */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-2xl">
                Delivering 10+ years of audit-grade precision and multi-state compliance for scale-ups and established enterprises.
              </p>
            </div>

            {/* Two Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <button
                onClick={() => onOpenBookingModal()}
                className="px-6 py-3.5 text-sm font-bold text-white bg-[#10B981] hover:bg-[#059669] active:scale-98 transition-all rounded-xl shadow-soft hover:shadow-soft-md flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Book Free Consultation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreServices}
                className="px-6 py-3.5 text-sm font-semibold text-[#0B1F3A] bg-white hover:bg-[#F5F7FA] active:scale-98 border border-slate-200 transition-all rounded-xl flex items-center justify-center gap-2 shadow-soft-sm hover:border-slate-300 cursor-pointer"
              >
                <span>View Services</span>
              </button>
            </div>

            {/* Small Trust Strip Below with 4 Office Cities */}
            <div className="pt-6 border-t border-slate-100 space-y-2.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Pan-India Physical &amp; Multi-State Compliance Hubs
              </span>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs sm:text-sm font-semibold text-[#0B1F3A]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>New Delhi</span>
                </div>
                <span className="text-slate-300 hidden sm:inline" aria-hidden="true">•</span>

                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>Gurugram</span>
                </div>
                <span className="text-slate-300 hidden sm:inline" aria-hidden="true">•</span>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>Mumbai</span>
                </div>
                <span className="text-slate-300 hidden sm:inline" aria-hidden="true">•</span>

                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>Bengaluru</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Abstract Dashboard Illustration (CSS & SVG only, no external images) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-lg bg-[#0B1F3A] rounded-2xl p-5 sm:p-6 shadow-soft-lg border border-[#162D4F] relative text-white space-y-5 overflow-hidden">
              
              {/* Subtle Ambient Grid Background (SVG) */}
              <div className="absolute inset-0 pointer-events-none opacity-15">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="gridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#gridPattern)" />
                </svg>
              </div>

              {/* Dashboard Top Header Bar with Window Controls & Status */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#162D4F] relative z-10">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  </div>
                  <span className="ml-2 text-xs font-mono font-medium text-slate-300">
                    Live Statutory Console
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-md border border-[#10B981]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                  <span>Audit-Ready · 100% Compliant</span>
                </div>
              </div>

              {/* Key Metric Tiles (2 Cards) */}
              <div className="grid grid-cols-2 gap-3 relative z-10">
                
                {/* Metric 1: Monthly ITC Reconciled */}
                <div className="bg-[#102A4E] rounded-xl p-3 border border-[#1E3B66] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    ITC Reconciled (2B)
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                      ₹48.6L
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#10B981] flex items-center">
                      +99.8%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#10B981] h-full w-[99.8%] rounded-full" />
                  </div>
                </div>

                {/* Metric 2: Multi-State Filings SLA */}
                <div className="bg-[#102A4E] rounded-xl p-3 border border-[#1E3B66] space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    On-Time GST SLA
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                      100%
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#10B981]">
                      0 Penalties
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#10B981] h-full w-full rounded-full" />
                  </div>
                </div>

              </div>

              {/* Abstract Vector Financial Curve (Pure SVG) */}
              <div className="bg-[#102A4E] rounded-xl p-3.5 border border-[#1E3B66] relative z-10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    Reconciled Revenue Growth &amp; Cash Runway
                  </span>
                  <span className="text-[10px] font-mono text-[#10B981]">
                    +24.8% FY24
                  </span>
                </div>

                {/* SVG Area Chart */}
                <div className="h-28 w-full relative">
                  <svg
                    viewBox="0 0 360 110"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                        <stop offset="80%" stopColor="#10B981" stopOpacity="0.02" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Subtle Horizontal Grid Guidelines */}
                    <line x1="0" y1="20" x2="360" y2="20" stroke="#1E3B66" strokeDasharray="3 3" strokeWidth="0.8" />
                    <line x1="0" y1="55" x2="360" y2="55" stroke="#1E3B66" strokeDasharray="3 3" strokeWidth="0.8" />
                    <line x1="0" y1="90" x2="360" y2="90" stroke="#1E3B66" strokeDasharray="3 3" strokeWidth="0.8" />

                    {/* Area fill */}
                    <path
                      d="M 0,85 Q 40,80 80,68 T 160,52 T 240,38 T 300,22 T 360,10 L 360,110 L 0,110 Z"
                      fill="url(#chartGradient)"
                    />

                    {/* Glowing Stroke Curve */}
                    <path
                      d="M 0,85 Q 40,80 80,68 T 160,52 T 240,38 T 300,22 T 360,10"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Milestone Highlight Nodes */}
                    <circle cx="80" cy="68" r="3" fill="#0B1F3A" stroke="#10B981" strokeWidth="2" />
                    <circle cx="160" cy="52" r="3" fill="#0B1F3A" stroke="#10B981" strokeWidth="2" />
                    <circle cx="240" cy="38" r="3" fill="#0B1F3A" stroke="#10B981" strokeWidth="2" />
                    <circle cx="360" cy="10" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                  </svg>
                </div>

                {/* Timeline axis */}
                <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                  <span>Q1 (Apr)</span>
                  <span>Q2 (Jul)</span>
                  <span>Q3 (Oct)</span>
                  <span>Q4 (Jan)</span>
                  <span className="text-[#10B981] font-bold">Annual Closing (Mar)</span>
                </div>
              </div>

              {/* Statutory Compliance Checklist Pipeline */}
              <div className="space-y-1.5 relative z-10">
                <div className="flex items-center justify-between text-[11px] bg-[#102A4E]/60 px-3 py-1.5 rounded-lg border border-[#1E3B66]/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-slate-300 font-medium">GSTR-1 &amp; GSTR-3B Multi-State</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#10B981]">
                    Filed On-Time
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] bg-[#102A4E]/60 px-3 py-1.5 rounded-lg border border-[#1E3B66]/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-slate-300 font-medium">Corporate Advance Tax &amp; TDS 26Q</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#10B981]">
                    Reconciled
                  </span>
                </div>
              </div>

              {/* Consultant Authority Footer Badge */}
              <div className="pt-2 border-t border-[#162D4F] flex items-center justify-between text-[11px] text-slate-300 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Lead Consultant Rishi Jha</span>
                    <span className="text-[10px] text-slate-400 block font-mono">GST &amp; Tax Consultant</span>
                  </div>
                </div>

                <div className="text-right font-mono text-[10px] text-[#10B981]">
                  <span>24-Hour Lead SLA</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
