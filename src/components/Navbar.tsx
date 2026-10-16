import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ArrowRight,
  BarChart3,
  Shield,
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
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Rocket,
  ShoppingBag,
  Laptop,
  Factory,
  Globe,
  Calculator,
  Award,
  Play
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
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      badge: 'Popular',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'tax',
      title: 'Tax Filing & Direct GST Compliance',
      desc: 'Seamless GSTR-1, 3B, 9C filings, income tax returns, and notice handling.',
      icon: FileCheck,
      badge: 'Mandatory',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'audit',
      title: 'Statutory Audit & Internal Controls',
      desc: 'Independent financial audits, internal control reviews, and risk mitigation.',
      icon: ShieldCheck,
      badge: 'Certified',
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
      badge: 'High Impact',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'payroll',
      title: 'Payroll & Statutory Compliance',
      desc: 'Automated PF, ESI, TDS processing with employee self-serve tax declarations.',
      icon: Layers,
      badge: 'Automated',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'incorporation',
      title: 'Corporate Setup & FDI Governance',
      desc: 'Company incorporation, FEMA approvals, liaison office setup & RBI filings.',
      icon: Building,
      badge: 'Global',
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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Main Glassmorphic Navbar Bar */}
      <div className={`transition-all duration-300 ${
        isScrolled 
          ? 'py-2 px-3 sm:px-6' 
          : 'py-3.5 px-4 sm:px-8'
      }`}>
        <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0A1128]/95 backdrop-blur-xl border border-navy-border shadow-2xl shadow-slate-950/20 px-4 py-2.5 text-white' 
            : 'bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-md shadow-slate-900/5 px-5 py-3 text-slate-900'
        }`}>
          <div className="flex items-center justify-between gap-6">
            
            {/* Zone 1: Executive Brand Mark */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLinkClick('home')}
              className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-xl p-1 shrink-0"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-lg shadow-emerald-600/25 border border-emerald-400/40 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white stroke-[2.2]" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-navy-dark flex items-center justify-center">
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={`text-base font-bold tracking-tight font-sans leading-none ${
                    isScrolled ? 'text-white' : 'text-slate-900'
                  }`}>
                    Jha Accounting
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-mono tracking-wider uppercase font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded">
                    Tax Consultant
                  </span>
                </div>
                <span className={`text-[10px] font-mono tracking-wider uppercase mt-1 ${
                  isScrolled ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Est. 2022 · GST & Tax Consultant
                </span>
              </div>
            </motion.button>

            {/* Zone 2: Navigation Links with Multi-Column Mega Menus */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              
              {/* 1. Multi-Column Services Mega Menu */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={handleMouseLeave}
                onBlur={handleDropdownBlur}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveDropdown(activeDropdown === 'services' ? null : 'services');
                  }}
                  onFocus={() => handleMouseEnter('services')}
                  onKeyDown={(e) => handleDropdownTriggerKeyDown(e, 'services')}
                  aria-expanded={activeDropdown === 'services'}
                  aria-haspopup="true"
                  aria-controls="services-mega-menu"
                  className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                    isScrolled 
                      ? 'text-slate-200 hover:text-white hover:bg-slate-800/60' 
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                  } ${activeDropdown === 'services' ? (isScrolled ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-emerald-700') : ''}`}
                >
                  <span>Services</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'services' ? 'rotate-180 text-emerald-500' : 'opacity-60'
                  }`} />
                </motion.button>

                {/* Multi-Column Services Panel (3 Columns) */}
                <AnimatePresence>
                  {activeDropdown === 'services' && (
                    <motion.div 
                      id="services-mega-menu"
                      role="region"
                      aria-label="Services Mega Menu"
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full -left-20 mt-2 w-[820px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-6 text-slate-900 z-50 overflow-hidden"
                    >
                      {/* Top Header Strip */}
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                            Full-Stack Practice Capabilities
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                          <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            100% Tax Accuracy
                          </span>
                        </div>
                      </div>

                      {/* 3-Column Grid */}
                      <div className="grid grid-cols-12 gap-5">
                        
                        {/* Col 1: Core Accounting & Tax (4 cols) */}
                        <div className="col-span-4 space-y-3">
                          <span className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider block px-1">
                            Accounting & Tax Compliance
                          </span>
                          <div className="space-y-1.5">
                            {servicesCol1.map((srv) => {
                              const IconComp = srv.icon;
                              return (
                                <motion.button
                                  key={srv.id}
                                  whileHover={{ scale: 1.02, x: 2 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    handleLinkClick('home', 'services');
                                    onOpenBookingModal(srv.title);
                                  }}
                                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50/90 border border-transparent hover:border-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 group flex items-start gap-3"
                                >
                                  <div className={`p-2 rounded-lg ${srv.color} border shrink-0 mt-0.5`}>
                                    <IconComp className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                                        {srv.title}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
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
                            Strategic Advisory & Payroll
                          </span>
                          <div className="space-y-1.5">
                            {servicesCol2.map((srv) => {
                              const IconComp = srv.icon;
                              return (
                                <motion.button
                                  key={srv.id}
                                  whileHover={{ scale: 1.02, x: 2 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    handleLinkClick('home', 'services');
                                    onOpenBookingModal(srv.title);
                                  }}
                                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50/90 border border-transparent hover:border-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 group flex items-start gap-3"
                                >
                                  <div className={`p-2 rounded-lg ${srv.color} border shrink-0 mt-0.5`}>
                                    <IconComp className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                                        {srv.title}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                                      {srv.desc}
                                    </p>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Col 3: Highlight Featured Callout Box (4 cols) */}
                        <div className="col-span-4 bg-gradient-to-br from-[#0A1128] via-[#111B38] to-[#1E2B52] rounded-2xl p-4 text-white flex flex-col justify-between border border-navy-border shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                          
                          <div className="space-y-2.5 relative z-10">
                            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider">
                              <Calculator className="w-3.5 h-3.5" />
                              Instant Scope Assessment
                            </div>
                            <h4 className="text-sm font-bold text-white leading-snug">
                              Need a Custom Accounting & Tax Package?
                            </h4>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Get an instant quote tailored for your employee count, monthly invoice volume, and statutory requirements.
                            </p>

                            <div className="space-y-1.5 pt-1 text-[11px] text-slate-300">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>Zero setup fees & transparent pricing</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>Dedicated Senior CA & Account Manager</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 relative z-10">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => {
                                handleLinkClick('home', 'services');
                                onOpenBookingModal('Custom Engagement Scope');
                              }}
                              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-900/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                            >
                              <span>Request Custom Scope</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </div>

                      </div>

                      {/* Bottom Footer Ribbon */}
                      <div className="mt-5 pt-3 border-t border-slate-100 bg-slate-50/80 -mx-6 -mb-6 p-4 rounded-b-2xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-600 font-sans">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>ISO 27001 Data Security · SOC2 Compliant Accounting Workflows</span>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLinkClick('home', 'services')}
                          className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1.5 py-0.5"
                        >
                          <span>Explore All 12 Capabilities</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveDropdown(activeDropdown === 'solutions' ? null : 'solutions');
                  }}
                  onFocus={() => handleMouseEnter('solutions')}
                  onKeyDown={(e) => handleDropdownTriggerKeyDown(e, 'solutions')}
                  aria-expanded={activeDropdown === 'solutions'}
                  aria-haspopup="true"
                  aria-controls="solutions-mega-menu"
                  className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                    isScrolled 
                      ? 'text-slate-200 hover:text-white hover:bg-slate-800/60' 
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                  } ${activeDropdown === 'solutions' ? (isScrolled ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-emerald-700') : ''}`}
                >
                  <span>Solutions</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'solutions' ? 'rotate-180 text-emerald-500' : 'opacity-60'
                  }`} />
                </motion.button>

                {/* Multi-Column Solutions Panel (3 Columns) */}
                <AnimatePresence>
                  {activeDropdown === 'solutions' && (
                    <motion.div 
                      id="solutions-mega-menu"
                      role="region"
                      aria-label="Solutions Mega Menu"
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full -left-20 mt-2 w-[760px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-6 text-slate-900 z-50 overflow-hidden"
                    >
                      {/* Top Header Strip */}
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                            Tailored Solutions By Stage & Industry
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          Specialized Practice Groups
                        </span>
                      </div>

                      {/* 3-Column Grid */}
                      <div className="grid grid-cols-12 gap-5">
                        
                        {/* Col 1: By Business Stage (4 cols) */}
                        <div className="col-span-4 space-y-3">
                          <span className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider block px-1">
                            By Growth Stage
                          </span>
                          <div className="space-y-1.5">
                            {solutionsStage.map((sol, idx) => {
                              const IconComponent = sol.icon;
                              return (
                                <motion.button
                                  key={idx}
                                  whileHover={{ scale: 1.02, x: 2 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleLinkClick('home', 'solutions')}
                                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 group flex items-start gap-3"
                                >
                                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 mt-0.5">
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                                        {sol.title}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
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
                                  whileHover={{ scale: 1.02, x: 2 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleLinkClick('home', 'solutions')}
                                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 group flex items-start gap-3"
                                >
                                  <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shrink-0 mt-0.5">
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                                        {sol.title}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                                      {sol.desc}
                                    </p>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Col 3: Direct Advisor Desk Box (4 cols) */}
                        <div className="col-span-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 text-slate-900 flex flex-col justify-between relative">
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider">
                              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                              Partner Advisory Desk
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 leading-snug">
                              Direct Consultation with Senior Tax Consultants
                            </h4>
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                              Get actionable clarity on GST notices, tax structuring, or FEMA foreign inflow regulations.
                            </p>

                            <div className="p-2.5 bg-white rounded-xl border border-emerald-200/70 text-[11px] text-slate-700 space-y-1 font-mono">
                              <div className="flex justify-between">
                                <span className="text-slate-500">SLA Response:</span>
                                <span className="font-bold text-emerald-700">Under 2 Hours</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Advisory Fee:</span>
                                <span className="font-bold text-emerald-700">First Call Free</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 space-y-2">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => {
                                handleLinkClick('home', 'contact');
                                onOpenBookingModal('Senior Tax Consultant Consultation');
                              }}
                              className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            >
                              <span>Book Partner Consultation</span>
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLinkClick('blog')}
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                  isScrolled 
                    ? 'text-slate-200 hover:text-white hover:bg-slate-800/60' 
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                } ${currentView === 'blog' ? 'bg-emerald-500/10 text-emerald-600 font-semibold' : ''}`}
              >
                <span>Insights & Blog</span>
                <span className="text-[10px] font-mono bg-emerald-500 text-white px-1.5 py-0.2 rounded font-bold uppercase tracking-wider animate-pulse">
                  Updates
                </span>
              </motion.button>

              {/* About Link */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLinkClick('home', 'about')}
                className={`px-3.5 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                  isScrolled 
                    ? 'text-slate-200 hover:text-white hover:bg-slate-800/60' 
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                About Us
              </motion.button>

              {/* Contact Link */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLinkClick('home', 'contact')}
                className={`px-3.5 py-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                  isScrolled 
                    ? 'text-slate-200 hover:text-white hover:bg-slate-800/60' 
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                Contact
              </motion.button>

              {/* Analytics Badge Link */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLinkClick('analytics')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono border focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                  isScrolled 
                    ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-emerald-500/50' 
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-emerald-500/40'
                } ${currentView === 'analytics' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 font-semibold' : ''}`}
                title="Visitor Conversion & Web Vitals Dashboard"
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Analytics</span>
              </motion.button>

            </nav>

            {/* Zone 3: Primary CTA Button + Quick WhatsApp/Phone */}
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/919810012345?text=Hello%20Jha%20Accounting%20Team%2C%20I%20would%20like%20to%20discuss%20accounting%20and%20taxation%20services."
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                  isScrolled 
                    ? 'border-slate-700 bg-slate-800 text-emerald-400 hover:bg-slate-700 hover:border-emerald-500' 
                    : 'border-slate-200 bg-slate-50 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300'
                }`}
                title="Quick WhatsApp Chat with Senior Tax Partner"
              >
                <MessageSquare className="w-4 h-4" />
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenBookingModal()}
                className="relative group overflow-hidden px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 transition-all rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 flex items-center gap-2 whitespace-nowrap shrink-0 border border-emerald-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
              >
                <span className="relative z-10">Book Free Consultation</span>
                <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            {/* Mobile Navigation Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                isScrolled 
                  ? 'border-slate-700 text-slate-200 bg-slate-800' 
                  : 'border-slate-200 text-slate-800 bg-slate-50'
              }`}
              aria-label="Toggle Navigation Drawer"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-emerald-500" /> : <Menu className="w-5 h-5" />}
            </motion.button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-x-0 top-[60px] bg-[#0A1128]/98 text-white border-b border-navy-border p-6 shadow-2xl backdrop-blur-2xl max-h-[calc(100vh-70px)] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-navy-border/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm tracking-tight text-white">Navigation Menu</span>
              </div>
              <span className="text-xs font-mono text-emerald-400">Jha Accounting Solutions</span>
            </div>

            <div className="py-4 space-y-4 font-medium text-sm">
              {/* Mobile Services Accordion Block */}
              <div className="space-y-2 border-b border-navy-border/40 pb-3">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider block">
                  Practice Capabilities
                </span>
                <div className="grid grid-cols-1 gap-2 pl-2">
                  {servicesCol1.concat(servicesCol2).map((srv) => {
                    const IconComp = srv.icon;
                    return (
                      <button
                        key={srv.id}
                        onClick={() => {
                          handleLinkClick('home', 'services');
                          onOpenBookingModal(srv.title);
                        }}
                        className="text-left py-2 px-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 flex items-center gap-3 border border-slate-700/50"
                      >
                        <div className={`p-1.5 rounded ${srv.color}`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{srv.title}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{srv.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Solutions Accordion Block */}
              <div className="space-y-2 border-b border-navy-border/40 pb-3">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider block">
                  Solutions By Business Stage
                </span>
                <div className="grid grid-cols-1 gap-2 pl-2">
                  {solutionsStage.concat(solutionsIndustry).map((sol, idx) => {
                    const IconComp = sol.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleLinkClick('home', 'solutions')}
                        className="text-left py-2 px-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 flex items-center gap-3 border border-slate-700/50"
                      >
                        <div className="p-1.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{sol.title}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{sol.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLinkClick('blog')}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-800/80 flex items-center justify-between border-b border-navy-border/30 text-emerald-300"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Insights & Tax Circulars</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded">
                  4 Hub Articles
                </span>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLinkClick('home', 'about')}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-800/80 flex items-center justify-between border-b border-navy-border/30"
              >
                <span>About & Leadership Team</span>
                <ChevronDown className="-rotate-90 w-4 h-4 text-slate-400" />
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLinkClick('home', 'contact')}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-800/80 flex items-center justify-between border-b border-navy-border/30"
              >
                <span>Contact & Regional Desks</span>
                <ChevronDown className="-rotate-90 w-4 h-4 text-slate-400" />
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLinkClick('analytics')}
                className="w-full text-left py-2.5 px-3 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-between text-emerald-400"
              >
                <div className="flex items-center gap-2 font-mono text-xs">
                  <BarChart3 className="w-4 h-4" />
                  <span>Visitor Behavior & Web Vitals Dashboard</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 px-1.5 py-0.5 rounded">Live</span>
              </motion.button>
            </div>

            <div className="pt-4 border-t border-navy-border/80 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBookingModal();
                }}
                className="w-full py-3 text-center font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
              >
                <span>Schedule Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 font-mono">
                <a href="tel:+911148009900" className="flex items-center gap-1 hover:text-white">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+91 (11) 4800-9900</span>
                </a>
                <span className="text-emerald-400">SLA: 2hr Turnaround</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
