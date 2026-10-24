import React from 'react';
import { Globe, FileCheck2, Calculator, ShieldCheck } from 'lucide-react';

export const StatsBar: React.FC = () => {
  const pillars = [
    {
      id: 'categories',
      icon: ShieldCheck,
      badge: '04',
      label: 'Core Services',
      title: 'Four Practice Areas',
      subtitle: 'GST, Income Tax, TDS/TCS, and Bookkeeping'
    },
    {
      id: 'coverage',
      icon: Globe,
      badge: '28',
      label: 'States & 8 UTs',
      title: 'Pan-India Reach',
      subtitle: 'Multi-jurisdictional indirect tax return compliance'
    },
    {
      id: 'tds-forms',
      icon: FileCheck2,
      badge: '4 Forms',
      label: 'Forms 24Q · 26Q · 27Q · 27EQ',
      title: 'TDS/TCS Returns',
      subtitle: 'Quarterly withholding statements & TRACES support'
    },
    {
      id: 'direct-tax',
      icon: Calculator,
      badge: 'Sec 139',
      label: 'Income-tax Act, 1961',
      title: 'Direct Tax Returns',
      subtitle: 'Total income computation & advance tax scheduling'
    }
  ];

  return (
    <section className="bg-[#0B1F3A] text-white border-y border-[#162D4F] relative overflow-hidden py-8 sm:py-10">
      {/* Subtle ambient light */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 bg-[#10B981] rounded-full blur-3xl" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between ${
                  index > 0 ? 'pt-6 sm:pt-0 sm:pl-6 lg:pl-8' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#102A4E] border border-[#1E3B66] flex items-center justify-center text-[#10B981]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                    {item.badge}
                  </span>
                </div>

                <div className="my-1">
                  <h3 className="text-base sm:text-lg font-bold text-white font-display tracking-tight">
                    {item.title}
                  </h3>
                  <span className="text-xs font-mono text-slate-300 block">
                    {item.label}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-snug mt-1 font-sans">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
