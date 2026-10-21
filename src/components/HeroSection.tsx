import React from 'react';
import { ArrowRight, MapPin, Building2 } from 'lucide-react';
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
          
          {/* Left Column: Headline, Subheadline, Buttons & Trust Strip */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            
            <ScrollReveal delayMs={50}>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/20">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span>{brand.leadPartnerTitle}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0B1F3A] leading-[1.15] tracking-tight font-display [text-wrap:balance]">
                  {brand.tagline}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-2xl">
                  Delivering {brand.experienceYears} years of audit-grade precision and multi-state compliance for scale-ups and established enterprises.
                </p>
              </div>
            </ScrollReveal>

            {/* Two Action Buttons */}
            <ScrollReveal delayMs={120}>
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
            </ScrollReveal>

            {/* Small Trust Strip Below with 4 Office Cities */}
            <ScrollReveal delayMs={180}>
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
            </ScrollReveal>

          </div>

          {/* Right Column: Clean Abstract Dashboard Illustration built with CSS/SVG */}
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
