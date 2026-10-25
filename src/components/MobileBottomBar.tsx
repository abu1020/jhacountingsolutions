import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Calendar,
  Calculator,
  ShieldCheck,
  User as UserIcon,
  X,
  FileText,
  MapPin,
  ChevronRight,
  ExternalLink,
  Layers
} from 'lucide-react';
import { COMPANY_CONTENT } from '../data/content';
import { trackClickPhone, trackClickWhatsApp, trackClickConsultation } from '../lib/analytics';

interface MobileBottomBarProps {
  onOpenBookingModal: (service?: string) => void;
  onOpenClientPortal?: () => void;
  onOpenAdminPortal?: () => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onOpenBookingModal,
  onOpenClientPortal,
  onOpenAdminPortal,
  onNavigateToSection
}) => {
  const [isHubOpen, setIsHubOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    setIsHubOpen(false);
    if (onNavigateToSection) {
      onNavigateToSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile Bottom Dock (Hidden on desktop md:) */}
      <nav
        aria-label="Mobile quick action navigation"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0B1F3A]/95 backdrop-blur-xl border-t border-[#1E3B66]/90 shadow-[0_-8px_30px_rgba(0,0,0,0.45)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 items-center h-16 px-1 max-w-lg mx-auto">
          
          {/* 1. Direct Phone Call */}
          <a
            href={`tel:${COMPANY_CONTENT.brand.directMobileRaw}`}
            onClick={() => trackClickPhone('Mobile_Bottom_Call')}
            className="flex flex-col items-center justify-center gap-1 py-1 text-slate-300 hover:text-white active:scale-90 transition-all cursor-pointer"
            title="Direct Practice Desk Hotline"
          >
            <div className="relative">
              <Phone className="w-4 h-4 text-[#10B981]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#10B981]" />
            </div>
            <span className="text-[10px] font-mono font-semibold tracking-tight">Call Desk</span>
          </a>

          {/* 2. WhatsApp Direct */}
          <a
            href={COMPANY_CONTENT.brand.whatsappLink}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackClickWhatsApp()}
            className="flex flex-col items-center justify-center gap-1 py-1 text-slate-300 hover:text-emerald-300 active:scale-90 transition-all cursor-pointer"
            title="Chat directly on WhatsApp"
          >
            <MessageSquare className="w-4 h-4 text-[#10B981]" />
            <span className="text-[10px] font-mono font-semibold tracking-tight">WhatsApp</span>
          </a>

          {/* 3. Center Elevated Action: Book Consultation */}
          <div className="flex items-center justify-center -mt-5">
            <button
              onClick={() => {
                trackClickConsultation('Mobile_Bottom_Bar');
                onOpenBookingModal();
              }}
              className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#059669] via-[#10B981] to-[#34D399] text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-900/50 border-2 border-white/20 active:scale-95 transition-transform cursor-pointer group"
              title="Schedule Statutory Consultation"
              aria-label="Schedule Consultation"
            >
              <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider mt-0.5">Book</span>
            </button>
          </div>

          {/* 4. GST & Tax Tools Shortcut */}
          <button
            onClick={() => handleScrollTo('free-tools')}
            className="flex flex-col items-center justify-center gap-1 py-1 text-slate-300 hover:text-white active:scale-90 transition-all cursor-pointer"
            title="GST Split Calculator & Compliance Dates"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono font-semibold tracking-tight">GST Tools</span>
          </button>

          {/* 5. Executive Hub / Portals */}
          <button
            onClick={() => setIsHubOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-1 text-slate-300 hover:text-[#10B981] active:scale-90 transition-all cursor-pointer"
            title="Client Portal & Admin CMS Access"
            aria-expanded={isHubOpen}
          >
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] font-mono font-semibold tracking-tight">Portals</span>
          </button>

        </div>
      </nav>

      {/* Slide-Up Mobile Quick Hub Sheet */}
      {isHubOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#070D1F]/80 backdrop-blur-md transition-opacity animate-in fade-in"
            onClick={() => setIsHubOpen(false)}
          />

          {/* Bottom Sheet Card */}
          <div className="relative bg-[#0B1F3A] text-white rounded-t-3xl border-t border-[#1E3B66] p-5 pb-8 space-y-4 shadow-2xl z-10 animate-in slide-in-from-bottom duration-250 max-h-[85vh] overflow-y-auto">
            
            {/* Sheet Handle & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#162D4F]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] font-mono font-bold text-xs">
                  JAS
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white font-display">
                    Executive Portals &amp; Practice Desk
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Lead Partner Rishi Jha
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsHubOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                aria-label="Close Portals Hub"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Portals Row */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Security &amp; Software Portals
              </span>

              {/* Admin CMS Button */}
              <button
                onClick={() => {
                  setIsHubOpen(false);
                  onOpenAdminPortal?.();
                }}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#102A4E] to-[#132D52] hover:from-[#132D52] hover:to-[#1A3A6B] border border-[#10B981]/40 text-left flex items-center justify-between shadow-soft cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-display">Executive Admin CMS</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#10B981]/20 text-[#10B981] font-bold">
                        Whitelisted
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-sans block mt-0.5">
                      abu01510866@gmail.com &amp; ramkj1804@gmail.com
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#10B981]" />
              </button>

              {/* Client Portal Button */}
              <button
                onClick={() => {
                  setIsHubOpen(false);
                  onOpenClientPortal?.();
                }}
                className="w-full p-3.5 rounded-2xl bg-[#0F2442] hover:bg-[#132D52] border border-[#1E3B66] text-left flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-700/50 flex items-center justify-center text-slate-300 shrink-0">
                    <UserIcon className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white font-display block">Client Service Portal</span>
                    <span className="text-[10px] text-slate-300 font-sans block mt-0.5">
                      Client onboarding &amp; engagement dashboard
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Quick Section Shortcuts */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Quick Navigation &amp; Checklists
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleScrollTo('required-documents')}
                  className="p-3 rounded-xl bg-[#071528] hover:bg-[#102A4E] border border-[#162D4F] flex items-center gap-2 text-slate-200 text-left transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-[11px] font-semibold">Docs Checklist</span>
                </button>

                <button
                  onClick={() => handleScrollTo('free-tools')}
                  className="p-3 rounded-xl bg-[#071528] hover:bg-[#102A4E] border border-[#162D4F] flex items-center gap-2 text-slate-200 text-left transition-colors"
                >
                  <Calculator className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-[11px] font-semibold">GST Calculator</span>
                </button>

                <button
                  onClick={() => handleScrollTo('gst-map')}
                  className="p-3 rounded-xl bg-[#071528] hover:bg-[#102A4E] border border-[#162D4F] flex items-center gap-2 text-slate-200 text-left transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-[11px] font-semibold">India GST Rules</span>
                </button>

                <button
                  onClick={() => handleScrollTo('services')}
                  className="p-3 rounded-xl bg-[#071528] hover:bg-[#102A4E] border border-[#162D4F] flex items-center gap-2 text-slate-200 text-left transition-colors"
                >
                  <Layers className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-[11px] font-semibold">4 Practice Areas</span>
                </button>
              </div>
            </div>

            {/* Direct Partner Hotline Pill */}
            <div className="p-3 rounded-2xl bg-[#071528] border border-[#162D4F] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-slate-300">Desk: +91-8882860226</span>
              </div>
              <a
                href={`tel:${COMPANY_CONTENT.brand.directMobileRaw}`}
                className="text-xs font-bold text-[#10B981] hover:underline"
              >
                Call Now
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
