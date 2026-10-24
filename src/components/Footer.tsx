import React from 'react';
import {
  ShieldCheck,
  Phone,
  Mail,
  MessageSquare,
  ArrowRight,
  Lock,
  Globe2
} from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';

interface FooterProps {
  onNavigate: (view: 'home' | 'blog' | 'analytics' | '404', sectionId?: string) => void;
  onOpenBookingModal: (service?: string) => void;
  onOpenClientPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBookingModal, onOpenClientPortal }) => {
  const { brand, services } = COMPANY_CONTENT;

  return (
    <footer className="bg-[#0B1F3A] text-slate-300 border-t border-[#162D4F] relative overflow-hidden py-16">
      
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#10B981]/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Practice Banner */}
        <div className="bg-[#132D52] p-5 sm:p-6 rounded-2xl border border-[#162D4F] flex flex-col md:flex-row items-center justify-between gap-4 shadow-soft">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-bold flex items-center justify-center shrink-0">
              <Globe2 className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-extrabold text-white tracking-tight font-display">
                  Corporate Accounting, GST Compliance &amp; Income Tax
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 rounded-full">
                  All 28 States &amp; 8 UTs
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-tight mt-1 font-sans">
                Providing statutory compliance and financial bookkeeping services across India.
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

        {/* 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pt-4">
          
          {/* Column 1: Brand + Contact */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#132D52] border border-[#162D4F] text-[#10B981] font-extrabold font-mono text-xl flex items-center justify-center shadow-soft-sm shrink-0">
                {brand.shortName}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-none font-display">
                  {brand.name}
                </h3>
                <span className="text-[11px] font-mono text-[#10B981] font-semibold uppercase tracking-wider block mt-1">
                  {brand.leadPartnerTitle}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Dedicated to professional GST compliance, income tax computation, quarterly TDS/TCS filings, and systematic bookkeeping for Indian businesses.
            </p>

            <div className="space-y-1.5 text-xs font-mono pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <a href={`tel:${brand.directMobileRaw}`} className="text-white font-bold hover:text-[#10B981] transition-colors focus:outline-none focus:ring-1 focus:ring-[#10B981]">
                  {brand.primaryPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <a href={`mailto:${brand.primaryEmail}`} className="text-white font-bold hover:text-[#10B981] transition-colors focus:outline-none focus:ring-1 focus:ring-[#10B981]">
                  {brand.primaryEmail}
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={brand.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="bg-[#10B981] hover:bg-[#059669] text-white py-2 px-3.5 rounded-xl text-xs font-bold transition-all shadow-soft-sm flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Direct</span>
              </a>
              <button
                onClick={onOpenClientPortal}
                className="bg-[#132D52] hover:bg-[#1A3A6B] text-white py-2 px-3 rounded-xl text-xs font-bold transition-colors border border-[#162D4F] cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-[#10B981] active:scale-[0.98]"
                title="Client Portal Login"
              >
                <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Client Portal</span>
              </button>
            </div>
          </div>

          {/* Column 2: Approved Services */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Approved Practice Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              {services.map((srv) => (
                <li key={srv.id}>
                  <button onClick={() => onOpenBookingModal(srv.title)} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                    {srv.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              <li>
                <button onClick={() => onNavigate('home', 'services')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Core Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', 'free-tools')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Compliance Calendar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', 'gst-map')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  GST State Rules
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Tax Knowledge Base
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', 'contact')} className="hover:text-white transition-colors text-left focus:outline-none focus:text-[#10B981] cursor-pointer">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Professional Notice */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Engagement Terms
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Services provided strictly within approved categories: GST compliance, Income Tax computation &amp; return, TDS/TCS returns, and Bookkeeping. Deliverables subject to client applicability and mutually agreed engagement terms.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#162D4F] flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4 font-mono">
          <div>
            &copy; {new Date().getFullYear()} {brand.name} ({brand.leadPartnerTitle}). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#10B981]">
              <ShieldCheck className="w-4 h-4" />
              <span>Professional Statutory Integrity</span>
            </span>
            <span>{brand.addressSummary}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
