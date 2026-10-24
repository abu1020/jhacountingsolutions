import React from 'react';
import { ShieldCheck, FileCheck, Calculator, BookOpen, Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const TestimonialsCarousel: React.FC = () => {
  const standards = [
    {
      icon: FileCheck,
      title: "Diligent ITC Verification",
      description: "Rigorous line-by-line reconciliation between your Purchase Register and auto-drafted GSTR-2B to verify eligible Input Tax Credits."
    },
    {
      icon: Calculator,
      title: "Direct Tax Computation",
      description: "Structured computation of total income and quarterly advance tax liabilities adhering strictly to the Income-tax Act, 1961."
    },
    {
      icon: ShieldCheck,
      title: "Withholding Tax Accuracy",
      description: "Verification of deductee details under Chapter XVII-B and prompt preparation of quarterly Forms 24Q, 26Q, 27Q, and 27EQ."
    },
    {
      icon: BookOpen,
      title: "Disciplined Bookkeeping",
      description: "Periodic ledger reviews, balanced trial balances, and finalised Balance Sheet and Profit and Loss statements."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200/70 overflow-hidden scroll-mt-20 lg:scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block">
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#10B981]" />
              Professional Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              Our Professional Accounting Commitments
            </h2>
            <p className="text-slate-600 text-base font-sans">
              We focus exclusively on our four approved practice categories, delivering accurate records and dependable statutory compliance for every client engagement.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((std, idx) => {
            const Icon = std.icon;
            return (
              <ScrollReveal key={idx} delayMs={idx * 60}>
                <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 shadow-soft hover:shadow-soft-md hover:border-[#10B981]/40 transition-all flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#10B981] shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-[#0B1F3A] font-display">
                        {std.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {std.description}
                      </p>
                    </div>
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
