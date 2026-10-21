import React from 'react';
import {
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ArrowRight,
  Lock,
  Globe2
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

interface FooterProps {
  onNavigate: (view: 'home' | 'blog' | 'analytics', sectionId?: string) => void;
  onOpenBookingModal: (service?: string) => void;
  onOpenClientPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBookingModal, onOpenClientPortal }) => {
  const { firm } = JHA_ACCOUNTING_DATA;

  return (
    <footer className="bg-[#0B1F3A] text-slate-300 border-t border-[#162D4F] relative overflow-hidden py-16">
      
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#10B981]/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Pan-India Banner */}
        <div className="bg-[#132D52] p-5 sm:p-6 rounded-2xl border border-[#162D4F] flex flex-col md:flex-row items-center justify-between gap-4 shadow-soft">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-bold flex items-center justify-center shrink-0">
              <Globe2 className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-extrabold text-white tracking-tight font-display">
                  Pan-India GST &amp; Corporate Accounting Practice
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 rounded-full">
                  All 28 States &amp; 8 UTs
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-tight mt-1 font-sans">
                Serving 450+ scale-ups across New Delhi NCR, Gurugram, Mumbai, Bengaluru, and pan-India economic hubs.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('home', 'free-tools')}
            className="bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-soft-sm flex items-center gap-2 cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
          >
            <span>Try Free GST Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Column Footer Grid as Requested */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pt-4">
          
          {/* Column 1: Brand + Short Tagline (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#132D52] border border-[#162D4F] text-[#10B981] font-extrabold font-mono text-xl flex items-center justify-center shadow-soft-sm shrink-0">
                JAS
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-none font-display">
                  {firm.name}
                </h3>
                <span className="text-[11px] font-mono text-[#10B981] font-semibold uppercase tracking-wider block mt-1">
                  GST &amp; Tax Consultant · Lead Partner Rishi Jha
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Modern corporate accounting, multi-state GST filing, TDS compliance, and Virtual CFO advisory engineered for India&apos;s growing businesses with zero-penalty SLAs.
            </p>

            <div className="space-y-1.5 text-xs font-mono pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <a href={`tel:${firm.directMobileRaw}`} className="text-white font-bold hover:text-[#10B981] transition-colors focus:outline-none focus:ring-1 focus:ring-[#10B981]">
                  {firm.primaryPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <a href={`mailto:${firm.primaryEmail}`} className="text-white font-bold hover:text-[#10B981] transition-colors focus:outline-none focus:ring-1 focus:ring-[#10B981]">
                  {firm.primaryEmail}
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={firm.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="bg-[#10B981] hover:bg-[#059669] text-white py-2 px-3.5 rounded-xl text-xs font-bold transition-all shadow-soft-sm flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Direct</span>
              </a>
              {onOpenClientPortal && (
                <button
                  onClick={onOpenClientPortal}
                  className="bg-[#132D52] hover:bg-[#1A3A6B] text-white py-2 px-3 rounded-xl text-xs font-bold transition-colors border border-[#162D4F] cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                >
                  <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Client Portal</span>
                </button>
              )}
            </div>
          </div>

          {/* Column 2: Services (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              <li>
                <button onClick={() => onOpenBookingModal('Corporate Accounting & Bookkeeping')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Corporate Accounting &amp; Bookkeeping
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('Multi-State GST Filing')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Multi-State GST Filing &amp; ITC
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('TDS Compliance')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  TDS Compliance &amp; Returns
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('Payroll Operations')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Payroll Operations &amp; PF/ESIC
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('Virtual CFO Advisory')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Virtual CFO Advisory
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('Audit Support')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Audit Support &amp; Tax Scrutiny
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              <li>
                <button onClick={() => onNavigate('home', 'about')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  About Our Firm
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', 'virtual-cfo')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Leadership Team
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', 'contact')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  4 Office Locations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Tax &amp; GST Insights
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Firm Analytics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', 'contact')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal (Privacy Policy, Terms) (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Legal &amp; Compliance
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              <li>
                <button onClick={() => onOpenBookingModal('Privacy Policy Inquiry')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Privacy Policy &amp; Data Protection
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('Terms of Service Inquiry')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Terms of Service &amp; Retainer SLA
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('White-Label NDA Terms')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  White-Label Non-Disclosure Protocol
                </button>
              </li>
              <li>
                <span className="text-[11px] text-slate-400 font-mono block pt-1">
                  ICAI Professional Guidelines Compliant
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-[#162D4F] flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4 font-mono">
          <div>
            &copy; {new Date().getFullYear()} {firm.name} (Lead Partner Rishi Jha). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#10B981]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Zero Penalty SLA Guarantee</span>
            </span>
            <span>New Delhi · Gurugram · Mumbai · Bengaluru</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
