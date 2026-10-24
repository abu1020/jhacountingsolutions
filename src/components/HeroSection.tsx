import React from 'react';
import { ArrowRight, Globe, ShieldCheck } from 'lucide-react';
import { HeroDashboardIllustration } from './HeroDashboardIllustration';
import { COMPANY_CONTENT } from '../data/content';
import { ScrollReveal } from './ScrollReveal';

interface HeroSectionProps {
  onOpenBookingModal: (service?: string) => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBookingModal,
  onExploreServices
}) => {
  const { brand } = COMPANY_CONTENT;

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
          
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            
            <ScrollReveal delayMs={50}>
              <div className="space-y-6">
                
                {/* Practice Badge */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/20">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>{brand.leadPartnerTitle}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>GST · Income Tax · TDS/TCS · Bookkeeping</span>
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0B1F3A] leading-[1.15] tracking-tight font-display [text-wrap:balance]">
                  GST Compliance, Income Tax &amp; Corporate Bookkeeping for Indian Businesses
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-2xl">
                  Providing meticulous periodic return filings, monthly GSTR-2B input credit reconciliations, income tax return preparation under Section 139, quarterly TDS/TCS returns, and systematic financial ledger review—as applicable to your business needs.
                </p>
              </div>
            </ScrollReveal>

            {/* Action Buttons */}
            <ScrollReveal delayMs={120}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                <button
                  onClick={() => onOpenBookingModal()}
                  className="px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] active:scale-[0.98] transition-all rounded-xl shadow-soft hover:shadow-soft-md flex items-center justify-center gap-2 cursor-pointer group whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Schedule Consultation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                <button
                  onClick={onExploreServices}
                  className="px-6 py-3.5 text-sm font-semibold text-[#0B1F3A] bg-white hover:bg-[#F5F7FA] active:scale-[0.98] border border-slate-200 hover:border-slate-300 transition-all rounded-xl flex items-center justify-center gap-2 shadow-soft-sm cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">Explore Approved Services</span>
                </button>
              </div>
            </ScrollReveal>

            {/* Trust Strip */}
            <ScrollReveal delayMs={180}>
              <div className="pt-6 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Statutory Practice Scope
                </span>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs sm:text-sm font-semibold text-[#0B1F3A]">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span>Pan-India Remote Digital Operations</span>
                  </div>
                  <span className="text-slate-300 hidden sm:inline" aria-hidden="true">•</span>

                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span>Four Approved Practice Categories</span>
                  </div>
                  <span className="text-slate-300 hidden sm:inline" aria-hidden="true">•</span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[#10B981] font-mono font-bold">ITR</span>
                    <span>Sec 139 &amp; Chapter XVII-B</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: Clean Abstract Dashboard Illustration */}
          <div className="lg:col-span-5">
            <ScrollReveal delayMs={150}>
              <HeroDashboardIllustration />
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
