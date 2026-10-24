import React from 'react';
import {
  Globe,
  Calculator,
  ReceiptText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { COMPANY_CONTENT, ServiceItem } from '../data/content';
import { ScrollReveal } from './ScrollReveal';

interface ServicesSectionProps {
  onOpenBookingModal: (service?: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Globe,
  Calculator,
  ReceiptText,
  ShieldCheck
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenBookingModal
}) => {
  const { services } = COMPANY_CONTENT;

  return (
    <section id="services" className="py-20 bg-white border-b border-slate-200/70 overflow-hidden scroll-mt-20 lg:scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#10B981] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Approved Practice Areas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Our Professional Accounting &amp; Tax Compliance Services
            </h2>
            <p className="text-slate-600 text-base font-sans">
              Dedicated statutory compliance, periodic tax filings, and systematic financial record-keeping for businesses in India. Services are provided as applicable to each client under mutually agreed terms.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Approved Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service: ServiceItem, idx: number) => {
            const IconComponent = ICON_MAP[service.iconName] || Globe;

            return (
              <ScrollReveal key={service.id} delayMs={idx * 80}>
                <div className="bg-[#F8FAFC] rounded-2xl p-7 sm:p-8 border border-slate-200/80 shadow-soft hover:shadow-soft-md hover:border-[#10B981]/50 transition-all duration-300 flex flex-col justify-between group h-full">
                  <div className="space-y-5">
                    
                    {/* Card Header with Icon & Index */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors duration-300 flex items-center justify-center shadow-xs">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-[#10B981] transition-colors">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Title & Short Description */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold font-display text-[#0B1F3A] group-hover:text-[#10B981] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        {service.shortDesc}
                      </p>
                    </div>

                    {/* Specific Deliverables Checklist */}
                    <div className="pt-2 border-t border-slate-200/60 space-y-2.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                        Scope &amp; Deliverables:
                      </span>
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-sans leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Card Action Link */}
                  <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      As applicable to client
                    </span>
                    <button
                      onClick={() => onOpenBookingModal(service.title)}
                      className="text-xs font-bold text-[#10B981] group-hover:text-[#059669] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Inquire About This Service</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Professional Scope Notice Strip */}
        <ScrollReveal delayMs={200}>
          <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 font-sans leading-relaxed">
            <span className="font-semibold text-slate-800">Engagement Note: </span>
            All services are rendered strictly within the four approved practice areas listed above. Specific deliverables are provided as applicable to the client and subject to mutually agreed professional engagement terms.
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
