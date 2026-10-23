import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  User as UserIcon,
  Loader2,
  Lock,
  LayoutDashboard
} from 'lucide-react';
import { trackClickConsultation } from '../lib/analytics';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: 'home' | 'blog' | 'analytics' | 'dashboard' | 'setup' | '404' | string;
  onNavigate: (view: 'home' | 'blog' | 'analytics' | '404', sectionId?: string) => void;
  onOpenBookingModal: (service?: string) => void;
  onOpenAdminPortal?: () => void;
  onOpenClientPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenBookingModal,
  onOpenAdminPortal,
  onOpenClientPortal
}) => {
  const { user, userProfile, authLoading, signInWithGoogle } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  interface NavItem {
    label: string;
    sectionId: string;
    highlight?: boolean;
    badge?: string;
  }

  const navLinks: NavItem[] = [
    { label: 'Services', sectionId: 'services' },
    { label: 'Outsourcing', sectionId: 'outsourcing', highlight: true },
    { label: 'Virtual CFO', sectionId: 'virtual-cfo' },
    { label: 'Industries', sectionId: 'industries' },
    { label: 'Free Tools', sectionId: 'free-tools' },
    { label: 'Contact', sectionId: 'contact' }
  ];

  const handleNavClick = (sectionId: string) => {
    onNavigate('home', sectionId);
    setIsMobileMenuOpen(false);
  };

  const handleClientLoginClick = () => {
    window.location.href = 'https://jhacountingsolution.vercel.app';
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-soft border-b border-slate-200/80 py-2.5 sm:py-3'
          : 'bg-white border-b border-slate-100 py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo Brand Mark */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none focus:ring-2 focus:ring-[#10B981] rounded-xl cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B1F3A] border border-[#162D4F] text-[#10B981] font-extrabold font-mono text-lg sm:text-xl flex items-center justify-center shadow-soft-sm group-hover:scale-105 group-hover:border-[#10B981]/50 transition-all shrink-0">
              JAS
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base font-extrabold text-[#0B1F3A] tracking-tight leading-none font-display whitespace-nowrap">
                  Jha Accounting
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20 hidden xs:inline-block whitespace-nowrap">
                  SOLUTIONS
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-tight leading-none mt-1 hidden md:block whitespace-nowrap">
                GST &amp; Tax Consultant · Lead Partner Rishi Jha
              </span>
            </div>
          </button>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 font-medium text-xs xl:text-sm text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.sectionId)}
                className={`px-2.5 xl:px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  link.highlight
                    ? 'text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 font-semibold'
                    : 'text-slate-700 hover:text-[#0B1F3A] hover:bg-[#F5F7FA] font-medium'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[8px] font-mono font-bold bg-[#10B981] text-white px-1 py-0 rounded-md uppercase tracking-wider">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 shrink-0">
            
            {/* Outlined Navy Client Login Link */}
            <a
              href="https://jhacountingsolution.vercel.app"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] bg-white hover:bg-emerald-50/50 border border-slate-300 hover:border-[#10B981] px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#10B981] whitespace-nowrap shrink-0 group"
              title="Client Login"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#10B981] group-hover:scale-110 transition-transform shrink-0" />
              <span className="whitespace-nowrap">Client Login</span>
            </a>

            {/* Green 'Book Free Consultation' Button */}
            <button
              onClick={() => {
                trackClickConsultation('Navbar_Desktop');
                onOpenBookingModal();
              }}
              className="hidden sm:inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 xl:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] active:scale-[0.98] transition-all shadow-soft hover:shadow-soft-md cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">Book Free Consultation</span>
              <ArrowRight className="w-4 h-4 hidden xl:inline-block shrink-0" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-[#0B1F3A] hover:bg-[#F5F7FA] border border-slate-200 transition-colors cursor-pointer shrink-0"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#0B1F3A]" />
              ) : (
                <Menu className="w-5 h-5 text-[#0B1F3A]" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] sm:top-[73px] bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4 animate-in slide-in-from-top-2 duration-200 z-50">
          {/* Practice Badge */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-[11px] font-mono font-bold text-[#10B981] uppercase tracking-wider">
              Pan-India Accounting &amp; Virtual CFO
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              4 Physical Offices
            </span>
          </div>

          <nav className="flex flex-col space-y-1 font-semibold text-slate-800">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.sectionId)}
                className={`text-left px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-between whitespace-nowrap ${
                  link.highlight
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'hover:bg-[#F5F7FA] text-[#0B1F3A] hover:text-[#10B981]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-mono font-extrabold bg-[#10B981] text-white px-2 py-0.5 rounded-full uppercase">
                      {link.badge}
                    </span>
                  )}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <a
              href="https://jhacountingsolution.vercel.app"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 bg-[#0B1F3A] text-white hover:bg-[#132D52] rounded-xl text-xs font-bold font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-soft whitespace-nowrap"
            >
              <UserIcon className="w-4 h-4 text-[#10B981]" />
              <span className="whitespace-nowrap">Client Login &rarr;</span>
            </a>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                trackClickConsultation('Navbar_Mobile');
                onOpenBookingModal();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span className="whitespace-nowrap">Book Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
