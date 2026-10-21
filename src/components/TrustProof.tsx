import React from 'react';
import {
  Quote,
  ShieldCheck,
  Building2,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Users,
  Award
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';
import { CountingNumber } from './CountingNumber';

interface TrustProofProps {
  onOpenBookingModal: (service?: string) => void;
}

export const TrustProof: React.FC<TrustProofProps> = ({ onOpenBookingModal }) => {
  const { testimonials, leaders, offices, statutoryMilestones } = JHA_ACCOUNTING_DATA;

  return (
    <section id="about" className="py-20 bg-[#F5F7FA] border-b border-slate-200/70">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold text-[#10B981] tracking-wider uppercase">
            02. Social Proof &amp; Measurable Outcomes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
            Trusted by 450+ Indian Scale-Ups and Enterprises
          </h2>
          <p className="text-base text-slate-600">
            Real corporate outcomes delivered through meticulous accounting discipline and 24-hour SLA commitments.
          </p>
        </div>

        {/* Statutory Milestones Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#0B1F3A] text-white p-8 rounded-2xl border border-[#162D4F] shadow-soft-lg">
          {statutoryMilestones.map((ms, idx) => {
            const renderAnimatedMetric = () => {
              if (idx === 0) return <CountingNumber value={4} suffix="+" />;
              if (idx === 1) return <CountingNumber value={450} suffix="+" />;
              if (idx === 2) return <CountingNumber prefix="₹" value={650} suffix="+ Cr" />;
              if (idx === 3) return <CountingNumber value={99.8} decimals={1} suffix="%" />;
              return ms.number;
            };

            return (
              <div key={idx} className="space-y-1">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#10B981] block">
                  {renderAnimatedMetric()}
                </span>
                <span className="text-xs font-bold text-slate-200 block">
                  {ms.label}
                </span>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {ms.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Client Impact & Testimonials Grid */}
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-mono text-[#10B981] font-bold uppercase block">
                Case Impact Cards
              </span>
              <h3 className="text-2xl font-bold text-[#0B1F3A] font-display">
                Verified Client Impact Statements
              </h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-soft-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-mono font-bold text-[#047857] bg-[#10B981]/10 px-2.5 py-1 rounded-lg border border-[#10B981]/20">
                      {test.metricHighlight}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {test.industry}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#0B1F3A]">{test.clientName}</p>
                    <p className="text-[11px] text-slate-600">{test.designation}, {test.company}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{test.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Leadership Team */}
        <div className="space-y-8 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-[#10B981] tracking-wider uppercase">
              Executive Leadership
            </span>
            <h3 className="text-2xl font-bold text-[#0B1F3A] font-display">
              Steered by Senior Financial Architects
            </h3>
            <p className="text-xs text-slate-600">
              Over 40+ combined years of corporate accounting, tax law, and Virtual CFO expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {leaders.map((leader, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft hover:shadow-soft-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] text-[#10B981] font-bold font-mono text-lg flex items-center justify-center shadow-soft-sm">
                    {leader.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0B1F3A]">{leader.name}</h4>
                    <p className="text-xs font-semibold text-[#10B981]">{leader.role}</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">{leader.qualifications}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                  {leader.specialization.map((spec, sIdx) => (
                    <span key={sIdx} className="text-[10px] font-mono text-slate-600 bg-[#F5F7FA] px-2 py-0.5 rounded border border-slate-200/60">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Offices Network */}
        <div className="space-y-8 pt-4 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-[#10B981] tracking-wider uppercase">
              Office Locations &amp; Delivery Hubs
            </span>
            <h3 className="text-2xl font-bold text-[#0B1F3A] font-display">
              Corporate Footprint Across Key Business Hubs
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((off, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                    {off.city}
                  </span>
                  {off.isHeadquarters && (
                    <span className="text-[9px] font-mono bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30 px-1.5 py-0.5 rounded font-bold">
                      HQ
                    </span>
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed">{off.address}</p>
                <p className="text-[#0B1F3A] font-mono font-semibold pt-1">{off.phone}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
