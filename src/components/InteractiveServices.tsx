import React, { useState } from 'react';
import {
  TrendingUp,
  Receipt,
  FileCheck,
  Building,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  Clock,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA, PracticePillar } from '../data/firmData';

interface InteractiveServicesProps {
  onOpenBookingModal: (service?: string) => void;
}

export const InteractiveServices: React.FC<InteractiveServicesProps> = ({
  onOpenBookingModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const pillars = JHA_ACCOUNTING_DATA.practicePillars;

  const filteredPillars = selectedCategory === 'all'
    ? pillars
    : pillars.filter(p => {
        if (selectedCategory === 'bookkeeping') return p.id === 'corporate-accounting';
        if (selectedCategory === 'gst') return p.id === 'gst-compliance';
        if (selectedCategory === 'payroll') return p.id === 'tds-payroll';
        if (selectedCategory === 'cfo') return p.id === 'virtual-cfo';
        if (selectedCategory === 'b2b') return p.id === 'b2b-outsourcing';
        return true;
      });

  return (
    <section id="services" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold text-emerald-700 tracking-wider uppercase">
            01. Interactive Practice Pillars
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            High-Precision Financial Services & Practice Areas
          </h2>
          <p className="text-base text-slate-600">
            Tailored accounting solutions engineered for Indian mid-market enterprises, high-growth startups, and multi-unit businesses.
          </p>

          {/* Filter Segmented Control */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-navy-dark text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Services ({pillars.length})
            </button>
            <button
              onClick={() => setSelectedCategory('bookkeeping')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === 'bookkeeping'
                  ? 'bg-navy-dark text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Bookkeeping & Ledgers
            </button>
            <button
              onClick={() => setSelectedCategory('gst')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === 'gst'
                  ? 'bg-navy-dark text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              GST & ITC Recovery
            </button>
            <button
              onClick={() => setSelectedCategory('payroll')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === 'payroll'
                  ? 'bg-navy-dark text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              TDS & Payroll
            </button>
            <button
              onClick={() => setSelectedCategory('cfo')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === 'cfo'
                  ? 'bg-navy-dark text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Virtual CFO
            </button>
            <button
              onClick={() => setSelectedCategory('b2b')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === 'b2b'
                  ? 'bg-navy-dark text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              B2B Pods
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* Top Number & Tagline */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-2xl font-mono font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                    {pillar.pillarNumber}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">
                    {pillar.targetFit.split('(')[0]}
                  </span>
                </div>

                {/* Title & Summary */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-navy-dark transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.summary}
                </p>

                {/* Key Deliverables Bullet Points */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono text-slate-700 font-semibold block uppercase">
                    Key Deliverables & Output:
                  </span>
                  <ul className="space-y-1.5">
                    {pillar.keyDeliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Case Study Teaser Box & Direct Trigger */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">
                    Proven Result:
                  </span>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    {pillar.caseStudy.metricBadge}
                  </p>
                </div>

                <button
                  onClick={() => onOpenBookingModal(pillar.scopePreselect)}
                  className="w-full py-2.5 px-4 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:border-emerald-500 group-hover:text-emerald-700"
                >
                  <span>Request Quote for {pillar.scopePreselect}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
