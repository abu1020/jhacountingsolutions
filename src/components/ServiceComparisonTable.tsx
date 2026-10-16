import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Minus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Building2,
  HelpCircle,
  Clock,
  Award,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface ServiceComparisonTableProps {
  onOpenBookingModal: (service?: string) => void;
}

export const ServiceComparisonTable: React.FC<ServiceComparisonTableProps> = ({
  onOpenBookingModal
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedMobileTier, setSelectedMobileTier] = useState<'standard' | 'growth' | 'cfo'>('cfo');
  const [showOnlyCfoFeatures, setShowOnlyCfoFeatures] = useState(false);

  // Discount multiplier for annual retainer (10% discount)
  const discountMultiplier = billingCycle === 'annual' ? 0.9 : 1;

  const tiers = [
    {
      id: 'standard',
      name: 'Essential Compliance',
      tagline: 'Core GST filing and basic ledger hygiene for early-stage traders and small setups.',
      priceMonthly: 7500,
      badge: 'Essential',
      isPopular: false,
      color: 'border-slate-200 bg-white text-slate-900'
    },
    {
      id: 'growth',
      name: 'Growth Accounting & Tax',
      tagline: 'Complete back-office accounting, multi-state GST, and TDS payroll operations.',
      priceMonthly: 18500,
      badge: 'Full-Stack Operations',
      isPopular: false,
      color: 'border-slate-300 bg-slate-50/80 text-slate-900'
    },
    {
      id: 'cfo',
      name: 'Premium Virtual CFO',
      tagline: 'Strategic financial steering, 13-week runway modeling, and board-grade investor MIS.',
      priceMonthly: 45000,
      badge: 'Most Popular for Scaleups',
      isPopular: true,
      color: 'border-emerald-500 bg-[#0A1128] text-white shadow-2xl shadow-emerald-950/40'
    }
  ];

  const featureCategories = [
    {
      category: '1. Bookkeeping & Ledger Maintenance',
      features: [
        {
          name: 'Voucher Posting & Daily Ledger Entry',
          tooltip: 'Daily entry of purchase, sales, bank, and petty cash vouchers on cloud accounting software.',
          standard: 'Monthly Batch',
          growth: 'Weekly Posting',
          cfo: 'Daily Real-Time'
        },
        {
          name: 'Bank & Payment Gateway Reconciliation',
          tooltip: 'Matching bank statements and payment gateway payouts (Razorpay, Stripe, Cashfree) against ledgers.',
          standard: '1 Bank Account',
          growth: 'Up to 3 Accounts',
          cfo: 'Unlimited Accounts'
        },
        {
          name: 'Month-End Financial Closing (P&L & Balance Sheet)',
          tooltip: 'Trial balance audit, depreciation posting, and draft financial statement generation.',
          standard: 'Quarterly',
          growth: 'By 10th of Month',
          cfo: 'By 5th of Month'
        }
      ]
    },
    {
      category: '2. GST & Direct Tax Compliance',
      features: [
        {
          name: 'Monthly GSTR-1 & GSTR-3B Filings',
          tooltip: 'Preparation, ITC computation, tax liability settlement, and portal filing.',
          standard: true,
          growth: true,
          cfo: true
        },
        {
          name: 'GSTR-2B Input Tax Credit (ITC) Reconciliation',
          tooltip: 'Automated purchase register matching against GSTR-2B to unlock blocked tax credits.',
          standard: 'Basic Matching',
          growth: 'Monthly Automated',
          cfo: 'Continuous Leakage Audit'
        },
        {
          name: 'Annual GSTR-9 / 9C Reconciliation Statement',
          tooltip: 'Year-end GST audit and annual return preparation with reconciliation table.',
          standard: false,
          growth: true,
          cfo: true
        },
        {
          name: 'Income Tax Return & Corporate TDS Returns',
          tooltip: 'Quarterly Form 26Q/27Q TDS returns, 15CA/15CB certificates, and annual tax returns.',
          standard: 'TDS Returns Only',
          growth: true,
          cfo: true
        }
      ]
    },
    {
      category: '3. Strategic Virtual CFO & Capital Advisory (Premium)',
      isCfoExclusiveCategory: true,
      features: [
        {
          name: 'Rolling 13-Week Cash Flow & Runway Forecast Model',
          tooltip: 'Dynamic financial model projecting weekly cash inflows, payroll commitments, and runway.',
          standard: false,
          growth: false,
          cfo: true
        },
        {
          name: 'Monthly Investor Board MIS & Variance Analysis',
          tooltip: 'Board-ready financial decks comparing actual P&L performance against budgeted targets.',
          standard: false,
          growth: false,
          cfo: true
        },
        {
          name: 'Unit Economics, CAC/LTV & Gross Margin Optimization',
          tooltip: 'Granular product or customer cohort margin analysis to identify profit leakages.',
          standard: false,
          growth: false,
          cfo: true
        },
        {
          name: 'Due Diligence Readiness & Investor Data Room Support',
          tooltip: 'Organizing financial records, cap tables, and compliance certificates for fundraising.',
          standard: false,
          growth: false,
          cfo: true
        },
        {
          name: 'Bi-Weekly Executive Reviews with Lead Partner',
          tooltip: 'Direct 1-on-1 strategic review sessions with a Senior Tax & Financial Consultant.',
          standard: false,
          growth: false,
          cfo: true
        }
      ]
    },
    {
      category: '4. Service SLA & Governance',
      features: [
        {
          name: 'Dedicated Lead Consultant Allocation',
          tooltip: 'Single point of contact managing your account with experienced back-office accountants.',
          standard: 'Shared Helpdesk',
          growth: 'Dedicated Manager',
          cfo: 'Senior Partner Lead'
        },
        {
          name: 'Guaranteed Query SLA Response',
          tooltip: 'Maximum turnaround time for regulatory clarifications and accounting queries.',
          standard: '48 Business Hours',
          growth: '24 Business Hours',
          cfo: '2-Hour Priority SLA'
        },
        {
          name: 'Priority WhatsApp Advisory Group',
          tooltip: 'Direct chat channel with senior tax specialists for quick queries.',
          standard: false,
          growth: true,
          cfo: true
        }
      ]
    }
  ];

  const renderFeatureValue = (val: boolean | string, isCfoColumn = false) => {
    if (typeof val === 'boolean') {
      return val ? (
        <div className="flex justify-center">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            isCfoColumn 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-emerald-100 text-emerald-700'
          }`}>
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Minus className={`w-4 h-4 ${isCfoColumn ? 'text-slate-600' : 'text-slate-300'}`} />
        </div>
      );
    }

    return (
      <span className={`text-xs font-semibold font-mono ${
        isCfoColumn ? 'text-emerald-300' : 'text-slate-800'
      }`}>
        {val}
      </span>
    );
  };

  return (
    <section id="comparison-matrix" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title & Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold text-emerald-700 tracking-wider uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>03. Package Comparison &amp; Advisory Scope</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Standard Accounting vs. Premium Virtual CFO Advisory
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            While standard accounting ensures statutory compliance and ledger hygiene, our Virtual CFO packages deliver strategic capital steering, 13-week runway modeling, and investor-ready financial governance.
          </p>

          {/* Interactive Billing Cadence & Feature Filter Controls */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Monthly vs Annual Toggle */}
            <div className="p-1 bg-slate-200/80 rounded-xl flex items-center gap-1 text-xs font-semibold text-slate-700">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Retainer
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual Retainer</span>
                <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-300 px-1.5 py-0.2 rounded uppercase tracking-wider">
                  Save 10%
                </span>
              </button>
            </div>

            {/* CFO Exclusive Filter Toggle */}
            <button
              onClick={() => setShowOnlyCfoFeatures(!showOnlyCfoFeatures)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-colors flex items-center gap-2 ${
                showOnlyCfoFeatures
                  ? 'bg-emerald-900 text-emerald-300 border-emerald-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>{showOnlyCfoFeatures ? 'Showing CFO Exclusives' : 'Highlight CFO Exclusives'}</span>
            </button>

          </div>
        </div>

        {/* DESKTOP COMPARISON TABLE (Visible on Desktop lg+) */}
        <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            
            {/* Table Header: Tier Titles & Pricing */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="p-6 w-2/5 align-bottom">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Service Capabilities
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Compare Practice Plans
                    </h3>
                  </div>
                </th>

                {/* Tier 1: Standard */}
                <th className="p-6 w-1/5 text-center align-top border-l border-slate-200">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {tiers[0].badge}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{tiers[0].name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                        {tiers[0].tagline}
                      </p>
                    </div>
                    <div className="pt-2 font-mono">
                      <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                        ₹{Math.round(tiers[0].priceMonthly * discountMultiplier).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500"> /mo</span>
                    </div>
                    <button
                      onClick={() => onOpenBookingModal(tiers[0].name)}
                      className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      Select Plan
                    </button>
                  </div>
                </th>

                {/* Tier 2: Growth */}
                <th className="p-6 w-1/5 text-center align-top border-l border-slate-200 bg-slate-50/80">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {tiers[1].badge}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{tiers[1].name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                        {tiers[1].tagline}
                      </p>
                    </div>
                    <div className="pt-2 font-mono">
                      <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                        ₹{Math.round(tiers[1].priceMonthly * discountMultiplier).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500"> /mo</span>
                    </div>
                    <button
                      onClick={() => onOpenBookingModal(tiers[1].name)}
                      className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      Select Plan
                    </button>
                  </div>
                </th>

                {/* Tier 3: Premium Virtual CFO (Featured Highlight) */}
                <th className="p-6 w-1/5 text-center align-top border-l border-emerald-500/40 bg-[#0A1128] text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
                  
                  <div className="space-y-3 relative z-10">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {tiers[2].badge}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-white">{tiers[2].name}</h4>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-tight">
                        {tiers[2].tagline}
                      </p>
                    </div>
                    <div className="pt-2 font-mono">
                      <span className="text-2xl font-extrabold text-emerald-400 tabular-nums">
                        ₹{Math.round(tiers[2].priceMonthly * discountMultiplier).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400"> /mo</span>
                    </div>
                    <button
                      onClick={() => onOpenBookingModal(tiers[2].name)}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-emerald-950/80 flex items-center justify-center gap-1.5"
                    >
                      <span>Get CFO Proposal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </th>

              </tr>
            </thead>

            {/* Table Body: Grouped Categories & Features */}
            <tbody>
              {featureCategories
                .filter(cat => !showOnlyCfoFeatures || cat.isCfoExclusiveCategory)
                .map((cat, catIdx) => (
                  <React.Fragment key={catIdx}>
                    
                    {/* Category Header Row */}
                    <tr className="bg-slate-100/80 border-t border-b border-slate-200">
                      <td colSpan={4} className="px-6 py-3 text-xs font-mono font-extrabold text-slate-800 uppercase tracking-wider">
                        {cat.category}
                      </td>
                    </tr>

                    {/* Category Features */}
                    {cat.features.map((feat, featIdx) => (
                      <tr 
                        key={featIdx} 
                        className={`border-b border-slate-100 transition-colors ${
                          featIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                        } hover:bg-slate-50`}
                      >
                        {/* Feature Name & Tooltip */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 group cursor-help">
                            <span className="text-xs font-semibold text-slate-800">
                              {feat.name}
                            </span>
                            <div className="relative group/tooltip">
                              <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover/tooltip:text-slate-600" />
                              <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-900 text-white text-[11px] rounded-lg p-2.5 shadow-xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-50 leading-relaxed font-sans">
                                {feat.tooltip}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Standard Value */}
                        <td className="px-6 py-4 text-center border-l border-slate-100">
                          {renderFeatureValue(feat.standard, false)}
                        </td>

                        {/* Growth Value */}
                        <td className="px-6 py-4 text-center border-l border-slate-100 bg-slate-50/50">
                          {renderFeatureValue(feat.growth, false)}
                        </td>

                        {/* CFO Value (Featured Dark Background) */}
                        <td className="px-6 py-4 text-center border-l border-emerald-500/30 bg-[#0A1128]/95 text-white">
                          {renderFeatureValue(feat.cfo, true)}
                        </td>
                      </tr>
                    ))}

                  </React.Fragment>
                ))}
            </tbody>

            {/* Table Footer: Action Row */}
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200">
                <td className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>All retainer scopes include non-disclosure covenants &amp; 24-hr response SLA</span>
                  </div>
                </td>
                <td className="p-6 text-center border-l border-slate-200">
                  <button
                    onClick={() => onOpenBookingModal(tiers[0].name)}
                    className="w-full py-2 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl"
                  >
                    Get Standard Scope
                  </button>
                </td>
                <td className="p-6 text-center border-l border-slate-200 bg-slate-100/50">
                  <button
                    onClick={() => onOpenBookingModal(tiers[1].name)}
                    className="w-full py-2 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl"
                  >
                    Get Growth Scope
                  </button>
                </td>
                <td className="p-6 text-center border-l border-emerald-500/40 bg-[#0A1128]">
                  <button
                    onClick={() => onOpenBookingModal(tiers[2].name)}
                    className="w-full py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md"
                  >
                    Get CFO Proposal
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* MOBILE COMPARISON SWITCHER (Visible on Mobile & Tablet < lg) */}
        <div className="lg:hidden space-y-6">
          
          {/* Mobile Tier Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200 rounded-xl text-xs font-bold">
            {tiers.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedMobileTier(t.id as any)}
                className={`py-2.5 px-2 rounded-lg text-center transition-all ${
                  selectedMobileTier === t.id
                    ? t.id === 'cfo'
                      ? 'bg-[#0A1128] text-emerald-400 shadow-md'
                      : 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Active Mobile Tier Card */}
          {(() => {
            const activeTier = tiers.find(t => t.id === selectedMobileTier)!;
            const isCfo = activeTier.id === 'cfo';

            return (
              <div className={`rounded-2xl p-6 border shadow-xl space-y-6 transition-all ${
                isCfo
                  ? 'bg-[#0A1128] text-white border-emerald-500/50 shadow-emerald-950/30'
                  : 'bg-white text-slate-900 border-slate-200'
              }`}>
                
                {/* Header Badge & Title */}
                <div className="space-y-2">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block ${
                    isCfo
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {activeTier.badge}
                  </span>
                  <h3 className="text-xl font-bold">{activeTier.name}</h3>
                  <p className={`text-xs ${isCfo ? 'text-slate-300' : 'text-slate-600'}`}>
                    {activeTier.tagline}
                  </p>
                </div>

                {/* Mobile Pricing */}
                <div className="pt-2 pb-4 border-b border-slate-200/20 font-mono">
                  <span className={`text-3xl font-extrabold tabular-nums ${isCfo ? 'text-emerald-400' : 'text-slate-900'}`}>
                    ₹{Math.round(activeTier.priceMonthly * discountMultiplier).toLocaleString('en-IN')}
                  </span>
                  <span className={`text-xs ${isCfo ? 'text-slate-400' : 'text-slate-500'}`}> /month</span>
                </div>

                {/* Feature Checklist List */}
                <div className="space-y-4">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider block ${
                    isCfo ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    Included Scope &amp; Deliverables:
                  </span>

                  {featureCategories.map((cat, cIdx) => (
                    <div key={cIdx} className="space-y-2">
                      <span className={`text-[11px] font-mono font-semibold uppercase block ${
                        isCfo ? 'text-slate-400' : 'text-slate-400'
                      }`}>
                        {cat.category}
                      </span>
                      <div className="space-y-2">
                        {cat.features.map((feat, fIdx) => {
                          const val = feat[activeTier.id as keyof typeof feat];
                          if (val === false) return null; // Hide non-included features on mobile for clarity

                          return (
                            <div key={fIdx} className="flex items-start gap-2.5 text-xs">
                              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                                isCfo ? 'text-emerald-400' : 'text-emerald-600'
                              }`} />
                              <div className="flex-1">
                                <span className={`font-medium ${isCfo ? 'text-slate-200' : 'text-slate-800'}`}>
                                  {feat.name}
                                </span>
                                {typeof val === 'string' && (
                                  <span className={`ml-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                    isCfo 
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                                      : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {val}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="pt-4 border-t border-slate-200/20">
                  <button
                    onClick={() => onOpenBookingModal(activeTier.name)}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg ${
                      isCfo
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/80'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Schedule Free {activeTier.name} Discovery Call</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })()}

        </div>

        {/* Bottom Trust Guarantee Banner */}
        <div className="bg-[#0A1128] text-white p-6 sm:p-8 rounded-2xl border border-[#1E2B52] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Transparent Engagement Terms</span>
            </div>
            <h4 className="text-base font-bold text-white">
              Need a Custom Multi-Entity or High-Volume Enterprise Plan?
            </h4>
            <p className="text-xs text-slate-300">
              We structure custom retainers for multi-state GST groups, e-commerce marketplaces with 10,000+ monthly SKUs, and FDI entities.
            </p>
          </div>

          <button
            onClick={() => onOpenBookingModal('Custom Enterprise Scope')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl whitespace-nowrap shrink-0 shadow-lg shadow-emerald-950/80 flex items-center gap-2"
          >
            <span>Talk to Senior Tax Partner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
