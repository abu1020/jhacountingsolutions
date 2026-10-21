import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Building2,
  Lock,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { trackClickConsultation } from '../lib/analytics';

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

  // Prevent background scrolling when mobile menu drawer is open
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

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleNavClick = (sectionId?: string) => {
    setIsMobileMenuOpen(false);
    onNavigate('home', sectionId);
  };

  const navLinks = [
    { label: 'Services', sectionId: 'services' },
    { label: 'Virtual CFO', sectionId: 'virtual-cfo' },
    { label: 'Industries', sectionId: 'industries' },
    { label: 'Outsourcing', sectionId: 'outsourcing' },
    { label: 'Contact', sectionId: 'contact-advisory' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-slate-200/80 py-3'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo on the Left */}
          <button
            onClick={() => handleNavClick()}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            aria-label="Jha Accounting Solutions Home"
          >
            {/* Abstract Corporate Monogram Logo */}
            <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] flex items-center justify-center text-white font-display font-bold shadow-soft-sm group-hover:bg-[#132D52] transition-colors relative overflow-hidden">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                className="w-6 h-6 text-[#10B981]"
                aria-hidden="true"
              >
                <path
                  d="M6 8V24C6 25.1 6.9 26 8 26H22"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 12H24C25.1 12 26 12.9 26 14V20C26 21.1 25.1 22 24 22H16"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="20" cy="17" r="2" fill="#10B981" />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base sm:text-lg text-[#0B1F3A] tracking-tight group-hover:text-[#10B981] transition-colors">
                  Jha Accounting
                </span>
                <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.2 rounded hidden sm:inline-block">
                  SOLUTIONS
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 tracking-tight leading-none">
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
            
            {/* Client Portal Discrete Trigger */}
            {onOpenClientPortal && (
              <button
                onClick={onOpenClientPortal}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0B1F3A] hover:bg-[#F5F7FA] px-3 py-2 rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                title="Client Portal Login"
              >
                <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Client Portal</span>
              </button>
            )}

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

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-slate-900/40 backdrop-blur-xs z-50 animate-in fade-in duration-150">
          <div className="bg-white border-b border-slate-200 shadow-soft-lg px-6 py-6 space-y-5 max-h-[85vh] overflow-y-auto">
            
            {/* Navigation Links */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block px-3 mb-1">
                Navigation
              </span>
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.sectionId)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-800 hover:text-[#0B1F3A] hover:bg-[#F5F7FA] font-semibold text-sm transition-colors text-left"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>

            {/* Mobile CTAs & Portals */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBookingModal();
                }}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#10B981] hover:bg-[#059669] transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenClientPortal && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenClientPortal();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-[#F5F7FA] hover:bg-slate-200/70 border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Existing Client Login (Client Portal)</span>
                </button>
              )}

              {onOpenAdminPortal && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdminPortal();
                  }}
                  className="w-full py-2 px-4 rounded-xl text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors text-center"
                >
                  Internal Team &amp; Partner Desk
                </button>
              )}
            </div>

            {/* Quick Contact Line */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Direct Tax Desk:</span>
              <a
                href="tel:+918882860226"
                className="font-mono font-bold text-[#0B1F3A] hover:text-[#10B981]"
              >
                +91 88828 60226
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
