import React, { useState } from 'react';
import {
  ShoppingBag,
  Rocket,
  Factory,
  Building2,
  Stethoscope,
  Truck,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Percent,
  CheckCircle2,
  Sparkles,
  Calculator,
  BadgePercent,
  Zap
} from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';
import { ScrollReveal } from './ScrollReveal';

interface IndustriesAndOutsourcingProps {
  onOpenBookingModal: (service?: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ShoppingBag,
  Rocket,
  Factory,
  Building2,
  Stethoscope,
  Truck,
  GraduationCap,
  Briefcase
};

export const IndustriesAndOutsourcing: React.FC<IndustriesAndOutsourcingProps> = ({
  onOpenBookingModal
}) => {
  const { industries, brand, outsourcingTiers } = COMPANY_CONTENT;

  // Interactive Outsourcing Savings Calculator State
  const [selectedAccountsCount, setSelectedAccountsCount] = useState<number>(10);

  // Dynamic calculations based on client account volume
  const getCalculations = (count: number) => {
    let discountPercent = 25;
    if (count >= 16) discountPercent = 40;
    else if (count >= 6) discountPercent = 35;

    // Standard in-house cost per account approx ₹18,000/mo (accountant salary + PF + software + overhead)
    const inHouseMonthly = count * 18000;
    // Base JAS outsource fee approx ₹12,000/mo
    const baseOutsourceMonthly = count * 12000;
    // With partner volume discount
    const discountedMonthly = baseOutsourceMonthly * (1 - discountPercent / 100);
    const monthlySavings = inHouseMonthly - discountedMonthly;
    const annualSavings = monthlySavings * 12;

    return {
      discountPercent,
      inHouseMonthly,
      discountedMonthly,
      annualSavings
    };
  };

  const calc = getCalculations(selectedAccountsCount);

  const whiteLabelBenefits = [
    {
      title: 'Scale Without Hiring Overheads',
      description: 'Take on bulk corporate clients and complex GST filings without the friction of hiring, training, and retaining full-time junior accountants.',
      icon: TrendingUp
    },
    {
      title: 'Strict Confidentiality Guaranteed',
      description: '100% white-label confidentiality. We operate invisibly in the background under your firm letterhead and NDA protocols.',
      icon: ShieldCheck
    },
    {
      title: 'Huge Volume Retainer Discounts',
      description: 'The more client accounts you outsource, the higher your margins. Outsource owners unlock 25% to 40% OFF standard retainers.',
      icon: DollarSign
    }
  ];

  return (
    <>
      {/* Industries We Serve Grid Section */}
      <section id="industries" className="py-20 bg-white border-b border-slate-200/70 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-[#10B981]/25 inline-block">
                Sector Expertise
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight font-display">
                Industries We Serve
              </h2>
              <p className="text-slate-600 text-base font-sans">
                Specialized domain accounting, tax compliance, and regulatory reporting tailored to the unique economic models of India&apos;s leading sectors.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((ind, idx) => {
              const IconComponent = ICON_MAP[ind.iconName] || Briefcase;
              return (
                <ScrollReveal key={idx} delayMs={idx * 60}>
                  <div className="bg-[#F5F7FA] rounded-2xl p-6 border border-slate-200/80 hover:border-[#10B981]/40 hover:bg-white hover:shadow-soft-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group h-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors shadow-xs">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#0B1F3A]/60 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                          {ind.metrics}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-[#0B1F3A] font-display group-hover:text-[#10B981] transition-colors">
                          {ind.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed font-sans">
                          {ind.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center justify-between">
                      <button
                        onClick={() => onOpenBookingModal(`${ind.title} Accounting Support`)}
                        className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#10B981] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Explore Sector Spec</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* Flagship B2B White-Label Outsourcing Hub for CA Firms & Business Owners */}
      <section id="outsourcing" className="py-24 bg-[#0B1F3A] text-white border-b border-[#162D4F] overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(#1E3B66_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#10B981]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          
          {/* Section Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Our Primary Flagship Business · 100% Talkable Fees</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display leading-[1.15]">
              White-Label Accounting Outsourcing <br className="hidden sm:block" />
              <span className="text-[#10B981]">100% Talkable Rates · Bigger Discounts · Up to Free Trial</span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans max-w-2xl mx-auto">
              Are you a practicing CA, CPA, or bookkeeping agency owner? Outsource your clients&apos; daily bookkeeping, GST filings, TDS, and payroll to our dedicated CA pods under <strong className="text-white font-semibold">your own brand</strong>. All fees are completely talkable, additional custom discounts are always on the table, and qualified practice owners can get started with <span className="text-[#10B981] font-bold">up to a 100% free pilot trial account</span>.
            </p>
          </div>

          {/* Golden Talkable Fees & Free Pilot Guarantee Banner */}
          <div className="bg-gradient-to-r from-amber-500/15 via-[#102A4E] to-emerald-500/15 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 text-center space-y-4 relative overflow-hidden shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-mono text-[11px] font-extrabold uppercase tracking-wide">
              <span>★ Partner Promise: All Fees Are Talkable &amp; Negotiable</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Have Unique Requirements or a Target Budget? Let&apos;s Talk!
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto font-sans leading-relaxed">
              We never let rigid pricing stand in the way of a long-term partnership. Our fees are flexible, bigger volume discounts are readily discussed, and you can test our zero-penalty accuracy with a <span className="text-emerald-300 font-bold underline decoration-emerald-400 underline-offset-4">100% Free 30-Day Pilot Account</span> before paying a single rupee.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onOpenBookingModal('Claim 100% Free Pilot Trial Account (Outsourcing)')}
                className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs sm:text-sm font-bold font-display rounded-xl shadow-soft hover:shadow-soft-md transition-transform hover:scale-102 cursor-pointer flex items-center gap-2"
              >
                <span>Claim 100% Free Pilot Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenBookingModal('Discuss Talkable Outsource Retainer Pricing')}
                className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#132D52] text-white text-xs sm:text-sm font-bold font-display rounded-xl border border-white/20 hover:border-[#10B981] transition-colors cursor-pointer"
              >
                <span>Discuss Custom / Talkable Rates</span>
              </button>
            </div>
          </div>

          {/* 3 Tiered Volume Discount Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {outsourcingTiers.map((tier, idx) => (
              <ScrollReveal key={tier.name} delayMs={idx * 80}>
                <div
                  className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative h-full ${
                    tier.popular
                      ? 'bg-gradient-to-b from-[#102A4E] to-[#0D223F] border-2 border-[#10B981] shadow-2xl scale-102 -translate-y-1'
                      : 'bg-[#102A4E]/80 border border-[#1E3B66] shadow-soft hover:border-[#10B981]/50'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-[10px] font-mono font-extrabold uppercase px-4 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                      <Zap className="w-3 h-3 fill-current" />
                      <span>Most Popular For Growing CA Firms</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                          {tier.range}
                        </span>
                        <span className="text-xs font-mono font-extrabold text-[#10B981] bg-[#10B981]/20 px-2.5 py-0.5 rounded-full border border-[#10B981]/30">
                          {tier.discountBadge}
                        </span>
                      </div>

                      <h3 className="text-2xl font-extrabold text-white font-display">
                        {tier.name}
                      </h3>
                      
                      <div className="flex items-baseline gap-2 pt-2">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#10B981] font-display">
                          {tier.discount}
                        </span>
                        <span className="text-xs font-mono text-slate-300">
                          Partner Retainer Discount
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                        {tier.desc}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2.5 pt-4 border-t border-[#1E3B66]">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                        Included In Partner Pod:
                      </span>
                      {tier.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => onOpenBookingModal(`Outsourcing Partner: ${tier.name} (${tier.discount})`)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-soft ${
                        tier.popular
                          ? 'bg-[#10B981] hover:bg-[#059669] text-white shadow-soft-md hover:scale-102'
                          : 'bg-[#0B1F3A] hover:bg-[#132D52] text-white border border-[#1E3B66] hover:border-[#10B981]'
                      }`}
                    >
                      <span>Claim {tier.discount} Partner Rate</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Interactive Outsourcing Savings Calculator */}
          <ScrollReveal delayMs={100}>
            <div className="bg-gradient-to-r from-[#102A4E] via-[#0B1F3A] to-[#102A4E] rounded-3xl p-6 sm:p-10 border border-[#1E3B66] shadow-2xl relative overflow-hidden">
              <div className="max-w-4xl mx-auto space-y-8">
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#1E3B66]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-[#10B981]" />
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                        Outsourcing Partner Savings &amp; Margin Calculator
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-sans">
                      See how much profit your practice retains by outsourcing client accounts to Jha Accounting Solutions.
                    </p>
                  </div>

                  <div className="bg-[#0B1F3A] px-4 py-2 rounded-xl border border-[#162D4F] flex items-center gap-2 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[#10B981] font-bold">Current Tier: {calc.discountPercent}% OFF Retainer</span>
                  </div>
                </div>

                {/* Account Count Selector Buttons */}
                <div className="space-y-3">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                    Select Number of Client Accounts You Wish to Outsource:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[3, 5, 10, 15, 25].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setSelectedAccountsCount(count)}
                        className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          selectedAccountsCount === count
                            ? 'bg-[#10B981] text-white shadow-soft scale-102 ring-2 ring-[#10B981]/50'
                            : 'bg-[#0B1F3A] text-slate-300 hover:text-white hover:bg-[#132D52] border border-[#162D4F]'
                        }`}
                      >
                        <span className="text-base sm:text-lg">{count} Accounts</span>
                        <span className="text-[10px] font-normal opacity-90">
                          {count >= 16 ? '40% Discount' : count >= 6 ? '35% Discount' : '25% Discount'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Comparison Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-[#0B1F3A] p-4 sm:p-5 rounded-2xl border border-[#162D4F] space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      In-House Team Overhead
                    </span>
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-300 font-mono">
                      ₹{(calc.inHouseMonthly / 1000).toFixed(0)}k <span className="text-xs font-sans text-slate-400">/mo</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block font-sans">
                      Includes salaries, PF, software licenses &amp; office space
                    </span>
                  </div>

                  <div className="bg-[#0B1F3A] p-4 sm:p-5 rounded-2xl border border-[#162D4F] space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-mono uppercase text-[#10B981] flex items-center gap-1 justify-center sm:justify-start">
                      <BadgePercent className="w-3.5 h-3.5" />
                      <span>JAS Outsource Fee ({calc.discountPercent}% OFF)</span>
                    </span>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#10B981] font-mono">
                      ₹{(calc.discountedMonthly / 1000).toFixed(0)}k <span className="text-xs font-sans text-[#10B981]/70">/mo</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block font-sans">
                      Dedicated CA pod + all software &amp; filing SLAs included
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-[#10B981]/20 to-[#10B981]/5 p-4 sm:p-5 rounded-2xl border border-[#10B981]/40 space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#10B981]">
                      Your Estimated Annual Savings
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                      ₹{(calc.annualSavings / 100000).toFixed(1)} Lakhs
                    </div>
                    <span className="text-[11px] text-[#10B981] block font-sans font-medium">
                      + 100% Zero-penalty filing SLA guarantee
                    </span>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="pt-2 flex flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-sans">
                    <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Protected by strict bilateral NDA. All fees are 100% talkable, customized, and negotiable.</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={() => onOpenBookingModal(`Claim 100% Free Pilot Trial Account (${selectedAccountsCount} Accounts Planned)`)}
                      className="px-3 py-2 bg-[#0B1F3A] hover:bg-[#132D52] text-[#10B981] hover:text-white text-xs sm:text-sm font-bold font-display rounded-xl border border-[#10B981]/40 hover:border-[#10B981] transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Claim Free Pilot Account</span>
                    </button>

                    <button
                      onClick={() => onOpenBookingModal(`Outsourcing Partner Inquiry: ${selectedAccountsCount} Accounts (${calc.discountPercent}% Discount + Talkable Pricing)`)}
                      className="px-4 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-xs sm:text-sm font-bold font-display rounded-xl shadow-soft flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 hover:scale-102 transition-transform"
                    >
                      <span>Lock In {calc.discountPercent}% Discount &amp; Talk Pricing</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </ScrollReveal>

          {/* Key Advantages Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {whiteLabelBenefits.map((benefit, idx) => {
              const IconComponent = benefit.icon;
              return (
                <div key={idx} className="bg-[#102A4E]/60 rounded-2xl p-6 border border-[#1E3B66] flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] border border-[#1E3B66] flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white font-display">
                      {benefit.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
};
