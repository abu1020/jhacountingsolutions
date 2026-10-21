import React from 'react';
import {
  ReceiptText,
  Globe,
  Calculator,
  Users2,
  TrendingUp,
  ShieldCheck,
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
  ShieldCheck
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
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block">
              Core Practice Areas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Corporate Accounting &amp; Advisory Solutions
            </h2>
            <p className="text-slate-600 text-base font-sans">
              Precision tax engineering, automated GST reconciliations, and fractional CFO intelligence tailored for Indian enterprises.
            </p>
          </div>
        </ScrollReveal>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: ServiceItem, idx: number) => {
            const IconComponent = ICON_MAP[service.iconName] || ReceiptText;

            return (
              <ScrollReveal key={service.id} delayMs={idx * 80}>
                <div className="bg-[#F5F7FA] rounded-2xl p-7 border border-slate-200/80 shadow-soft hover:shadow-soft-md hover:border-[#10B981]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group h-full">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors duration-300 shadow-xs">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-[#0B1F3A] font-display group-hover:text-[#10B981] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-sans line-clamp-2">
                        {service.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      onClick={() => onOpenBookingModal(service.title)}
                      className="text-xs font-bold text-[#10B981] group-hover:text-[#059669] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Learn more</span>
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
