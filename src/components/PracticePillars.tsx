import React from 'react';
import {
  TrendingUp,
  Receipt,
  FileCheck,
  Building,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  Clock
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA, PracticePillar } from '../data/firmData';

interface PracticePillarsProps {
  onOpenScopeModal: (service?: string) => void;
}

export const PracticePillars: React.FC<PracticePillarsProps> = ({ onOpenScopeModal }) => {
  const renderPillarIcon = (id: string) => {
    switch (id) {
      case 'corporate-accounting':
        return <FileCheck className="w-5 h-5" />;
      case 'gst-compliance':
        return <Receipt className="w-5 h-5" />;
      case 'tds-payroll':
        return <Clock className="w-5 h-5" />;
      case 'virtual-cfo':
        return <TrendingUp className="w-5 h-5" />;
      case 'b2b-outsourcing':
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  return (
    <section id="practice-pillars" className="py-20 sm:py-28 bg-[#F8FAFC] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-sky-600 mb-2 block">
            Core Service Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 tracking-tight">
            Comprehensive Corporate Accounting &amp; Compliance Under One Roof
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Eliminating accounting friction and tax compliance delays with dedicated account managers, standardized SOPs, and modern cloud financial tools.
          </p>
        </div>

        {/* Practice Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {JHA_ACCOUNTING_DATA.practicePillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-9 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold group-hover:bg-[#0B132B] group-hover:text-white transition-colors">
                      {pillar.pillarNumber}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Service Practice
                      </span>
                      <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-sky-700 transition-colors">
                        {pillar.title}
                      </h3>
                    </div>
                  </div>
                  <div className="text-slate-400 group-hover:text-sky-600 transition-colors">
                    {renderPillarIcon(pillar.id)}
                  </div>
                </div>

                {/* Tagline & Summary */}
                <p className="text-xs font-semibold text-sky-700 mb-2">
                  {pillar.tagline}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {pillar.summary}
                </p>

                {/* Target Fit Badge */}
                <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Ideal Fit:
                  </span>
                  <span className="text-xs font-medium text-slate-700">
                    {pillar.targetFit}
                  </span>
                </div>

                {/* Key Deliverables Bullet List */}
                <div className="mb-6">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-900 block mb-3">
                    Key Deliverables:
                  </span>
                  <ul className="space-y-2">
                    {pillar.keyDeliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Embedded Case Study Snippet */}
                <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100/80 mb-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-sky-800">
                      Client Case Study
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {pillar.caseStudy.metricBadge}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 mb-1">
                    {pillar.caseStudy.clientType}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {pillar.caseStudy.outcome}
                  </p>
                </div>
              </div>

              {/* Bottom CTA Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  24-Hour Scoping SLA
                </span>
                <button
                  onClick={() => onOpenScopeModal(pillar.scopePreselect)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B132B] hover:text-sky-700 transition-colors group-hover:translate-x-1 duration-200"
                >
                  <span>Request Scope for this Service</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
