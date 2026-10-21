import React from 'react';
import { CountingNumber } from './CountingNumber';
import { Clock, Building2, Users2, FileCheck2 } from 'lucide-react';

interface StatsBarProps {
  // Placeholders configurable if needed
  yearsExperience?: number;
  officesCount?: number;
  clientsServedPlaceholder?: number;
  gstReturnsFiledPlaceholder?: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  yearsExperience = 10,
  officesCount = 4,
  // Placeholders requested: [X]+ Clients Served, [X]+ GST Returns Filed
  clientsServedPlaceholder = 500,
  gstReturnsFiledPlaceholder = 12500
}) => {
  const stats = [
    {
      id: 'experience',
      icon: Clock,
      value: yearsExperience,
      suffix: '+ Years',
      label: 'Experience',
      subtitle: 'Corporate accounting & multi-state compliance'
    },
    {
      id: 'offices',
      icon: Building2,
      value: officesCount,
      suffix: '',
      label: 'Offices',
      subtitle: 'New Delhi · Gurugram · Mumbai · Bengaluru'
    },
    {
      id: 'clients',
      icon: Users2,
      value: clientsServedPlaceholder,
      suffix: '+',
      label: 'Clients Served',
      subtitle: 'Startups, SMBs & enterprise scale-ups'
    },
    {
      id: 'gst-returns',
      icon: FileCheck2,
      value: gstReturnsFiledPlaceholder,
      suffix: '+',
      label: 'GST Returns Filed',
      subtitle: '100% on-time statutory filing record'
    }
  ];

  return (
    <section className="bg-[#0B1F3A] text-white border-y border-[#162D4F] relative overflow-hidden py-10 sm:py-12">
      {/* Subtle ambient light */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 bg-[#10B981] rounded-full blur-3xl" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between ${
                  index > 0 ? 'pt-6 sm:pt-0 sm:pl-6 lg:pl-8' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#102A4E] border border-[#1E3B66] flex items-center justify-center text-[#10B981]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 my-1">
                  <div className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white font-display tracking-tight leading-none">
                    <CountingNumber
                      value={item.value}
                      suffix={item.suffix}
                      className="text-[#10B981]"
                    />
                  </div>
                  {item.suffix && item.id !== 'experience' && (
                    <span className="text-base sm:text-lg font-bold text-slate-300">
                      {item.label}
                    </span>
                  )}
                  {item.id === 'offices' && (
                    <span className="text-base sm:text-lg font-bold text-slate-300">
                      Offices
                    </span>
                  )}
                  {item.id === 'experience' && (
                    <span className="text-base sm:text-lg font-bold text-slate-300">
                      Experience
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-snug mt-1.5 font-sans">
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
