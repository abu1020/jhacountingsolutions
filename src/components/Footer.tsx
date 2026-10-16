import React from 'react';
import {
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Linkedin,
  Twitter,
  MessageSquare,
  BarChart3,
  Globe2,
  Lock
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

interface FooterProps {
  onNavigate: (view: 'home' | 'blog' | 'analytics', sectionId?: string) => void;
  onOpenBookingModal: (service?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBookingModal }) => {
  const { firm, offices } = JHA_ACCOUNTING_DATA;

  return (
    <footer className="bg-[#0A1128] text-slate-300 border-t border-[#1E2B52] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid: Brand & Credentials + Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A1128] to-[#1E2B52] border border-emerald-500/40 text-emerald-400 font-bold font-mono text-xl flex items-center justify-center shadow-md">
                JAS
              </div>
              <div>
                <span className="text-lg font-extrabold text-white tracking-tight block">
                  {firm.name}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                  Established 2022 · GST &amp; Tax Practice
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {firm.tagline}. High-precision bookkeeping, multi-state GST filing, corporate TDS returns, statutory payroll operations, and Virtual CFO advisory for Indian scale-ups and enterprises.
            </p>

            <div className="space-y-1 text-xs text-slate-400 font-mono pt-2">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{firm.primaryPhone} · {firm.directMobile}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{firm.primaryEmail}</span>
              </p>
            </div>

            {/* Social Media Connected Profiles */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-colors"
                title="Twitter Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={firm.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-colors"
                title="WhatsApp Direct Channel"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Practice Areas */}
          <div className="space-y-3 text-xs">
            <span className="font-mono font-bold text-white uppercase text-[11px] block text-emerald-400">
              Practice Areas
            </span>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onOpenBookingModal('Corporate Accounting & Bookkeeping')} className="hover:text-white transition-colors">
                  Corporate Cloud Bookkeeping
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('GST Compliance & ITC Reconciliation')} className="hover:text-white transition-colors">
                  Multi-State GST Compliance
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('TDS Returns & Payroll Management')} className="hover:text-white transition-colors">
                  TDS Returns & Payroll Operations
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('Virtual CFO Advisory')} className="hover:text-white transition-colors">
                  Virtual CFO & Runway Modeling
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBookingModal('B2B Accounting Outsourcing')} className="hover:text-white transition-colors">
                  B2B Back-Office Pods
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Site Navigation */}
          <div className="space-y-3 text-xs">
            <span className="font-mono font-bold text-white uppercase text-[11px] block text-emerald-400">
              Platform Navigation
            </span>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('home', 'services')} className="hover:text-white transition-colors">
                  Services Grid
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Insights & Blog Hub</span>
                  <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 px-1 rounded">4 Articles</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Visitor Analytics</span>
                </button>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  XML Sitemap
                </a>
              </li>
              <li>
                <a href="/robots.txt" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Robots.txt
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Statutory Notice Guarantee */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div>
            <p>© {new Date().getFullYear()} {firm.name} Pvt. Ltd. All Rights Reserved.</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{firm.registrationId}</p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              ISO Data Security Compliant
            </span>
            <span>Guaranteed 24-Hour Account Response SLA</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
