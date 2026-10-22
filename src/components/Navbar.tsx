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
  currentView: 'home' | 'blog' | 'analytics';
  onNavigate: (view: 'home' | 'blog' | 'analytics', sectionId?: string) => void;
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

  const navLinks = [
    { label: 'Services', sectionId: 'services' },
    { label: 'Virtual CFO', sectionId: 'virtual-cfo' },
    { label: 'Industries', sectionId: 'industries' },
    { label: 'Outsourcing', sectionId: 'outsourcing' },
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
          ? 'bg-white/90 backdrop-blur-md shadow-soft border-b border-slate-200/80 py-3'
          : 'bg-white border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand Mark */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-[#10B981] rounded-xl cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] border border-[#162D4F] text-[#10B981] font-extrabold font-mono text-xl flex items-center justify-center shadow-soft-sm group-hover:scale-105 transition-transform shrink-0">
              JAS
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-[#0B1F3A] tracking-tight leading-none font-display">
                  Jha Accounting
                </span>
                <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.2 rounded hidden sm:inline-block">
                  SOLUTIONS
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 tracking-tight leading-none mt-0.5">
                GST &amp; Tax Consultant · Lead Partner Rishi Jha
              </span>
            </div>
          </button>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.sectionId)}
                className="px-3.5 py-2 rounded-lg text-slate-700 hover:text-[#0B1F3A] hover:bg-[#F5F7FA] transition-all cursor-pointer font-medium"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Outlined Navy Client Login Link to https://jhacountingsolution.vercel.app */}
            <a
              href="https://jhacountingsolution.vercel.app"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] bg-white hover:bg-[#F5F7FA] border border-[#0B1F3A] px-3.5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              title="Client Login"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#0B1F3A]" />
              <span>Client Login</span>
            </a>

            {/* Green 'Book Free Consultation' Button */}
            <button
              onClick={() => {
                trackClickConsultation('Navbar_Desktop');
                onOpenBookingModal();
              }}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#10B981] hover:bg-[#059669] active:scale-98 transition-all shadow-soft hover:shadow-soft-md cursor-pointer"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4 hidden sm:inline-block" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-[#0B1F3A] hover:bg-[#F5F7FA] border border-slate-200 transition-colors cursor-pointer"
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
        <div className="lg:hidden fixed inset-x-0 top-[73px] bg-white border-b border-slate-200 shadow-soft-xl p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1 font-semibold text-slate-800">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.sectionId)}
                className="text-left px-4 py-3 rounded-xl hover:bg-[#F5F7FA] text-sm text-[#0B1F3A] cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <a
              href="https://jhacountingsolution.vercel.app"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 border border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white rounded-xl text-xs font-bold font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>Client Login</span>
            </a>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                trackClickConsultation('Navbar_Mobile');
                onOpenBookingModal();
              }}
              className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
