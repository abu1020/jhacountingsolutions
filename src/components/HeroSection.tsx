import React, { useState } from 'react';
import {
  ArrowRight,
  Shield,
  Calculator,
  TrendingUp,
  CheckCircle,
  Clock,
  Sparkles,
  Building2,
  FileCheck,
  Zap,
  Lock,
  Play
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

interface HeroSectionProps {
  onOpenBookingModal: (service?: string) => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBookingModal,
  onExploreServices
}) => {
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const currentVariant = JHA_ACCOUNTING_DATA.heroVariants[activeVariantIndex];

  // Interactive preview card state
  const [turnoverBand, setTurnoverBand] = useState<'startup' | 'smb' | 'enterprise'>('smb');

  const turnoverDetails = {
    startup: {
      range: "Under ₹2 Cr Annual Turnover",
      recommendedService: "Essential GST Return Filing & Startup Accounting",
      hoursSaved: "25+ Hours/Month",
      sla: "24-Hour Lead Accountant SLA",
      estimatedFee: "₹1,299/mo (₹12,999/yr)"
    },
    smb: {
      range: "₹2 Cr – ₹25 Cr Turnover",
      recommendedService: "Full-Stack Corporate Accounting & TDS Payroll",
      hoursSaved: "50+ Hours/Month",
      sla: "Dedicated Account Manager + WhatsApp Pod",
      estimatedFee: "Scale-Up Standard Tier"
    },
    enterprise: {
      range: "₹25 Cr – ₹150+ Cr Turnover",
      recommendedService: "Virtual CFO Leadership & Multi-State GST Pod",
      hoursSaved: "120+ Hours/Month",
      sla: "CFO-Level Weekly MIS & Board Advisory",
      estimatedFee: "Executive Advisory Tier"
    }
  };

  const currentCalculator = turnoverDetails[turnoverBand];

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-slate-50 border-b border-slate-200/70">
      
      {/* Background Subtle Gradient Field */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Unboxed Metadata & Authority Line (Strict Zero-Pill Rule) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-600 mb-6">
          <span className="text-emerald-700 font-semibold tracking-wide uppercase">
            Est. 2022 · GST &amp; Tax Consultant
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>4+ Years Corporate Practice</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>450+ Active Indian Scale-Ups</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-500">New Delhi · Gurugram · Mumbai · Bengaluru</span>
        </div>

        {/* 2-Column Hero Split */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          
          {/* Left Column: Value Proposition & Dual CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.12] tracking-tight [text-wrap:balance]">
                {currentVariant.headline}
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                {currentVariant.subheadline}
              </p>
            </div>

            {/* Dual CTAs & Trust Badges */}
            <div className="space-y-6 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onOpenBookingModal()}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition-all rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>{currentVariant.primaryCta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onExploreServices}
                  className="px-6 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-100 active:scale-98 border border-slate-300 transition-all rounded-xl flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{currentVariant.secondaryCta}</span>
                </button>
              </div>

              {/* Security & SLA Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>24-Hour SLA Guarantee</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>99.8% On-Time Filing</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-700 col-span-2 sm:col-span-1">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ISO Data Privacy</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Service & Savings Preview Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-[#0A1128] text-white rounded-2xl p-6 md:p-8 shadow-xl border border-[#1E2B52] relative overflow-hidden space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      Interactive Scope Preview
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Select your business turnover scale
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  Prices Are Comparable
                </span>
              </div>

              {/* Turnover Scale Buttons */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
                <button
                  onClick={() => setTurnoverBand('startup')}
                  className={`py-2 px-2 text-xs font-medium rounded-lg transition-all ${
                    turnoverBand === 'startup'
                      ? 'bg-emerald-600 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  New Startup
                </button>
                <button
                  onClick={() => setTurnoverBand('smb')}
                  className={`py-2 px-2 text-xs font-medium rounded-lg transition-all ${
                    turnoverBand === 'smb'
                      ? 'bg-emerald-600 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SMB Scale-Up
                </button>
                <button
                  onClick={() => setTurnoverBand('enterprise')}
                  className={`py-2 px-2 text-xs font-medium rounded-lg transition-all ${
                    turnoverBand === 'enterprise'
                      ? 'bg-emerald-600 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Enterprise
                </button>
              </div>

              {/* Result Preview Box */}
              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Business Revenue Band:</span>
                  <span className="text-white font-semibold">{currentCalculator.range}</span>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-emerald-400 font-sans block mb-1 font-semibold">
                    Recommended Practice Scope:
                  </span>
                  <p className="text-sm font-sans font-bold text-white">
                    {currentCalculator.recommendedService}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Starting Retainer:</span>
                    <span className="text-xs font-bold text-emerald-400">{currentCalculator.estimatedFee}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Service SLA:</span>
                    <span className="text-xs font-bold text-white">{currentCalculator.sla}</span>
                  </div>
                </div>
              </div>

              {/* Direct Quote Trigger */}
              <button
                onClick={() => onOpenBookingModal(currentCalculator.recommendedService)}
                className="w-full py-3 px-4 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Request Custom Quote for {currentCalculator.recommendedService}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <p className="text-[10px] text-center text-slate-400">
                100% confidential · Non-binding scope assessment in 24 hours
              </p>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
