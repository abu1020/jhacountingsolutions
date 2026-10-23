import React from 'react';
import {
  ReceiptText,
  Globe,
  Calculator,
  Users2,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  Sparkles,
  Percent,
  ArrowRight
} from 'lucide-react';
import { COMPANY_CONTENT, ServiceItem } from '../data/content';
import { ScrollReveal } from './ScrollReveal';

interface ServicesSectionProps {
  onOpenBookingModal: (service?: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ReceiptText,
  Globe,
  Calculator,
  Users2,
  TrendingUp,
  ShieldCheck,
  Briefcase
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenBookingModal
}) => {
  const { services } = COMPANY_CONTENT;

  return (
    <section id="services" className="py-20 bg-white border-b border-slate-200/70 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#10B981] text-xs font-mono font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Core Practice Areas &amp; Flagship Outsourcing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Corporate Accounting &amp; Advisory Solutions
            </h2>
            <p className="text-slate-600 text-base font-sans">
              Precision tax engineering, automated GST reconciliations, and white-label back-office outsourcing tailored for Indian enterprises and practice owners.
            </p>
          </div>
        </ScrollReveal>

        {/* Flagship Outsourcing Callout Strip */}
        <ScrollReveal delayMs={50}>
          <div className="mb-10 bg-gradient-to-r from-[#0B1F3A] via-[#102A4E] to-[#0B1F3A] rounded-2xl p-4 sm:p-5 border border-[#1E3B66] text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-soft">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shrink-0">
                <Percent className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white font-display">
                    Our Flagship Business: B2B White-Label Accounting Outsourcing
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase bg-[#10B981] text-white px-2 py-0.5 rounded-full shadow-xs">
                    Talkable Fees · Up to Free Pilot
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Fees are 100% negotiable and talkable. Outsource owners get custom volume discounts, flexible budgets, and up to a 100% free pilot trial account.
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenBookingModal('B2B White-Label Outsourcing (Talkable Pricing & Free Pilot Inquiry)')}
              className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all shadow-soft flex items-center gap-2 shrink-0 cursor-pointer whitespace-nowrap"
            >
              <span>Talk Pricing &amp; Claim Free Pilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </ScrollReveal>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: ServiceItem, idx: number) => {
            const IconComponent = ICON_MAP[service.iconName] || ReceiptText;
            const isFlagship = service.isFlagship;

            return (
              <ScrollReveal key={service.id} delayMs={idx * 70}>
                <div
                  className={`rounded-2xl p-7 transition-all duration-300 flex flex-col justify-between group h-full ${
                    isFlagship
                      ? 'bg-gradient-to-b from-[#0B1F3A] to-[#071528] text-white border-2 border-[#10B981] shadow-soft-lg hover:-translate-y-1 relative overflow-hidden'
                      : 'bg-[#F5F7FA] rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-soft-md hover:border-[#10B981]/40 hover:-translate-y-1'
                  }`}
                >
                  {isFlagship && (
                    <div className="absolute top-0 right-0 bg-[#10B981] text-white text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow-sm">
                      ★ #1 Flagship Practice
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 shadow-xs ${
                          isFlagship
                            ? 'bg-[#102A4E] border border-[#1E3B66] text-[#10B981]'
                            : 'bg-white border border-slate-200/80 text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white'
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>

                      {service.discountBadge && (
                        <span className="text-[10px] font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 px-2 py-0.5 rounded-full">
                          {service.discountBadge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3
                        className={`text-xl font-bold font-display transition-colors ${
                          isFlagship ? 'text-white' : 'text-[#0B1F3A] group-hover:text-[#10B981]'
                        }`}
                      >
                        {service.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed font-sans ${
                          isFlagship ? 'text-slate-300' : 'text-slate-600 line-clamp-3'
                        }`}
                      >
                        {service.shortDesc}
                      </p>
                    </div>

                    {/* Features list */}
                    {service.features && (
                      <div className="pt-2 space-y-1.5">
                        {service.features.map((feat, fIdx) => (
                          <div
                            key={fIdx}
                            className={`flex items-center gap-2 text-xs font-sans ${
                              isFlagship ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    className={`pt-6 mt-6 border-t flex items-center justify-between ${
                      isFlagship ? 'border-[#1E3B66]' : 'border-slate-200/60'
                    }`}
                  >
                    <button
                      onClick={() => onOpenBookingModal(service.title)}
                      className={`text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isFlagship
                          ? 'text-[#10B981] hover:text-white'
                          : 'text-[#10B981] group-hover:text-[#059669]'
                      }`}
                    >
                      <span>{isFlagship ? 'Get Partner Pricing & Discount' : 'Learn more'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
