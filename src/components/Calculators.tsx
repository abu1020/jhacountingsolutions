import React, { useState } from 'react';
import {
  Calculator,
  Receipt,
  ArrowRight,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Info
} from 'lucide-react';

interface CalculatorsProps {
  onOpenScopeModal: (service?: string) => void;
}

export const Calculators: React.FC<CalculatorsProps> = ({ onOpenScopeModal }) => {
  const [activeTab, setActiveTab] = useState<'gst' | 'tds'>('gst');

  // GST State
  const [gstAmount, setGstAmount] = useState<number>(250000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [calcMode, setCalcMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [taxNature, setTaxNature] = useState<'intra' | 'inter'>('intra');

  // TDS State
  const [tdsPaymentAmount, setTdsPaymentAmount] = useState<number>(150000);
  const [tdsSection, setTdsSection] = useState<'194C' | '194J_fee' | '194J_tech' | '194I_rent_land' | '194I_rent_mach' | '194H_comm'>('194J_fee');
  const [tdsDeducteeType, setTdsDeducteeType] = useState<'individual' | 'company'>('company');

  // GST Computation
  const calculateGst = () => {
    let base = 0;
    let tax = 0;
    let total = 0;

    if (calcMode === 'exclusive') {
      base = gstAmount;
      tax = (gstAmount * gstRate) / 100;
      total = base + tax;
    } else {
      total = gstAmount;
      base = (gstAmount * 100) / (100 + gstRate);
      tax = total - base;
    }

    const halfTax = tax / 2;
    const halfRate = gstRate / 2;

    return {
      base: base.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      tax: tax.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      total: total.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      halfTax: halfTax.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      halfRate
    };
  };

  // TDS Computation
  const calculateTds = () => {
    let rate = 10;
    let threshold = 30000;
    let sectionName = "194J - Professional / Legal Fees";
    let thresholdNote = "Threshold: ₹30,000 per financial year per payee";

    if (tdsSection === '194C') {
      rate = tdsDeducteeType === 'individual' ? 1 : 2;
      threshold = 100000;
      sectionName = "194C - Contractor & Sub-Contractor Works";
      thresholdNote = "Single contract > ₹30,000 or aggregate > ₹1,00,000 p.a.";
    } else if (tdsSection === '194J_fee') {
      rate = 10;
      threshold = 30000;
      sectionName = "194J(1) - Professional / Legal Fees";
      thresholdNote = "Threshold: ₹30,000 per financial year";
    } else if (tdsSection === '194J_tech') {
      rate = 2;
      threshold = 30000;
      sectionName = "194J(2) - Technical Services / Call Center";
      thresholdNote = "Threshold: ₹30,000 per financial year (2% rate)";
    } else if (tdsSection === '194I_rent_land') {
      rate = 10;
      threshold = 240000;
      sectionName = "194I - Rent of Land, Building or Furniture";
      thresholdNote = "Threshold: ₹2,40,000 per financial year";
    } else if (tdsSection === '194I_rent_mach') {
      rate = 2;
      threshold = 240000;
      sectionName = "194I - Rent of Plant, Machinery or Equipment";
      thresholdNote = "Threshold: ₹2,40,000 per financial year";
    } else if (tdsSection === '194H_comm') {
      rate = 5;
      threshold = 15000;
      sectionName = "194H - Commission or Brokerage";
      thresholdNote = "Threshold: ₹15,000 per financial year";
    }

    const isExempt = tdsPaymentAmount < threshold;
    const applicableTds = isExempt ? 0 : (tdsPaymentAmount * rate) / 100;
    const netPayable = tdsPaymentAmount - applicableTds;

    return {
      rate,
      threshold,
      sectionName,
      thresholdNote,
      isExempt,
      applicableTds: applicableTds.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      netPayable: netPayable.toLocaleString('en-IN', { maximumFractionDigits: 2 })
    };
  };

  const gstRes = calculateGst();
  const tdsRes = calculateTds();

  return (
    <section id="calculators" className="py-20 sm:py-24 bg-[#F5F7FA] border-b border-slate-200/70">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-[#10B981] mb-2 block">
            Statutory Diagnostic Tools
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#0B1F3A] tracking-tight">
            Corporate Tax &amp; GST Calculators
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Instant computations compliant with current Central Board of Direct Taxes (CBDT) and GST Council rates.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-soft-sm inline-flex">
            <button
              onClick={() => setActiveTab('gst')}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'gst'
                  ? 'bg-[#0B1F3A] text-white shadow-soft-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-4 h-4 text-[#10B981]" />
              <span>GST Split &amp; ITC Calculator</span>
            </button>
            <button
              onClick={() => setActiveTab('tds')}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'tds'
                  ? 'bg-[#0B1F3A] text-white shadow-soft-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4 text-[#10B981]" />
              <span>TDS Rate &amp; Threshold Calculator</span>
            </button>
          </div>
        </div>

        {/* GST CALCULATOR */}
        {activeTab === 'gst' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-soft max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Inputs */}
              <div className="md:col-span-7 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Transaction Value (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={gstAmount}
                    onChange={(e) => setGstAmount(Number(e.target.value) || 0)}
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Calculation Mode
                    </label>
                    <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                      <button
                        onClick={() => setCalcMode('exclusive')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          calcMode === 'exclusive' ? 'bg-white text-slate-900 shadow-soft-sm font-bold' : 'text-slate-600'
                        }`}
                      >
                        GST Exclusive
                      </button>
                      <button
                        onClick={() => setCalcMode('inclusive')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          calcMode === 'inclusive' ? 'bg-white text-slate-900 shadow-soft-sm font-bold' : 'text-slate-600'
                        }`}
                      >
                        GST Inclusive
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Supply Nature
                    </label>
                    <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                      <button
                        onClick={() => setTaxNature('intra')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          taxNature === 'intra' ? 'bg-white text-slate-900 shadow-soft-sm font-bold' : 'text-slate-600'
                        }`}
                      >
                        Intra-State
                      </button>
                      <button
                        onClick={() => setTaxNature('inter')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          taxNature === 'inter' ? 'bg-white text-slate-900 shadow-soft-sm font-bold' : 'text-slate-600'
                        }`}
                      >
                        Inter-State
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    GST Slab Rate
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 12, 18, 28].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setGstRate(rate)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          gstRate === rate
                            ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-soft-sm'
                            : 'bg-[#F5F7FA] text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Output Display */}
              <div className="md:col-span-5 bg-[#0B1F3A] text-white rounded-2xl p-6 border border-[#162D4F] space-y-4 shadow-soft-md">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#10B981]">
                    Statutory Tax Breakdown
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{gstRate}% Slab</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-sans">Base Taxable Value</span>
                    <span className="font-bold text-white">₹{gstRes.base}</span>
                  </div>

                  {taxNature === 'intra' ? (
                    <>
                      <div className="flex justify-between text-slate-300">
                        <span className="font-sans">CGST ({gstRes.halfRate}%)</span>
                        <span className="font-semibold text-slate-200">₹{gstRes.halfTax}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="font-sans">SGST / UTGST ({gstRes.halfRate}%)</span>
                        <span className="font-semibold text-slate-200">₹{gstRes.halfTax}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-slate-300">
                      <span className="font-sans">IGST ({gstRate}%)</span>
                      <span className="font-semibold text-slate-200">₹{gstRes.tax}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm">
                    <span className="font-bold text-white font-sans">Gross Invoice Total</span>
                    <span className="font-extrabold text-[#10B981]">₹{gstRes.total}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => onOpenScopeModal('GST Compliance & ITC Reconciliation')}
                    className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-soft-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Request ITC Reconciliation Scope</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TDS CALCULATOR */}
        {activeTab === 'tds' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-soft max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Inputs */}
              <div className="md:col-span-7 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Payment / Credit Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={tdsPaymentAmount}
                    onChange={(e) => setTdsPaymentAmount(Number(e.target.value) || 0)}
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    TDS Section (Income Tax Act 1961)
                  </label>
                  <select
                    value={tdsSection}
                    onChange={(e) => setTdsSection(e.target.value as any)}
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white"
                  >
                    <option value="194J_fee">194J(1) - Professional / Legal Fees (10%)</option>
                    <option value="194J_tech">194J(2) - Technical Services / Call Center (2%)</option>
                    <option value="194C">194C - Contractor &amp; Subcontractor Works (1% / 2%)</option>
                    <option value="194I_rent_land">194I - Rent of Land, Building or Furniture (10%)</option>
                    <option value="194I_rent_mach">194I - Rent of Plant &amp; Machinery (2%)</option>
                    <option value="194H_comm">194H - Commission or Brokerage (5%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Payee / Deductee Status
                  </label>
                  <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                    <button
                      onClick={() => setTdsDeducteeType('company')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        tdsDeducteeType === 'company' ? 'bg-white text-slate-900 shadow-soft-sm font-bold' : 'text-slate-600'
                      }`}
                    >
                      Company / LLP / Firm
                    </button>
                    <button
                      onClick={() => setTdsDeducteeType('individual')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        tdsDeducteeType === 'individual' ? 'bg-white text-slate-900 shadow-soft-sm font-bold' : 'text-slate-600'
                      }`}
                    >
                      Individual / HUF
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{tdsRes.thresholdNote}</span>
                </div>
              </div>

              {/* Output Display */}
              <div className="md:col-span-5 bg-[#0B1F3A] text-white rounded-2xl p-6 border border-[#162D4F] space-y-4 shadow-soft-md">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#10B981]">
                    TDS Deduction Summary
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{tdsRes.rate}% Rate</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-sans">Gross Payment Value</span>
                    <span className="font-bold text-white">₹{tdsPaymentAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="font-sans">Applicable TDS Amount</span>
                    <span className="font-semibold text-rose-400">
                      {tdsRes.isExempt ? '₹0 (Under Threshold)' : `₹${tdsRes.applicableTds}`}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm">
                    <span className="font-bold text-white font-sans">Net Payable to Vendor</span>
                    <span className="font-extrabold text-[#10B981]">₹{tdsRes.netPayable}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => onOpenScopeModal('TDS Returns & Payroll Management')}
                    className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-soft-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Request Quarterly TDS Filing Scope</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
