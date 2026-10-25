import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  User as UserIcon,
  ChevronRight,
  ShieldCheck,
  Calendar,
  BookOpen,
  Briefcase,
  Phone,
  MessageSquare,
  FileCheck2
} from 'lucide-react';
import { trackClickConsultation, trackClickPhone } from '../lib/analytics';
import { COMPANY_CONTENT } from '../data/content';

interface NavbarProps {
  currentView: 'home' | 'blog' | 'analytics' | 'dashboard' | 'setup' | '404' | string;
  onNavigate: (view: 'home' | 'blog' | 'analytics' | '404', sectionId?: string) => void;
  onOpenBookingModal: (service?: string) => void;
  onOpenAdminPortal?: () => void;
  onOpenClientPortal?: () => void;
}

interface NavItem {
  label: string;
  sectionId?: string;
  view?: 'home' | 'blog' | 'analytics';
  icon: React.FC<{ className?: string }>;
  description: string;
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
  const [activeSection, setActiveSection] = useState<string>('services');
  const headerRef = useRef<HTMLElement>(null);

  // Monitor scroll for header background styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer to highlight active section on desktop and mobile
  useEffect(() => {
    if (currentView !== 'home') {
      setActiveSection('');
      return;
    }

    const sectionIds = ['services', 'required-documents', 'free-tools', 'about', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentView]);

  // Lock body scroll when mobile menu is open & listen for escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const navLinks: NavItem[] = [
    {
      label: 'Services',
      sectionId: 'services',
      view: 'home',
      icon: Briefcase,
      description: 'GST, Income Tax, TDS & Bookkeeping'
    },
    {
      label: 'Documents',
      sectionId: 'required-documents',
      view: 'home',
      icon: FileCheck2,
      description: 'Categorized checklist for GST, ITR & TDS'
    },
    {
      label: 'Compliance Dates',
      sectionId: 'free-tools',
      view: 'home',
      icon: Calendar,
      description: 'Statutory compliance dates & GST calculator'
    },
    {
      label: 'Knowledge Base',
      view: 'blog',
      icon: BookOpen,
      description: 'Tax updates & GSTR-2B ITC guidance'
    },
    {
      label: 'Contact Desk',
      sectionId: 'contact',
      view: 'home',
      icon: Phone,
      description: 'Connect with Lead Partner Rishi Jha'
    }
  ];

  const handleNavClick = (link: NavItem) => {
    setIsMobileMenuOpen(false);
    if (link.view === 'blog') {
      onNavigate('blog');
    } else {
      onNavigate('home', link.sectionId);
    }
  };

  const isLinkActive = (link: NavItem): boolean => {
    if (link.view === 'blog') {
      return currentView === 'blog';
    }
    if (currentView === 'home') {
      if (link.sectionId) {
        return activeSection === link.sectionId;
      }
      return !activeSection || activeSection === 'services';
    }
    return false;
  };

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/90 py-2 sm:py-2.5'
          : 'bg-white border-b border-slate-100 py-2.5 sm:py-3.5'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          
          {/* Brand Logo & Title */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onNavigate('home');
            }}
            className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[#10B981] rounded-xl cursor-pointer group shrink-0 min-w-0"
            aria-label="Jha Accounting Solutions Home"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0B1F3A] border border-[#162D4F] text-[#10B981] font-black font-mono text-base flex items-center justify-center shadow-xs group-hover:border-[#10B981]/60 group-hover:scale-102 transition-all shrink-0">
              JAS
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-extrabold text-[#0B1F3A] tracking-tight leading-none font-display whitespace-nowrap">
                  Jha Accounting
                </span>
                <span className="text-[9px] font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/25 shrink-0 hidden xs:inline-block">
                  SOLUTIONS
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 tracking-tight leading-none mt-1 hidden 2xl:block truncate">
                GST Compliance, Income Tax &amp; Bookkeeping · Lead Partner Rishi Jha
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-tight leading-none mt-1 hidden xl:block 2xl:hidden truncate">
                GST Compliance, Income Tax &amp; Bookkeeping
              </span>
            </div>
          </button>

          {/* Computer Navigation Links (Visible on >= 1024px, optimized for laptops) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2 font-medium text-xs xl:text-[13px] text-slate-600 shrink-0"
          >
            {navLinks.map((link) => {
              const active = isLinkActive(link);
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    active
                      ? 'text-[#0B1F3A] font-bold bg-slate-100 shadow-2xs'
                      : 'text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100/80'
                  }`}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                  )}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Computer & Mobile Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0">
            
            {/* Direct Phone Link (Desktop only) */}
            <a
              href={`tel:${COMPANY_CONTENT.brand.directMobileRaw}`}
              onClick={() => trackClickPhone('Navbar_Desktop_Call')}
              className="hidden 2xl:inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 hover:text-[#0B1F3A] px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
              title="Direct Practice Desk Hotline"
            >
              <Phone className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{COMPANY_CONTENT.brand.primaryPhone}</span>
            </a>

            {/* Client Login Button */}
            <button
              onClick={() => onOpenClientPortal?.()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] bg-white hover:bg-emerald-50/50 border border-slate-300 hover:border-[#10B981] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#10B981] whitespace-nowrap shrink-0 group hover:shadow-soft active:scale-[0.98]"
              title="Client Portal Login"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#10B981] group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden xs:inline">Client Login</span>
              <span className="xs:hidden">Login</span>
            </button>

            {/* Admin Login Button */}
            <button
              onClick={() => onOpenAdminPortal?.()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0B1F3A] hover:bg-[#132D52] border border-[#162D4F] hover:border-[#10B981] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#10B981] whitespace-nowrap shrink-0 group active:scale-[0.98]"
              title="Admin"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] group-hover:scale-110 transition-transform shrink-0" />
              <span>Admin</span>
            </button>

            {/* Desktop 'Consult With Us' Primary CTA */}
            <button
              onClick={() => {
                trackClickConsultation('Navbar_Desktop');
                onOpenBookingModal();
              }}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3.5 xl:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] active:scale-[0.98] transition-all shadow-soft hover:shadow-soft-md cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Consult With Us</span>
              <ArrowRight className="w-3.5 h-3.5 hidden xl:inline-block shrink-0" />
            </button>

            {/* Mobile / Tablet Hamburger Toggle (< 1024px) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-[#0B1F3A] hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#10B981] active:scale-95"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
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

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-[52px] sm:top-[60px] bg-slate-900/50 backdrop-blur-xs z-30 transition-opacity animate-in fade-in duration-150"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer (Attached Directly Below Header) */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200/90 shadow-2xl p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-2 duration-200 z-40 max-h-[calc(100vh-70px)] overflow-y-auto"
        >
          {/* Executive Partner Passport Card */}
          <div className="bg-[#0B1F3A] text-white p-4 rounded-2xl border border-[#162D4F] shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center font-mono font-bold text-base text-white shadow-soft-sm">
                  RJ
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white font-display leading-tight">
                    Rishi Jha
                  </h4>
                  <span className="text-[10px] font-mono text-[#10B981] font-semibold block uppercase">
                    Lead Partner · GST &amp; Tax Consultant
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[10px] font-mono text-[#10B981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>Practice Active</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#162D4F]/80 text-slate-300">
              <a
                href={`tel:${COMPANY_CONTENT.brand.directMobileRaw}`}
                className="flex items-center gap-1.5 text-white hover:text-[#10B981] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                <span>+91-8882860226</span>
              </a>

              <a
                href={COMPANY_CONTENT.brand.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="text-[#10B981] hover:underline font-bold"
              >
                Direct WhatsApp &rarr;
              </a>
            </div>
          </div>

          {/* Nav Items List */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 block">
              Practice Navigation
            </span>

            <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const active = isLinkActive(link);
                const Icon = link.icon;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link)}
                    className={`text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                      active
                        ? 'bg-emerald-50/70 border border-[#10B981]/30 text-[#0B1F3A]'
                        : 'hover:bg-[#F5F7FA] text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        active
                          ? 'bg-[#10B981] text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-[#10B981]/15 group-hover:text-[#10B981]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-xs sm:text-sm font-semibold truncate ${
                          active ? 'text-[#0B1F3A] font-bold' : 'text-slate-800'
                        }`}>
                          {link.label}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                          {link.description}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                      active ? 'text-[#10B981]' : 'text-slate-400'
                    }`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Mobile Portals & Action Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 block">
              Executive Portals
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenClientPortal?.();
                }}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-[#0B1F3A] rounded-xl font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs border border-slate-200 active:scale-[0.99]"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Client Portal</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdminPortal?.();
                }}
                className="py-2.5 px-3 bg-[#0B1F3A] hover:bg-[#132D52] text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs border border-[#162D4F] active:scale-[0.99]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Admin</span>
              </button>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                trackClickConsultation('Navbar_Mobile');
                onOpenBookingModal();
              }}
              className="w-full py-3 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] active:scale-[0.99] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Schedule Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
