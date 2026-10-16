import React, { useState } from 'react';
import {
  TrendingUp,
  Building2,
  Globe2,
  Check,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';

interface IntentSelectorProps {
  onOpenScopeModal: (service?: string) => void;
}

export const IntentSelector: React.FC<IntentSelectorProps> = ({ onOpenScopeModal }) => {
  const [selectedPersona, setSelectedPersona] = useState<'midmarket' | 'startup' | 'outsourcing'>('midmarket');

  const personas = {
    midmarket: {
      id: 'midmarket',
      title: 'Indian Mid-Market & SME Enterprises',
      subtitle: 'Turnover ₹5 Cr to ₹150 Cr with high daily transaction volumes, multi-state GST and vendor TDS obligations.',
      painPoints: [
        'Multi-state GSTR-2B mismatches causing blocked input tax credit and supplier disputes',
        'Delayed month-end financial closures preventing management visibility into true margins',
        'Struggling to find reliable, disciplined accounting staff on TallyPrime or Zoho Books'
      ],
      recommendedService: 'Corporate Accounting & Bookkeeping',
      recommendedSecondary: 'GST Compliance & ITC Reconciliation',
      caseHighlight: {
        metric: '₹31.2 Lakhs',
        desc: 'Unclaimed Input Tax Credit recovered in 45-day audit for an Indian automotive distributor.'
      }
    },
    startup: {
      id: 'startup',
      title: 'High-Growth Startups & D2C Scale-ups',
      subtitle: 'Seed to Series-B funded startups needing clean investor financials, automated payroll, and Virtual CFO leadership.',
      painPoints: [
        'Preparing books for institutional venture capital diligence with zero compliance red flags',
        'Complex channel reconciliation across payment gateways, marketplaces, and e-commerce carts',
        'Need for dynamic 13-week runway modeling and board MIS without hiring a full-time ₹1.5 Cr CFO'
      ],
      recommendedService: 'Virtual CFO Advisory',
      recommendedSecondary: 'TDS Returns & Payroll Management',
      caseHighlight: {
        metric: '0 Diligence Red Flags',
        desc: 'Series-A diligence cleared for a Bengaluru SaaS startup with zero post-term sheet valuation haircut.'
      }
    },
    outsourcing: {
      id: 'outsourcing',
      title: 'Multi-Branch Groups & B2B Outsourcing Partners',
      subtitle: 'Corporate groups, retail chains, and international agencies seeking a dedicated back-office accounting pod.',
      painPoints: [
        'High overhead costs and attrition when managing in-house junior accounting teams',
        'Lack of standardized accounting SOPs across distributed branches or subsidiaries',
        'Need for scalable, white-label bookkeeping pods operating under strict NDA guarantees'
      ],
      recommendedService: 'B2B Accounting Outsourcing',
      recommendedSecondary: 'Corporate Accounting & Bookkeeping',
      caseHighlight: {
        metric: '52% Cost Reduction',
        desc: 'Deployed centralized 4-person accounting pod for 14-outlet retail group, halving monthly finance ops costs.'
      }
    }
  };

  const current = personas[selectedPersona];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-sky-600 mb-2 block">
            Client-Centric Diagnostic Funnel
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
            Which Operational Stage Best Describes Your Business?
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Select your enterprise category to view how Jha Accounting Solutions structures your workflow and deliverables.
          </p>
        </div>

        {/* Persona Switcher Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-10 max-w-3xl mx-auto">
          {[
            { id: 'midmarket', label: 'Mid-Market & Manufacturing', icon: <Building2 className="w-4 h-4" /> },
            { id: 'startup', label: 'Startups & D2C Brands', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'outsourcing', label: 'B2B Outsourcing & Multi-Unit', icon: <Users className="w-4 h-4" /> }
          ].map((item) => {
            const isSelected = selectedPersona === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedPersona(item.id as any)}
                className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-[#0B132B] text-white shadow-xs ring-1 ring-slate-900'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Persona Resolution Panel */}
        <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Analysis & Friction Points */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                  Tailored Accounting Architecture
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
                  {current.title}
                </h3>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                  {current.subtitle}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Typical Bottlenecks We Eliminate:
                </span>
                {current.painPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80">
                    <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenScopeModal(current.recommendedService)}
                  className="inline-flex items-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-[0.98]"
                >
                  <span>Build Scope for {current.recommendedService}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                </button>

                <button
                  onClick={() => onOpenScopeModal(current.recommendedSecondary)}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xs"
                >
                  <span>Explore {current.recommendedSecondary}</span>
                </button>
              </div>
            </div>

            {/* Right Col: Attributable Proven Metric Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#0B132B] text-white rounded-2xl p-7 border border-slate-800 space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                    Verified Engagement Metric
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                    {current.caseHighlight.metric}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {current.caseHighlight.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>JAS Client Portfolio</span>
                  <span className="text-emerald-400 font-semibold">100% Verified Result</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
