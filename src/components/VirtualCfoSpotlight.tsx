import React from 'react';
import {
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  DollarSign,
  PieChart,
  PhoneCall,
  FileSpreadsheet,
  Cpu,
  LineChart
} from 'lucide-react';

interface VirtualCfoSpotlightProps {
  onOpenBookingModal: (service?: string) => void;
}

export const VirtualCfoSpotlight: React.FC<VirtualCfoSpotlightProps> = ({
  onOpenBookingModal
}) => {
  const benefits = [
    'Monthly MIS Reports & Executive Dashboards',
    'Advanced Cash-Flow Forecasting & Runway Modeling',
    'Strategic Budgeting & Variance Analysis',
    'Investor-Ready Financial Reporting & Board Decks'
  ];

  const steps = [
    {
      number: '01',
      title: 'Discovery Call',
      description: 'Understand your business model, current accounting bottlenecks, compliance history, and growth targets.',
      icon: PhoneCall
    },
    {
      number: '02',
      title: 'Onboarding & Data Migration',
      description: 'Secure cloud setup, historical books clean-up, ERP/Tally synchronization, and baseline reconciliation.',
      icon: FileSpreadsheet
    },
    {
      number: '03',
      title: 'Monthly Execution',
      description: 'Rigorous book closing, multi-state GST filing, TDS deductions, payroll processing, and statutory compliance.',
      icon: Cpu
    },
    {
      number: '04',
      title: 'Review & Advisory',
      description: 'Executive MIS walkthrough, tax optimization strategies, cash runway insights, and board-ready reporting.',
      icon: LineChart
    }
  ];

  return (
    <>
      {/* Virtual CFO Spotlight Section */}
      <section id="virtual-cfo" className="py-20 bg-white border-b border-slate-200/70 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Two-Column Layout */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline, 4 Checkmark Benefits & Button */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block">
                  Executive Strategy &amp; Growth
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display leading-[1.15]">
                  Virtual CFO Advisory: Board-Level Financial Intelligence for Scale-Ups
                </h2>

                <p className="text-slate-600 text-base leading-relaxed font-sans">
                  Scale beyond routine accounting. Get dedicated fractional CFO leadership led by Rishi Jha to optimize margins, secure venture funding, and steer capital efficiency.
                </p>
              </div>

              {/* 4 Checkmark Benefits */}
              <div className="space-y-3.5">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-sm font-semibold text-[#0B1F3A] font-sans">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => onOpenBookingModal('Virtual CFO Advisory')}
                  className="px-6 py-3.5 text-sm font-bold text-white bg-[#10B981] hover:bg-[#059669] active:scale-98 transition-all rounded-xl shadow-soft hover:shadow-soft-md flex items-center gap-2 cursor-pointer group"
                >
                  <span>Schedule Virtual CFO Consultation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column: Mock Dashboard Card with Simple Bar Chart & 3 KPI Tiles (Built with CSS) */}
            <div className="lg:col-span-6">
              <div className="bg-[#0B1F3A] rounded-2xl p-6 sm:p-7 shadow-soft-lg border border-[#162D4F] text-white space-y-6 relative">
                
                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#162D4F]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#102A4E] border border-[#1E3B66] flex items-center justify-center text-[#10B981]">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-display">
                        Virtual CFO Executive Console
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">
                        Real-time MIS &amp; Cash Runway
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-md border border-[#10B981]/30">
                    Live MIS Active
                  </span>
                </div>

                {/* 3 KPI Tiles */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#102A4E] rounded-xl p-3 border border-[#1E3B66] space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Operating Margin
                    </span>
                    <div className="text-lg sm:text-xl font-extrabold text-white font-mono">
                      28.4%
                    </div>
                    <span className="text-[10px] text-[#10B981] font-medium block">
                      +4.2% vs budget
                    </span>
                  </div>

                  <div className="bg-[#102A4E] rounded-xl p-3 border border-[#1E3B66] space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Cash Runway
                    </span>
                    <div className="text-lg sm:text-xl font-extrabold text-white font-mono">
                      18 Mos
                    </div>
                    <span className="text-[10px] text-[#10B981] font-medium block">
                      Fully optimized
                    </span>
                  </div>

                  <div className="bg-[#102A4E] rounded-xl p-3 border border-[#1E3B66] space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Monthly Burn
                    </span>
                    <div className="text-lg sm:text-xl font-extrabold text-white font-mono">
                      ₹32.5L
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium block">
                      Stable trend
                    </span>
                  </div>
                </div>

                {/* Simple CSS Bar Chart */}
                <div className="bg-[#102A4E] rounded-xl p-4 border border-[#1E3B66] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      Monthly Revenue &amp; EBITDA Trajectory (₹ Lakhs)
                    </span>
                    <span className="text-[10px] font-mono text-[#10B981]">
                      FY 2024-25
                    </span>
                  </div>

                  {/* Bars Container */}
                  <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-800">
                    
                    {/* Month 1 */}
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[9px] font-mono text-slate-400">42L</span>
                      <div className="w-full bg-slate-800 rounded-t-md relative group h-[55%]">
                        <div className="absolute inset-x-0 bottom-0 bg-[#10B981]/70 group-hover:bg-[#10B981] rounded-t-md h-full transition-all" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Q1</span>
                    </div>

                    {/* Month 2 */}
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[9px] font-mono text-slate-400">58L</span>
                      <div className="w-full bg-slate-800 rounded-t-md relative group h-[70%]">
                        <div className="absolute inset-x-0 bottom-0 bg-[#10B981]/70 group-hover:bg-[#10B981] rounded-t-md h-full transition-all" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Q2</span>
                    </div>

                    {/* Month 3 */}
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[9px] font-mono text-slate-400">74L</span>
                      <div className="w-full bg-slate-800 rounded-t-md relative group h-[85%]">
                        <div className="absolute inset-x-0 bottom-0 bg-[#10B981]/70 group-hover:bg-[#10B981] rounded-t-md h-full transition-all" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Q3</span>
                    </div>

                    {/* Month 4 */}
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[9px] font-mono text-[#10B981] font-bold">96L</span>
                      <div className="w-full bg-slate-800 rounded-t-md relative group h-[100%]">
                        <div className="absolute inset-x-0 bottom-0 bg-[#10B981] rounded-t-md h-full transition-all shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
                      </div>
                      <span className="text-[10px] font-mono text-[#10B981] font-bold">Q4</span>
                    </div>

                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                    <span>Growth Velocity: +38% YoY</span>
                    <span className="text-[#10B981]">Board Reviewed</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-20 bg-[#F5F7FA] border-b border-slate-200/70 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block">
              Streamlined Engagement
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
              How We Work With You
            </h2>
            <p className="text-slate-600 text-base font-sans">
              A transparent, high-touch 4-step framework designed for absolute compliance, zero disruption, and proactive financial clarity.
            </p>
          </div>

          {/* Steps Container with Connecting Line */}
          <div className="relative">
            
            {/* Desktop Horizontal Line connecting step headers */}
            <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-300 -translate-y-12 z-0" />

            {/* Mobile Vertical Line */}
            <div className="block lg:hidden absolute top-8 bottom-8 left-8 w-0.5 bg-slate-300 z-0" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 sm:p-7 shadow-soft border border-slate-200/80 hover:shadow-soft-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#10B981]/30 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-extrabold font-mono text-[#0B1F3A]/20 group-hover:text-[#10B981] transition-colors">
                          {step.number}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-[#0B1F3A] font-display">
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed font-sans">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Phase {step.number} of 04</span>
                      <span className="text-[#10B981] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Active SLA
                      </span>
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
