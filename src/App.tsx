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
  Info,
  Copy,
  Briefcase,
  FilePlus2,
  GitCompare,
  FolderLock,
  TrendingDown,
  Percent,
  Play,
  Home,
  Users,
  Cpu
} from 'lucide-react';

// =========================================================================
// ARCHITECTURE & CONFIGURATION REGISTRY (Data-Driven / Config-Driven)
// =========================================================================
interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  features: string[];
}

interface ToolItem {
  id: string;
  title: string;
  status: 'active' | 'beta' | 'coming_soon';
  badgeText: string;
  description: string;
  iconName: string;
  action: string;
  toolTarget?: 'gst' | 'tds';
}

const APP_CONFIG = {
  branding: {
    name: "Jha Accounting Solutions",
    tagline: "Modern Accounting Solutions & B2B Outsourcing",
    inquiryEmail: "solutions@jhaaccounting.in",
    phone: "+91 (0) 98765 43210",
    operatingHours: "Monday – Saturday : 09:30 AM – 07:00 PM IST"
  },
  navigation: [
    { id: 'home', label: 'Home', iconName: 'home' },
    { id: 'outsourcing', label: 'B2B Outsourcing', iconName: 'layers' },
    { id: 'tools', label: 'Apps & Tools Hub', badge: 'Interactive', iconName: 'cpu' },
    { id: 'blog', label: 'Accounting Blog', iconName: 'book-open' },
    { id: 'analytics', label: 'Analytics Dashboard', iconName: 'bar-chart' },
    { id: 'social', label: 'Social Hub', iconName: 'share' },
    { id: 'contact', label: 'Contact', iconName: 'mail' }
  ],
  services: [
    {
      id: "gst-solutions",
      title: "GST Solutions",
      category: "Indirect Tax",
      description: "End-to-end Goods and Services Tax compliance including prompt GST registration, monthly GSTR-1 outward filing, GSTR-3B tax computation, and thorough GSTR-2B input tax credit (ITC) reconciliation.",
      iconName: "receipt",
      features: [
        "GSTR-1 & GSTR-3B filings",
        "GSTR-2B ITC matched with purchase register",
        "New GST registrations & amendments",
        "Handling mismatches & e-Way bill support"
      ]
    },
    {
      id: "direct-tax",
      title: "Direct Tax Compliance",
      category: "Income Tax",
      description: "Structured Income Tax Return (ITR) preparation and statutory filings for corporate entities, LLPs, proprietorships, and professionals, ensuring accurate balance sheet classification.",
      iconName: "calculator",
      features: [
        "Corporate & Non-Corporate ITR Filings",
        "Advance tax computation schedules",
        "Depreciation & expense schedule alignment",
        "Computation of total income & tax audit sheets"
      ]
    },
    {
      id: "tds-tcs",
      title: "TDS & TCS Returns",
      category: "Statutory Withholding",
      description: "Rigorous quarterly withholding tax compliance, deduction validation, correct section mapping (194C, 194J, 194Q, 206C), challan verification, and Form 16 / 16A generation.",
      iconName: "file-text",
      features: [
        "Quarterly 24Q, 26Q, and 27EQ returns",
        "Challan generation & payment tracking",
        "Form 16/16A generation & digital sign-off",
        "TRACES justification report reconciliation"
      ]
    },
    {
      id: "bookkeeping",
      title: "Full-Cycle Bookkeeping",
      category: "Core Accounting",
      description: "Meticulous daily and monthly general ledger maintenance, bank reconciliation statements (BRS), accounts payable/receivable monitoring, and monthly financial closures.",
      iconName: "book-open",
      features: [
        "Ledger maintenance & chart of accounts setup",
        "Weekly / Monthly Bank & Card Reconciliations",
        "Vendor bill bookings & Customer AR ageings",
        "Monthly Profit & Loss, Balance Sheet, Cash Flow"
      ]
    },
    {
      id: "outsourcing-module",
      title: "Accounting Outsourcing",
      category: "B2B Solutions",
      description: "Specialized back-office processing, high-volume data entry, and compliance handling for practicing Chartered Accountants, CPAs, and corporate accounting departments.",
      iconName: "layers",
      features: [
        "White-label working paper preparation",
        "Multi-software support: Tally, Zoho, QuickBooks",
        "Scalable capacity during peak filing deadlines",
        "Zero client poaching guarantee under strict NDA"
      ]
    }
  ] as ServiceItem[],
  tools: [
    {
      id: "tool-gst-calc",
      title: "GST Rate & ITC Calculator",
      status: "active",
      badgeText: "Ready to Use",
      description: "Interactive real-time calculator to evaluate split taxes (CGST, SGST, IGST) across invoice amounts with inclusive and exclusive tax modes.",
      iconName: "percent",
      action: "Launch GST Calculator",
      toolTarget: "gst"
    },
    {
      id: "tool-tds-calculator",
      title: "TDS Section Threshold & Deduction Finder",
      status: "active",
      badgeText: "Ready to Use",
      description: "Live deduction engine covering 194C, 194J, 194I, 194H & 194Q with threshold triggers, payee classifications, and Section 206AA non-PAN penal rate checks.",
      iconName: "calculator",
      action: "Launch TDS Calculator",
      toolTarget: "tds"
    },
    {
      id: "tool-invoice-maker",
      title: "Statutory Invoice Generator",
      status: "coming_soon",
      badgeText: "Coming Soon",
      description: "A lightweight web tool to generate GST-compliant e-invoice ready PDFs with automatic HSN codes, reverse charge flags, and QR placeholders.",
      iconName: "file-plus-2",
      action: "Notify Me Upon Launch"
    },
    {
      id: "tool-reconcile-hub",
      title: "GSTR-2B vs Books Excel Matcher",
      status: "beta",
      badgeText: "In Beta Testing",
      description: "Browser-based client-side tool to parse portal JSON/Excel and highlight missing invoices, mismatching GSTINs, and excess claims.",
      iconName: "git-compare",
      action: "Request Beta Access"
    },
    {
      id: "tool-client-portal",
      title: "Secure Client Document Portal",
      status: "coming_soon",
      badgeText: "Q3 Roadmap",
      description: "Encrypted repository where clients can upload monthly bank statements, download filed returns, and monitor real-time filing progress.",
      iconName: "folder-lock",
      action: "Learn More"
    },
    {
      id: "tool-deprec-calc",
      title: "Companies Act & IT Depreciation Table",
      status: "coming_soon",
      badgeText: "Coming Soon",
      description: "Comparative calculation sheet calculating asset depreciation under the Income Tax WDV method versus Companies Act SLM schedule.",
      iconName: "trending-down",
      action: "Notify Me"
    }
  ] as ToolItem[]
};

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
  const [activeToolTab, setActiveToolTab] = useState<'gst' | 'tds'>('gst');
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
    service: APP_CONFIG.services[0].title,
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Blog State
  const [blogSearch, setBlogSearch] = useState('');
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

  // Helper icon renderer
  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'receipt':
        return <Receipt className="w-5 h-5" />;
      case 'calculator':
        return <Calculator className="w-5 h-5" />;
      case 'file-text':
        return <FileText className="w-5 h-5" />;
      case 'book-open':
        return <BookOpen className="w-5 h-5" />;
      case 'layers':
        return <Layers className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const renderToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'percent':
        return <Percent className="w-5 h-5" />;
      case 'calculator':
        return <Calculator className="w-5 h-5" />;
      case 'file-plus-2':
        return <FilePlus2 className="w-5 h-5" />;
      case 'git-compare':
        return <GitCompare className="w-5 h-5" />;
      case 'folder-lock':
        return <FolderLock className="w-5 h-5" />;
      case 'trending-down':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <Calculator className="w-5 h-5" />;
    }
  };

  const renderNavIcon = (iconName?: string) => {
    switch (iconName) {
      case 'home':
        return <Home className="w-5 h-5 shrink-0" />;
      case 'layers':
        return <Layers className="w-5 h-5 shrink-0" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 shrink-0" />;
      case 'book-open':
        return <BookOpen className="w-5 h-5 shrink-0" />;
      case 'bar-chart':
        return <BarChart3 className="w-5 h-5 shrink-0" />;
      case 'share':
        return <Share2 className="w-5 h-5 shrink-0" />;
      case 'mail':
        return <Mail className="w-5 h-5 shrink-0" />;
      default:
        return <Layers className="w-5 h-5 shrink-0" />;
    }
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

  // Professional Vector Logo Component for Jha Accounting Solutions
  const BrandLogo = ({ size = 44, isDark = false }: { size?: number; isDark?: boolean }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      role="img"
      aria-label="Jha Accounting Solutions Official Logo"
    >
      <defs>
        <linearGradient id="jaBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="60%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0B1120" />
        </linearGradient>
        <linearGradient id="jaAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id="jaEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="logoShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0284C7" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Hexagonal Shield Background Container */}
      <rect
        x="2"
        y="2"
        width="52"
        height="52"
        rx="14"
        fill={isDark ? "url(#jaBaseGrad)" : "url(#jaBaseGrad)"}
        stroke={isDark ? "#334155" : "#1E293B"}
        strokeWidth="1.5"
      />

      {/* Inner Architectural Grid Matrix */}
      <circle cx="28" cy="28" r="22" stroke="white" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="2 3" />

      {/* Geometric Letter 'J' - Clean Pillar & Anchor Curve */}
      <path
        d="M20 16 V32 C20 36.418 16.418 39 13.5 39 C12.2 39 11.2 38.6 10.5 38.1"
        stroke="url(#jaAccentGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Geometric Letter 'A' - Slanted Pillar & Apex */}
      <path
        d="M23 39 L35 15 L47 39"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dynamic Financial Precision Crossbar (Upward Trend Arrow + Balance Bar) */}
      <path
        d="M27.5 30 H42.5"
        stroke="url(#jaAccentGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Statutory Growth & Compliance Beacon (Diamond Star / Peak) */}
      <circle cx="35" cy="15" r="2.75" fill="url(#jaEmeraldGrad)" filter="url(#logoShadow)" />
      
      {/* Metric Calibration Tick */}
      <path
        d="M41 22 L45 18"
        stroke="url(#jaEmeraldGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="bg-brand-offwhite text-brand-slate font-sans antialiased selection:bg-brand-accent selection:text-white flex flex-col min-h-screen">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-slate text-cyan-300 border border-cyan-500/40 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 2. HEADER & NAVIGATION */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-subtle transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Brand Identity / Logo */}
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none text-left">
            <BrandLogo size={38} />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base sm:text-xl tracking-tight text-brand-slate leading-none group-hover:text-brand-accent transition-colors">
                Jha Accounting
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-brand-muted tracking-wider uppercase mt-1">
                Solutions &amp; Outsourcing
              </span>
            </div>
          </button>

          {/* Desktop Nav (Dynamically Rendered from APP_CONFIG) */}
          <nav className="hidden lg:flex items-center gap-1">
            {APP_CONFIG.navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === item.id
                    ? 'bg-slate-100 text-brand-slate font-bold shadow-xs'
                    : 'text-brand-muted hover:text-brand-slate hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] bg-brand-accent/10 text-brand-accent px-1.5 py-0.5 rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('contact')}
              className="hidden sm:inline-flex items-center gap-2 bg-brand-slate hover:bg-brand-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile Direct Inquire Quick Button */}
            <button
              onClick={() => setActiveTab('contact')}
              className="sm:hidden p-2 text-slate-700 hover:text-brand-accent hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              aria-label="Direct Contact"
              title="Contact Us"
            >
              <Mail className="w-5 h-5" />
            </button>

            {/* Redesigned Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 text-brand-slate hover:bg-slate-100 rounded-xl border border-slate-200 bg-white shadow-xs focus:outline-none transition-all active:scale-95"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-brand-slate" />
              <span className="text-xs font-bold text-brand-slate">Menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Quick-Swipe Navigation Strip (Right below the header) */}
        <div className="lg:hidden border-t border-slate-200/70 bg-slate-50/95 backdrop-blur-xs px-3 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
          {APP_CONFIG.navigation.map((item) => {
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-800'
                    : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>}
                <span className="whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-blue-100 text-brand-accent'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Redesigned Mobile Slide-Over Drawer with Backdrop */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-over panel */}
            <div className="fixed inset-y-0 right-0 max-w-xs sm:max-w-sm w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <BrandLogo size={36} />
                  <div>
                    <div className="font-display font-bold text-sm text-brand-slate leading-tight">
                      {APP_CONFIG.branding.name}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-brand-accent tracking-wider">
                      Navigation &amp; Portals
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {/* Active View Status Indicator Card */}
                <div className="bg-slate-900 text-white p-3.5 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current View</div>
                      <div className="text-sm font-bold text-white">
                        {APP_CONFIG.navigation.find(n => n.id === activeTab)?.label || 'Overview'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">Active</span>
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-2 pb-1">
                  All Portals &amp; Modules
                </div>
                {APP_CONFIG.navigation.map((item) => {
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-md ring-1 ring-slate-800'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-brand-slate border border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isSelected ? 'text-brand-accent' : 'text-slate-400'}>
                          {renderNavIcon(item.iconName)}
                        </span>
                        <span className={isSelected ? 'font-bold text-white' : 'font-medium'}>
                          {item.label}
                        </span>
                      </div>
                      {item.badge ? (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isSelected
                            ? 'bg-brand-accent text-white'
                            : 'bg-blue-50 text-brand-accent border border-blue-200'
                        }`}>
                          {item.badge}
                        </span>
                      ) : (
                        isSelected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm"></span>
                        )
                      )}
                    </button>
                  );
                })}

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
                    Direct Contact Channels
                  </div>
                  <a
                    href={`tel:${APP_CONFIG.branding.phone}`}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{APP_CONFIG.branding.phone}</span>
                  </a>
                  <a
                    href={`mailto:${APP_CONFIG.branding.inquiryEmail}`}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 break-all"
                  >
                    <Mail className="w-4 h-4 text-brand-accent shrink-0" />
                    <span>{APP_CONFIG.branding.inquiryEmail}</span>
                  </a>
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-brand-slate hover:bg-brand-accent text-white px-4 py-3 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  <span>Request Consultation</span>
                  <ArrowRight className="w-4 h-4 text-brand-accent" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 3. MAIN DYNAMIC VIEW CONTAINER */}
      <main className="flex-grow pb-24 lg:pb-0">

        {/* =============================================================== */}
        {/* VIEW: HOME                                                      */}
        {/* =============================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-0">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-slate-100/60 to-brand-offwhite border-b border-brand-subtle py-10 sm:py-16 lg:py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-subtle text-xs font-semibold text-slate-700 mb-5 shadow-xs">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="leading-tight">Modern Compliance Architecture for Corporate &amp; CA Firms</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-brand-slate leading-[1.2] mb-5 sm:mb-6">
                    Reliable statutory compliance &amp; <span className="text-brand-accent underline decoration-brand-accent/30 decoration-wavy decoration-2">frictionless</span> accounting.
                  </h1>

                  <p className="text-base sm:text-xl text-brand-muted font-normal leading-relaxed mb-6 sm:mb-8 max-w-2xl">
                    From GST reconciliation and TDS quarterly filings to full-cycle day-to-day bookkeeping. We manage your end-to-end accounting pipeline with strict statutory precision.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="inline-flex items-center justify-center gap-2 bg-brand-slate hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                      <span>Request Consultation</span>
                      <ArrowRight className="w-4 h-4 text-brand-accent" />
                    </button>
                    <button
                      onClick={() => setActiveTab('outsourcing')}
                      className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-brand-slate border border-brand-subtle px-6 py-3.5 rounded-xl font-semibold text-sm shadow-xs transition-all hover:border-slate-400"
                    >
                      <Layers className="w-4 h-4 text-slate-500" />
                      <span>Explore B2B Outsourcing</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('tools')}
                      className="inline-flex items-center justify-center gap-2 text-brand-accent hover:text-brand-accentHover text-sm font-semibold px-4 py-3 transition-colors"
                    >
                      <span>View Free Utility Tools</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metrics bar */}
                <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-brand-subtle grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  <div className="space-y-1 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-100 shadow-xs sm:shadow-none">
                    <div className="text-2xl sm:text-3xl font-display font-bold text-brand-slate">99.8%</div>
                    <div className="text-xs text-brand-muted font-medium">On-Time Filing Record</div>
                  </div>
                  <div className="space-y-1 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-100 shadow-xs sm:shadow-none">
                    <div className="text-2xl sm:text-3xl font-display font-bold text-brand-slate">100%</div>
                    <div className="text-xs text-brand-muted font-medium">Statutory Accuracy</div>
                  </div>
                  <div className="space-y-1 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-100 shadow-xs sm:shadow-none">
                    <div className="text-2xl sm:text-3xl font-display font-bold text-brand-slate">24-48h</div>
                    <div className="text-xs text-brand-muted font-medium">SLA Resolution</div>
                  </div>
                  <div className="space-y-1 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-100 shadow-xs sm:shadow-none">
                    <div className="text-2xl sm:text-3xl font-display font-bold text-brand-slate">Zero-Leakage</div>
                    <div className="text-xs text-brand-muted font-medium">Data Confidentiality</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Services Section (Dynamically Rendered from APP_CONFIG) */}
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
                {APP_CONFIG.services.map((service) => (
                  <div key={service.id} className="bg-white rounded-2xl border border-brand-subtle p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 text-brand-slate group-hover:bg-brand-slate group-hover:text-white flex items-center justify-center transition-colors">
                          {renderServiceIcon(service.iconName)}
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          {service.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold font-display text-brand-slate mb-2.5 group-hover:text-brand-accent transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-brand-muted leading-relaxed mb-6">{service.description}</p>
                      <div className="border-t border-slate-100 pt-5 mb-6">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Key Inclusions</div>
                        <ul className="space-y-2">
                          {service.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setContactForm({ ...contactForm, service: service.title });
                          setActiveTab('contact');
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-brand-slate hover:text-white text-brand-slate border border-slate-200 text-xs font-semibold py-2.5 rounded-xl transition-all"
                      >
                        <span>Inquire for {service.title}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Outsourcing Ribbon */}
            <div className="bg-brand-slate text-white py-14">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="space-y-2 max-w-2xl">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400">White-Label Partnership</span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold">Overburdened with client bookkeeping &amp; return deadlines?</h3>
                  <p className="text-slate-300 text-sm">
                    We provide seamless back-office capacity for practicing CAs, CPAs, and corporate accounting desks under strict confidentiality agreements.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('outsourcing')}
                  className="shrink-0 bg-brand-accent hover:bg-brand-accentHover text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span>Learn About Outsourcing Partnerships</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
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
                  Designed specifically for Chartered Accountant firms, accounting practices, and multi-entity corporate teams seeking high-accuracy data entry, ledger audits, and compliance execution.
                </p>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-8 rounded-2xl border border-brand-subtle shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-accent flex items-center justify-center mb-6">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-brand-slate mb-3">White-Label Delivery</h3>
                  <p className="text-brand-muted text-sm leading-relaxed mb-4">
                    We work quietly in the background. Reports, working sheets, reconciliations, and filings are prepared ready for your partner sign-off and client presentation.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-4">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> No direct client solicitations</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Custom working paper formats</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-brand-subtle shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-brand-slate mb-3">High-Volume Ledger Processing</h3>
                  <p className="text-brand-muted text-sm leading-relaxed mb-4">
                    From heavy bank statement parsing to complex multi-branch voucher allocations, we eliminate bookkeeping backlogs rapidly.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-4">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> TallyPrime, Zoho Books, QuickBooks, SAP</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Strict cross-checking protocols</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-brand-subtle shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-brand-slate mb-3">Enterprise-Grade Security</h3>
                  <p className="text-brand-muted text-sm leading-relaxed mb-4">
                    Financial data stays protected via zero-trust cloud workspaces, non-disclosure compliance agreements, and segregated user privilege systems.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-4">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Mutual non-disclosure agreements</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Encrypted transmission channels</li>
                  </ul>
                </div>
              </div>

              {/* Partnership Process Flow */}
              <div className="bg-white rounded-2xl border border-brand-subtle p-8 lg:p-12 mb-16">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs uppercase font-bold tracking-wider text-brand-accent">Smooth Onboarding</span>
                  <h3 className="text-2xl font-bold font-display text-brand-slate mt-1">How Our Outsourcing Engagement Works</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full bg-brand-slate text-white flex items-center justify-center font-bold text-sm">1</div>
                    <h4 className="font-bold text-base text-brand-slate">Requirement Scope</h4>
                    <p className="text-xs text-brand-muted leading-relaxed">Define monthly transaction volume, software platform, and turnaround SLAs.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full bg-brand-slate text-white flex items-center justify-center font-bold text-sm">2</div>
                    <h4 className="font-bold text-base text-brand-slate">NDA &amp; Access Setup</h4>
                    <p className="text-xs text-brand-muted leading-relaxed">Execution of mutual NDA and role-based read/entry access on your preferred accounting suite.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full bg-brand-slate text-white flex items-center justify-center font-bold text-sm">3</div>
                    <h4 className="font-bold text-base text-brand-slate">Execution &amp; Audit</h4>
                    <p className="text-xs text-brand-muted leading-relaxed">Dedicated accounting specialists process books and prepare draft returns with audit trails.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold text-sm">4</div>
                    <h4 className="font-bold text-base text-brand-slate">Partner Sign-off</h4>
                    <p className="text-xs text-brand-muted leading-relaxed">Clean sheets handed over in your format ready for client filing and statutory submissions.</p>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 text-center text-white max-w-3xl mx-auto">
                <h3 className="text-2xl font-display font-bold mb-3">Discuss a Firm-Level Outsourcing Retainer</h3>
                <p className="text-slate-300 text-sm mb-6 max-w-lg mx-auto">
                  Contact us for dedicated back-office capacity tailored to your firm's volume and compliance calendar.
                </p>
                <button
                  onClick={() => {
                    setContactForm({ ...contactForm, service: 'Accounting Outsourcing' });
                    setActiveTab('contact');
                  }}
                  className="bg-brand-accent hover:bg-brand-accentHover text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95"
                >
                  Book an Outsourcing Briefing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW: APPS & TOOLS HUB (Interactive Tools + Showcase Grid)      */}
        {/* =============================================================== */}
        {activeTab === 'tools' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-slate text-white text-xs font-semibold mb-4">
                <Calculator className="w-3.5 h-3.5 text-brand-accent" /> Client Utilities &amp; Interactive Architecture
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-slate mb-2">Accounting Tools &amp; Client Hub</h1>
              <p className="text-brand-muted text-sm">Explore our suite of interactive statutory calculation tools, reconciliation utilities, and upcoming self-service client dashboard modules.</p>
            </div>

            {/* Tool Selection Tabs */}
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
              <button
                onClick={() => setActiveToolTab('gst')}
                className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all ${
                  activeToolTab === 'gst' ? 'bg-brand-slate text-white' : 'bg-white border border-brand-subtle text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Percent className="w-4 h-4 text-emerald-400" />
                <span>GST Breakdown &amp; ITC Estimator</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold ml-1">Live</span>
              </button>
              <button
                onClick={() => setActiveToolTab('tds')}
                className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all ${
                  activeToolTab === 'tds' ? 'bg-brand-slate text-white' : 'bg-white border border-brand-subtle text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Calculator className="w-4 h-4 text-brand-accent" />
                <span>TDS Threshold &amp; Deduction Calculator</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-brand-accent font-bold ml-1">Live</span>
              </button>
            </div>

            {/* GST Calculator Panel */}
            {activeToolTab === 'gst' && (
              <div className="bg-white rounded-2xl border border-brand-subtle shadow-xs p-6 sm:p-8">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">ACTIVE TOOL</span>
                      <h3 className="text-xl font-bold font-display text-brand-slate">Quick GST Breakdown &amp; Tax Estimator</h3>
                    </div>
                    <p className="text-xs text-brand-muted mt-1">Calculate CGST, SGST, IGST, and net amounts instantly for invoicing and ledger checks.</p>
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
                          <option value={5}>5% (Essential Commodities/Transport)</option>
                          <option value={12}>12% (Standard Goods/Processed Foods)</option>
                          <option value={18}>18% (Most Services & Manufacturing)</option>
                          <option value={28}>28% (Luxury & Regulated Goods)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Transaction Nature</label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
                          <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer p-2 rounded-lg bg-slate-50 sm:bg-transparent border sm:border-0 border-slate-200">
                            <input type="radio" name="tax-nature" checked={taxNature === 'intra'} onChange={() => setTaxNature('intra')} className="text-brand-accent focus:ring-brand-accent" />
                            <span>Intra-State (CGST + SGST)</span>
                          </label>
                          <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer p-2 rounded-lg bg-slate-50 sm:bg-transparent border sm:border-0 border-slate-200">
                            <input type="radio" name="tax-nature" checked={taxNature === 'inter'} onChange={() => setTaxNature('inter')} className="text-brand-accent focus:ring-brand-accent" />
                            <span>Inter-State (IGST)</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Calculation Mode</label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
                          <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer p-2 rounded-lg bg-slate-50 sm:bg-transparent border sm:border-0 border-slate-200">
                            <input type="radio" name="calc-mode" checked={calcMode === 'exclusive'} onChange={() => setCalcMode('exclusive')} className="text-brand-accent focus:ring-brand-accent" />
                            <span>Exclusive of GST</span>
                          </label>
                          <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer p-2 rounded-lg bg-slate-50 sm:bg-transparent border sm:border-0 border-slate-200">
                            <input type="radio" name="calc-mode" checked={calcMode === 'inclusive'} onChange={() => setCalcMode('inclusive')} className="text-brand-accent focus:ring-brand-accent" />
                            <span>Inclusive of GST</span>
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
            )}

            {/* TDS Calculator Panel */}
            {activeToolTab === 'tds' && (
              <div className="bg-white rounded-2xl border border-brand-subtle shadow-xs p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-brand-accent">INTERACTIVE UTILITY</span>
                      <h3 className="text-xl font-bold font-display text-brand-slate">TDS Threshold &amp; Deduction Calculator</h3>
                    </div>
                    <p className="text-xs text-brand-muted mt-1">Compute statutory withholding taxes under Chapter XVII-B with section threshold criteria &amp; 206AA penal validation.</p>
                  </div>
                  <button
                    onClick={() => {
                      const txt = `[Jha Accounting - TDS Computation Summary]\nSection: ${currentTdsBench.section}\nGross Bill Amount: ${formatINRSimple(tdsAmount)}\nStatus: ${tdsApplies ? 'TDS Applicable' : 'Exempt from TDS'}\nApplied Rate: ${effectiveTdsRate.toFixed(1)}%\nTDS Deductible: ${formatINRSimple(computedTdsTax)}\nNet Payable to Payee: ${formatINRSimple(computedNetPayable)}`;
                      navigator.clipboard.writeText(txt);
                      setTdsCopyLabel('Copied!');
                      setTimeout(() => setTdsCopyLabel('Copy Breakdown'), 2000);
                    }}
                    className="self-start sm:self-auto text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-brand-slate px-3 py-1.5 rounded-lg border border-slate-200 inline-flex items-center gap-1.5 transition-colors"
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
                              className="rounded border-slate-300 text-brand-accent focus:ring-brand-accent"
                            />
                            <span>Exceeds Annual Aggregate Threshold</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="inline-flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hasPan}
                            onChange={(e) => setHasPan(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-brand-accent focus:ring-brand-accent"
                          />
                          <span className="text-xs font-bold text-brand-slate">Valid PAN Furnished by Payee</span>
                        </label>
                        <span className={`self-start sm:self-auto text-[10px] font-bold px-2 py-0.5 rounded border ${hasPan ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-300'}`}>
                          {hasPan ? 'Standard Rates Apply' : 'Sec 206AA Penal Rate (20%) Active'}
                        </span>
                      </div>
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
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${tdsApplies ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
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
                          <span className={`font-bold font-mono text-sm ${!hasPan ? 'text-rose-400' : 'text-emerald-400'}`}>{effectiveTdsRate.toFixed(1)}%</span>
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
                      <div className="text-[11px] text-slate-400">Net Remittance to Vendor:</div>
                      <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight mt-1">{formatINRSimple(computedNetPayable)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Roadmap / Future Showcase Grid (Dynamically Rendered from APP_CONFIG.tools) */}
            <div className="pt-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-brand-accent mb-1">Architecture Roadmap</div>
                  <h2 className="text-2xl font-bold font-display text-brand-slate">Upcoming Platform Modules &amp; Tools</h2>
                </div>
                <p className="text-brand-muted text-xs max-w-sm">
                  Dynamically configured tools scheduled for rollout. Designed to give clients live reconciliation dashboards and automated financial trackers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {APP_CONFIG.tools.map((tool) => {
                  let badgeClass = "bg-slate-100 text-slate-600 border-slate-200";
                  if (tool.status === 'active') badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  if (tool.status === 'beta') badgeClass = "bg-blue-50 text-blue-700 border-blue-200";

                  return (
                    <div key={tool.id} className="bg-white rounded-2xl border border-brand-subtle p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                            {renderToolIcon(tool.iconName)}
                          </div>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                            {tool.badgeText}
                          </span>
                        </div>
                        <h3 className="text-base font-bold font-display text-brand-slate mb-2">{tool.title}</h3>
                        <p className="text-xs text-brand-muted leading-relaxed mb-6">{tool.description}</p>
                      </div>

                      <div>
                        {tool.toolTarget ? (
                          <button
                            onClick={() => {
                              setActiveToolTab(tool.toolTarget as any);
                              window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            className="w-full text-xs font-semibold py-2.5 px-4 rounded-xl bg-brand-slate text-white hover:bg-brand-accent transition-colors flex items-center justify-center gap-2"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>{tool.action}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setContactForm({ ...contactForm, message: `Inquiry regarding future utility: ${tool.title}` });
                              setActiveTab('contact');
                            }}
                            className="w-full text-xs font-semibold py-2.5 px-4 rounded-xl border border-brand-subtle text-slate-600 hover:text-brand-slate hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <span>{tool.action}</span>
                            <Bell className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
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
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-brand-muted font-medium">Inquiry Desk</div>
                      <a href={`mailto:${APP_CONFIG.branding.inquiryEmail}`} className="text-sm font-semibold text-brand-slate hover:text-brand-accent break-all sm:break-normal">
                        {APP_CONFIG.branding.inquiryEmail}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand-accent flex items-center justify-center shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-brand-muted font-medium">Direct Line / WhatsApp</div>
                      <a href="tel:+919876543210" className="text-sm font-semibold text-brand-slate hover:text-brand-accent">
                        {APP_CONFIG.branding.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand-accent flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-brand-muted font-medium">Operating Hours</div>
                      <div className="text-sm font-semibold text-brand-slate">
                        {APP_CONFIG.branding.operatingHours}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-brand-slate font-bold text-sm">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Strict Confidentiality Assurance
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    We sign non-disclosure agreements prior to reviewing financial books. Your data, customer records, and ledger volumes remain confidential.
                  </p>
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
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Authorized Signatory *</label>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="e.g. Ramesh Jha"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-brand-subtle rounded-xl text-sm focus:bg-white focus:border-brand-accent focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Company / CA Firm Name</label>
                          <input
                            type="text"
                            value={contactForm.company}
                            onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                            placeholder="e.g. Acme Enterprises / Jha & Co."
                            className="w-full px-4 py-2.5 bg-slate-50 border border-brand-subtle rounded-xl text-sm focus:bg-white focus:border-brand-accent focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email Address *</label>
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
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / Mobile Number *</label>
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

                      {/* Config-Driven Service Selection Field */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Area of Interest *</label>
                        <select
                          value={contactForm.service}
                          onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-brand-subtle rounded-xl text-sm focus:bg-white focus:border-brand-accent focus:outline-none"
                        >
                          <optgroup label="Core Accounting Solutions">
                            {APP_CONFIG.services.map((s) => (
                              <option key={s.id} value={s.title}>
                                {s.title}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Platform & Other Services">
                            <option value="General Consultation">General Corporate Consultation</option>
                            <option value="Tools & Early Access">Early Access to Future Client Tools</option>
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Requirement Details / Monthly Volume *</label>
                        <textarea
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Please describe your entity type, estimated invoice volume, or specific filing requirements..."
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

      {/* 4. MOBILE BOTTOM APP DOCK (NATIVE APP STYLE) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-brand-accent font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-brand-accent stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Home</span>
          {activeTab === 'home' && <span className="w-1 h-1 rounded-full bg-brand-accent mt-0.5"></span>}
        </button>

        <button
          onClick={() => setActiveTab('outsourcing')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'outsourcing' ? 'text-brand-accent font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className={`w-5 h-5 ${activeTab === 'outsourcing' ? 'text-brand-accent stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Outsource</span>
          {activeTab === 'outsourcing' && <span className="w-1 h-1 rounded-full bg-brand-accent mt-0.5"></span>}
        </button>

        <button
          onClick={() => setActiveTab('tools')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
            activeTab === 'tools' ? 'text-brand-accent font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calculator className={`w-5 h-5 ${activeTab === 'tools' ? 'text-brand-accent stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Tools Hub</span>
          <span className="absolute 0 top-0.5 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          {activeTab === 'tools' && <span className="w-1 h-1 rounded-full bg-brand-accent mt-0.5"></span>}
        </button>

        <button
          onClick={() => setActiveTab('blog')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'blog' ? 'text-brand-accent font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'blog' ? 'text-brand-accent stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Blog</span>
          {activeTab === 'blog' && <span className="w-1 h-1 rounded-full bg-brand-accent mt-0.5"></span>}
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 transition-all"
        >
          <Menu className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">More</span>
        </button>
      </div>

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
              <BrandLogo size={38} isDark={true} />
              <span className="font-display font-bold text-base text-white">{APP_CONFIG.branding.name}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Professional accounting services, statutory compliance management, and specialized B2B outsourcing solutions.
            </p>
            <div className="text-[11px] text-slate-500">
              Dedicated to zero-defect financial records and rigorous filing integrity.
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-white">Home &amp; Services</button></li>
              <li><button onClick={() => setActiveTab('outsourcing')} className="hover:text-white">B2B Outsourcing</button></li>
              <li><button onClick={() => setActiveTab('tools')} className="hover:text-white">Client Tools Hub</button></li>
              <li><button onClick={() => setActiveTab('blog')} className="hover:text-white">Accounting Blog</button></li>
              <li><button onClick={() => setActiveTab('contact')} className="hover:text-white">Inquiry &amp; Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Core Practices</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>GST Filings &amp; 2B Reconciliation</li>
              <li>Direct Tax &amp; ITR Compliance</li>
              <li>Quarterly TDS/TCS Return Audits</li>
              <li>Multi-Platform Bookkeeping</li>
              <li>White-Label Support for CA Firms</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Statutory Notice</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jha Accounting Solutions operates as an independent accounting, bookkeeping, and statutory compliance facilitation practice. We focus on execution, return filings, and back-office accounting operations.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
              <Check className="w-4 h-4" /> SLA-Backed Accuracy
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} {APP_CONFIG.branding.name}. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast('🔒 All client ledgers and tax records are strictly secured under mutual Non-Disclosure Agreements.'); }} className="hover:text-slate-400">Data Privacy Protocol</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); showToast('📋 Terms: Turnaround timelines are SLA-backed upon receipt of source invoices and statements.'); }} className="hover:text-slate-400">Terms of Engagement</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
