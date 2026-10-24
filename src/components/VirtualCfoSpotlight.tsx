import React from 'react';
import {
  PhoneCall,
  FileSpreadsheet,
  Cpu,
  LineChart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface VirtualCfoSpotlightProps {
  onOpenBookingModal: (service?: string) => void;
}

export const VirtualCfoSpotlight: React.FC<VirtualCfoSpotlightProps> = ({
  onOpenBookingModal
}) => {
  const steps = [
    {
      number: '01',
      title: 'Applicable Scope Evaluation',
      description: 'Understanding your business entity type, transaction pattern, GST registrations, and specific accounting requirements.',
      icon: PhoneCall
    },
    {
      number: '02',
      title: 'Ledger & Document Setup',
      description: 'Alignment of opening ledger balances, cloud accounting setup (Tally Prime / Zoho Books), and purchase register synchronization.',
      icon: FileSpreadsheet
    },
    {
      number: '03',
      title: 'Periodic Return Execution',
      description: 'Preparation and filing of GSTR-1, GSTR-3B, monthly GSTR-2B ITC reconciliations, and quarterly TDS/TCS returns (24Q/26Q/27Q/27EQ).',
      icon: Cpu
    },
    {
      number: '04',
      title: 'Finalisation & Annual Filings',
      description: 'Periodic ledger review, trial balance finalisation, Balance Sheet & P&L completion, quarterly advance tax estimations, and annual ITR/GSTR-9.',
      icon: LineChart
    }
  ];

  return (
    <section id="process" className="py-20 bg-[#F5F7FA] border-b border-slate-200/70 overflow-hidden scroll-mt-20 lg:scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block">
              Structured Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Our Accounting &amp; Compliance Workflow
            </h2>
            <p className="text-slate-600 text-base font-sans">
              A clear, disciplined 4-stage engagement framework designed for statutory accuracy, periodic return timeliness, and orderly accounting records.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <ScrollReveal key={idx} delayMs={idx * 80}>
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-soft border border-slate-200/80 hover:shadow-soft-md hover:border-[#10B981]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#10B981]/30 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-extrabold font-mono text-[#0B1F3A]/20 group-hover:text-[#10B981] transition-colors">
                        {step.number}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[#0B1F3A] font-display">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Statutory Compliance Stage</span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onOpenBookingModal('Accounting & Compliance Workflow Inquiry')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1F3A] hover:bg-[#132D52] text-white text-xs sm:text-sm font-bold font-mono rounded-xl transition-all shadow-soft cursor-pointer"
          >
            <span>Discuss Your Filing Requirements</span>
            <ArrowRight className="w-4 h-4 text-[#10B981]" />
          </button>
        </div>

      </div>
    </section>
  );
};
