import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Rocket,
  Factory,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter
} from 'lucide-react';
import {
  INDUSTRY_CASE_STUDIES,
  INDUSTRY_CATEGORIES,
  IndustryCategory,
  IndustryCaseStudy
} from '../data/industryCaseStudies';
import { ScrollReveal } from './ScrollReveal';

interface IndustriesAndOutsourcingProps {
  onOpenBookingModal: (service?: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ShoppingBag,
  Rocket,
  Factory,
  Briefcase
};

export const IndustriesAndOutsourcing: React.FC<IndustriesAndOutsourcingProps> = ({
  onOpenBookingModal
}) => {
  const [activeCategory, setActiveCategory] = useState<IndustryCategory>('all');

  // Filter case studies according to active category
  const filteredStudies = useMemo(() => {
    if (activeCategory === 'all') {
      return INDUSTRY_CASE_STUDIES;
    }
    return INDUSTRY_CASE_STUDIES.filter(
      (study) => study.category === activeCategory
    );
  }, [activeCategory]);

  return (
    <section
      id="industries"
      className="py-20 bg-white border-b border-slate-200/70 overflow-hidden scroll-mt-20 lg:scroll-mt-24"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block uppercase tracking-wider">
              Sector Applicability &amp; Case Studies
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Accounting &amp; Tax Compliance Across Sectors
            </h2>
            <p className="text-slate-600 text-base font-sans">
              Explore how our four approved services—GST Compliance, Income Tax Computation, TDS/TCS Returns, and Bookkeeping—apply to distinct industry transaction cycles.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-2">
          {INDUSTRY_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count =
              cat.id === 'all'
                ? INDUSTRY_CASE_STUDIES.length
                : INDUSTRY_CASE_STUDIES.filter((s) => s.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer flex items-center gap-2 shadow-2xs ${
                  isActive
                    ? 'bg-[#0B1F3A] text-white shadow-soft font-bold'
                    : 'bg-[#F8FAFC] text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-200/70 border border-slate-200'
                }`}
                role="tab"
                aria-selected={isActive}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? 'bg-[#10B981] text-white font-bold'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Case Studies Grid with AnimatePresence */}
        <motion.div
          layout
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredStudies.map((study) => {
              const IconComponent = ICON_MAP[study.iconName] || Briefcase;

              return (
                <motion.div
                  key={study.id}
                  layout
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-[#10B981]/40 hover:bg-white hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-5">
                    
                    {/* Header Row: Icon, Sector Badge, & Profile */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors shadow-2xs shrink-0">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-wider block">
                            {study.categoryLabel}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] font-display leading-snug">
                            {study.title}
                          </h3>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md shrink-0 hidden sm:inline-block">
                        Case Profile
                      </span>
                    </div>

                    {/* Client Context Pill */}
                    <div className="bg-white/80 rounded-xl px-3.5 py-2 border border-slate-200/80 flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
                      <span>{study.clientProfile}</span>
                    </div>

                    {/* Challenge Box */}
                    <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-800 uppercase">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Statutory Challenge</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {study.challenge}
                      </p>
                    </div>

                    {/* Applied Deliverables (Strictly from 4 Approved Categories) */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono font-bold text-[#0B1F3A] uppercase tracking-wider block">
                        Applied Statutory Deliverables
                      </span>
                      <ul className="space-y-2 text-xs text-slate-600 font-sans">
                        {study.appliedDeliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Outcome */}
                    <div className="bg-emerald-50/70 border border-[#10B981]/25 rounded-xl p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 uppercase">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                        <span>Compliance Outcome</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
                        {study.keyOutcome}
                      </p>
                    </div>

                  </div>

                  {/* Footer Action & Approved Services Tags */}
                  <div className="pt-5 mt-6 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {study.approvedServices.map((srv, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-mono font-semibold text-[#0B1F3A] bg-white border border-slate-200 px-2 py-0.5 rounded-md"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        onOpenBookingModal(
                          `${study.categoryLabel} Compliance Consultation`
                        )
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10B981] hover:text-[#059669] transition-colors cursor-pointer shrink-0 font-display"
                    >
                      <span>Inquire for {study.categoryLabel.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Scope Assurance Note */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 font-sans max-w-xl mx-auto">
            All case illustrations reflect genuine statutory workflows within our 4 approved services: GST compliance, Income Tax computation &amp; returns, TDS/TCS quarterly returns, and Bookkeeping. Specific deliverables subject to client applicability and mutually agreed engagement terms.
          </p>
        </div>

      </div>
    </section>
  );
};
