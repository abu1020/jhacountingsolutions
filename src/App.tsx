/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calculator,
  Receipt,
  FileText,
  BookOpen,
  Layers,
  Mail,
  PhoneCall,
  Clock,
  Shield,
  Check,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  BarChart3,
  Bell,
  BellRing,
  Share2,
  ThumbsUp,
  MessageSquare,
  Search,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Info,
  ShieldAlert,
  Copy,
  Briefcase
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  likes: number;
  commentsCount: number;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'outsourcing' | 'tools' | 'blog' | 'analytics' | 'social' | 'contact'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Push Notifications State
  const [pushEnabled, setPushEnabled] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'GSTR-3B Filing Reminder',
      message: 'Monthly GST return filing window for current period is now open.',
      time: '1 hour ago',
      read: false
    },
    {
      id: '2',
      title: 'TDS Deposit Deadline',
      message: 'Quarterly TDS deposit due date is approaching on the 7th.',
      time: '5 hours ago',
      read: true
    }
  ]);

  // GST Calculator State
  const [gstAmount, setGstAmount] = useState<number>(50000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [taxNature, setTaxNature] = useState<'intra' | 'inter'>('intra');
  const [calcMode, setCalcMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  // TDS Calculator State
  const [tdsSection, setTdsSection] = useState<string>('194C_ind');
  const [tdsAmount, setTdsAmount] = useState<number>(85000);
  const [tdsAggregate, setTdsAggregate] = useState<boolean>(false);
  const [hasPan, setHasPan] = useState<boolean>(true);
  const [tdsCopyLabel, setTdsCopyLabel] = useState<string>('Copy Breakdown');

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: 'GST Solutions',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Blog State
  const [blogSearch, setBlogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [commentText, setCommentText] = useState('');
  const [articleComments, setArticleComments] = useState<{ [key: string]: string[] }>({
    '1': ['Very clear explanation of GSTR-2B matching rules!', 'Crucial for avoiding ITC reversal notices.'],
    '2': ['Section 194J threshold criteria explained brilliantly.', 'Thanks for the penal PAN breakdown under 206AA.']
  });

  // Analytics Range State
  const [analyticsRange, setAnalyticsRange] = useState<'7d' | '30d' | 'ytd'>('7d');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Push notification toggle
  const handleTogglePush = () => {
    if (!pushEnabled) {
      setPushEnabled(true);
      showToast('🔔 Push notifications enabled successfully!');
      setNotifications([
        {
          id: Date.now().toString(),
          title: 'Push Enabled',
          message: 'You will receive real-time statutory filing and return updates.',
          time: 'Just now',
          read: false
        },
        ...notifications
      ]);
    } else {
      setPushEnabled(false);
      showToast('🔕 Push notifications disabled.');
    }
  };

  const handleTestPush = () => {
    if (!pushEnabled) {
      showToast('⚠️ Please enable push notifications first.');
      return;
    }
    showToast('🚀 [Push Notification]: GST GSTR-1 filing status verified successfully!');
    setNotifications([
      {
        id: Date.now().toString(),
        title: 'Filing Verified',
        message: 'GSTR-1 acknowledgment ARN generated and archived.',
        time: 'Just now',
        read: false
      },
      ...notifications
    ]);
  };

  // Blog articles database
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Navigating GSTR-2B Input Tax Credit (ITC) Reconciliation in 2026',
      excerpt: 'Learn how to prevent ITC reversal notices and streamline your monthly purchase register matching with the portal.',
      content: `Input Tax Credit (ITC) reconciliation remains one of the most critical compliance pillars under GST. With recent portal updates, mismatched invoices can immediately trigger restriction flags.

In this guide, we review step-by-step best practices for reconciling GSTR-2B with your purchase ledgers, handling vendor non-filing, and maintaining audit trails.`,
      category: 'GST Compliance',
      author: 'Ramesh Jha, Managing Partner',
      date: 'Oct 10, 2026',
      readTime: '5 min read',
      likes: 84,
      commentsCount: 2
    },
    {
      id: '2',
      title: 'Understanding TDS Chapter XVII-B Thresholds & Section 206AA Penalties',
      excerpt: 'A comprehensive review of withholding tax obligations under sections 194C, 194J, 194I, and penal provisions for non-PAN holders.',
      content: `Compliance with withholding tax (TDS) under Chapter XVII-B requires rigorous tracking of single invoice limits and cumulative annual threshold aggregations.

Furthermore, under Section 206AA, failure to furnish a valid PAN mandates tax deduction at the penal rate of 20%. This article details how to automate threshold validations.`,
      category: 'Direct Tax',
      author: 'Priya Sharma, Tax Lead',
      date: 'Oct 04, 2026',
      readTime: '6 min read',
      likes: 112,
      commentsCount: 2
    },
    {
      id: '3',
      title: 'Why CA Firms Are Embracing White-Label Accounting Outsourcing',
      excerpt: 'How growing accounting practices scale client ledger volumes without increasing fixed overhead expenses.',
      content: `Practicing Chartered Accountants often face seasonal bottlenecks during tax filing seasons. White-label back-office outsourcing enables firms to delegate high-volume bookkeeping and return preparation under strict NDAs.`,
      category: 'B2B Outsourcing',
      author: 'Amit Jha, Operations Head',
      date: 'Sep 28, 2026',
      readTime: '4 min read',
      likes: 95,
      commentsCount: 0
    }
  ];

  // GST Calculation Logic
  const calculateGSTValues = () => {
    let baseAmount = 0;
    let taxAmount = 0;
    let grossAmount = 0;

    if (calcMode === 'inclusive') {
      baseAmount = gstAmount / (1 + gstRate / 100);
      taxAmount = gstAmount - baseAmount;
      grossAmount = gstAmount;
    } else {
      baseAmount = gstAmount;
      taxAmount = gstAmount * (gstRate / 100);
      grossAmount = baseAmount + taxAmount;
    }

    const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return {
      base: formatINR(baseAmount),
      taxTotal: formatINR(taxAmount),
      gross: formatINR(grossAmount),
      halfRate: (gstRate / 2).toFixed(1),
      halfTax: formatINR(taxAmount / 2),
      fullTax: formatINR(taxAmount)
    };
  };

  const gstCalc = calculateGSTValues();

  // TDS Benchmarks & Calculation
  const tdsBenchmarks: Record<string, { section: string; label: string; rate: number; singleThreshold: number; ruleText: string }> = {
    '194C_ind': { section: 'Sec 194C', label: 'Contractor (Individual / HUF)', rate: 1.0, singleThreshold: 30000, ruleText: 'Single invoice limit ₹30,000 or yearly ₹1,00,000.' },
    '194C_corp': { section: 'Sec 194C', label: 'Contractor (Company / Firm)', rate: 2.0, singleThreshold: 30000, ruleText: 'Single invoice limit ₹30,000 or yearly ₹1,00,000.' },
    '194J_prof': { section: 'Sec 194J(1)', label: 'Professional / Legal Fees', rate: 10.0, singleThreshold: 30000, ruleText: 'Threshold ₹30,000 per financial year.' },
    '194J_tech': { section: 'Sec 194J(1)', label: 'Technical Services', rate: 2.0, singleThreshold: 30000, ruleText: 'Threshold ₹30,000 per financial year.' },
    '194I_land': { section: 'Sec 194I(b)', label: 'Rent on Land / Building', rate: 10.0, singleThreshold: 240000, ruleText: 'Threshold ₹2,40,000 per financial year.' },
    '194I_mach': { section: 'Sec 194I(a)', label: 'Rent on Plant & Machinery', rate: 2.0, singleThreshold: 240000, ruleText: 'Threshold ₹2,40,000 per financial year.' },
    '194H_comm': { section: 'Sec 194H', label: 'Commission or Brokerage', rate: 2.0, singleThreshold: 15000, ruleText: 'Threshold ₹15,000 per financial year.' },
    '194Q_goods': { section: 'Sec 194Q', label: 'Purchase of Goods (> ₹50L)', rate: 0.1, singleThreshold: 5000000, ruleText: 'Exceeding ₹50 Lakhs turnover.' }
  };

  const currentTdsBench = tdsBenchmarks[tdsSection] || tdsBenchmarks['194C_ind'];
  const tdsApplies = (tdsAmount > currentTdsBench.singleThreshold) || tdsAggregate;
  const effectiveTdsRate = !hasPan ? 20.0 : currentTdsBench.rate;
  const computedTdsTax = tdsApplies ? tdsAmount * (effectiveTdsRate / 100) : 0;
  const computedNetPayable = tdsAmount - computedTdsTax;

  const formatINRSimple = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-brand-offwhite text-brand-slate font-sans antialiased selection:bg-brand-accent selection:text-white flex flex-col min-h-screen">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-slate text-cyan-300 border border-cyan-500/40 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-brand-slate text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ISO Compliant Protocols
            </span>
            <span className="text-slate-300 font-medium">B2B Statutory Accounting &amp; White-Label Back-Office Services</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Strict NDA &amp; Data Encryption</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <button 
              onClick={() => setNotificationModalOpen(true)}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 font-medium"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" /> Push Notifications
            </button>
          </div>
        </div>
      </div>

      {/* 2. HEADER & NAVIGATION */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-brand-subtle transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-3 group focus:outline-none text-left">
            <div className="w-10 h-10 rounded-xl bg-brand-slate text-white flex items-center justify-center font-display font-bold text-lg shadow-sm group-hover:bg-brand-accent transition-colors">
              JA
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-brand-slate block leading-none">
                Jha Accounting
              </span>
              <span className="text-[11px] font-medium text-brand-muted tracking-wide uppercase block mt-1">
                Solutions &amp; Outsourcing
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: 'home', label: 'Home' },
              { id: 'outsourcing', label: 'B2B Outsourcing' },
              { id: 'tools', label: 'Apps & Tools Hub' },
              { id: 'blog', label: 'Accounting Blog' },
              { id: 'analytics', label: 'Analytics Dashboard' },
              { id: 'social', label: 'Social Hub' },
              { id: 'contact', label: 'Contact' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-100 text-brand-slate font-bold shadow-xs'
                    : 'text-brand-muted hover:text-brand-slate hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('contact')}
              className="hidden sm:inline-flex items-center gap-2 bg-brand-slate hover:bg-brand-accent text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-brand-slate hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-brand-subtle bg-white px-4 pt-2 pb-6 space-y-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'outsourcing', label: 'B2B Outsourcing' },
              { id: 'tools', label: 'Apps & Tools Hub' },
              { id: 'blog', label: 'Accounting Blog' },
              { id: 'analytics', label: 'Analytics Dashboard' },
              { id: 'social', label: 'Social Hub' },
              { id: 'contact', label: 'Contact' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium ${
                  activeTab === tab.id ? 'bg-brand-slate text-white' : 'text-brand-slate hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* 3. MAIN DYNAMIC VIEW CONTAINER */}
      <main className="flex-grow">

        {/* =============================================================== */}
        {/* VIEW: HOME                                                      */}
        {/* =============================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-0">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-slate-100/60 to-brand-offwhite border-b border-brand-subtle py-16 lg:py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-subtle text-xs font-semibold text-slate-700 mb-6 shadow-xs">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    Modern Compliance Architecture for Corporate &amp; CA Firms
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-brand-slate leading-[1.15] mb-6">
                    Reliable statutory compliance &amp; <span className="text-brand-accent underline decoration-brand-accent/30 decoration-wavy decoration-2">frictionless</span> accounting.
                  </h1>

                  <p className="text-lg sm:text-xl text-brand-muted font-normal leading-relaxed mb-8 max-w-2xl">
                    From GST reconciliation and TDS quarterly filings to full-cycle day-to-day bookkeeping. We manage your end-to-end accounting pipeline with strict statutory precision.
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="inline-flex items-center gap-2 bg-brand-slate hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                      <span>Request Consultation</span>
                      <ArrowRight className="w-4 h-4 text-brand-accent" />
                    </button>
                    <button
                      onClick={() => setActiveTab('outsourcing')}
                      className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-brand-slate border border-brand-subtle px-6 py-3.5 rounded-xl font-semibold text-sm shadow-xs transition-all hover:border-slate-400"
                    >
                      <Layers className="w-4 h-4 text-slate-500" />
                      <span>Explore B2B Outsourcing</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('tools')}
                      className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-accentHover text-sm font-semibold px-2 py-3.5 transition-colors"
                    >
                      <span>View Free Utility Tools</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metrics bar */}
                <div className="mt-16 pt-10 border-t border-brand-subtle grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <div className="text-2xl lg:text-3xl font-display font-bold text-brand-slate">99.8%</div>
                    <div className="text-xs text-brand-muted font-medium">On-Time Filing Record</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl lg:text-3xl font-display font-bold text-brand-slate">100%</div>
                    <div className="text-xs text-brand-muted font-medium">Statutory Compliance Accuracy</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl lg:text-3xl font-display font-bold text-brand-slate">24-48h</div>
                    <div className="text-xs text-brand-muted font-medium">SLA Query Resolution</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl lg:text-3xl font-display font-bold text-brand-slate">Zero-Leakage</div>
                    <div className="text-xs text-brand-muted font-medium">Data Confidentiality Protocol</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Services Section */}
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-brand-accent mb-2">Service Modules</div>
                  <h2 className="text-3xl font-bold font-display text-brand-slate">Core Accounting &amp; Compliance Solutions</h2>
                </div>
                <p className="text-brand-muted text-sm max-w-md mt-3 md:mt-0">
                  Engineered for corporate entities, growing SMEs, and accounting firms demanding rigorous execution without overhead.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'GST Solutions',
                    category: 'Indirect Tax',
                    desc: 'End-to-end Goods and Services Tax compliance including prompt GST registration, monthly GSTR-1 outward filing, GSTR-3B tax computation, and thorough GSTR-2B input tax credit (ITC) reconciliation.',
                    icon: Receipt,
                    features: ['GSTR-1 & GSTR-3B filings', 'GSTR-2B ITC matched with purchase register', 'New GST registrations & amendments']
                  },
                  {
                    title: 'Direct Tax Compliance',
                    category: 'Income Tax',
                    desc: 'Structured Income Tax Return (ITR) preparation and statutory filings for corporate entities, LLPs, proprietorships, and professionals.',
                    icon: Calculator,
                    features: ['Corporate & Non-Corporate ITR Filings', 'Advance tax computation schedules', 'Depreciation & expense schedule alignment']
                  },
                  {
                    title: 'TDS & TCS Returns',
                    category: 'Statutory Withholding',
                    desc: 'Rigorous quarterly withholding tax compliance, deduction validation, correct section mapping, challan verification, and Form 16 / 16A generation.',
                    icon: FileText,
                    features: ['Quarterly 24Q, 26Q, and 27EQ returns', 'Challan generation & payment tracking', 'Form 16/16A generation']
                  },
                  {
                    title: 'Full-Cycle Bookkeeping',
                    category: 'Core Accounting',
                    desc: 'Meticulous daily and monthly general ledger maintenance, bank reconciliation statements (BRS), and accounts payable/receivable monitoring.',
                    icon: BookOpen,
                    features: ['Ledger maintenance & chart of accounts setup', 'Weekly / Monthly Bank Reconciliations', 'Monthly P&L, Balance Sheet']
                  },
                  {
                    title: 'Accounting Outsourcing',
                    category: 'B2B Solutions',
                    desc: 'Specialized back-office processing, high-volume data entry, and compliance handling for practicing Chartered Accountants and CPAs.',
                    icon: Layers,
                    features: ['White-label working paper preparation', 'Tally, Zoho Books, QuickBooks, SAP', 'Scalable capacity during peak deadlines']
                  }
                ].map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-brand-subtle p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <div className="w-11 h-11 rounded-xl bg-slate-100 text-brand-slate group-hover:bg-brand-slate group-hover:text-white flex items-center justify-center transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                            {s.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold font-display text-brand-slate mb-2.5">{s.title}</h3>
                        <p className="text-xs text-brand-muted leading-relaxed mb-6">{s.desc}</p>
                        <ul className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                          {s.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => {
                          setContactForm({ ...contactForm, service: s.title });
                          setActiveTab('contact');
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-brand-slate hover:text-white text-brand-slate border border-slate-200 text-xs font-semibold py-2.5 rounded-xl transition-all"
                      >
                        <span>Inquire for {s.title}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW: OUTSOURCING SOLUTIONS                                     */}
        {/* =============================================================== */}
        {activeTab === 'outsourcing' && (
          <div className="space-y-16 py-12">
            <div className="bg-gradient-to-b from-slate-100/70 to-brand-offwhite border-b border-brand-subtle py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-slate text-white text-xs font-semibold mb-4">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> B2B Accounting Outsourcing
                </span>
                <h1 className="text-3xl sm:text-5xl font-display font-bold text-brand-slate mb-4">
                  Scale Your Practice Without Increasing Overhead.
                </h1>
                <p className="text-brand-muted text-base sm:text-lg leading-relaxed">
                  Designed specifically for Chartered Accountant firms and corporate teams seeking high-accuracy data entry, ledger audits, and compliance execution.
                </p>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-brand-subtle shadow-xs">
                <h3 className="text-xl font-bold font-display text-brand-slate mb-3">White-Label Delivery</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-4">
                  We work quietly in the background. Reports, working sheets, reconciliations, and filings are prepared ready for your partner sign-off.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-brand-subtle shadow-xs">
                <h3 className="text-xl font-bold font-display text-brand-slate mb-3">High-Volume Ledger Processing</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-4">
                  From heavy bank statement parsing to complex multi-branch voucher allocations, we eliminate bookkeeping backlogs rapidly.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-brand-subtle shadow-xs">
                <h3 className="text-xl font-bold font-display text-brand-slate mb-3">Enterprise-Grade Security</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-4">
                  Financial data stays protected via zero-trust cloud workspaces and mutual non-disclosure compliance agreements.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW: APPS & TOOLS HUB (GST & TDS Calculators)                  */}
        {/* =============================================================== */}
        {activeTab === 'tools' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-slate text-white text-xs font-semibold mb-4">
                <Calculator className="w-3.5 h-3.5 text-brand-accent" /> Client Utilities &amp; Calculators
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-slate mb-2">Accounting Tools Hub</h1>
              <p className="text-brand-muted text-sm">Interactive calculators for GST breakdowns and TDS threshold deductions.</p>
            </div>

            {/* GST Calculator Card */}
            <div className="bg-white rounded-2xl border border-brand-subtle shadow-xs p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-xl font-bold font-display text-brand-slate">Quick GST Breakdown &amp; Tax Estimator</h3>
                  <p className="text-xs text-brand-muted mt-1">Calculate CGST, SGST, IGST, and net amounts instantly.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-4 lg:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Base Amount (₹)</label>
                      <input
                        type="number"
                        value={gstAmount}
                        onChange={(e) => setGstAmount(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-brand-subtle rounded-xl text-sm focus:bg-white focus:border-brand-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Applicable GST Slab (%)</label>
                      <select
                        value={gstRate}
                        onChange={(e) => setGstRate(parseFloat(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-brand-subtle rounded-xl text-sm focus:bg-white focus:border-brand-accent focus:outline-none"
                      >
                        <option value={5}>5% (Essential Commodities)</option>
                        <option value={12}>12% (Standard Goods)</option>
                        <option value={18}>18% (Most Services & Manufacturing)</option>
                        <option value={28}>28% (Luxury & Regulated Goods)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Transaction Nature</label>
                      <div className="flex items-center gap-4 pt-1">
                        <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                          <input type="radio" name="tax-nature" checked={taxNature === 'intra'} onChange={() => setTaxNature('intra')} /> Intra-State (CGST + SGST)
                        </label>
                        <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                          <input type="radio" name="tax-nature" checked={taxNature === 'inter'} onChange={() => setTaxNature('inter')} /> Inter-State (IGST)
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Calculation Mode</label>
                      <div className="flex items-center gap-4 pt-1">
                        <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                          <input type="radio" name="calc-mode" checked={calcMode === 'exclusive'} onChange={() => setCalcMode('exclusive')} /> Exclusive of GST
                        </label>
                        <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                          <input type="radio" name="calc-mode" checked={calcMode === 'inclusive'} onChange={() => setCalcMode('inclusive')} /> Inclusive of GST
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result card */}
                <div className="bg-brand-slate text-white p-6 rounded-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Calculation Summary</div>
                    <div className="space-y-2 border-b border-slate-800 pb-4 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Taxable Base:</span>
                        <span className="font-mono font-semibold text-white">{gstCalc.base}</span>
                      </div>
                      {taxNature === 'intra' ? (
                        <>
                          <div className="flex justify-between text-slate-300">
                            <span>CGST ({gstCalc.halfRate}%):</span>
                            <span className="font-mono text-emerald-400">{gstCalc.halfTax}</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>SGST ({gstCalc.halfRate}%):</span>
                            <span className="font-mono text-emerald-400">{gstCalc.halfTax}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between text-slate-300">
                          <span>IGST ({gstRate}%):</span>
                          <span className="font-mono text-emerald-400">{gstCalc.fullTax}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-300 pt-1">
                        <span>Total Tax Component:</span>
                        <span className="font-mono font-semibold text-emerald-400">{gstCalc.taxTotal}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="text-xs text-slate-400">Total Invoice Amount:</div>
                    <div className="text-2xl font-mono font-bold text-white tracking-tight mt-0.5">{gstCalc.gross}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* TDS Calculator Card */}
            <div className="bg-white rounded-2xl border border-brand-subtle shadow-xs p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-xl font-bold font-display text-brand-slate">TDS Threshold &amp; Deduction Calculator</h3>
                  <p className="text-xs text-brand-muted mt-1">Chapter XVII-B withholding tax calculator with section threshold &amp; 206AA penal validation.</p>
                </div>
                <button
                  onClick={() => {
                    const txt = `[TDS Summary] Section: ${currentTdsBench.section}, Gross: ${formatINRSimple(tdsAmount)}, TDS: ${formatINRSimple(computedTdsTax)}, Net: ${formatINRSimple(computedNetPayable)}`;
                    navigator.clipboard.writeText(txt);
                    setTdsCopyLabel('Copied!');
                    setTimeout(() => setTdsCopyLabel('Copy Breakdown'), 2000);
                  }}
                  className="text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-brand-slate px-3 py-1.5 rounded-lg border border-slate-200 inline-flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-brand-accent" />
                  <span>{tdsCopyLabel}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Applicable Statutory Section *</label>
                    <select
                      value={tdsSection}
                      onChange={(e) => setTdsSection(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-brand-subtle rounded-xl text-sm focus:bg-white focus:border-brand-accent focus:outline-none"
                    >
                      <option value="194C_ind">Sec 194C - Contractor (Individual / HUF) [1%]</option>
                      <option value="194C_corp">Sec 194C - Contractor (Company / Firm) [2%]</option>
                      <option value="194J_prof">Sec 194J - Professional / Legal Fees [10%]</option>
                      <option value="194J_tech">Sec 194J - Technical Services [2%]</option>
                      <option value="194I_land">Sec 194I - Rent on Land / Building [10%]</option>
                      <option value="194I_mach">Sec 194I - Rent on Plant & Machinery [2%]</option>
                      <option value="194H_comm">Sec 194H - Commission or Brokerage [2%]</option>
                      <option value="194Q_goods">Sec 194Q - Purchase of Goods (&gt; ₹50 Lakhs) [0.1%]</option>
                    </select>
                    <div className="text-[11px] text-slate-500 mt-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-brand-accent shrink-0 mt-0.5" />
                      <span>{currentTdsBench.ruleText}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice / Gross Bill Value (₹) *</label>
                      <input
                        type="number"
                        value={tdsAmount}
                        onChange={(e) => setTdsAmount(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-brand-subtle rounded-xl text-sm font-mono focus:bg-white focus:border-brand-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Cumulative Billing Context</label>
                      <div className="pt-2">
                        <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer text-slate-700">
                          <input
                            type="checkbox"
                            checked={tdsAggregate}
                            onChange={(e) => setTdsAggregate(e.target.checked)}
                            className="rounded border-slate-300 text-brand-accent"
                          />
                          <span>Exceeds Annual Aggregate Threshold</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <label className="inline-flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasPan}
                        onChange={(e) => setHasPan(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-brand-accent"
                      />
                      <span className="text-xs font-bold text-brand-slate">Valid PAN Furnished by Payee</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Under <strong>Section 206AA</strong>, non-furnishing of valid PAN mandates 20.00% penal TDS deduction.
                    </p>
                  </div>
                </div>

                {/* TDS Output Card */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-brand-slate text-white p-6 rounded-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Statutory Computation</div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${tdsApplies ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        {tdsApplies ? 'TDS Applicable' : 'Exempt from TDS'}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Applicable Section:</span>
                        <span className="font-bold font-mono text-brand-accent">{currentTdsBench.section}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Threshold Limit:</span>
                        <span className="font-mono text-slate-200">₹{currentTdsBench.singleThreshold.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Applied Rate:</span>
                        <span className="font-bold font-mono text-emerald-400">{effectiveTdsRate.toFixed(1)}%</span>
                      </div>
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <div className="flex justify-between text-slate-300">
                          <span>Gross Bill:</span>
                          <span className="font-mono text-white">{formatINRSimple(tdsAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-rose-300 bg-rose-950/40 px-2.5 py-1.5 rounded-lg border border-rose-800/40">
                          <span>TDS Deductible:</span>
                          <span className="font-mono font-bold text-rose-300">{formatINRSimple(computedTdsTax)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-slate-800 mt-4">
                    <div className="text-[11px] text-slate-400">Net Payable to Vendor:</div>
                    <div className="text-3xl font-mono font-bold text-white tracking-tight mt-1">{formatINRSimple(computedNetPayable)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW: ACCOUNTING BLOG SECTION                                   */}
        {/* =============================================================== */}
        {activeTab === 'blog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-subtle pb-8">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-brand-accent mb-2 block">Statutory Knowledge &amp; Insights</span>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-slate">Accounting &amp; Compliance Blog</h1>
                <p className="text-brand-muted text-sm mt-1">Expert articles on GST, TDS, ITR filings, and CA practice management.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full bg-white border border-brand-subtle rounded-xl pl-10 pr-4 py-2 text-xs text-brand-slate focus:outline-none focus:border-brand-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts
                .filter(p => p.title.toLowerCase().includes(blogSearch.toLowerCase()) || p.excerpt.toLowerCase().includes(blogSearch.toLowerCase()))
                .map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedArticle(post)}
                    className="bg-white rounded-2xl border border-brand-subtle p-7 shadow-xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-brand-accent border border-blue-100">
                          {post.category}
                        </span>
                        <span className="text-xs text-brand-muted flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold font-display text-brand-slate mb-3 group-hover:text-brand-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-brand-muted leading-relaxed mb-6">{post.excerpt}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-brand-muted">
                      <span>{post.author}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {post.likes}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {post.commentsCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Article Modal Reader */}
            {selectedArticle && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-white border border-brand-subtle w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-10 shadow-2xl relative">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-brand-slate"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-brand-accent mb-4 inline-block">
                    {selectedArticle.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-slate mb-3">{selectedArticle.title}</h1>
                  <div className="text-xs text-brand-muted mb-6">By {selectedArticle.author} • {selectedArticle.date}</div>

                  <div className="text-brand-slate text-sm leading-relaxed space-y-4 border-y border-slate-100 py-6 mb-8 whitespace-pre-line">
                    {selectedArticle.content}
                  </div>

                  <div className="flex items-center justify-between mb-8">
                    <button
                      onClick={() => {
                        selectedArticle.likes += 1;
                        showToast('❤️ Thank you for liking this article!');
                      }}
                      className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-brand-slate px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      <ThumbsUp className="w-4 h-4 text-brand-accent" />
                      <span>Like ({selectedArticle.likes})</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showToast('🔗 Article link copied!');
                      }}
                      className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-brand-slate px-4 py-2 rounded-xl text-xs font-medium"
                    >
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>

                  <div className="space-y-4 border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-brand-slate">Comments</h3>
                    {(articleComments[selectedArticle.id] || []).map((c, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">{c}</div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-brand-slate focus:outline-none focus:border-brand-accent"
                      />
                      <button
                        onClick={() => {
                          if (!commentText.trim()) return;
                          setArticleComments({
                            ...articleComments,
                            [selectedArticle.id]: [...(articleComments[selectedArticle.id] || []), commentText]
                          });
                          selectedArticle.commentsCount += 1;
                          setCommentText('');
                          showToast('💬 Comment posted successfully!');
                        }}
                        className="bg-brand-slate hover:bg-brand-accent text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW: ANALYTICS DASHBOARD                                       */}
        {/* =============================================================== */}
        {activeTab === 'analytics' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-subtle pb-8">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-brand-accent mb-2 block">Client &amp; Portal Intelligence</span>
                <h1 className="text-3xl font-display font-bold text-brand-slate">Analytics Dashboard</h1>
                <p className="text-brand-muted text-sm mt-1">Real-time metrics tracking client logins, portal utility usage, and compliance deadlines.</p>
              </div>

              <div className="flex items-center gap-2 bg-white border border-brand-subtle p-1 rounded-xl">
                {(['7d', '30d', 'ytd'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAnalyticsRange(r)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-all ${
                      analyticsRange === r ? 'bg-brand-slate text-white shadow-xs' : 'text-brand-muted hover:text-brand-slate'
                    }`}
                  >
                    {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Year to Date'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Client Portal Logins', value: analyticsRange === '7d' ? '3,420' : analyticsRange === '30d' ? '14,890' : '98,400', change: '+12.4%' },
                { title: 'GST Returns Filed', value: analyticsRange === '7d' ? '412' : analyticsRange === '30d' ? '1,850' : '11,400', change: '+18.2%' },
                { title: 'TDS Challans Generated', value: analyticsRange === '7d' ? '284' : analyticsRange === '30d' ? '1,240' : '7,890', change: '+8.9%' },
                { title: 'Calculator Utility Usage', value: analyticsRange === '7d' ? '1,920' : analyticsRange === '30d' ? '8,400' : '54,200', change: '+24.1%' }
              ].map((m, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-brand-subtle shadow-xs space-y-3">
                  <div className="text-xs font-medium text-brand-muted">{m.title}</div>
                  <div className="text-3xl font-display font-bold text-brand-slate">{m.value}</div>
                  <div className="text-xs font-semibold text-emerald-600">{m.change} vs prior period</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW: SOCIAL MEDIA HUB                                          */}
        {/* =============================================================== */}
        {activeTab === 'social' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="border-b border-brand-subtle pb-8">
              <span className="text-xs uppercase font-bold tracking-wider text-brand-accent mb-2 block">Brand Visibility</span>
              <h1 className="text-3xl font-display font-bold text-brand-slate">Social Media Integration</h1>
              <p className="text-brand-muted text-sm mt-1">Connect with our professional updates across digital networks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'LinkedIn Professional Desk', handle: 'Jha Accounting Solutions', desc: 'Direct corporate updates, GST notifications, and regulatory advisories.', link: 'https://linkedin.com' },
                { name: 'X / Twitter Tax Updates', handle: '@JhaAccounting', desc: 'Real-time tax calendar deadlines and compliance alerts.', link: 'https://twitter.com' },
                { name: 'WhatsApp Business Support', handle: '+91 98765 43210', desc: 'Quick document sharing and direct advisory consultations.', link: 'https://whatsapp.com' }
              ].map((s, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-brand-subtle shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-display text-brand-slate mb-1">{s.name}</h3>
                    <div className="text-xs font-mono text-brand-accent mb-3">{s.handle}</div>
                    <p className="text-xs text-brand-muted leading-relaxed mb-6">{s.desc}</p>
                  </div>
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-brand-slate hover:text-white text-brand-slate py-2.5 rounded-xl text-xs font-semibold transition-all"
                  >
                    <span>Connect</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW: CONTACT & INQUIRY                                         */}
        {/* =============================================================== */}
        {activeTab === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="border-b border-brand-subtle pb-8">
              <span className="text-xs uppercase font-bold tracking-wider text-brand-accent mb-2 block">Direct Contact &amp; Inquiries</span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-slate">Let's Discuss Your Compliance Needs.</h1>
              <p className="text-brand-muted text-sm mt-1">Our team responds within 24 business hours.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-8 rounded-2xl border border-brand-subtle shadow-xs space-y-6">
                  <h3 className="text-xl font-bold font-display text-brand-slate">Direct Communications</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand-accent flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-brand-muted font-medium">Inquiry Desk</div>
                      <a href="mailto:solutions@jhaaccounting.in" className="text-sm font-semibold text-brand-slate hover:text-brand-accent">
                        solutions@jhaaccounting.in
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand-accent flex items-center justify-center shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-brand-muted font-medium">Direct Line / WhatsApp</div>
                      <a href="tel:+919876543210" className="text-sm font-semibold text-brand-slate hover:text-brand-accent">
                        +91 (0) 98765 43210
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-white p-8 sm:p-10 rounded-2xl border border-brand-subtle shadow-xs">
                  {contactSubmitted ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold font-display text-brand-slate">Inquiry Received Successfully!</h3>
                      <p className="text-xs text-brand-muted max-w-md mx-auto">
                        An accounting specialist will examine your requirements and get back to you within 24 business hours.
                      </p>
                      <button
                        onClick={() => setContactSubmitted(false)}
                        className="mt-4 bg-brand-slate text-white px-6 py-2.5 rounded-xl text-xs font-semibold"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!contactForm.name || !contactForm.email || !contactForm.message) {
                          showToast('⚠️ Please fill in all required fields.');
                          return;
                        }
                        setContactSubmitted(true);
                        showToast('✨ Inquiry submitted successfully!');
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="Ramesh Jha"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-brand-subtle rounded-xl text-sm focus:bg-white focus:border-brand-accent focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Company / CA Firm Name</label>
                          <input
                            type="text"
                            value={contactForm.company}
                            onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                            placeholder="Acme Enterprises"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-brand-subtle rounded-xl text-sm focus:bg-white focus:border-brand-accent focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="name@company.com"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-brand-subtle rounded-xl text-sm focus:bg-white focus:border-brand-accent focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            placeholder="+91 98765 00000"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-brand-subtle rounded-xl text-sm focus:bg-white focus:border-brand-accent focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Area of Interest *</label>
                        <select
                          value={contactForm.service}
                          onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-brand-subtle rounded-xl text-sm focus:bg-white focus:border-brand-accent focus:outline-none"
                        >
                          <option value="GST Solutions">GST Solutions</option>
                          <option value="Direct Tax Compliance">Direct Tax Compliance</option>
                          <option value="TDS & TCS Returns">TDS & TCS Returns</option>
                          <option value="Full-Cycle Bookkeeping">Full-Cycle Bookkeeping</option>
                          <option value="Accounting Outsourcing">Accounting Outsourcing</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Requirement Details *</label>
                        <textarea
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Describe invoice volume or specific compliance requirements..."
                          className="w-full px-4 py-2.5 bg-slate-50 border border-brand-subtle rounded-xl text-sm focus:bg-white focus:border-brand-accent focus:outline-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-slate hover:bg-brand-accent text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
                      >
                        <span>Submit Inquiry</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Push Notifications Modal */}
      {notificationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-brand-subtle w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-brand-accent" />
                <h3 className="text-lg font-bold text-brand-slate">Push Notifications Center</h3>
              </div>
              <button onClick={() => setNotificationModalOpen(false)} className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <div className="text-xs font-bold text-brand-slate">Enable Push Notifications</div>
                <div className="text-[11px] text-brand-muted">Receive instant alerts for filing dates</div>
              </div>
              <button
                onClick={handleTogglePush}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${pushEnabled ? 'bg-brand-accent' : 'bg-slate-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${pushEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <button
              onClick={handleTestPush}
              className="w-full bg-brand-slate hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-semibold transition-all"
            >
              🚀 Send Test Push Notification
            </button>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Filing Alerts</div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between text-xs font-bold text-brand-slate">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-brand-muted">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FOOTER */}
      <footer className="bg-brand-dark text-slate-400 border-t border-slate-800 pt-16 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-accent text-white flex items-center justify-center font-display font-bold text-sm">
                JA
              </div>
              <span className="font-display font-bold text-base text-white">Jha Accounting</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Professional accounting services, statutory compliance management, and specialized B2B outsourcing solutions.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-white">Home &amp; Services</button></li>
              <li><button onClick={() => setActiveTab('outsourcing')} className="hover:text-white">B2B Outsourcing</button></li>
              <li><button onClick={() => setActiveTab('tools')} className="hover:text-white">Client Tools Hub</button></li>
              <li><button onClick={() => setActiveTab('blog')} className="hover:text-white">Accounting Blog</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Core Practices</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>GST Filings &amp; 2B Reconciliation</li>
              <li>Direct Tax &amp; ITR Compliance</li>
              <li>Quarterly TDS/TCS Return Audits</li>
              <li>Multi-Platform Bookkeeping</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Statutory Notice</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jha Accounting Solutions operates as an independent accounting and statutory compliance practice.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Jha Accounting Solutions. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Protocol: Client ledgers are kept strictly confidential.'); }} className="hover:text-slate-400">Data Privacy Protocol</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Engagement: Timelines are subject to timely receipt of invoices.'); }} className="hover:text-slate-400">Terms of Engagement</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
