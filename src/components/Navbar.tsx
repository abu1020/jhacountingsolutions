import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  BookOpen,
  Layers,
  PhoneCall,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Receipt,
  FileCheck,
  Building,
  Building2,
  MessageSquare,
  Rocket,
  ShoppingBag,
  Laptop,
  Factory,
  Globe,
  Calculator,
  Award,
  ChevronRight,
  Phone,
  CheckCircle2
} from 'lucide-react';
import { JHA_ACCOUNTING_DATA } from '../data/firmData';

interface NavbarProps {
  currentView: 'home' | 'blog' | 'analytics';
  onNavigate: (view: 'home' | 'blog' | 'analytics', sectionId?: string) => void;
  onOpenBookingModal: (service?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenBookingModal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'services' | 'solutions' | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<'services' | 'solutions' | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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

  // Close sub-menus or mobile drawer when 'Escape' key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeDropdown !== null) {
          setActiveDropdown(null);
        }
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDropdown, isMobileMenuOpen]);

  // Keyboard focus management: close sub-menu when focus leaves the dropdown wrapper
  const handleDropdownBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setActiveDropdown(null);
    }
  };

  // Keyboard trigger handler for Services & Solutions buttons
  const handleDropdownTriggerKeyDown = (
    e: React.KeyboardEvent,
    dropdown: 'services' | 'solutions'
  ) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveDropdown(dropdown);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setActiveDropdown(null);
    }
  };

  const handleMouseEnter = (dropdown: 'services' | 'solutions') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleLinkClick = (view: 'home' | 'blog' | 'analytics', sectionId?: string) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    onNavigate(view, sectionId);
  };

  // Services Column 1: Core Accounting & Tax
  const servicesCol1 = [
    {
      id: 'bookkeeping',
      title: 'Bookkeeping & Financial Reporting',
      desc: 'Real-time ledger management, GAAP compliance, monthly P&L and balance sheets.',
      icon: Receipt,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'tax',
      title: 'Tax Filing & Direct GST Compliance',
      desc: 'Seamless GSTR-1, 3B, 9C filings, income tax returns, and notice handling.',
      icon: FileCheck,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'audit',
      title: 'Statutory Audit & Internal Controls',
      desc: 'Independent financial audits, internal control reviews, and risk mitigation.',
      icon: ShieldCheck,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  // Services Column 2: Strategic Advisory & Operations
  const servicesCol2 = [
    {
      id: 'cfo',
      title: 'Virtual CFO & Strategic Advisory',
      desc: 'FP&A modeling, cashflow forecasting, runway planning & investor decks.',
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'payroll',
      title: 'Payroll & Statutory Compliance',
      desc: 'Automated PF, ESI, TDS processing with employee self-serve tax declarations.',
      icon: Layers,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'incorporation',
      title: 'Corporate Setup & FDI Governance',
      desc: 'Company incorporation, FEMA approvals, liaison office setup & RBI filings.',
      icon: Building,
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    }
  ];

  // Solutions Column 1: By Business Stage
  const solutionsStage = [
    {
      title: 'Early-Stage Tech Startups',
      desc: 'Incorporation, ESOP structuring, 80-IAC tax holiday setup & seed runway planning.',
      icon: Rocket,
      tag: '0-50 Staff'
    },
    {
      title: 'Mid-Market Indian Scaleups',
      desc: 'Full-stack accounting, internal audits, vendor GST recon, statutory filings.',
      icon: TrendingUp,
      tag: 'D2C & Retail'
    },
    {
      title: 'Cross-Border & FDI Entities',
      desc: 'FEMA guidelines, transfer pricing docs, liaison office compliance & RBI reporting.',
      icon: Globe,
      tag: 'Global MNCs'
    }
  ];

  // Solutions Column 2: By Industry Sector
  const solutionsIndustry = [
    {
      title: 'E-Commerce & D2C Brands',
      desc: 'Multi-marketplace GST reconciliation, inventory valuation & TCS compliance.',
      icon: ShoppingBag,
      tag: 'High Vol.'
    },
    {
      title: 'SaaS & IT Export Services',
      desc: 'LUT filing for zero-rated exports, STPI compliance & SEZ unit tax exemptions.',
      icon: Laptop,
      tag: 'Zero GST'
    },
    {
      title: 'Manufacturing & Supply Chain',
      desc: 'Job-work GST compliance, ITC 04 filings, E-Way Bill audits & factory cost accounting.',
      icon: Factory,
      tag: 'Supply Chain'
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* High-Contrast Executive Navy Glass Navbar Bar */}
      <div className={`transition-all duration-300 ${
        isScrolled 
          ? 'py-2 px-3 sm:px-6 bg-[#0A1128]/98 backdrop-blur-xl border-b border-[#1E2B52] shadow-2xl shadow-slate-950/40' 
          : 'py-3.5 px-4 sm:px-8 bg-[#0A1128] border-b border-[#1E2B52]/80 shadow-xl'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          
          {/* Zone 1: Single-Line Executive Brand Wordmark */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 rounded-xl p-1 shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/40 shrink-0">
              <ShieldCheck className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-white tracking-tight font-sans leading-none flex items-center gap-2">
                <span>Jha Accounting</span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono tracking-wider uppercase font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 rounded shadow-2xs">
                  GST &amp; Tax Consultant
                </span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider uppercase mt-1">
                Est. 2022 · GST &amp; Tax Practice
              </span>
            </div>
          </motion.button>

          {/* Zone 2: Navigation Links with Multi-Column Mega Menus (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-slate-200">
            
            {/* 1. Multi-Column Services Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
              onBlur={handleDropdownBlur}
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setActiveDropdown(activeDropdown === 'services' ? null : 'services');
                }}
                onFocus={() => handleMouseEnter('services')}
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, 'services')}
                aria-expanded={activeDropdown === 'services'}
                aria-haspopup="true"
                aria-controls="services-mega-menu"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  activeDropdown === 'services' 
                    ? 'bg-slate-800 text-emerald-400 font-bold' 
                    : 'hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'services' ? 'rotate-180 text-emerald-400' : 'opacity-70'
                }`} />
              </motion.button>

              {/* Centered Multi-Column Services Panel */}
              <AnimatePresence>
                {activeDropdown === 'services' && (
                  <motion.div 
                    id="services-mega-menu"
                    role="region"
                    aria-label="Services Mega Menu"
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute top-full -left-28 mt-3 w-[840px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-slate-900 z-50 overflow-hidden"
                  >
                    {/* Top Header Strip */}
                    <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                          Full-Stack GST &amp; Tax Services
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        100% On-Time Filing Guarantee
                      </span>
                    </div>

                    {/* 3-Column Grid */}
                    <div className="grid grid-cols-12 gap-5">
                      
                      {/* Col 1: Core Accounting & Tax (4 cols) */}
                      <div className="col-span-4 space-y-3">
                        <span className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider block px-1">
                          GST &amp; Tax Filing
                        </span>
                        <div className="space-y-1.5">
                          {servicesCol1.map((srv) => {
                            const IconComp = srv.icon;
                            return (
                              <motion.button
                                key={srv.id}
                                whileHover={{ scale: 1.01, x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  handleLinkClick('home', 'services');
                                  onOpenBookingModal(srv.title);
                                }}
                                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 group flex items-start gap-3"
                              >
                                <div className={`p-2 rounded-lg ${srv.color} border shrink-0 mt-0.5`}>
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight block">
                                    {srv.title}
                                  </span>
                                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                                    {srv.desc}
                                  </p>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Col 2: Virtual CFO & Operations (4 cols) */}
                      <div className="col-span-4 space-y-3">
                        <span className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider block px-1">
                          Strategic Advisory &amp; Payroll
                        </span>
                        <div className="space-y-1.5">
                          {servicesCol2.map((srv) => {
                            const IconComp = srv.icon;
                            return (
                              <motion.button
                                key={srv.id}
                                whileHover={{ scale: 1.01, x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  handleLinkClick('home', 'services');
                                  onOpenBookingModal(srv.title);
                                }}
                                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 group flex items-start gap-3"
                              >
                                <div className={`p-2 rounded-lg ${srv.color} border shrink-0 mt-0.5`}>
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight block">
                                    {srv.title}
                                  </span>
                                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                                    {srv.desc}
                                  </p>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Col 3: Direct Consultation Callout Box (4 cols) */}
                      <div className="col-span-4 bg-gradient-to-br from-[#0A1128] via-[#111B38] to-[#1E2B52] rounded-2xl p-4 text-white flex flex-col justify-between border border-navy-border shadow-lg relative overflow-hidden">
                        <div className="space-y-2.5 relative z-10">
                          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider">
                            <Calculator className="w-3.5 h-3.5" />
                            Instant Assessment
                          </div>
                          <h4 className="text-sm font-bold text-white leading-snug">
                            Need Custom Tax &amp; Accounting Scope?
                          </h4>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Tailored proposal for monthly invoice volume, multi-state GST registrations, and annual returns.
                          </p>
                          <div className="space-y-1 pt-1 text-[11px] text-slate-300 font-sans">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>Zero hidden fees &amp; 24-hr response SLA</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 relative z-10">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              handleLinkClick('home', 'services');
                              onOpenBookingModal('Custom Tax & Accounting Scope');
                            }}
                            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          >
                            <span>Request Custom Scope</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Footer Ribbon */}
                    <div className="mt-5 pt-3 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-sans">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Certified Tax Practitioner · ISO 27001 Data Confidentiality</span>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleLinkClick('home', 'services')}
                        className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1.5 py-0.5"
                      >
                        <span>Explore All Capabilities</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Multi-Column Solutions Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
              onBlur={handleDropdownBlur}
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setActiveDropdown(activeDropdown === 'solutions' ? null : 'solutions');
                }}
                onFocus={() => handleMouseEnter('solutions')}
                onKeyDown={(e) => handleDropdownTriggerKeyDown(e, 'solutions')}
                aria-expanded={activeDropdown === 'solutions'}
                aria-haspopup="true"
                aria-controls="solutions-mega-menu"
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  activeDropdown === 'solutions' 
                    ? 'bg-slate-800 text-emerald-400 font-bold' 
                    : 'hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'solutions' ? 'rotate-180 text-emerald-400' : 'opacity-70'
                }`} />
              </motion.button>

              {/* Centered Multi-Column Solutions Panel */}
              <AnimatePresence>
                {activeDropdown === 'solutions' && (
                  <motion.div 
                    id="solutions-mega-menu"
                    role="region"
                    aria-label="Solutions Mega Menu"
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute top-full -left-28 mt-3 w-[780px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-slate-900 z-50 overflow-hidden"
                  >
                    {/* Top Header Strip */}
                    <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                          Solutions By Business Stage &amp; Sector
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-500">
                        Tailored Compliance Plans
                      </span>
                    </div>

                    {/* 3-Column Grid */}
                    <div className="grid grid-cols-12 gap-5">
                      
                      {/* Col 1: By Business Stage (4 cols) */}
                      <div className="col-span-4 space-y-3">
                        <span className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider block px-1">
                          By Business Stage
                        </span>
                        <div className="space-y-1.5">
                          {solutionsStage.map((sol, idx) => {
                            const IconComponent = sol.icon;
                            return (
                              <motion.button
                                key={idx}
                                whileHover={{ scale: 1.01, x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleLinkClick('home', 'solutions')}
                                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 group flex items-start gap-3"
                              >
                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 mt-0.5">
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight block">
                                    {sol.title}
                                  </span>
                                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                                    {sol.desc}
                                  </p>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Col 2: By Specialized Sector (4 cols) */}
                      <div className="col-span-4 space-y-3">
                        <span className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider block px-1">
                          By Industry Domain
                        </span>
                        <div className="space-y-1.5">
                          {solutionsIndustry.map((sol, idx) => {
                            const IconComponent = sol.icon;
                            return (
                              <motion.button
                                key={idx}
                                whileHover={{ scale: 1.01, x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleLinkClick('home', 'solutions')}
                                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 group flex items-start gap-3"
                              >
                                <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shrink-0 mt-0.5">
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight block">
                                    {sol.title}
                                  </span>
                                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                                    {sol.desc}
                                  </p>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Col 3: Direct Advisor Desk Box (4 cols) */}
                      <div className="col-span-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-slate-900 flex flex-col justify-between relative">
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider">
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                            Tax Advisory Desk
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            Direct Consultation with Senior Tax Consultants
                          </h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Actionable clarity on GST notice replies, GSTR-2B ITC leakage, and tax structuring.
                          </p>

                          <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-[11px] text-slate-700 space-y-1 font-mono">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Response SLA:</span>
                              <span className="font-bold text-emerald-700">Under 2 Hours</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Discovery Session:</span>
                              <span className="font-bold text-emerald-700">100% Free Call</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              handleLinkClick('home', 'contact');
                              onOpenBookingModal('Senior Tax Consultant Consultation');
                            }}
                            className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                          >
                            <span>Book Consultation</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Insights & Blog Link */}
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleLinkClick('blog')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                currentView === 'blog' 
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold' 
                  : 'hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <span>Insights &amp; Blog</span>
              <span className="text-[10px] font-mono bg-emerald-500 text-white px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                Updates
              </span>
            </motion.button>

            {/* About Link */}
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleLinkClick('home', 'about')}
              className="px-3.5 py-2 rounded-xl transition-all hover:text-white hover:bg-slate-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              About Us
            </motion.button>

            {/* Contact Link */}
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleLinkClick('home', 'contact')}
              className="px-3.5 py-2 rounded-xl transition-all hover:text-white hover:bg-slate-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Contact
            </motion.button>

            {/* Analytics Link */}
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleLinkClick('analytics')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-mono border focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                currentView === 'analytics' 
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold' 
                  : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-emerald-500/50'
              }`}
              title="Visitor Conversion & Web Vitals Dashboard"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Analytics</span>
            </motion.button>

          </nav>

          {/* Zone 3: Primary Actions (Desktop) & Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Direct WhatsApp Channel Button (Desktop) */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/918882860226?text=Hello%20Jha%20Accounting%20Team%2C%20I%20would%20like%20to%20discuss%20GST%20and%20taxation%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-emerald-400 hover:bg-slate-700 hover:border-emerald-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              title="Quick WhatsApp Chat with Senior Tax Consultant"
            >
              <MessageSquare className="w-4.5 h-4.5" />
            </motion.a>

            {/* Primary CTA: Book Consultation (Desktop) */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenBookingModal()}
              className="hidden sm:flex relative group overflow-hidden px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 whitespace-nowrap shrink-0 border border-emerald-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Mobile Navigation Drawer Toggle Button (Visible on Mobile) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-slate-700 text-white bg-slate-800 hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Toggle Mobile Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-emerald-400" /> : <Menu className="w-6 h-6 text-white" />}
            </motion.button>

          </div>
        </div>
      </div>

      {/* High-Impact Mobile Slide-Over Full Viewport Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-50 bg-[#0A1128] text-white flex flex-col justify-between overflow-y-auto p-6 sm:p-8"
          >
            {/* Mobile Header Bar */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white tracking-tight leading-none flex items-center gap-1.5">
                    <span>Jha Accounting</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase">
                      GST &amp; Tax Consultant
                    </span>
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold block mt-1">
                    Est. 2022 · GST &amp; Tax Practice
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
                aria-label="Close Navigation Drawer"
              >
                <X className="w-6 h-6 text-emerald-400" />
              </motion.button>
            </div>

            {/* Mobile Navigation Main Content */}
            <div className="py-6 space-y-3 flex-grow font-sans">
              
              {/* Services Accordion Block */}
              <div className="border-b border-slate-800/80 pb-3">
                <button
                  onClick={() => setMobileAccordion(mobileAccordion === 'services' ? null : 'services')}
                  className="w-full text-left py-3 flex items-center justify-between text-base font-extrabold text-white group"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span>Practice Services</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-emerald-400 transition-transform duration-200 ${mobileAccordion === 'services' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {mobileAccordion === 'services' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden space-y-2 pt-2 pl-2"
                    >
                      {servicesCol1.concat(servicesCol2).map((srv) => {
                        const IconComp = srv.icon;
                        return (
                          <button
                            key={srv.id}
                            onClick={() => {
                              handleLinkClick('home', 'services');
                              onOpenBookingModal(srv.title);
                            }}
                            className="w-full text-left p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 flex items-start gap-3 transition-colors"
                          >
                            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0 mt-0.5">
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white">{srv.title}</div>
                              <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{srv.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Solutions Accordion Block */}
              <div className="border-b border-slate-800/80 pb-3">
                <button
                  onClick={() => setMobileAccordion(mobileAccordion === 'solutions' ? null : 'solutions')}
                  className="w-full text-left py-3 flex items-center justify-between text-base font-extrabold text-white group"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                    <span>Solutions By Stage &amp; Industry</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-emerald-400 transition-transform duration-200 ${mobileAccordion === 'solutions' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {mobileAccordion === 'solutions' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden space-y-2 pt-2 pl-2"
                    >
                      {solutionsStage.concat(solutionsIndustry).map((sol, idx) => {
                        const IconComp = sol.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleLinkClick('home', 'solutions')}
                            className="w-full text-left p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 flex items-start gap-3 transition-colors"
                          >
                            <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800 shrink-0 mt-0.5">
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white">{sol.title}</div>
                              <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{sol.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Direct Navigation Links */}
              <button
                onClick={() => handleLinkClick('blog')}
                className="w-full text-left py-3.5 px-3 rounded-xl hover:bg-slate-800/80 flex items-center justify-between border-b border-slate-800/60 text-base font-bold text-white"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>Insights &amp; Tax Blog</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </button>

              <button
                onClick={() => handleLinkClick('home', 'about')}
                className="w-full text-left py-3.5 px-3 rounded-xl hover:bg-slate-800/80 flex items-center justify-between border-b border-slate-800/60 text-base font-bold text-white"
              >
                <span>About Us &amp; Leadership</span>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </button>

              <button
                onClick={() => handleLinkClick('home', 'contact')}
                className="w-full text-left py-3.5 px-3 rounded-xl hover:bg-slate-800/80 flex items-center justify-between border-b border-slate-800/60 text-base font-bold text-white"
              >
                <span>Contact &amp; Advisory Desk</span>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </button>

              <button
                onClick={() => handleLinkClick('analytics')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-between text-emerald-400 font-bold text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-5 h-5" />
                  <span>Visitor Analytics Dashboard</span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                  Live
                </span>
              </button>

            </div>

            {/* Mobile Footer Fixed Action Dock */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBookingModal();
                }}
                className="w-full py-3.5 text-center font-extrabold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2"
              >
                <span>Schedule Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <a 
                  href="tel:+918882860226" 
                  className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center gap-2 text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Desk</span>
                </a>
                <a 
                  href="https://wa.me/918882860226?text=Hello%20Jha%20Accounting%20Team%2C%20I%20would%20like%20to%20discuss%20GST%20and%20taxation%20services." 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-2 text-center font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
