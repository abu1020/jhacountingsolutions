import React, { useState } from 'react';
import {
  Calculator,
  Calendar,
  Receipt,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  Building2
} from 'lucide-react';

interface FreeToolsSectionProps {
  onOpenBookingModal: (service?: string) => void;
}

export const FreeToolsSection: React.FC<FreeToolsSectionProps> = ({
  onOpenBookingModal
}) => {
  // GST Calculator State
  const [amount, setAmount] = useState<number>(100000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [supplyType, setSupplyType] = useState<'intra' | 'inter'>('intra');

  // GST Calculation Logic
  const calculateGst = () => {
    let base = 0;
    let total = 0;
    let tax = 0;

    if (isInclusive) {
      total = amount;
      base = (amount * 100) / (100 + gstRate);
      tax = total - base;
    } else {
      base = amount;
      tax = (amount * gstRate) / 100;
      total = base + tax;
    }

    const cgst = supplyType === 'intra' ? tax / 2 : 0;
    const sgst = supplyType === 'intra' ? tax / 2 : 0;
    const igst = supplyType === 'inter' ? tax : 0;

    return {
      base: base.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      cgst: cgst.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      sgst: sgst.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      igst: igst.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      totalTax: tax.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      total: total.toLocaleString('en-IN', { maximumFractionDigits: 2 })
    };
  };

  const gstResult = calculateGst();

  // Current Month Compliance Due Dates (GST, TDS, PF)
  const currentMonthDueDates = [
    {
      category: 'GST Compliance',
      title: 'GSTR-3B Filing (Monthly)',
      dueDate: '20th of Every Month',
      act: 'CGST Act 2017',
      description: 'Summary return of outward supplies, inward supplies liable to reverse charge, and ITC claim.',
      status: 'Upcoming'
    },
    {
      category: 'GST Compliance',
      title: 'GSTR-1 Outward Supplies',
      dueDate: '11th of Every Month',
      act: 'CGST Act 2017',
      description: 'Details of outward supplies of goods and services made to registered and unregistered taxpayers.',
      status: 'Upcoming'
    },
    {
      category: 'Direct Tax (TDS)',
      title: 'TDS / TCS Deposit (Challan 281)',
      dueDate: '7th of Next Month',
      act: 'Income Tax Act 1961',
      description: 'Deposit of tax deducted at source for salaries, rent, professional fees, and contractor payments.',
      status: 'Upcoming'
    },
    {
      category: 'Labor & PF Compliance',
      title: 'EPF & ESIC Monthly Contribution',
      dueDate: '15th of Every Month',
      act: 'EPF & MP Act 1952',
      description: 'Remittance of Employee Provident Fund and State Insurance statutory dues for the preceding month.',
      status: 'Upcoming'
    }
  ];

  return (
    <section id="free-tools" className="py-20 bg-[#F5F7FA] border-b border-slate-200/70 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block">
            Compliant Financial Utilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
            Free GST Calculator &amp; Compliance Calendar
          </h2>
          <p className="text-slate-600 text-base font-sans">
            Instant statutory tools built for Indian businesses. Compute tax splits with precision and stay ahead of monthly filing deadlines.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Working GST Calculator */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0B1F3A] font-display">
                    Advanced GST Split Calculator
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    CGST, SGST, IGST &amp; Base Breakdown
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-2.5 py-1 rounded-md border border-[#10B981]/30">
                Live Engine
              </span>
            </div>

            {/* Inputs Form */}
            <div className="space-y-5">
              
              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                  Transaction Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl py-3 pl-9 pr-4 text-sm font-mono font-bold text-[#0B1F3A] focus:outline-none focus:border-[#10B981] transition-colors"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* GST Rate Selector (5, 12, 18, 28) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                GST Rate (%)
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[5, 12, 18, 28].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setGstRate(rate)}
                      className={`py-2.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                        gstRate === rate
                          ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-soft-sm'
                          : 'bg-[#F5F7FA] text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle for Inclusive vs Exclusive */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                    Calculation Basis
                  </label>
                  <div className="bg-[#F5F7FA] p-1 rounded-xl border border-slate-200 flex">
                    <button
                      type="button"
                      onClick={() => setIsInclusive(false)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        !isInclusive
                          ? 'bg-white text-[#0B1F3A] shadow-soft-sm font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Exclusive
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInclusive(true)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isInclusive
                          ? 'bg-white text-[#0B1F3A] shadow-soft-sm font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Inclusive
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                    Supply Nature
                  </label>
                  <div className="bg-[#F5F7FA] p-1 rounded-xl border border-slate-200 flex">
                    <button
                      type="button"
                      onClick={() => setSupplyType('intra')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        supplyType === 'intra'
                          ? 'bg-white text-[#0B1F3A] shadow-soft-sm font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Intra-State
                    </button>
                    <button
                      type="button"
                      onClick={() => setSupplyType('inter')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        supplyType === 'inter'
                          ? 'bg-white text-[#0B1F3A] shadow-soft-sm font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Inter-State
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Computation Output Results Box */}
            <div className="bg-[#0B1F3A] rounded-2xl p-6 text-white space-y-4 border border-[#162D4F]">
              <div className="flex items-center justify-between pb-3 border-b border-[#162D4F]">
                <span className="text-xs font-mono text-slate-400 uppercase">
                  Tax Breakdown Results
                </span>
                <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded border border-[#10B981]/30">
                  CBDT &amp; GST Council Compliant
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#102A4E] rounded-xl p-3 border border-[#1E3B66]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Base Amount</span>
                  <div className="text-base sm:text-lg font-extrabold font-mono text-white mt-1">
                    ₹{gstResult.base}
                  </div>
                </div>

                {supplyType === 'intra' ? (
                  <>
                    <div className="bg-[#102A4E] rounded-xl p-3 border border-[#1E3B66]">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">CGST ({gstRate / 2}%)</span>
                      <div className="text-base sm:text-lg font-extrabold font-mono text-[#10B981] mt-1">
                        ₹{gstResult.cgst}
                      </div>
                    </div>
                    <div className="bg-[#102A4E] rounded-xl p-3 border border-[#1E3B66]">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">SGST ({gstRate / 2}%)</span>
                      <div className="text-base sm:text-lg font-extrabold font-mono text-[#10B981] mt-1">
                        ₹{gstResult.sgst}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-[#102A4E] rounded-xl p-3 border border-[#1E3B66] col-span-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">IGST ({gstRate}%)</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-[#10B981] mt-1">
                      ₹{gstResult.igst}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#162D4F] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 block">Total Invoice Value</span>
                  <span className="text-[10px] font-mono text-slate-400">Inclusive of all taxes</span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#10B981]">
                  ₹{gstResult.total}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenBookingModal('GST Reconciliation & Filing Advisory')}
                className="w-full py-3.5 text-xs font-bold text-white bg-[#0B1F3A] hover:bg-[#132D52] rounded-xl shadow-soft flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Consult Lead CA Rishi Jha on GST Filings</span>
                <ArrowRight className="w-4 h-4 text-[#10B981]" />
              </button>
            </div>

          </div>

          {/* Right Column: Compliance Calendar Card (GST, TDS, PF) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0B1F3A]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1F3A] font-display">
                      Compliance Calendar
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      Current Month Statutory Deadlines
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-[#0B1F3A] bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  SLA Monitored
                </span>
              </div>

              <div className="space-y-4">
                {currentMonthDueDates.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F5F7FA] rounded-xl p-4 border border-slate-200/80 space-y-2 hover:border-[#10B981]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-2.5 py-0.5 rounded border border-[#10B981]/25">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono font-extrabold text-[#0B1F3A] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {item.dueDate}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A] font-display">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1 font-sans">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>Act: {item.act}</span>
                      <span className="text-[#10B981] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Zero Penalty SLA
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenBookingModal('Retain Full Monthly Compliance Desk')}
                  className="w-full py-3.5 text-xs font-bold text-[#0B1F3A] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#10B981]/30 rounded-xl shadow-soft flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Outsource All Filings to Our Desk</span>
                  <ArrowRight className="w-4 h-4 text-[#10B981]" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
