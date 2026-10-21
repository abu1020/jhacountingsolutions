import React from 'react';
import {
  ReceiptText,
  Globe,
  Calculator,
  Users2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ServicesSectionProps {
  onOpenBookingModal: (service?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenBookingModal
}) => {
  const services = [
    {
      id: 'accounting-bookkeeping',
      title: 'Corporate Accounting & Bookkeeping',
      icon: ReceiptText,
      // 2-line description
      description:
        'End-to-end ledger maintenance, monthly P&L, balance sheets, and GAAP-compliant financial reporting for Indian enterprises.',
      tag: 'Core Financials'
    },
    {
      id: 'multi-state-gst',
      title: 'Multi-State GST Filing',
      icon: Globe,
      // 2-line description
      description:
        'Seamless GSTR-1, 3B & 9C filings with automated GSTR-2B ITC reconciliations across all Indian state jurisdictions.',
      tag: 'Statutory GST'
    },
    {
      id: 'tds-compliance',
      title: 'TDS Compliance',
      icon: Calculator,
      // 2-line description
      description:
        'Timely corporate tax deductions, quarterly Form 26Q & 27Q filings, and streamlined digital Form 16/16A issuance.',
      tag: 'Direct Taxation'
    },
    {
      id: 'payroll-operations',
      title: 'Payroll Operations',
      icon: Users2,
      // 2-line description
      description:
        'Full-cycle salary processing, PF, ESI, and Professional Tax compliances with encrypted digital employee payslips.',
      tag: 'Human Capital'
    },
    {
      id: 'virtual-cfo',
      title: 'Virtual CFO Advisory',
      icon: TrendingUp,
      // 2-line description
      description:
        'Strategic cashflow modeling, 13-week runway forecasts, and board-level MIS financial intelligence led by senior specialists.',
      tag: 'Executive Scale'
    },
    {
      id: 'audit-support',
      title: 'Audit Support',
      icon: ShieldCheck,
      // 2-line description
      description:
        'Comprehensive audit schedule prep, tax scrutiny notice representation, and dedicated liaison for statutory and internal audits.',
      tag: 'Risk & Governance'
    }
  ];

  return (
    <section id="services" className="py-20 bg-[#F5F7FA] border-b border-slate-200/70">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Practice Areas &amp; Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
            High-Precision Corporate Accounting &amp; Compliance Services
          </h2>

          <p className="text-base text-slate-600 leading-relaxed font-sans">
            Engineered for Indian scale-ups, mid-market businesses, and multi-state operations requiring zero compliance lapses and strategic clarity.
          </p>
        </div>

        {/* 6 Cards Grid (Lifts slightly on hover) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-soft hover:shadow-soft-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-5">
                  {/* Card Top: Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#F5F7FA] border border-slate-200/80 text-[#0B1F3A] group-hover:bg-[#10B981] group-hover:text-white group-hover:border-[#10B981] transition-all duration-200 flex items-center justify-center shadow-soft-sm">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-100 group-hover:bg-emerald-50 group-hover:text-[#10B981] px-2 py-0.5 rounded transition-colors">
                      {service.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#0B1F3A] font-display tracking-tight group-hover:text-[#10B981] transition-colors leading-snug">
                    {service.title}
                  </h3>

                  {/* 2-Line Description */}
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 font-sans">
                    {service.description}
                  </p>
                </div>

                {/* "Learn more" Link with Arrow */}
                <div className="pt-5 mt-6 border-t border-slate-100">
                  <button
                    onClick={() => onOpenBookingModal(service.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10B981] group-hover:text-[#059669] group-hover:gap-2.5 transition-all cursor-pointer focus:outline-none"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Assurance Note */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
            <span className="font-medium">
              All services supervised by Lead Tax Consultant <strong className="text-[#0B1F3A]">Rishi Jha</strong> with guaranteed 24-hour query SLAs.
            </span>
          </div>

          <button
            onClick={() => onOpenBookingModal()}
            className="text-xs font-bold text-white bg-[#0B1F3A] hover:bg-[#132D52] px-4 py-2.5 rounded-xl transition-colors shrink-0 shadow-soft-sm cursor-pointer"
          >
            Request Custom Scope &amp; Fee Proposal
          </button>
        </div>

      </div>
    </section>
  );
};
