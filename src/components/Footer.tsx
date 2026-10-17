import React from 'react';
import {
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  MessageSquare,
  BarChart3,
  Globe2,
  Lock,
  Sparkles,
  Calculator,
  Calendar,
  Award,
  ArrowRight
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

interface FooterProps {
  onNavigate: (view: 'home' | 'blog' | 'analytics', sectionId?: string) => void;
  onOpenBookingModal: (service?: string) => void;
  onOpenAdminPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBookingModal, onOpenAdminPortal }) => {
  const { firm } = JHA_ACCOUNTING_DATA;

  return (
    <footer className="bg-[#070D1F] text-slate-300 border-t border-[#1E2B52] relative overflow-hidden select-none py-10 sm:py-12">
      
      {/* Background Subtle Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* PAN-INDIA HIGHLIGHT BANNER BAR */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-[#0D1838] to-emerald-950/80 p-3.5 sm:p-4 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-bold flex items-center justify-center shrink-0">
              <Globe2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white tracking-tight">
                  Pan-India GST &amp; Accounting Practice
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                  All 28 States &amp; 8 UTs
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                Serving 450+ scale-ups &amp; businesses across Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune &amp; all Tier-1/2/3 cities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('home', 'solutions')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Explore India GST Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* COMPACT & POWERFUL 4-COLUMN CORE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 pt-2">
          
          {/* Column 1: Brand & Direct Desk (4 Cols) */}
          <div className="lg:col-span-4 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-600/20 border border-emerald-500/40 text-emerald-400 font-extrabold font-mono text-xl flex items-center justify-center shadow-md shrink-0">
                JAS
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-none">
                  {firm.name}
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider block mt-1">
                  Est. 2022 · GST &amp; Tax Consultant
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              High-precision GST filing, corporate bookkeeping, TDS compliance, payroll operations, and Virtual CFO advisory delivered seamlessly across India.
            </p>

            <div className="space-y-1.5 text-xs font-mono pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={`tel:${firm.directMobileRaw}`} className="text-white font-bold hover:text-emerald-300 transition-colors">
                  {firm.primaryPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={`mailto:${firm.primaryEmail}`} className="text-white font-bold hover:text-emerald-300 transition-colors">
                  {firm.primaryEmail}
                </a>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <a
                href={firm.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Direct</span>
              </a>
              <a
                href={`tel:${firm.directMobileRaw}`}
                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-xl transition-colors border border-slate-700"
                title="Direct Call"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>

          {/* Column 2: Financial Solutions (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Financial Solutions
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onOpenBookingModal('Corporate Accounting & Bookkeeping')} className="hover:text-white transition-colors text-left">
                  • Corporate Cloud Bookkeeping
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('GST Compliance & ITC Reconciliation')} className="hover:text-white transition-colors text-left">
                  • Multi-State GST &amp; GSTR-2B Recovery
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('TDS Returns & Payroll Management')} className="hover:text-white transition-colors text-left">
                  • TDS Returns &amp; Statutory Payroll
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('Virtual CFO Advisory')} className="hover:text-white transition-colors text-left">
                  • Virtual CFO &amp; Cash Runway Modeling
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('B2B Accounting Outsourcing')} className="hover:text-white transition-colors text-left">
                  • B2B Back-Office Accounting Pods
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Interactive Client Tools (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Interactive Tools &amp; Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('home', 'solutions')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>India State GST Rules Map</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', 'solutions')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Tax &amp; GST Calculators</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', 'about')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Statutory Tax Calendar</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Tax Knowledge Base &amp; Blog</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Visitor Analytics</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Pan-India Delivery Centers (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Key Offices
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-white block">New Delhi (HQ)</span>
                <span className="text-[10px] text-slate-400">Netaji Subhash Place</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-white block">Gurugram</span>
                <span className="text-[10px] text-slate-400">Sector 44 Hub</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-white block">Mumbai &amp; Bengaluru</span>
                <span className="text-[10px] text-slate-400">BKC &amp; Indiranagar</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM SLA & COPYRIGHT BAR */}
        <div className="pt-6 border-t border-[#1E2B52] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div>
            <span>© {new Date().getFullYear()} {firm.name} Pvt. Ltd. All Rights Reserved.</span>
            <span className="hidden sm:inline text-slate-600 mx-2">·</span>
            <span className="block sm:inline text-[10px] text-slate-400">{firm.registrationId}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              ISO 27001 Data Security
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">24-Hour SLA</span>

            {/* Social Icons & Admin Portal Trigger */}
            <div className="flex items-center gap-1.5 ml-2">
              {onOpenAdminPortal && (
                <button
                  onClick={onOpenAdminPortal}
                  className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 hover:text-emerald-300 font-mono font-bold text-[10px] flex items-center justify-center transition-colors"
                  title="Admin Portal Access"
                >
                  A
                </button>
              )}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-3 h-3" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-colors"
                title="Twitter"
              >
                <Twitter className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
