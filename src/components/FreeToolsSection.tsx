import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  Phone,
  Mail,
  ArrowRight,
  Calculator,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';
import { trackClickPhone, trackClickWhatsApp } from '../lib/analytics';

interface FreeToolsSectionProps {
  onOpenBookingModal: (service?: string) => void;
}

interface ComplianceDateItem {
  id: string;
  category: 'gst' | 'itr' | 'tds';
  categoryLabel: string;
  title: string;
  dueDate: string;
  frequency: string;
  act: string;
  description: string;
  consequence: string;
  serviceBookingName: string;
  criticality: 'high' | 'medium';
  actionPrompt: string;
}

export const FreeToolsSection: React.FC<FreeToolsSectionProps> = ({
  onOpenBookingModal
}) => {
  const [activeTab, setActiveTab] = useState<'dates' | 'calculator'>('dates');
  const [activeCategory, setActiveCategory] = useState<'all' | 'gst' | 'itr' | 'tds'>('all');

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

  // Comprehensive Statutory Compliance Due Dates
  const complianceDates: ComplianceDateItem[] = [
    {
      id: 'gstr-3b',
      category: 'gst',
      categoryLabel: 'GST Compliance',
      title: 'GSTR-3B Monthly Return & Tax Settlement',
      dueDate: '20th of Every Month',
      frequency: 'Monthly (by 20th) / QRMP (22nd or 24th)',
      act: 'Section 39, CGST Act, 2017 & Rule 61',
      description: 'Monthly summary statement of outward supplies, input tax credit (ITC) matched with GSTR-2B, and cash tax payment.',
      consequence: 'Interest @ 18% p.a. under Section 50 on net cash liability plus late fees up to ₹50/day.',
      serviceBookingName: 'GST Compliance Services',
      criticality: 'high',
      actionPrompt: 'Need assistance reconciling GSTR-2B or filing GSTR-3B before the 20th?'
    },
    {
      id: 'gstr-1',
      category: 'gst',
      categoryLabel: 'GST Compliance',
      title: 'GSTR-1 Outward Supplies Statement',
      dueDate: '11th of Every Month',
      frequency: 'Monthly (by 11th) / IFF QRMP (13th)',
      act: 'Section 37, CGST Act, 2017 & Rule 59',
      description: 'Reporting of invoice-wise outward supplies (B2B, B2C, Exports, Credit/Debit Notes) to ensure buyers receive GSTR-2B credit.',
      consequence: 'Blocks subsequent GSTR-1 & GSTR-3B generation; clients cannot claim ITC without timely upload.',
      serviceBookingName: 'GST Compliance Services',
      criticality: 'high',
      actionPrompt: 'Consult on sales invoice upload and credit note adjustments in GSTR-1.'
    },
    {
      id: 'advance-tax',
      category: 'itr',
      categoryLabel: 'Income Tax & ITR',
      title: 'Quarterly Advance Tax Installments',
      dueDate: '15th (Jun, Sep, Dec, Mar)',
      frequency: 'Quarterly (15 Jun 15%, 15 Sep 45%, 15 Dec 75%, 15 Mar 100%)',
      act: 'Sections 208-211, Income-tax Act, 1961',
      description: 'Mandatory payment of estimated income tax liability in 4 quarterly tranches where tax exceeds ₹10,000 in a financial year.',
      consequence: 'Mandatory interest @ 1% per month for deferment under Section 234C and default under Section 234B.',
      serviceBookingName: 'Income Tax Return and Computation',
      criticality: 'high',
      actionPrompt: 'Need advance tax liability calculated on your estimated yearly income?'
    },
    {
      id: 'tds-challan',
      category: 'tds',
      categoryLabel: 'TDS / TCS Compliance',
      title: 'Monthly TDS / TCS Challan Deposit (ITNS 281)',
      dueDate: '7th of Every Month',
      frequency: 'Monthly by 7th (March tax due by 30th April)',
      act: 'Chapter XVII-B, Income-tax Act & Rule 30',
      description: 'Mandatory deposit of tax deducted or collected at source (salaries, contractors, rent, professional fees) to the Central Government.',
      consequence: 'Penal interest @ 1.5% per month under Section 201(1A) from deduction date till deposit date.',
      serviceBookingName: 'TDS/TCS Quarterly Returns',
      criticality: 'high',
      actionPrompt: 'Verify correct BSR codes and Challan 281 tax allocations.'
    },
    {
      id: 'itr-filing',
      category: 'itr',
      categoryLabel: 'Income Tax & ITR',
      title: 'Annual Income Tax Return (ITR) Filing',
      dueDate: '31st July (Non-Audit) / 31st October (Audit)',
      frequency: 'Annual CBDT Statutory Cutoff',
      act: 'Section 139(1), Income-tax Act, 1961',
      description: 'Annual declaration of total taxable income, deductions under Chapter VI-A, and final tax computation for individuals, firms, and companies.',
      consequence: 'Late fee under Section 234F up to ₹5,000, interest under Section 234A, and forfeiture of loss carry-forward benefits.',
      serviceBookingName: 'Income Tax Return and Computation',
      criticality: 'high',
      actionPrompt: 'Schedule ITR computation and 26AS/AIS reconciliation review.'
    },
    {
      id: 'tds-quarterly-returns',
      category: 'tds',
      categoryLabel: 'TDS / TCS Compliance',
      title: 'Quarterly TDS Returns (Forms 24Q, 26Q & 27EQ)',
      dueDate: '31st Jul (Q1), 31st Oct (Q2), 31st Jan (Q3), 31st May (Q4)',
      frequency: 'Quarterly filing & TRACES Form 16/16A generation',
      act: 'Section 200(3), Income-tax Act, 1961',
      description: 'Quarterly return statements reporting deductee PANs, challan details, and certificate generation on the TRACES portal.',
      consequence: 'Mandatory late fee of ₹200 per day under Section 234E plus potential penalty under Section 271H.',
      serviceBookingName: 'TDS/TCS Quarterly Returns',
      criticality: 'high',
      actionPrompt: 'Inquire regarding quarterly TDS return drafting and TRACES certificates.'
    },
    {
      id: 'gstr-9-annual',
      category: 'gst',
      categoryLabel: 'GST Compliance',
      title: 'Annual GST Return (GSTR-9) & Reconciliation (GSTR-9C)',
      dueDate: '31st December',
      frequency: 'Annual statement for preceding Financial Year',
      act: 'Section 44, CGST Act, 2017',
      description: 'Consolidated annual return of all inward supplies, outward supplies, taxes paid, and ITC claimed during the preceding fiscal year.',
      consequence: 'Late fee of ₹50 per day (₹25 CGST + ₹25 SGST) subject to statutory turnover caps.',
      serviceBookingName: 'GST Compliance Services',
      criticality: 'medium',
      actionPrompt: 'Plan your annual GST audit readiness and GSTR-9 finalisation.'
    }
  ];

  // Filter compliance dates by selected category
  const filteredDates = useMemo(() => {
    if (activeCategory === 'all') return complianceDates;
    return complianceDates.filter((d) => d.category === activeCategory);
  }, [activeCategory]);

  // Helper to generate personalized WhatsApp link
  const getWhatsAppLink = (item: ComplianceDateItem) => {
    const text = encodeURIComponent(
      `Hello Rishi Ji, I would like to consult with Jha Accounting Solutions regarding the upcoming "${item.title}" (Due: ${item.dueDate}). Please guide me on compliance requirements.`
    );
    return `https://wa.me/${JHA_ACCOUNTING_DATA.firm.primaryPhoneRaw.replace('+', '')}?text=${text}`;
  };

  // Helper to generate mailto link
  const getMailtoLink = (item: ComplianceDateItem) => {
    const subject = encodeURIComponent(`Consultation Inquiry: ${item.title}`);
    const body = encodeURIComponent(
      `Dear Rishi Jha,\n\nI am contacting you regarding the statutory filing due date for ${item.title} (${item.dueDate}).\n\nPlease let me know your availability for a compliance consultation.\n\nThank you.`
    );
    return `mailto:${JHA_ACCOUNTING_DATA.firm.primaryEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="free-tools"
      className="py-20 bg-[#F5F7FA] border-b border-slate-200/70 overflow-hidden scroll-mt-20 lg:scroll-mt-24"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block uppercase tracking-wider">
            Statutory Financial Utilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
            Statutory Compliance Due Dates &amp; Direct Communication
          </h2>
          <p className="text-slate-600 text-base font-sans">
            Monitor upcoming statutory filing cutoffs across GST, Income Tax, and TDS/TCS. Connect with Lead Partner Rishi Jha directly via WhatsApp, Phone, or Email for immediate assistance.
          </p>
        </div>

        {/* Tab Switcher: Due Dates vs GST Calculator */}
        <div className="flex items-center justify-center">
          <div className="bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/80 flex items-center gap-1.5 max-w-md w-full">
            <button
              onClick={() => setActiveTab('dates')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'dates'
                  ? 'bg-[#0B1F3A] text-white shadow-soft'
                  : 'text-slate-600 hover:text-[#0B1F3A] hover:bg-white/60'
              }`}
            >
              <Calendar className={`w-4 h-4 ${activeTab === 'dates' ? 'text-[#10B981]' : 'text-slate-500'}`} />
              <span>Compliance Due Dates ({complianceDates.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-[#0B1F3A] text-white shadow-soft'
                  : 'text-slate-600 hover:text-[#0B1F3A] hover:bg-white/60'
              }`}
            >
              <Calculator className={`w-4 h-4 ${activeTab === 'calculator' ? 'text-[#10B981]' : 'text-slate-500'}`} />
              <span>GST Split Calculator</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Statutory Compliance Due Dates with Communication Options */}
        {activeTab === 'dates' && (
          <div className="space-y-8">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {[
                { id: 'all', label: 'All Statutory Dates', count: complianceDates.length },
                { id: 'gst', label: 'GST Filings', count: complianceDates.filter((c) => c.category === 'gst').length },
                { id: 'itr', label: 'Income Tax & Advance Tax', count: complianceDates.filter((c) => c.category === 'itr').length },
                { id: 'tds', label: 'TDS / TCS Deposits & Returns', count: complianceDates.filter((c) => c.category === 'tds').length }
              ].map((filter) => {
                const isActive = activeCategory === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveCategory(filter.id as any)}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer flex items-center gap-2 shadow-2xs ${
                      isActive
                        ? 'bg-[#0B1F3A] text-white shadow-soft font-bold'
                        : 'bg-white text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                        isActive ? 'bg-[#10B981] text-white font-bold' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Compliance Due Dates Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {filteredDates.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-soft hover:shadow-soft-md hover:border-[#10B981]/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    
                    {/* Header: Category Badge & Due Date Chip */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-2.5 py-0.5 rounded-md border border-[#10B981]/25 uppercase tracking-wider">
                        {item.categoryLabel}
                      </span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0B1F3A] text-white text-xs font-mono font-bold shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>{item.dueDate}</span>
                      </div>
                    </div>

                    {/* Title & Governing Law */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#0B1F3A] font-display">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                        <span>{item.act}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {item.description}
                    </p>

                    {/* Statutory Consequence of Delay */}
                    <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 space-y-1">
                      <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-800 uppercase">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Statutory Penalty for Late Filing</span>
                      </div>
                      <p className="text-xs text-amber-900/80 font-sans leading-relaxed">
                        {item.consequence}
                      </p>
                    </div>

                    {/* Frequency info */}
                    <div className="text-[11px] font-mono text-slate-400">
                      <span>Filing Frequency: </span>
                      <strong className="text-slate-600">{item.frequency}</strong>
                    </div>

                  </div>

                  {/* Communication Options Cluster */}
                  <div className="pt-5 mt-6 border-t border-slate-100 space-y-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Options to Communicate Regarding This Filing
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      
                      {/* WhatsApp Option */}
                      <a
                        href={getWhatsAppLink(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackClickWhatsApp()}
                        className="py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        title="Chat on WhatsApp about this deadline"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Direct Call Option */}
                      <a
                        href={`tel:${JHA_ACCOUNTING_DATA.firm.primaryPhoneRaw}`}
                        onClick={() => trackClickPhone(JHA_ACCOUNTING_DATA.firm.primaryPhoneRaw)}
                        className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        title="Call Lead Partner Rishi Jha directly"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>Call Desk</span>
                      </a>

                      {/* Direct Email Option */}
                      <a
                        href={getMailtoLink(item)}
                        className="col-span-2 sm:col-span-1 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        title="Send email inquiry to Lead Partner"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>Email</span>
                      </a>

                    </div>

                    {/* Primary Consultation Booking CTA */}
                    <button
                      onClick={() => onOpenBookingModal(item.serviceBookingName)}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132D52] text-white text-xs font-bold shadow-soft flex items-center justify-center gap-2 cursor-pointer transition-colors font-display"
                    >
                      <span>Book Consultation for {item.title.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#10B981]" />
                    </button>

                  </div>

                </div>
              ))}
            </div>

            {/* Direct Communication Hub Banner */}
            <div className="bg-[#0B1F3A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-soft">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#10B981] text-xs font-mono font-bold uppercase tracking-wider border border-white/10">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Direct Practice Communication Desk</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Need Immediate Filing Support or Notice Assistance?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans">
                    Reach Lead Partner Rishi Jha directly. We review client filings, reconcile GSTR-2B purchase ledgers, compute advance tax, and file quarterly returns across India.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono pt-1">
                    <span>Lead Partner: <strong className="text-slate-200">Rishi Jha</strong></span>
                    <span>•</span>
                    <span>Hotline: <strong className="text-slate-200">{JHA_ACCOUNTING_DATA.firm.primaryPhone}</strong></span>
                    <span>•</span>
                    <span>Email: <strong className="text-slate-200">{JHA_ACCOUNTING_DATA.firm.primaryEmail}</strong></span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto">
                  <a
                    href={JHA_ACCOUNTING_DATA.firm.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClickWhatsApp()}
                    className="flex-1 lg:flex-initial px-5 py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-xs sm:text-sm font-bold shadow-soft flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Lead Partner</span>
                  </a>

                  <a
                    href={`tel:${JHA_ACCOUNTING_DATA.firm.primaryPhoneRaw}`}
                    onClick={() => trackClickPhone(JHA_ACCOUNTING_DATA.firm.primaryPhoneRaw)}
                    className="flex-1 lg:flex-initial px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-[#10B981]" />
                    <span>Call Hotline</span>
                  </a>

                  <button
                    onClick={() => onOpenBookingModal('Statutory Compliance Due Date Support')}
                    className="w-full lg:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#0B1F3A] text-xs sm:text-sm font-bold shadow-soft flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Schedule Consultation</span>
                    <ArrowRight className="w-4 h-4 text-[#10B981]" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: GST Split Calculator */}
        {activeTab === 'calculator' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Working GST Calculator */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1F3A] font-display">
                      GST Split Calculator
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      CGST, SGST, IGST &amp; Base Breakdown
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-2.5 py-1 rounded-md border border-[#10B981]/30">
                  Calculator
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
                        className={`py-2.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                          gstRate === rate
                            ? 'bg-[#10B981] text-white border-[#10B981] shadow-soft'
                            : 'bg-[#F5F7FA] text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inclusive / Exclusive Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-[#F5F7FA] rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-[#0B1F3A] block">
                      Price Includes GST?
                    </span>
                    <span className="text-[11px] text-slate-500 font-sans">
                      {isInclusive ? 'Calculated as tax-inclusive' : 'Calculated as tax-exclusive'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsInclusive(!isInclusive)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isInclusive ? 'bg-[#10B981]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isInclusive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Intra-State vs Inter-State Supply Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider block font-mono">
                    Type of Supply
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSupplyType('intra')}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-left ${
                        supplyType === 'intra'
                          ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-soft'
                          : 'bg-[#F5F7FA] text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="block font-bold">Intra-State</span>
                      <span className="text-[10px] opacity-75 font-mono">CGST ({gstRate / 2}%) + SGST ({gstRate / 2}%)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSupplyType('inter')}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-left ${
                        supplyType === 'inter'
                          ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-soft'
                          : 'bg-[#F5F7FA] text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="block font-bold">Inter-State</span>
                      <span className="text-[10px] opacity-75 font-mono">IGST ({gstRate}%)</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Calculated Results Box */}
              <div className="bg-[#0B1F3A] rounded-xl p-5 text-white space-y-3 font-sans border border-[#162D4F]">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-[#162D4F]">
                  <span className="text-slate-400">Net Base Amount</span>
                  <span className="font-mono font-bold text-white">₹{gstResult.base}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {supplyType === 'intra' ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">CGST ({gstRate / 2}%)</span>
                        <span className="font-mono text-emerald-400">₹{gstResult.cgst}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">SGST ({gstRate / 2}%)</span>
                        <span className="font-mono text-emerald-400">₹{gstResult.sgst}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">IGST ({gstRate}%)</span>
                      <span className="font-mono text-emerald-400">₹{gstResult.igst}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#162D4F] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-300 block">Total Invoice Value</span>
                    <span className="text-[10px] font-mono text-slate-400">Inclusive of calculated taxes</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#10B981]">
                    ₹{gstResult.total}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenBookingModal('GST Compliance Services')}
                  className="w-full py-3.5 text-xs font-bold text-white bg-[#0B1F3A] hover:bg-[#132D52] rounded-xl shadow-soft flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Consult on GST Compliance Services</span>
                  <ArrowRight className="w-4 h-4 text-[#10B981]" />
                </button>
              </div>

            </div>

            {/* Right Column: Quick Support & Consultation Contact */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#10B981]">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0B1F3A] font-display">
                        Filing Support Desk
                      </h3>
                      <span className="text-xs font-mono text-slate-500">
                        Lead Partner Rishi Jha
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('dates')}
                    className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-[#10B981]/30 transition-colors cursor-pointer"
                  >
                    View Dates
                  </button>
                </div>

                <div className="space-y-3 text-xs text-slate-600 font-sans">
                  <p>
                    Need assistance filing within the statutory deadline? Connect with our dedicated practice desk for verified compliance support:
                  </p>
                  <div className="space-y-2 pt-2">
                    <a
                      href={JHA_ACCOUNTING_DATA.firm.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#10B981]" />
                        <span>Chat on WhatsApp</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={`tel:${JHA_ACCOUNTING_DATA.firm.primaryPhoneRaw}`}
                      className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-600" />
                        <span>Call {JHA_ACCOUNTING_DATA.firm.primaryPhone}</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={`mailto:${JHA_ACCOUNTING_DATA.firm.primaryEmail}`}
                      className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-600" />
                        <span>{JHA_ACCOUNTING_DATA.firm.primaryEmail}</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onOpenBookingModal('GST Compliance Services')}
                    className="w-full py-3 text-xs font-bold text-white bg-[#0B1F3A] hover:bg-[#132D52] rounded-xl shadow-soft flex items-center justify-center gap-2 cursor-pointer transition-colors font-display"
                  >
                    <span>Schedule Consultation</span>
                    <ArrowRight className="w-4 h-4 text-[#10B981]" />
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
