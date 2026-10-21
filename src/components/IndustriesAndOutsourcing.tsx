import React from 'react';
import {
  ShoppingBag,
  Rocket,
  Factory,
  Building2,
  Stethoscope,
  Truck,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Layers
} from 'lucide-react';

interface IndustriesAndOutsourcingProps {
  onOpenBookingModal: (service?: string) => void;
}

export const IndustriesAndOutsourcing: React.FC<IndustriesAndOutsourcingProps> = ({
  onOpenBookingModal
}) => {
  const industries = [
    {
      title: 'E-commerce & D2C',
      description: 'Multi-state GST marketplace reconciliation (Amazon, Flipkart, Shopify), TCS/TDS tracking, and gateway accounting.',
      icon: ShoppingBag,
      metrics: '120+ Active Stores'
    },
    {
      title: 'SaaS & Startups',
      description: 'VC-ready financial modeling, R&D expense tracking, 13-week cash runway, and ESOP accounting advisory.',
      icon: Rocket,
      metrics: 'Funded Scale-ups'
    },
    {
      title: 'Manufacturing',
      description: 'Inventory valuation (FIFO/Weighted Average), BOM costing, e-way bill compliance, and fixed asset registers.',
      icon: Factory,
      metrics: 'ERP Integrated'
    },
    {
      title: 'Real Estate & Infrastructure',
      description: 'RERA compliance accounting, escrow account reconciliation, vendor TDS, and milestone billing tracking.',
      icon: Building2,
      metrics: 'Multi-Project'
    },
    {
      title: 'Healthcare & Pharma',
      description: 'GST exemption tracking, medical equipment depreciation, regulatory compliance, and payroll management.',
      icon: Stethoscope,
      metrics: 'Strict HIPAA / Data Security'
    },
    {
      title: 'Logistics & Supply Chain',
      description: 'Fleet expense tracking, interstate transit GST compliance, driver payroll, and toll reconciliation.',
      icon: Truck,
      metrics: 'Pan-India Operations'
    },
    {
      title: 'Education & EdTech',
      description: 'GST compliance on digital courses, fee collection reconciliation, TDS on instructor payouts, and trust audits.',
      icon: GraduationCap,
      metrics: 'Institution Grade'
    },
    {
      title: 'Professional Services',
      description: 'Time-billing revenue recognition, professional fee TDS (194J), GST reverse charge (RCM), and partner payouts.',
      icon: Briefcase,
      metrics: 'Consultants & Agencies'
    }
  ];

  const whiteLabelBenefits = [
    {
      title: 'Scale Without Hiring Overheads',
      description: 'Take on bulk corporate clients and complex GST filings without the friction of hiring, training, and retaining full-time junior accountants.',
      icon: TrendingUp
    },
    {
      title: 'Strict Confidentiality Guaranteed',
      description: '100% white-label confidentiality. We operate invisibly in the background under your firm letterhead and NDA protocols.',
      icon: ShieldCheck
    },
    {
      title: 'Predictable Fixed Monthly Pricing',
      description: 'Enjoy high profit margins with transparent, fixed monthly pricing per client account, allowing you to bill your clients at your own rates.',
      icon: DollarSign
    }
  ];

  return (
    <>
      {/* Industries We Serve Grid Section */}
      <section id="industries" className="py-20 bg-white border-b border-slate-200/70 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block">
              Sector Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Industries We Serve
            </h2>
            <p className="text-slate-600 text-base font-sans">
              Specialized domain accounting, tax compliance, and regulatory reporting tailored to the unique economic models of India&apos;s leading sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((ind, idx) => {
              const IconComponent = ind.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#F5F7FA] rounded-2xl p-6 border border-slate-200/80 hover:border-[#10B981]/40 hover:bg-white hover:shadow-soft-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors shadow-xs">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#0B1F3A]/60 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                        {ind.metrics}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[#0B1F3A] font-display group-hover:text-[#10B981] transition-colors">
                        {ind.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        {ind.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      onClick={() => onOpenBookingModal(`${ind.title} Accounting Support`)}
                      className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#10B981] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Explore Sector Spec</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Dark Navy White-Label Accounting for CA Firms Section */}
      <section id="outsourcing" className="py-20 bg-[#0B1F3A] text-white border-b border-[#162D4F] overflow-hidden relative">
        {/* Subtle background decorative grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E3B66_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-lg border border-[#10B981]/30 inline-block">
                B2B Practice Outsourcing
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display leading-[1.15]">
                White-Label Accounting for CA Firms
              </h2>

              <p className="text-slate-300 text-base leading-relaxed font-sans">
                Are you a practicing Chartered Accountant (CA) or tax consultant overburdened with compliance deadlines? Partner with Rishi Jha&apos;s firm to outsource bookkeeping, GST return filing, TDS computation, and MIS preparation under <strong className="text-white font-semibold">your own firm brand</strong>.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onOpenBookingModal('White-Label CA Partnership')}
                  className="px-7 py-4 text-sm font-bold text-white bg-[#10B981] hover:bg-[#059669] active:scale-98 transition-all rounded-xl shadow-soft hover:shadow-soft-md flex items-center gap-2.5 cursor-pointer group"
                >
                  <span>Partner With Us</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              {whiteLabelBenefits.map((benefit, idx) => {
                const IconComponent = benefit.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#102A4E] rounded-2xl p-6 border border-[#1E3B66] shadow-soft-lg flex items-start gap-4 hover:border-[#10B981]/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] border border-[#1E3B66] flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-white font-display">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed font-sans">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>
    </>
  );
};
