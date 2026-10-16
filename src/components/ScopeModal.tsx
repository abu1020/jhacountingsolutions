import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  TrendingUp,
  Receipt,
  FileCheck,
  Clock,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  Check,
  Users
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

interface ScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const ScopeModal: React.FC<ScopeModalProps> = ({
  isOpen,
  onClose,
  preselectedService
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<string>(
    preselectedService || 'Corporate Accounting & Bookkeeping'
  );
  const [entityType, setEntityType] = useState<string>('Private Limited Company');
  const [annualTurnover, setAnnualTurnover] = useState<string>('₹5 Cr – ₹25 Cr');
  const [currentPainPoint, setCurrentPainPoint] = useState<string>('Daily Ledger Closures & Timely GST/TDS Filings');
  const [accountingSoftware, setAccountingSoftware] = useState<string>('TallyPrime / ERP');
  const [contactName, setContactName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [preferredCity, setPreferredCity] = useState<string>('New Delhi / NCR');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService);
    }
  }, [preselectedService]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep(1);
        setIsSubmitting(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Dynamic Scope Assessment Calculations based on selected practice area & turnover
  const getDynamicScopeEvaluation = () => {
    switch (selectedService) {
      case 'Virtual CFO Advisory':
        return {
          title: 'Virtual CFO & Strategic Financial Steering Scope',
          cadence: 'Bi-Weekly Executive Reviews + Continuous Oversight',
          leadConsultant: 'Rakesh N. Verma & Amit K. Jha',
          deliverables: [
            'Dynamic 13-Week Cash Flow & Runway Forecasting Model',
            'Monthly Board MIS Reporting & Revenue-Expense Variance Analysis',
            'Supervision of Accounting Team (Weekly Ledger Audits & Health Checks)',
            'Investor Diligence Readiness & Financial Data Room Organization',
            'Direct Access to Lead Financial Consultant for Strategic Capital Decisions'
          ],
          estimatedTurnaround: '48 Hours to Onboard & Complete Initial Financial Diagnostic',
          complianceRiskRating: annualTurnover === '₹100 Cr+' ? 'Multi-Entity Group Scope' : 'Standard Growth Scope'
        };
      case 'GST Compliance & ITC Reconciliation':
        return {
          title: 'Multi-State GST Compliance & ITC Optimization Scope',
          cadence: 'Monthly Filing Cadence + Continuous 2B Ledger Audit',
          leadConsultant: 'Priyanka Jha (Director – Tax Operations)',
          deliverables: [
            '100% GSTR-2B Input Tax Credit Reconciliation vs Purchase Register',
            'Monthly GSTR-1 (Outward) & GSTR-3B (Tax Settlement) Filings',
            'Vendor Mismatch Tracking to Prevent Supplier Credit Default',
            'Annual GSTR-9 Returns & GSTR-9C Reconciliation Table Preparation',
            'Prompt Assistance on GST Assessment Notices & Clarification Replies'
          ],
          estimatedTurnaround: '72 Hours for Initial 2B Leakage Health Check',
          complianceRiskRating: 'Zero Penalty Guarantee'
        };
      case 'TDS Returns & Payroll Management':
        return {
          title: 'Payroll Processing & Statutory TDS Compliance Scope',
          cadence: 'Monthly Payroll Cycle + Quarterly TDS Filings',
          leadConsultant: 'Priyanka Jha & Senior Payroll Desk',
          deliverables: [
            'End-to-End Monthly Payroll, Salary Registers & Automated Payslips',
            'EPFO (PF) & ESIC Monthly Challan Generation & Compliance',
            'Quarterly TDS Return Filing (Form 24Q Salary, Form 26Q Vendor)',
            'Digital Form 16 (Part A & B) and Form 16A TDS Certificates',
            'TRACES Default Rectification & Lower Deduction Form 197 Tracking'
          ],
          estimatedTurnaround: '24-Hour Payroll Disbursement Window on 1st of Every Month',
          complianceRiskRating: '100% On-Time Labor & TDS Adherence'
        };
      case 'B2B Accounting Outsourcing':
        return {
          title: 'Dedicated B2B Accounting Pod & Back-Office Outsourcing',
          cadence: 'Daily Operational Coverage (Full-Time Pod Model)',
          leadConsultant: 'Amit K. Jha (MD & Principal Architect)',
          deliverables: [
            'Dedicated Accounting Specialists Trained on Your Tech Stack',
            'Strict Standard Operating Procedures (SOPs) & Turnaround SLAs',
            'Full White-Label Client Communication & Regular Management Reporting',
            'Daily Invoice Processing, Bank Reconciliations & Ledger Balancing',
            'Up to 55% Operational Cost Reduction vs In-House Finance Teams'
          ],
          estimatedTurnaround: '5 Working Days for Pod Deployment & Workflow Mapping',
          complianceRiskRating: 'ISO-Standard Data Security & Confidentiality'
        };
      case 'Corporate Accounting & Bookkeeping':
      default:
        return {
          title: 'Corporate Accounting & Cloud Bookkeeping Scope',
          cadence: 'Daily/Weekly Voucher Processing + Month-End Closure',
          leadConsultant: 'Amit K. Jha & Senior Accounts Lead',
          deliverables: [
            'Daily Ledger Posting, Invoicing & Purchase Entry on Tally / Zoho / QuickBooks',
            'Bank, Payment Gateway & Credit Card Automated Reconciliations',
            'Debtors & Creditors Aging Reports with Working Capital Tracking',
            'Monthly Closing Statements: P&L, Balance Sheet & Trial Balance by 5th',
            'Pre-Audit Clean Books & Depreciation Schedule Maintenance'
          ],
          estimatedTurnaround: '3 Days to Complete Historical Ledger Audit & Setup',
          complianceRiskRating: 'Audit-Ready Books Guaranteed'
        };
    }
  };

  const dynamicScope = getDynamicScopeEvaluation();

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 2 | 3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Automatically open WhatsApp pre-filled with form details
    const waText = encodeURIComponent(
      `Hello Jha Accounting Solutions Team, I submitted a scope assessment request.\n\n• Name: ${contactName}\n• Company: ${companyName}\n• Email: ${contactEmail}\n• Phone: ${contactPhone}\n• Required Service: ${selectedService}\n• Entity Scale: ${entityType} (${annualTurnover})\n• Software Platform: ${accountingSoftware}\n• Office Hub: ${preferredCity}\n• Notes: ${notes || 'N/A'}`
    );
    window.open(`https://wa.me/918882860226?text=${waText}`, '_blank');

    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Dim backdrop */}
      <div
        className="fixed inset-0 bg-[#0B132B]/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-3xl overflow-hidden z-10 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-[#0B132B] text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-sky-400">
                Jha Accounting Solutions · Est. 2022
              </div>
              <h3 className="text-base sm:text-lg font-bold font-display tracking-tight text-white">
                Interactive Accounting Scope &amp; Fee Assessment
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step !== 4 && (
          <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 sm:gap-4 font-semibold text-slate-600">
              <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-sky-700 font-bold' : step > 1 ? 'text-emerald-700' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-sky-600 text-white' : step > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300'}`}>
                  {step > 1 ? '✓' : '1'}
                </span>
                <span>Select Accounting Service</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-sky-700 font-bold' : step > 2 ? 'text-emerald-700' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-sky-600 text-white' : step > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300'}`}>
                  {step > 2 ? '✓' : '2'}
                </span>
                <span>Entity &amp; Operations Scale</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={`flex items-center gap-1.5 ${step === 3 ? 'text-sky-700 font-bold' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-sky-600 text-white' : 'bg-slate-300'}`}>
                  3
                </span>
                <span>Scope Output &amp; Booking</span>
              </span>
            </div>
            <span className="hidden sm:inline-block text-[11px] text-slate-500 font-medium">
              Step {step} of 3
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold font-display text-slate-900 tracking-tight">
                  Which financial solution does your business require?
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  We customize our accounting workflows to match your accounting software, volume, and statutory timelines.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'Corporate Accounting & Bookkeeping',
                    title: 'Corporate Accounting & Bookkeeping',
                    desc: 'Daily ledger entry, bank reconciliations, P&L, balance sheets & pre-audit preparation.',
                    icon: <FileCheck className="w-5 h-5" />,
                    badge: 'Daily & Monthly'
                  },
                  {
                    id: 'GST Compliance & ITC Reconciliation',
                    title: 'GST Compliance & ITC Reconciliation',
                    desc: 'Monthly GSTR-1 & 3B, GSTR-2B purchase matching, zero late-fee filing & annual 9/9C.',
                    icon: <Receipt className="w-5 h-5" />,
                    badge: 'Multi-State'
                  },
                  {
                    id: 'TDS Returns & Payroll Management',
                    title: 'TDS Returns & Payroll Management',
                    desc: 'Monthly salary registers, PF & ESIC remittances, quarterly 24Q/26Q returns & Form 16.',
                    icon: <Clock className="w-5 h-5" />,
                    badge: '10 to 500+ Staff'
                  },
                  {
                    id: 'Virtual CFO Advisory',
                    title: 'Virtual CFO Advisory',
                    desc: '13-week cash runway modeling, Board MIS reports, investor due diligence & unit economics.',
                    icon: <TrendingUp className="w-5 h-5" />,
                    badge: 'Startups & Scale-ups'
                  },
                  {
                    id: 'B2B Accounting Outsourcing',
                    title: 'B2B Accounting Pod Outsourcing',
                    desc: 'Dedicated remote accounting pods for multi-branch companies and agency partners.',
                    icon: <Users className="w-5 h-5" />,
                    badge: 'White-Label / Pod'
                  }
                ].map((item) => {
                  const isSelected = selectedService === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedService(item.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/70 shadow-xs ring-1 ring-sky-600'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                            {item.icon}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {item.badge}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h5>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                        <span className={isSelected ? 'text-sky-700' : 'text-slate-500'}>
                          {isSelected ? 'Selected Solution' : 'Select'}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Backed by 10+ Years of Corporate Accounting Excellence
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-xs transition-all"
                >
                  <span>Continue to Operations Details</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Entity & Scale Profile */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold font-display text-slate-900 tracking-tight">
                  Configure Your Corporate Scale &amp; Accounting Environment
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  Allows our senior accountants to determine transaction volume and dedicated resource allocation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Entity Constitution
                  </label>
                  <select
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  >
                    <option value="Private Limited Company">Private Limited Company</option>
                    <option value="High-Growth Tech Startup (Funded / Bootstrapped)">High-Growth Tech Startup</option>
                    <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                    <option value="Multi-Location Retail / E-Commerce Business">Multi-Location Retail / E-Commerce</option>
                    <option value="Proprietorship / Partnership Firm">Proprietorship / Partnership</option>
                    <option value="Global Firm Seeking B2B Outsourcing">Global Firm / B2B Outsourcing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Estimated Annual Turnover / Run-Rate
                  </label>
                  <select
                    value={annualTurnover}
                    onChange={(e) => setAnnualTurnover(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  >
                    <option value="Under ₹1 Cr (Early Stage)">Under ₹1 Cr (Early Stage)</option>
                    <option value="₹1 Cr – ₹5 Cr">₹1 Cr – ₹5 Cr (Growing SME)</option>
                    <option value="₹5 Cr – ₹25 Cr">₹5 Cr – ₹25 Cr (Mid-Market)</option>
                    <option value="₹25 Cr – ₹100 Cr">₹25 Cr – ₹100 Cr (Established Enterprise)</option>
                    <option value="₹100 Cr+">₹100 Cr+ (Large Corporate Group)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Primary Operational Need
                  </label>
                  <select
                    value={currentPainPoint}
                    onChange={(e) => setCurrentPainPoint(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  >
                    <option value="Daily Ledger Closures & Timely GST/TDS Filings">Daily Ledger Closures &amp; GST/TDS Filings</option>
                    <option value="GSTR-2B Input Tax Credit Reconciliation Leaks">Recover Blocked GST Input Tax Credit (ITC)</option>
                    <option value="Clean Books for Pre-Audit & Financial Closing">Pre-Audit Financial Closing &amp; P&amp;L Review</option>
                    <option value="Preparing Books for Investor Due Diligence">Investor Diligence &amp; Virtual CFO Support</option>
                    <option value="Replacing In-House Finance Team with Dedicated Pod">Cost Reduction via Dedicated Outsourcing Pod</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Current Accounting Software
                  </label>
                  <select
                    value={accountingSoftware}
                    onChange={(e) => setAccountingSoftware(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  >
                    <option value="TallyPrime / Tally ERP 9">TallyPrime / Tally ERP 9</option>
                    <option value="Zoho Books">Zoho Books</option>
                    <option value="QuickBooks / Xero">QuickBooks / Xero</option>
                    <option value="SAP Business One / NetSuite">SAP Business One / NetSuite</option>
                    <option value="Excel / Need Fresh Setup">Excel / Need Fresh Setup</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  ← Back to Services
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-xs transition-all"
                >
                  <span>Generate Instant Assessment</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Instant Scope Summary & Consultation Dispatch */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dynamic Assessment Output Card */}
              <div className="bg-[#0B132B] text-white rounded-xl p-5 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                      Tailored Scope Assessment
                    </span>
                    <h5 className="text-base font-bold text-white mt-0.5">{dynamicScope.title}</h5>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lead Engagement Lead</span>
                    <span className="text-xs font-semibold text-emerald-400">{dynamicScope.leadConsultant}</span>
                  </div>
                </div>

                <div className="py-3">
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                    Key Deliverables Assigned to Your Scope Schedule:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                    {dynamicScope.deliverables.slice(0, 4).map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
                  <div className="flex items-center gap-1.5 text-sky-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Estimated SLA: {dynamicScope.estimatedTurnaround}</span>
                  </div>
                  <span className="text-slate-400">
                    Delivery Cadence: <strong className="text-white">{dynamicScope.cadence}</strong>
                  </span>
                </div>
              </div>

              {/* Contact Dispatch Form */}
              <div>
                <h4 className="text-base font-bold font-display text-slate-900 mb-1">
                  Confirm Contact Details for Your Scope Schedule &amp; Fee Proposal
                </h4>
                <p className="text-xs text-slate-600 mb-4">
                  A senior financial advisor from Jha Accounting Solutions will review this requirement and respond within 24 business hours.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Vikramaditya Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enterprise / Entity Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Precision Pvt Ltd"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Corporate Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="v.sharma@apexlogistics.in"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (for WhatsApp / Call) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98100 XXXXX"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Location Hub
                    </label>
                    <select
                      value={preferredCity}
                      onChange={(e) => setPreferredCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    >
                      <option value="New Delhi (Corporate HQ)">New Delhi (Netaji Subhash Place HQ)</option>
                      <option value="Gurugram (Sector 44 NCR Hub)">Gurugram (Sector 44 NCR Hub)</option>
                      <option value="Mumbai (Bandra Kurla Complex)">Mumbai (Bandra Kurla Complex - BKC)</option>
                      <option value="Bengaluru (Indiranagar Tech Hub)">Bengaluru (Indiranagar Tech Hub)</option>
                      <option value="Virtual Video Conference (Google Meet / Zoom)">Virtual Video Conference</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Specific Notes or Current Backlog
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. 3 months pending GSTR-2B reconciliation"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Strict client financial data confidentiality guaranteed under signed Non-Disclosure Agreement (NDA).
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  ← Back to Scale Profile
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white px-7 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Scope Assessment...</span>
                  ) : (
                    <>
                      <span>Lock In Scope &amp; Book Consultation</span>
                      <ArrowRight className="w-4 h-4 text-sky-400" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Confirmation */}
          {step === 4 && (
            <div className="text-center py-6 sm:py-8 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 block mb-1">
                  Scope Assessment Recorded
                </span>
                <h4 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
                  Thank you, {contactName || 'Corporate Leader'}
                </h4>
                <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
                  Your customized scope assessment for <strong>{selectedService}</strong> has been transmitted directly to our Senior Advisory Desk at Jha Accounting Solutions.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-md mx-auto text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Service Area</span>
                  <span className="font-semibold text-slate-800">{selectedService}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Corporate Scale</span>
                  <span className="font-semibold text-slate-800">{annualTurnover} ({entityType})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Desk SLA</span>
                  <span className="font-bold text-emerald-700">Senior Financial Consultant Call within 24 Hours</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Office Hub</span>
                  <span className="font-semibold text-slate-800">{preferredCity}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`tel:${JHA_ACCOUNTING_DATA.firm.directMobileRaw}`}
                  className="inline-flex items-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Us Directly: {JHA_ACCOUNTING_DATA.firm.directMobile}</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Return to Website
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
