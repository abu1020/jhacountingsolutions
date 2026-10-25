import React, { useState } from 'react';
import {
  Home,
  Search,
  ArrowRight,
  FileText,
  Calendar,
  Calculator,
  PhoneCall,
  MessageSquare,
  ShieldAlert,
  ReceiptText,
  BookOpen,
  ExternalLink
} from 'lucide-react';

interface NotFoundPageProps {
  attemptedPath?: string;
  onNavigateHome: () => void;
  onNavigateToSection: (sectionId: string) => void;
  onNavigateToBlog: () => void;
  onOpenBookingModal: (service?: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  attemptedPath = '',
  onNavigateHome,
  onNavigateToSection,
  onOpenBookingModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const quickLinks = [
    {
      title: 'GST Compliance Services',
      description: 'Monthly/quarterly GSTR-1, GSTR-3B, GSTR-2B ITC reconciliation & annual GSTR-9/9C.',
      category: 'Services',
      action: () => onNavigateToSection('services'),
      icon: FileText,
      badge: 'Approved Service'
    },
    {
      title: 'Income Tax Return and Computation',
      description: 'Annual ITR filing under Section 139 and quarterly advance tax calculations.',
      category: 'Services',
      action: () => onNavigateToSection('services'),
      icon: Calculator,
      badge: 'Approved Service'
    },
    {
      title: 'TDS/TCS Quarterly Returns',
      description: 'Verification under Chapter XVII-B, quarterly Forms 24Q, 26Q, 27Q, 27EQ & TRACES Form 16/16A.',
      category: 'Services',
      action: () => onNavigateToSection('services'),
      icon: ReceiptText,
      badge: 'Approved Service'
    },
    {
      title: 'Bookkeeping and Accounting',
      description: 'Periodic ledger review, trial balance finalisation, and Balance Sheet/P&L statements.',
      category: 'Services',
      action: () => onNavigateToSection('services'),
      icon: BookOpen,
      badge: 'Approved Service'
    },
    {
      title: 'Tax Compliance Calendar',
      description: 'Statutory deadline tracking for monthly TDS, GSTR-1, GSTR-3B, and Advance Tax.',
      category: 'Compliance',
      action: () => onNavigateToSection('free-tools'),
      icon: Calendar,
      badge: 'Due Dates'
    },
    {
      title: 'Direct Practice Consultation',
      description: 'Connect directly with Lead Partner Rishi Jha regarding your accounting and tax requirements.',
      category: 'Consultation',
      action: () => onOpenBookingModal('404 Page Consultation'),
      icon: PhoneCall,
      badge: 'Consult Desk'
    }
  ];

  const filteredLinks = searchQuery.trim() === ''
    ? quickLinks
    : quickLinks.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#071528] via-[#0B1F3A] to-[#071528] text-white flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden">
      
      {/* Background ambient mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-[#10B981] rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        
        {/* Top Header & 404 Status Badge */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-inner">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>HTTP 404 · Page Not Found</span>
          </div>

          <div className="relative">
            <h1 className="text-7xl sm:text-9xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 select-none">
              404
            </h1>
            <p className="text-lg sm:text-2xl font-bold text-white font-display mt-2">
              Page Not Found
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-sans">
            The link you entered or followed does not exist on Jha Accounting Solutions or may have been updated.
          </p>

          {/* Attempted Path Indicator */}
          {attemptedPath && (
            <div className="inline-block max-w-md bg-[#102A4E]/90 border border-[#1E3B66] rounded-xl px-4 py-2 text-xs font-mono text-slate-300 truncate">
              <span className="text-slate-400">Target path: </span>
              <span className="text-amber-300 font-semibold">{attemptedPath}</span>
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onNavigateHome}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-sm shadow-soft hover:shadow-soft-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>

          <button
            onClick={() => onOpenBookingModal('404 Page Consultation')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#132D52] hover:bg-[#1A3A68] border border-[#1E3B66] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Contact Practice (+91 88828 60226)</span>
          </button>
        </div>

        {/* Interactive Search Bar to Find the Right Service */}
        <div className="mt-12 bg-[#0E2442] border border-[#1A3860] rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Looking for our approved accounting &amp; tax services?
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Select from our four approved service categories or compliance tools below.
              </p>
            </div>

            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search GST, ITR, TDS, Bookkeeping..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#08172C] border border-[#1E3B66] focus:border-[#10B981] rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition-colors font-sans"
              />
            </div>
          </div>

          {/* Quick Jump Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredLinks.length > 0 ? (
              filteredLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={item.action}
                    className="p-4 rounded-xl bg-[#102A4E]/60 hover:bg-[#102A4E] border border-[#1B365D] hover:border-[#10B981]/50 text-left transition-all group flex items-start gap-3.5 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#16345E] border border-[#234575] flex items-center justify-center text-[#10B981] shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 font-sans line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 self-center" />
                  </button>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-slate-400 space-y-2">
                <p className="text-sm">No exact matches for &quot;{searchQuery}&quot;</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-mono text-emerald-400 hover:underline cursor-pointer"
                >
                  Clear search and view approved services &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Practice Contact Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Practice Helpline: +91-8882860226 (Mon-Sat, 9:30 AM - 6:30 PM IST)</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/918882860226?text=Hi%20Jha%20Accounting%20Solutions%2C%20I%20hit%20a%20404%20error%20page%20and%20need%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://jhacountingsolution.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white font-medium inline-flex items-center gap-1"
            >
              <span>Client Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
