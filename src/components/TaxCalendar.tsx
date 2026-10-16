import React from 'react';
import { Calendar, AlertCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

interface TaxCalendarProps {
  onOpenScopeModal: (service?: string) => void;
}

export const TaxCalendar: React.FC<TaxCalendarProps> = ({ onOpenScopeModal }) => {
  return (
    <section className="py-20 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-sky-600 mb-2 block">
              Statutory Compliance Calendar
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
              Indian Corporate Tax &amp; GST Compliance Timetable
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Monthly and quarterly filing deadlines under Income Tax Act 1961, CGST Act 2017, and Labor Laws managed by our compliance desk.
            </p>
          </div>

          <button
            onClick={() => onOpenScopeModal('GST Compliance & ITC Reconciliation')}
            className="inline-flex items-center gap-2 text-xs font-bold bg-[#0B132B] hover:bg-slate-800 text-white px-5 py-3 rounded-xl shadow-2xs self-start md:self-auto"
          >
            <span>Retain Monthly Compliance Desk</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {JHA_ACCOUNTING_DATA.taxCalendar.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-extrabold font-display text-slate-900">
                    {item.day}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {item.period}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                  {item.title}
                </h4>

                <div className="text-[10px] font-semibold text-sky-700 mb-2">
                  {item.act}
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SLA Protected</span>
                </span>
                <span className="text-slate-400 font-medium">Zero Late Fee</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
