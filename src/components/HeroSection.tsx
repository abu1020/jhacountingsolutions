import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Building2 } from 'lucide-react';
import { HeroDashboardIllustration } from './HeroDashboardIllustration';
import { COMPANY_CONTENT } from '../data/content';
import { staggerContainer, fadeUp, tapScale } from '../lib/motion';

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
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden="true">
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-slate-100/80 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* 2-Column Responsive Layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column — one stagger container choreographs
              badges → headline → copy → CTAs → trust strip in <700ms total. */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col space-y-8"
          >
            <motion.div variants={fadeUp} className="space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/20">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" aria-hidden="true" />
                  <span>{brand.leadPartnerTitle}</span>
                </div>
                <a
                  href="#outsourcing"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-3 py-1 rounded-lg transition-colors cursor-pointer group"
                >
                  <span className="text-amber-600 font-extrabold">⚡ FLAGSHIP:</span>
                  <span className="text-slate-800 group-hover:text-amber-800">B2B Outsourcing (Talkable Rates · Up to Free Trial) &rarr;</span>
                </a>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0B1F3A] leading-[1.15] tracking-tight font-display [text-wrap:balance]">
                {brand.tagline}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-2xl">
                India&apos;s premier corporate accounting &amp; white-label B2B outsourcing firm. Outsource owners, CA firms, and enterprises get 100% talkable fees, negotiable custom retainers, and up to a free pilot trial with dedicated senior CA pods and zero hiring friction.
              </p>
            </motion.div>

            {/* Two Action Buttons — transform-only press/hover feedback */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <motion.button
                type="button"
                onClick={() => onOpenBookingModal()}
                whileHover={{ y: -1 }}
                whileTap={tapScale}
                className="px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] transition-colors rounded-xl shadow-soft hover:shadow-soft-md flex items-center justify-center gap-2 cursor-pointer group whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Book Free Consultation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" aria-hidden="true" />
              </motion.button>

              <motion.button
                type="button"
                onClick={onExploreServices}
                whileHover={{ y: -1 }}
                whileTap={tapScale}
                className="px-6 py-3.5 text-sm font-semibold text-[#0B1F3A] bg-white hover:bg-[#F5F7FA] border border-slate-200 hover:border-slate-300 transition-colors rounded-xl flex items-center justify-center gap-2 shadow-soft-sm cursor-pointer whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Explore Services</span>
              </motion.button>
            </motion.div>

            {/* Small Trust Strip Below with 4 Office Cities */}
            <motion.div variants={fadeUp} className="pt-6 border-t border-slate-100 space-y-2.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Pan-India Physical &amp; Multi-State Compliance Hubs
              </span>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs sm:text-sm font-semibold text-[#0B1F3A]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#10B981] shrink-0" aria-hidden="true" />
                  <span>New Delhi</span>
                </div>
                <span className="text-slate-300 hidden sm:inline" aria-hidden="true">•</span>

                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" aria-hidden="true" />
                  <span>Gurugram</span>
                </div>
                <span className="text-slate-300 hidden sm:inline" aria-hidden="true">•</span>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#10B981] shrink-0" aria-hidden="true" />
                  <span>Mumbai</span>
                </div>
                <span className="text-slate-300 hidden sm:inline" aria-hidden="true">•</span>

                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" aria-hidden="true" />
                  <span>Bengaluru</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Dashboard illustration settles in after the headline */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroDashboardIllustration />
          </motion.div>

        </div>

      </div>
    </section>
  );
};
