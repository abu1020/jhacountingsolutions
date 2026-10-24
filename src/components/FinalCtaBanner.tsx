import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';
import { ScrollReveal } from './ScrollReveal';

interface FinalCtaBannerProps {
  onOpenBookingModal: (service?: string) => void;
}

export const FinalCtaBanner: React.FC<FinalCtaBannerProps> = ({ onOpenBookingModal }) => {
  const { brand } = COMPANY_CONTENT;

  return (
    <section className="py-16 bg-[#0B1F3A] text-white border-b border-[#162D4F] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1E3B66_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        <ScrollReveal>
          <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-lg border border-[#10B981]/30 inline-block">
            Professional Practice Desk
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display max-w-3xl mx-auto leading-[1.15] mt-4">
            Reliable GST Compliance, Income Tax &amp; Corporate Bookkeeping
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-sans mt-3">
            Connect directly with Lead Partner {brand.leadPartner} for your periodic return filings, advance tax computations, TDS statements, or periodic ledger finalisation.
          </p>

          <div className="pt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onOpenBookingModal('Direct Consultation Request')}
              className="px-8 py-3.5 text-sm font-bold text-white bg-[#10B981] hover:bg-[#059669] active:scale-98 transition-all rounded-xl shadow-soft-lg hover:shadow-soft-xl flex items-center gap-2.5 cursor-pointer group"
            >
              <span>Schedule Consultation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href={`tel:${brand.directMobileRaw}`}
              className="px-8 py-3.5 text-sm font-bold text-white bg-[#102A4E] hover:bg-[#162D4F] border border-[#1E3B66] rounded-xl transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#10B981]" />
              <span>Call Practice Desk: {brand.primaryPhone}</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
