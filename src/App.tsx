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
  Share2,
  ThumbsUp,
  MessageSquare,
  Search,
  ExternalLink,
  CheckCircle2,
  Info,
  Briefcase,
  Percent,
  Home,
  Users,
  Award,
  Calendar,
  TrendingUp,
  Building2,
  Lock,
  ChevronRight,
  Phone,
  FileCheck
} from 'lucide-react';

// =========================================================================
// CORPORATE CONFIGURATION & PRACTICE REGISTRY (Data-Driven)
// =========================================================================
interface ServiceItem {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  description: string;
  iconName: string;
  features: string[];
  deliverables: string;
}

interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  commentsCount: number;
}

interface TaxDeadline {
  date: string;
  title: string;
  category: string;
  description: string;
  urgency: 'critical' | 'upcoming' | 'routine';
}

const APP_CONFIG = {
  branding: {
    name: "Jha Accounting Solutions",
    legalTitle: "Chartered Accountants & Corporate Tax Advisory",
    tagline: "Strategic Tax Compliance, Statutory Audit & B2B Outsourcing",
    inquiryEmail: "solutions@jhaaccounting.in",
    phone: "+91 (0) 98765 43210",
    phoneRaw: "+919876543210",
    whatsappLink: "https://wa.me/919876543210?text=Hello%20Jha%20Accounting%20Team%2C%20I%20would%20like%20to%20schedule%20a%20tax%20and%20compliance%20consultation.",
    operatingHours: "Monday – Saturday: 09:30 AM – 07:00 PM IST",
    officeAddress: "Tower B, Level 6, Cyber City Corporate Hub, Gurugram / New Delhi NCR, India",
    globalDesk: "Offshore Back-Office Desks serving US, UK & UAE Accounting Practices"
  },
  navigation: [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Practice Areas' },
    { id: 'outsourcing', label: 'B2B Outsourcing' },
    { id: 'calculators', label: 'Tax Calculators' },
    { id: 'insights', label: 'Insights & Calendar' },
    { id: 'why-us', label: 'Why Choose Us' },
    { id: 'contact', label: 'Contact & Advisory' }
  ],
  services: [
    {
      id: "gst-solutions",
      title: "GST Compliance & ITC Audit",
      category: "Indirect Tax",
      shortDesc: "End-to-end GST filing, 100% GSTR-2B input credit reconciliation & mismatch resolution.",
      description: "Comprehensive Goods and Services Tax compliance including prompt GST registration, monthly GSTR-1 outward filing, GSTR-3B tax computation, and thorough GSTR-2B input tax credit (ITC) reconciliation with zero cash-flow leakage.",
      iconName: "receipt",
      features: [
        "Monthly GSTR-1 & GSTR-3B return filings",
        "Rigorous GSTR-2B ITC matched with purchase register",
        "Handling Departmental notices & scrutiny replies",
        "E-Way bill automation & GST refund processing"
      ],
      deliverables: "Monthly reconciliation report, filing acknowledgment challans, and ITC risk matrix."
    },
    {
      id: "direct-tax",
      title: "Corporate Income Tax & TDS",
      category: "Direct Taxation",
      shortDesc: "Corporate return filing, quarterly TDS 24Q/26Q, advance tax planning & scrutiny handling.",
      description: "Structured corporate tax planning, computation of advance tax installments, preparation and submission of ITR-6 for companies and ITR-5 for LLPs, alongside full quarterly TDS compliance and Form 16/16A generation.",
      iconName: "calculator",
      features: [
        "Corporate ITR-5, ITR-6 & ITR-7 filings",
        "Quarterly TDS returns (24Q, 26Q, 27Q) & Form 16A",
        "Advance tax forecasting & liability minimization",
        "Faceless assessment replies & Section 148 appeals"
      ],
      deliverables: "Advance tax computation schedule, filed ITR acknowledgments, and quarterly TDS certificates."
    },
    {
      id: "audit-assurance",
      title: "Statutory & Internal Audit",
      category: "Assurance",
      shortDesc: "Independent statutory audits, Tax Audit under 44AB, internal controls & stock verification.",
      description: "Rigorous statutory auditing compliant with ICAI Standards on Auditing (SAs) and Companies Act 2013, Tax Audit reporting under Section 44AB (Form 3CA/3CD), internal risk assessments, and forensic ledger audits.",
      iconName: "file-check",
      features: [
        "Company Statutory Audit under Companies Act 2013",
        "Tax Audit under Section 44AB (Form 3CA/3CD)",
        "Internal Financial Controls (IFC) testing & SOPs",
        "Physical asset verification & inventory valuation"
      ],
      deliverables: "Comprehensive Audit Report, CARO disclosures, and Executive Management Letter."
    },
    {
      id: "virtual-cfo",
      title: "Virtual CFO & Strategic Advisory",
      category: "Financial Leadership",
      shortDesc: "Executive financial leadership, cash flow modeling, MIS reporting & investor board packs.",
      description: "High-caliber financial steering for fast-scaling startups and SMEs without the overhead of a full-time CFO. We govern cash runway, optimize unit economics, build investor MIS packages, and supervise accounting teams.",
      iconName: "trending-up",
      features: [
        "Monthly MIS reporting & variance analysis",
        "Cash burn, working capital & runway optimization",
        "Due diligence preparation for venture funding & debt",
        "Budgeting, forecast models & CAPEX planning"
      ],
      deliverables: "Monthly Board-ready financial deck, KPI scorecards, and strategic capital review."
    },
    {
      id: "corporate-roc",
      title: "Company Secretarial & ROC",
      category: "Corporate Law",
      shortDesc: "Private Limited incorporation, annual ROC filings (AOC-4, MGT-7), resolutions & DIN filings.",
      description: "Complete corporate legal compliance managed under Ministry of Corporate Affairs (MCA). We handle new entity incorporations, annual filing of financial statements and annual returns, director KYC, and statutory register maintenance.",
      iconName: "building",
      features: [
        "Private Limited, LLP & Section 8 incorporation",
        "Annual ROC filings (Form AOC-4, MGT-7/7A)",
        "Director KYC (DIR-3 KYC) & Board resolutions",
        "Share transfers, increase in authorized capital"
      ],
      deliverables: "ROC submission receipts, statutory register records, and compliance certificates."
    },
    {
      id: "bookkeeping-payroll",
      title: "Full-Cycle Bookkeeping & Payroll",
      category: "Day-to-Day Operations",
      shortDesc: "Daily ledger posting, automated bank reconciliation, PF/ESI compliance & payslip dispatch.",
      description: "Flawless day-to-day accounts maintenance on TallyPrime, Zoho Books, QuickBooks, or SAP. Includes automated bank reconciliations, vendor payables workflow, accounts receivable aging, and complete payroll processing with PF/ESI/PT.",
      iconName: "layers",
      features: [
        "Daily voucher entry & ledger classification",
        "Multi-bank reconciliation & payment gateway clearing",
        "Payroll processing with salary slips & tax computation",
        "EPF, ESIC & Professional Tax monthly compliance"
      ],
      deliverables: "Real-time updated balance sheet, P&L, aged receivables, and payroll disbursement registers."
    }
  ],
  taxDeadlines: [
    {
      date: "7th of Every Month",
      title: "TDS / TCS Deposit Due Date",
      category: "Direct Tax",
      description: "Payment of TDS/TCS deducted during the preceding month via Challan ITNS 281.",
      urgency: "critical"
    },
    {
      date: "11th of Every Month",
      title: "GSTR-1 Outward Supplies Filing",
      category: "GST",
      description: "Filing of monthly return for outward supplies of goods and services for regular taxpayers.",
      urgency: "critical"
    },
    {
      date: "20th of Every Month",
      title: "GSTR-3B Summary Return & Tax Payment",
      category: "GST",
      description: "Monthly summary return and payment of net tax liability after claiming eligible ITC.",
      urgency: "critical"
    },
    {
      date: "15th March",
      title: "Advance Tax 4th Installment (100%)",
      category: "Income Tax",
      description: "Final installment of Advance Tax payment (100% of estimated tax liability for FY 2024-25).",
      urgency: "critical"
    },
    {
      date: "31st July",
      title: "Non-Audit Income Tax Returns (ITR)",
      category: "Income Tax",
      description: "Due date for filing ITR for individuals, HUFs, and non-audit corporate/partnership entities.",
      urgency: "upcoming"
    },
    {
      date: "30th September / 31st Oct",
      title: "Tax Audit Report & Corporate ITR",
      category: "Audit & Tax",
      description: "Filing of Tax Audit Report under Section 44AB and Corporate ITR-6 for audited entities.",
      urgency: "routine"
    }
  ],
  testimonials: [
    {
      quote: "Jha Accounting Solutions restructured our entire GST reconciliation pipeline. In our first quarter alone, their GSTR-2B audit recovered ₹18.4 Lakhs of unclaimed Input Tax Credit that our previous accountants had overlooked.",
      author: "Vikramaditya Sharma",
      designation: "Managing Director",
      company: "Apex Global Logistics Ltd.",
      highlight: "₹18.4L Unclaimed ITC Recovered"
    },
    {
      quote: "As a UK practice handling over 150 corporate accounts, finding reliable offshore capacity was painful until we partnered with Jha Accounting's B2B pod. Their turnaround time and working papers are exceptionally thorough.",
      author: "Edward Thornton, FCCA",
      designation: "Managing Partner",
      company: "Thornton & Associates Chartered Certified Accountants (London)",
      highlight: "Over 150 Client Books Managed"
    },
    {
      quote: "Their Virtual CFO advisory helped us prepare our books for our Series-A due diligence. The investors' legal audit team praised our financial hygiene, zero notices, and clean statutory registers.",
      author: "Neha Malhotra",
      designation: "Co-Founder & CEO",
      company: "FinEdge Cloud Technologies",
      highlight: "Series-A Audit Cleared with Zero Notices"
    }
  ]
};

// =========================================================================
// MAIN COMPONENT
// =========================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'outsourcing' | 'calculators' | 'insights' | 'why-us' | 'contact'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Advisory Calculator States
  const [activeCalcTab, setActiveCalcTab] = useState<'gst' | 'tds'>('gst');
  
  // GST State
  const [gstAmount, setGstAmount] = useState<number>(100000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [taxNature, setTaxNature] = useState<'intra' | 'inter'>('intra');
  const [calcMode, setCalcMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  // TDS State
  const [tdsPaymentAmount, setTdsPaymentAmount] = useState<number>(150000);
  const [tdsSection, setTdsSection] = useState<'194C' | '194J_fee' | '194J_tech' | '194I_rent_land' | '194I_rent_mach' | '194H_comm'>('194J_fee');
  const [tdsDeducteeType, setTdsDeducteeType] = useState<'individual' | 'company'>('company');

  // Contact & Consultation State
  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: 'GST Compliance & ITC Audit',
    turnover: '₹1 Cr - ₹10 Cr',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Insights / Blog Search & Comments
  const [blogSearch, setBlogSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [commentText, setCommentText] = useState('');
  const [articleComments, setArticleComments] = useState<Record<string, string[]>>({});

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 'gstr2b-itc-compliance',
      title: 'Demystifying GSTR-2B vs Books Reconciliation: Preventing Cash Flow Leakage',
      category: 'GST Advisory',
      readTime: '6 min read',
      excerpt: 'Under Section 16(2)(aa) of the CGST Act, claiming ITC without invoice appearance in GSTR-2B triggers severe notices. Learn practical reconciliation frameworks for corporate CFOs.',
      content: `Section 16(2)(aa) of the Central Goods and Services Tax Act mandates that Input Tax Credit (ITC) can only be availed if invoice details have been properly uploaded by the supplier in their Form GSTR-1 and communicated to the recipient in Form GSTR-2B.\n\nCorporate financial teams that rely on traditional periodic sampling often miss critical variances, resulting in blocked working capital, automated GST DRC-01B notices, and interest liabilities under Section 50.\n\nKey Strategic Action Steps:\n1. Automate monthly ledger matching: Cross-reference purchase registers with the static GSTR-2B generated on the 14th of each month.\n2. Institute strict vendor payment holdback clauses: Contractually hold a 10-18% retention until vendor compliance reflects on the GST portal.\n3. Track provisional vs eligible ITC: Distinguish strictly between eligible credits and blocked credits under Section 17(5).\n\nNeed tailored reconciliation protocols for high-volume transactions? Consult our indirect tax advisory partners.`,
      author: 'CA Rajesh Jha, FCA',
      date: 'March 2025',
      likes: 42,
      commentsCount: 6
    },
    {
      id: 'advance-tax-planning-fy25',
      title: 'Advance Tax Calculation & Section 234B/234C Interest Optimization',
      category: 'Direct Tax',
      readTime: '5 min read',
      excerpt: 'How growing enterprises can forecast seasonal earnings accurately to avoid penal interest under Sections 234B and 234C of the Income Tax Act.',
      content: `Advance tax applies to every taxpayer whose estimated total tax liability for the financial year, after adjusting for TDS and TCS, equals or exceeds ₹10,000.\n\nFailing to meet quarterly installment milestones (15%, 45%, 75%, and 100%) invokes mandatory penal interest under Section 234C (1% per month for installment deferment) and Section 234B (1% per month on shortfall from 90% threshold upon year-end filing).\n\nPractical Strategies for Corporate CFOs:\n- Build dynamic rolling forecasts that factor in Q4 inventory liquidations and seasonal sales bumps.\n- Track capital gains immediately: Advance tax on windfall or capital gains is only payable in the remaining installments post-realization.\n- Take advantage of credit under Section 115JAA (MAT credit) where applicable to offset gross taxable liabilities.`,
      author: 'Senior Tax Advisory Desk',
      date: 'February 2025',
      likes: 38,
      commentsCount: 4
    },
    {
      id: 'b2b-accounting-outsourcing-playbook',
      title: 'The Modern B2B Accounting Outsourcing Model for Scaling CA & CPA Practices',
      category: 'Practice Management',
      readTime: '7 min read',
      excerpt: 'How forward-thinking accounting practices overcome critical skilled-labor shortages while maintaining strict partner oversight and data confidentiality.',
      content: `Accounting firms worldwide face unprecedented capacity bottlenecks. Senior partners spend billable hours on ledger scrubbing, voucher entry, and basic reconciliations rather than high-margin advisory.\n\nThe White-Label Pod Model:\nRather than ad-hoc transactional outsourcing, elite firms deploy dedicated offshore teams ('Pods') trained in local accounting taxonomies, working directly inside the firm's cloud environments (Tally, Zoho, QuickBooks, Xero) under strict mutual Non-Disclosure Agreements.\n\nBenefits Realized by Retained Practices:\n- 55% to 65% reduction in recurring back-office operational costs.\n- 24-48 hour turnaround on high-volume period-end closes.\n- Absolute client privacy: The offshore pod functions seamlessly behind the firm's brand with zero direct client contact.`,
      author: 'Outsourcing Strategy Team',
      date: 'January 2025',
      likes: 54,
      commentsCount: 9
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // -------------------------------------------------------------------------
  // CALCULATOR LOGIC
  // -------------------------------------------------------------------------
  const calculateGst = () => {
    let base = 0;
    let tax = 0;
    let total = 0;

    if (calcMode === 'exclusive') {
      base = gstAmount;
      tax = (gstAmount * gstRate) / 100;
      total = base + tax;
    } else {
      total = gstAmount;
      base = (gstAmount * 100) / (100 + gstRate);
      tax = total - base;
    }

    const halfTax = tax / 2;
    const halfRate = gstRate / 2;

    return {
      base: base.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      tax: tax.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      total: total.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      halfTax: halfTax.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      halfRate
    };
  };

  const calculateTds = () => {
    let rate = 10;
    let threshold = 30000;
    let sectionName = "194J - Professional / Technical Services";
    let thresholdNote = "Threshold: ₹30,000 per financial year per payee";

    if (tdsSection === '194C') {
      rate = tdsDeducteeType === 'individual' ? 1 : 2;
      threshold = 100000;
      sectionName = "194C - Contractor & Sub-Contractor Works";
      thresholdNote = "Single contract > ₹30,000 or aggregate > ₹1,00,000 p.a.";
    } else if (tdsSection === '194J_fee') {
      rate = 10;
      threshold = 30000;
      sectionName = "194J(1) - Professional / Legal Fees";
      thresholdNote = "Threshold: ₹30,000 per financial year";
    } else if (tdsSection === '194J_tech') {
      rate = 2;
      threshold = 30000;
      sectionName = "194J(2) - Technical Services / Call Center";
      thresholdNote = "Threshold: ₹30,000 per financial year (Reduced 2% rate)";
    } else if (tdsSection === '194I_rent_land') {
      rate = 10;
      threshold = 240000;
      sectionName = "194I - Rent of Land, Building or Furniture";
      thresholdNote = "Threshold: ₹2,40,000 per financial year";
    } else if (tdsSection === '194I_rent_mach') {
      rate = 2;
      threshold = 240000;
      sectionName = "194I - Rent of Plant, Machinery or Equipment";
      thresholdNote = "Threshold: ₹2,40,000 per financial year";
    } else if (tdsSection === '194H_comm') {
      rate = 5;
      threshold = 15000;
      sectionName = "194H - Commission or Brokerage";
      thresholdNote = "Threshold: ₹15,000 per financial year";
    }

    const isExempt = tdsPaymentAmount < threshold;
    const applicableTds = isExempt ? 0 : (tdsPaymentAmount * rate) / 100;
    const netPayable = tdsPaymentAmount - applicableTds;

    return {
      rate,
      threshold,
      sectionName,
      thresholdNote,
      isExempt,
      applicableTds: applicableTds.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      netPayable: netPayable.toLocaleString('en-IN', { maximumFractionDigits: 2 })
    };
  };

  const gstCalc = calculateGst();
  const tdsCalc = calculateTds();

  // Helper to render practice icons
  const renderServiceIcon = (name: string) => {
    switch (name) {
      case 'receipt': return <Receipt className="w-5 h-5" />;
      case 'calculator': return <Calculator className="w-5 h-5" />;
      case 'file-check': return <FileCheck className="w-5 h-5" />;
      case 'trending-up': return <TrendingUp className="w-5 h-5" />;
      case 'building': return <Building2 className="w-5 h-5" />;
      case 'layers': return <Layers className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  // =========================================================================
  // LUXURY BRAND LOGO SVG COMPONENT
  // =========================================================================
  const BrandLogo = ({ size = 40 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
    >
      <defs>
        <linearGradient id="corpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B132B" />
          <stop offset="100%" stopColor="#1C2541" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="accentEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Corporate Crest Container */}
      <rect
        x="3"
        y="3"
        width="50"
        height="50"
        rx="12"
        fill="url(#corpGrad)"
        stroke="#334155"
        strokeWidth="1.5"
      />

      {/* Architectural Inner Alignment Ring */}
      <circle cx="28" cy="28" r="21" stroke="#38BDF8" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2 3" />

      {/* Monogram 'J' - Clean Anchor Pillar */}
      <path
        d="M20 17 V31 C20 35.5 16.5 38 13.5 38 C12.2 38 11.2 37.6 10.5 37.1"
        stroke="url(#goldGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Monogram 'A' - Slanted Peak */}
      <path
        d="M23 38 L35 15 L47 38"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Financial Equilibrium Bar */}
      <path
        d="M28 30 H42"
        stroke="url(#goldGrad)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Statutory Apex Beacon */}
      <circle cx="35" cy="15" r="2.5" fill="url(#accentEmerald)" />
    </svg>
  );

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-sky-600 selection:text-white flex flex-col min-h-screen">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-sky-200 border border-sky-500/40 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. TOP UTILITY BAR (Corporate Contact & Statutory Trust Strip)     */}
      {/* =================================================================== */}
      <div className="bg-[#0B132B] text-slate-300 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          
          {/* Trust credentials & operating timings */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>ICAI Compliant Standards &amp; ISO 27001 Data Room</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{APP_CONFIG.branding.operatingHours}</span>
            </span>
          </div>

          {/* Direct channels & Quick Action */}
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a
              href={`tel:${APP_CONFIG.branding.phoneRaw}`}
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{APP_CONFIG.branding.phone}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={`mailto:${APP_CONFIG.branding.inquiryEmail}`}
              className="hidden lg:inline-flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>{APP_CONFIG.branding.inquiryEmail}</span>
            </a>
            <button
              onClick={() => setActiveTab('contact')}
              className="text-[11px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-0.5 rounded font-semibold transition-colors"
            >
              Book 15-Min Advisory
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. CORPORATE HEADER & NAVIGATION                                   */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Identity / Insignia */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 group text-left focus:outline-none"
          >
            <BrandLogo size={42} />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors leading-none">
                Jha Accounting Solutions
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wider uppercase mt-1">
                Chartered Accountants &amp; B2B Corporate Advisory
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {APP_CONFIG.navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'text-sky-700 bg-sky-50/80 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-3 h-0.5 bg-sky-600 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Primary Header Action & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <a
              href={`tel:${APP_CONFIG.branding.phoneRaw}`}
              className="hidden md:inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Partner</span>
            </a>

            <button
              onClick={() => setActiveTab('contact')}
              className="inline-flex items-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              <span>Schedule Consultation</span>
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* LUXURY CORPORATE MOBILE DRAWER (Slide-Over, NOT an App Bar)       */}
        {/* ================================================================= */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-over panel */}
            <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <BrandLogo size={36} />
                  <div>
                    <div className="font-display font-bold text-sm text-slate-900 leading-tight">
                      Jha Accounting Solutions
                    </div>
                    <div className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">
                      Chartered Accountants
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

              {/* Direct Partner Connect Strip */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Immediate Advisory Desk</div>
                  <a href={`tel:${APP_CONFIG.branding.phoneRaw}`} className="text-xs font-bold text-emerald-400 hover:underline">
                    {APP_CONFIG.branding.phone}
                  </a>
                </div>
                <a
                  href={APP_CONFIG.branding.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                  Main Practice Portals
                </div>
                {APP_CONFIG.navigation.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
                        isActive
                          ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm">{item.label}</span>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    </button>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                    Direct Corporate Office
                  </div>
                  <div className="px-3 py-2 text-xs text-slate-600 space-y-1">
                    <p className="font-medium text-slate-800">{APP_CONFIG.branding.officeAddress}</p>
                    <p className="text-slate-500">{APP_CONFIG.branding.operatingHours}</p>
                  </div>
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-md transition-all"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =================================================================== */}
      {/* 3. MAIN CONTENT CONTAINER (NO FIXED DOCKS, CLEAN FLOW)              */}
      {/* =================================================================== */}
      <main className="flex-grow">

        {/* ================================================================= */}
        {/* VIEW: HOME (Customer-Centric Corporate Overview)                  */}
        {/* ================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-0">
            
            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#F1F5F9] via-[#F8FAFC] to-white border-b border-slate-200 py-12 sm:py-20 lg:py-28">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-3xl">
                  
                  {/* Trust Authority Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 mb-6 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Statutory Compliance Architecture for Corporates, Startups &amp; CA Practices</span>
                  </div>

                  {/* Commanding Headline */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-[#0B132B] leading-[1.15] mb-6">
                    Strategic Tax Advisory &amp; <span className="text-sky-600 underline decoration-sky-300 decoration-wavy decoration-2">High-Impact</span> Corporate Accounting.
                  </h1>

                  {/* Value Proposition Subtitle */}
                  <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed mb-8 max-w-2xl">
                    Eliminate GST reconciliation leakages, missed TDS deadlines, and back-office bottlenecks. We partner with founders, CFOs, and global CPA practices to deliver end-to-end statutory accuracy with zero compromise.
                  </p>

                  {/* Primary Customer Conversion Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="inline-flex items-center justify-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white px-7 py-4 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                      <span>Schedule Free Advisory Call</span>
                      <ArrowRight className="w-4 h-4 text-sky-400" />
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('outsourcing')}
                      className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-6 py-4 rounded-xl font-semibold text-sm shadow-xs transition-all hover:border-slate-400"
                    >
                      <Layers className="w-4 h-4 text-sky-600" />
                      <span>Explore B2B Outsourcing</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('calculators')}
                      className="inline-flex items-center justify-center gap-2 text-sky-700 hover:text-sky-800 text-sm font-semibold px-4 py-3 transition-colors"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>Free Tax Calculators</span>
                    </button>
                  </div>
                </div>

                {/* Measurable Proof Bar */}
                <div className="mt-14 sm:mt-18 pt-8 sm:pt-10 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900">500+</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Corporate Entities Advised</div>
                  </div>
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900">₹150+ Cr</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Tax Volume &amp; Bookkeeping Handled</div>
                  </div>
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900">99.8%</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Statutory On-Time Filing Record</div>
                  </div>
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900">&lt; 15 Mins</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Client Advisory Response SLA</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. CUSTOMER PERSONA MATRIX ("WHO WE SERVE") */}
            <section className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs uppercase font-bold tracking-wider text-sky-600">Tailored Solutions</span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-1">
                    Engineered for Your Business Scale &amp; Entity Structure
                  </h2>
                  <p className="text-slate-500 text-sm mt-2">
                    Whether you are an emerging venture or an established corporate accounting practice, we align to your exact regulatory requirements.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-7 flex flex-col justify-between hover:border-slate-300 transition-all">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-sky-700 flex items-center justify-center font-bold mb-5">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold font-display text-slate-900 mb-2">High-Growth Startups &amp; SMEs</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-5">
                        Full-stack monthly bookkeeping, GST filing, TDS deductions, and monthly MIS reports so founders can focus on scaling revenue.
                      </p>
                      <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-200/70 pt-4 mb-6">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Never miss a 20th or 7th deadline</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Real-time P&amp;L and cash burn visibility</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Dedicated Chartered Accountant POC</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        setContactForm({ ...contactForm, service: 'Full-Cycle Bookkeeping & Payroll' });
                        setActiveTab('contact');
                      }}
                      className="w-full bg-white hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-200 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    >
                      Inquire for SME Retainer
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-7 flex flex-col justify-between hover:border-slate-300 transition-all">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-5">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold font-display text-slate-900 mb-2">Corporates &amp; Enterprises</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-5">
                        Rigorous statutory audits under Companies Act 2013, Tax Audits (Form 3CD), transfer pricing documentation, and corporate litigations.
                      </p>
                      <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-200/70 pt-4 mb-6">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Thorough CARO &amp; IFC testing</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> High-volume multi-GSTIN reconciliation</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Faceless assessment &amp; appeals support</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        setContactForm({ ...contactForm, service: 'Statutory & Internal Audit' });
                        setActiveTab('contact');
                      }}
                      className="w-full bg-white hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-200 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    >
                      Inquire for Corporate Audit
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-7 flex flex-col justify-between hover:border-slate-300 transition-all">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-5">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold font-display text-slate-900 mb-2">CA &amp; Global CPA Practices (B2B)</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-5">
                        White-label back-office capacity. Dedicated accounting pods executing high-volume bookkeeping and working papers under your firm's name.
                      </p>
                      <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-200/70 pt-4 mb-6">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Strict mutual Non-Disclosure Agreement</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 60% operational cost reduction</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Zero direct solicitation policy</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setActiveTab('outsourcing')}
                      className="w-full bg-[#0B132B] hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs"
                    >
                      Explore B2B Pod Models
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. CORE PRACTICE AREAS */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-sky-600">Practice Areas</span>
                  <h2 className="text-3xl font-bold font-display text-slate-900 mt-1">Core Advisory &amp; Statutory Solutions</h2>
                </div>
                <p className="text-slate-500 text-sm max-w-md mt-3 md:mt-0">
                  Comprehensive accounting and regulatory execution executed by qualified Chartered Accountants with proven corporate track records.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {APP_CONFIG.services.map((service) => (
                  <div key={service.id} className="bg-white rounded-2xl border border-slate-200 p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-[#0B132B] group-hover:text-white flex items-center justify-center transition-colors">
                          {renderServiceIcon(service.iconName)}
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          {service.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold font-display text-slate-900 mb-2.5 group-hover:text-sky-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">{service.description}</p>
                      
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
                        className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-[#0B132B] hover:text-white text-slate-800 border border-slate-200 text-xs font-semibold py-2.5 rounded-xl transition-all"
                      >
                        <span>Inquire for {service.title}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. STATUTORY COMPLIANCE DEADLINE CALENDAR */}
            <section className="bg-slate-100/70 border-y border-slate-200 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-sky-600">Statutory Alert Desk</span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-1">Upcoming Tax Compliance Deadlines</h2>
                  </div>
                  <p className="text-slate-500 text-sm max-w-md mt-2 md:mt-0">
                    Stay ahead of statutory deadlines to prevent late interest, Section 234 penalties, and GSTR cancellation notices.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {APP_CONFIG.taxDeadlines.map((dl, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold font-mono text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {dl.date}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            dl.urgency === 'critical' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {dl.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-slate-900 mb-1.5">{dl.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">{dl.description}</p>
                      </div>

                      <button
                        onClick={() => {
                          setContactForm({ ...contactForm, message: `Inquiring about filing assistance for: ${dl.title} (${dl.date})` });
                          setActiveTab('contact');
                        }}
                        className="text-xs font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 pt-2 border-t border-slate-100"
                      >
                        <span>Request Filing Assistance</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. VERIFIED CLIENT TESTIMONIALS */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-xs uppercase font-bold tracking-wider text-sky-600">Client Endorsements</span>
                <h2 className="text-3xl font-bold font-display text-slate-900 mt-1">Trusted by Industry Leaders &amp; Practices</h2>
                <p className="text-slate-500 text-sm mt-2">
                  Real client outcomes reflecting our standard of execution, statutory precision, and partner responsiveness.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {APP_CONFIG.testimonials.map((t, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-5">
                        {t.highlight}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                        "{t.quote}"
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <div className="font-bold text-sm text-slate-900">{t.author}</div>
                      <div className="text-xs text-slate-500">{t.designation}</div>
                      <div className="text-xs font-medium text-sky-700 mt-0.5">{t.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. HIGH-CONVERTING CORPORATE CTA SECTION */}
            <section className="bg-[#0B132B] text-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="space-y-3 max-w-2xl">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Complimentary 15-Minute Tax Health Review
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-display font-bold">
                    Concerned about unfiled returns, GST mismatch notices, or back-office overload?
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Speak directly with a senior Chartered Accountant. We will review your current compliance pipeline, identify cash-flow leakages, and outline a clear action plan.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <a
                    href={`tel:${APP_CONFIG.branding.phoneRaw}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Call {APP_CONFIG.branding.phone}</span>
                  </a>
                  
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Schedule Free Review</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW: PRACTICE AREAS (Full In-Depth Services Breakdown)           */}
        {/* ================================================================= */}
        {activeTab === 'services' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="border-b border-slate-200 pb-8">
              <span className="text-xs uppercase font-bold tracking-wider text-sky-600 mb-2 block">Comprehensive Practice Registry</span>
              <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900">Statutory Practice Areas &amp; Advisory</h1>
              <p className="text-slate-600 text-base mt-2 max-w-3xl">
                Executed under strict adherence to the Chartered Accountants Act, 1949 and Indian statutory requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {APP_CONFIG.services.map((service) => (
                <div key={service.id} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                        {renderServiceIcon(service.iconName)}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
                        {service.category}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold font-display text-slate-900 mb-3">{service.title}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{service.description}</p>

                    <div className="space-y-4 mb-6">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Scope of Work</div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {service.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Standard Deliverables</div>
                      <div className="text-xs text-slate-700">{service.deliverables}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setContactForm({ ...contactForm, service: service.title });
                      setActiveTab('contact');
                    }}
                    className="w-full bg-[#0B132B] hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request Proposal for {service.title}</span>
                    <ArrowRight className="w-4 h-4 text-sky-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW: B2B OUTSOURCING (For CA Firms & Corporate Desks)           */}
        {/* ================================================================= */}
        {activeTab === 'outsourcing' && (
          <div className="space-y-16 py-12">
            <div className="bg-gradient-to-b from-slate-100 via-slate-50 to-white border-b border-slate-200 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B132B] text-white text-xs font-semibold mb-4">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> Practice Scalability Solutions
                </span>
                <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
                  Scale Your Firm's Capacity Without Overhead.
                </h1>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  Dedicated white-label accounting pods operating in your time zone under strict mutual NDAs. We eliminate bookkeeping backlogs, voucher entries, and working-paper bottlenecks for practicing CAs and CPAs.
                </p>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              
              {/* Three Value Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-sky-700 flex items-center justify-center mb-6">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-3">100% White-Label Delivery</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    We work silently in the background. Ledgers, audit working papers, and draft returns are prepared ready in your firm's format for partner review.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-4">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Zero direct client solicitations</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Customized working paper formats</li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-3">Multi-Platform Expertise</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Our accountants are certified across leading Indian and global platforms, ensuring zero migration friction with your current workflows.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-4">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> TallyPrime, Zoho Books &amp; Busy</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> QuickBooks, Xero &amp; SAP ERP</li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-3">Enterprise-Grade Security</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Financial records are protected via zero-trust cloud workspaces, role-based access, and legally binding mutual non-disclosure agreements.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-4">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Mutual Non-Disclosure Agreements</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Segregated secure tenant workspaces</li>
                  </ul>
                </div>
              </div>

              {/* Onboarding Flow */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 lg:p-12">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs uppercase font-bold tracking-wider text-sky-600">Frictionless Engagement</span>
                  <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">How Our Outsourcing Retainer Operates</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full bg-[#0B132B] text-white flex items-center justify-center font-bold text-sm">1</div>
                    <h4 className="font-bold text-base text-slate-900">Volume Scoping</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">Define monthly transaction volume, software suite, and turnaround SLAs.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full bg-[#0B132B] text-white flex items-center justify-center font-bold text-sm">2</div>
                    <h4 className="font-bold text-base text-slate-900">Mutual NDA &amp; Access</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">Execution of confidentiality contracts and role-based read/entry access setup.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full bg-[#0B132B] text-white flex items-center justify-center font-bold text-sm">3</div>
                    <h4 className="font-bold text-base text-slate-900">Pod Execution</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">Dedicated accounting specialists process transactions with internal peer audits.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm">4</div>
                    <h4 className="font-bold text-base text-slate-900">Partner Sign-off</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">Pristine working sheets delivered in your format ready for client presentation.</p>
                  </div>
                </div>
              </div>

              {/* Call to action */}
              <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 text-center text-white max-w-3xl mx-auto">
                <h3 className="text-2xl font-display font-bold mb-3">Discuss a Dedicated Outsourcing Retainer</h3>
                <p className="text-slate-300 text-sm mb-6 max-w-lg mx-auto">
                  Contact our partner desk for capacity pricing based on your firm's volume and compliance calendar.
                </p>
                <button
                  onClick={() => {
                    setContactForm({ ...contactForm, service: 'B2B Accounting Outsourcing Pod' });
                    setActiveTab('contact');
                  }}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
                >
                  Schedule an Outsourcing Briefing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW: TAX CALCULATORS (Interactive Advisory Suite for Clients)   */}
        {/* ================================================================= */}
        {activeTab === 'calculators' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B132B] text-white text-xs font-semibold mb-4">
                <Calculator className="w-3.5 h-3.5 text-sky-400" /> Free Client Advisory Tools
              </span>
              <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 mb-2">
                Statutory Tax &amp; Deduction Estimators
              </h1>
              <p className="text-slate-600 text-base max-w-3xl">
                Estimate GST invoices and statutory TDS withholding liabilities instantly. For complex multi-tier transactions, request an expert review from our tax desk.
              </p>
            </div>

            {/* Calculator Switcher Buttons */}
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
              <button
                onClick={() => setActiveCalcTab('gst')}
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeCalcTab === 'gst' ? 'bg-[#0B132B] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Percent className="w-4 h-4 text-emerald-400" />
                <span>GST Breakdown &amp; ITC Estimator</span>
              </button>
              <button
                onClick={() => setActiveCalcTab('tds')}
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeCalcTab === 'tds' ? 'bg-[#0B132B] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Calculator className="w-4 h-4 text-sky-400" />
                <span>TDS Threshold &amp; Deduction Calculator</span>
              </button>
            </div>

            {/* GST Calculator Panel */}
            {activeCalcTab === 'gst' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold font-display text-slate-900">GST Invoice &amp; Tax Split Estimator</h3>
                    <p className="text-xs text-slate-500 mt-1">Computes CGST, SGST, IGST, and net billing sums for invoice verification.</p>
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                    Updated FY 2025-26
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-6 lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Base Amount (₹)</label>
                        <input
                          type="number"
                          value={gstAmount}
                          onChange={(e) => setGstAmount(parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-sky-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Applicable GST Slab (%)</label>
                        <select
                          value={gstRate}
                          onChange={(e) => setGstRate(parseFloat(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-sky-600 focus:outline-none"
                        >
                          <option value={5}>5% (Essential Commodities / Transport)</option>
                          <option value={12}>12% (Standard Goods / Food Processing)</option>
                          <option value={18}>18% (Most Services &amp; Manufacturing)</option>
                          <option value={28}>28% (Luxury &amp; Specified Goods)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Supply Type</label>
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50">
                            <input type="radio" name="tax-nature" checked={taxNature === 'intra'} onChange={() => setTaxNature('intra')} className="text-sky-600 focus:ring-sky-600" />
                            <span>Intra-State (CGST + SGST)</span>
                          </label>
                          <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50">
                            <input type="radio" name="tax-nature" checked={taxNature === 'inter'} onChange={() => setTaxNature('inter')} className="text-sky-600 focus:ring-sky-600" />
                            <span>Inter-State (IGST)</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Amount Condition</label>
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50">
                            <input type="radio" name="calc-mode" checked={calcMode === 'exclusive'} onChange={() => setCalcMode('exclusive')} className="text-sky-600 focus:ring-sky-600" />
                            <span>Exclusive of GST (Add Tax on Top)</span>
                          </label>
                          <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50">
                            <input type="radio" name="calc-mode" checked={calcMode === 'inclusive'} onChange={() => setCalcMode('inclusive')} className="text-sky-600 focus:ring-sky-600" />
                            <span>Inclusive of GST (Extract Embedded Tax)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-[#0B132B] text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg">
                    <div className="space-y-4">
                      <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Tax Summary Card</div>
                      <div className="space-y-2.5 border-b border-slate-800 pb-4 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>Taxable Value:</span>
                          <span className="font-mono font-semibold text-white">₹{gstCalc.base}</span>
                        </div>
                        {taxNature === 'intra' ? (
                          <>
                            <div className="flex justify-between text-slate-300">
                              <span>CGST ({gstCalc.halfRate}%):</span>
                              <span className="font-mono text-emerald-400">₹{gstCalc.halfTax}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>SGST ({gstCalc.halfRate}%):</span>
                              <span className="font-mono text-emerald-400">₹{gstCalc.halfTax}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between text-slate-300">
                            <span>IGST ({gstRate}%):</span>
                            <span className="font-mono text-emerald-400">₹{gstCalc.tax}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-300">
                          <span>Total Tax Amount:</span>
                          <span className="font-mono font-bold text-sky-400">₹{gstCalc.tax}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="text-xs text-slate-400">Final Gross Invoice Amount</div>
                        <div className="text-3xl font-display font-bold text-white mt-1">₹{gstCalc.total}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setContactForm({
                          ...contactForm,
                          message: `Need CA assistance with GST reconciliation for invoice volume base ~₹${gstCalc.base} (Rate: ${gstRate}%)`
                        });
                        setActiveTab('contact');
                      }}
                      className="mt-6 w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <span>Consult CA on This Calculation</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TDS Calculator Panel */}
            {activeCalcTab === 'tds' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold font-display text-slate-900">TDS Withholding &amp; Statutory Rate Checker</h3>
                    <p className="text-xs text-slate-500 mt-1">Verifies deduction rates under Sections 194C, 194J, 194I, and 194H.</p>
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 bg-blue-50 text-sky-700 rounded-full border border-blue-100">
                    Income Tax Act 1961
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-6 lg:col-span-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Gross Invoice / Contract Payment (₹)</label>
                      <input
                        type="number"
                        value={tdsPaymentAmount}
                        onChange={(e) => setTdsPaymentAmount(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-sky-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Section &amp; Nature of Payment</label>
                        <select
                          value={tdsSection}
                          onChange={(e) => setTdsSection(e.target.value as any)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-sky-600 focus:outline-none"
                        >
                          <option value="194J_fee">Sec 194J - Professional / Legal Fees (10%)</option>
                          <option value="194J_tech">Sec 194J - Technical Services / Call Center (2%)</option>
                          <option value="194C">Sec 194C - Contractor / Sub-Contractor Works (1% / 2%)</option>
                          <option value="194I_rent_land">Sec 194I - Rent on Land / Building (10%)</option>
                          <option value="194I_rent_mach">Sec 194I - Rent on Plant &amp; Machinery (2%)</option>
                          <option value="194H_comm">Sec 194H - Commission or Brokerage (5%)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2">Payee / Deductee Entity Type</label>
                        <select
                          value={tdsDeducteeType}
                          onChange={(e) => setTdsDeducteeType(e.target.value as any)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-sky-600 focus:outline-none"
                        >
                          <option value="company">Corporate / Company / Firm</option>
                          <option value="individual">Individual / Sole Proprietorship / HUF</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800 mb-1">{tdsCalc.sectionName}</div>
                      <div>{tdsCalc.thresholdNote}</div>
                    </div>
                  </div>

                  {/* TDS Result Card */}
                  <div className="bg-[#0B132B] text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg">
                    <div className="space-y-4">
                      <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Statutory Deductions</div>
                      
                      {tdsCalc.isExempt ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-xs text-emerald-300">
                          <strong>Exemption Note:</strong> Payment is below the annual Section threshold (₹{tdsCalc.threshold.toLocaleString('en-IN')}). No TDS deduction required under standard statutory provisions.
                        </div>
                      ) : (
                        <div className="space-y-2.5 border-b border-slate-800 pb-4 text-xs">
                          <div className="flex justify-between text-slate-300">
                            <span>Applicable Rate:</span>
                            <span className="font-mono font-bold text-sky-400">{tdsCalc.rate}%</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>TDS to Deduct &amp; Remit:</span>
                            <span className="font-mono font-bold text-emerald-400">₹{tdsCalc.applicableTds}</span>
                          </div>
                        </div>
                      )}

                      <div className="pt-2">
                        <div className="text-xs text-slate-400">Net Amount Disbursable to Vendor</div>
                        <div className="text-3xl font-display font-bold text-white mt-1">₹{tdsCalc.netPayable}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setContactForm({
                          ...contactForm,
                          message: `Need advice on quarterly TDS 26Q / 24Q filing and Section ${tdsSection} compliance for invoice ₹${tdsPaymentAmount}`
                        });
                        setActiveTab('contact');
                      }}
                      className="mt-6 w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <span>Inquire About TDS Quarterly Filing</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW: INSIGHTS & CALENDAR (Articles & Regulatory Updates)         */}
        {/* ================================================================= */}
        {activeTab === 'insights' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-8 gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-sky-600 mb-2 block">Chartered Knowledge Desk</span>
                <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900">Tax Insights &amp; Regulatory Analysis</h1>
                <p className="text-slate-600 text-sm mt-2">Executive analysis of Indian tax circulars, case laws, and practice management.</p>
              </div>

              <div className="w-full md:w-72 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  placeholder="Search articles & rulings..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
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
                    className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-sky-700 border border-blue-100">
                          {post.category}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold font-display text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">{post.excerpt}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-medium text-slate-800">{post.author}</span>
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
                <div className="bg-white border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-10 shadow-2xl relative">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-sky-700 mb-4 inline-block">
                    {selectedArticle.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-3">{selectedArticle.title}</h1>
                  <div className="text-xs text-slate-500 mb-6">By {selectedArticle.author} • {selectedArticle.date}</div>

                  <div className="text-slate-700 text-sm leading-relaxed space-y-4 border-y border-slate-100 py-6 mb-8 whitespace-pre-line">
                    {selectedArticle.content}
                  </div>

                  <div className="flex items-center justify-between mb-8">
                    <button
                      onClick={() => {
                        selectedArticle.likes += 1;
                        showToast('❤️ Appreciated!');
                      }}
                      className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      <ThumbsUp className="w-4 h-4 text-sky-600" />
                      <span>Endorse ({selectedArticle.likes})</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showToast('🔗 Article URL copied to clipboard');
                      }}
                      className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-medium"
                    >
                      <Share2 className="w-4 h-4" /> Share Article
                    </button>
                  </div>

                  <div className="space-y-4 border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-900">Discussion &amp; Queries</h3>
                    {(articleComments[selectedArticle.id] || []).map((c, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">{c}</div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a professional query or comment..."
                        className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-600"
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
                          showToast('💬 Comment submitted successfully');
                        }}
                        className="bg-[#0B132B] hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW: WHY CHOOSE US (Firm Credentials, Comparison & Guarantees)   */}
        {/* ================================================================= */}
        {activeTab === 'why-us' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
            <div className="border-b border-slate-200 pb-8">
              <span className="text-xs uppercase font-bold tracking-wider text-sky-600 mb-2 block">Institutional Pedigree</span>
              <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900">Why Market Leaders Choose Us</h1>
              <p className="text-slate-600 text-base mt-2 max-w-3xl">
                We combine the rigorous statutory integrity of senior Chartered Accountants with modern operational velocity and ironclad security.
              </p>
            </div>

            {/* Comparison Matrix Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xl font-bold font-display text-slate-900">Corporate Compliance Comparison</h3>
                <p className="text-xs text-slate-500 mt-1">How Jha Accounting Solutions compares against traditional accounting models.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4 sm:p-5">Capability / Standard</th>
                      <th className="p-4 sm:p-5 text-sky-800 bg-sky-50/60 font-extrabold">Jha Accounting Solutions</th>
                      <th className="p-4 sm:p-5 text-slate-500">Traditional Local CA</th>
                      <th className="p-4 sm:p-5 text-slate-500">Unvetted Freelancer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">Partner Oversight &amp; Audit Review</td>
                      <td className="p-4 sm:p-5 bg-sky-50/30 text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mandatory 2-Tier Partner Review
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600">Single Partner (Overburdened)</td>
                      <td className="p-4 sm:p-5 text-red-500">None / No CA Credential</td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">On-Time Filing Guarantee (SLA)</td>
                      <td className="p-4 sm:p-5 bg-sky-50/30 text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 99.8% Documented Track Record
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600">Frequent last-minute rushes</td>
                      <td className="p-4 sm:p-5 text-red-500">High late fee vulnerability</td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">Mutual Non-Disclosure Agreement (NDA)</td>
                      <td className="p-4 sm:p-5 bg-sky-50/30 text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Executed prior to ledger access
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600">Rarely formalized</td>
                      <td className="p-4 sm:p-5 text-red-500">Zero legal liability</td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">Dedicated Account Manager</td>
                      <td className="p-4 sm:p-5 bg-sky-50/30 text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Assigned Senior Account Lead
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600">Rotational junior article clerks</td>
                      <td className="p-4 sm:p-5 text-red-500">Unpredictable availability</td>
                    </tr>
                    <tr>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900">Emergency Notice Resolution</td>
                      <td className="p-4 sm:p-5 bg-sky-50/30 text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Within 24-48 business hours
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600">1 to 3 weeks delay</td>
                      <td className="p-4 sm:p-5 text-red-500">Cannot represent in scrutiny</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security & Confidentiality Framework */}
            <div className="bg-[#0B132B] text-white p-8 sm:p-12 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold font-display">Zero-Leakage Data Rooms</h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Your ledgers and bank records are handled inside encrypted corporate data vaults with restricted multi-factor privileges.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold font-display">ICAI Ethics Compliance</h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Strict adherence to the Institute of Chartered Accountants of India Code of Ethics, independence standards, and statutory disclosures.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold font-display">Zero Penalty Guarantee</h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  If any statutory filing is delayed due to an oversight by our team within agreed client documentation timelines, we cover the late fee.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW: CONTACT & ADVISORY (High-Converting Corporate Inquiries)   */}
        {/* ================================================================= */}
        {activeTab === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="border-b border-slate-200 pb-8">
              <span className="text-xs uppercase font-bold tracking-wider text-sky-600 mb-2 block">Direct Communication &amp; Consultation</span>
              <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900">Schedule a Senior Partner Consultation</h1>
              <p className="text-slate-600 text-base mt-2">
                Our accounting partners examine your compliance footprint and respond within 24 business hours.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Direct channels */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                  <h3 className="text-xl font-bold font-display text-slate-900">Direct Partner Channels</h3>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-sky-700 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-slate-500 font-medium">Direct Telephone / WhatsApp</div>
                      <a href={`tel:${APP_CONFIG.branding.phoneRaw}`} className="text-sm font-semibold text-slate-900 hover:text-sky-600">
                        {APP_CONFIG.branding.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-slate-500 font-medium">Corporate Inquiries</div>
                      <a href={`mailto:${APP_CONFIG.branding.inquiryEmail}`} className="text-sm font-semibold text-slate-900 hover:text-sky-600 break-all sm:break-normal">
                        {APP_CONFIG.branding.inquiryEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-slate-500 font-medium">Operating Hours</div>
                      <div className="text-sm font-semibold text-slate-900">
                        {APP_CONFIG.branding.operatingHours}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-slate-500 font-medium">Corporate Office</div>
                      <div className="text-xs font-semibold text-slate-900 leading-relaxed">
                        {APP_CONFIG.branding.officeAddress}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant WhatsApp Quick Connect */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Prefer WhatsApp?</div>
                    <div className="text-xs text-slate-600 mt-0.5">Connect instantly with our executive desk.</div>
                  </div>
                  <a
                    href={APP_CONFIG.branding.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all shrink-0 inline-flex items-center gap-1.5"
                  >
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Column: In-depth Contact Form */}
              <div className="lg:col-span-7">
                <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs">
                  {contactSubmitted ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold font-display text-slate-900">Inquiry Received Successfully</h3>
                      <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                        Thank you for reaching out to Jha Accounting Solutions. An authorized accounting specialist will review your details and contact you within 24 business hours.
                      </p>
                      <button
                        onClick={() => setContactSubmitted(false)}
                        className="mt-4 bg-[#0B132B] text-white px-6 py-2.5 rounded-xl text-xs font-semibold"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!contactForm.name || !contactForm.email || !contactForm.phone) {
                          showToast('⚠️ Please fill in all required fields.');
                          return;
                        }
                        setContactSubmitted(true);
                        showToast('✨ Inquiry submitted successfully! Our team will contact you shortly.');
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Signatory *</label>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="e.g. Ramesh Jha"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-sky-600 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Company / CA Firm Name</label>
                          <input
                            type="text"
                            value={contactForm.company}
                            onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                            placeholder="e.g. Acme Technologies Ltd."
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-sky-600 focus:outline-none"
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
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-sky-600 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                          <input
                            type="tel"
                            required
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            placeholder="+91 98765 00000"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-sky-600 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Area of Interest</label>
                          <select
                            value={contactForm.service}
                            onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-sky-600 focus:outline-none"
                          >
                            {APP_CONFIG.services.map((s) => (
                              <option key={s.id} value={s.title}>{s.title}</option>
                            ))}
                            <option value="B2B Accounting Outsourcing Pod">B2B Accounting Outsourcing Pod</option>
                            <option value="General Corporate Consultation">General Corporate Consultation</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Turnover Bracket</label>
                          <select
                            value={contactForm.turnover}
                            onChange={(e) => setContactForm({ ...contactForm, turnover: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-sky-600 focus:outline-none"
                          >
                            <option value="Under ₹1 Cr">Under ₹1 Cr</option>
                            <option value="₹1 Cr - ₹10 Cr">₹1 Cr - ₹10 Cr</option>
                            <option value="₹10 Cr - ₹50 Cr">₹10 Cr - ₹50 Cr</option>
                            <option value="₹50 Cr+">₹50 Cr+ (Large Corporate)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Requirement Overview / Monthly Volume</label>
                        <textarea
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Please describe your current accounting setup, monthly invoice count, or any specific compliance notices needing attention..."
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-sky-600 focus:outline-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B132B] hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95"
                      >
                        <span>Submit Corporate Inquiry</span>
                        <ArrowRight className="w-4 h-4 text-sky-400" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* =================================================================== */}
      {/* 4. PRESTIGIOUS CORPORATE FOOTER (Institutional Authority)           */}
      {/* =================================================================== */}
      <footer className="bg-[#0B132B] text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            
            {/* Column 1: Brand Info & Authority */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <BrandLogo size={42} />
                <div>
                  <div className="font-display font-bold text-lg text-white">Jha Accounting Solutions</div>
                  <div className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                    Chartered Accountants &amp; B2B Advisory
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Providing statutory compliance, GST reconciliation, corporate income tax computation, independent audits, and dedicated B2B back-office capacity for enterprises and CA practices.
              </p>
              <div className="text-xs text-slate-400 pt-2 space-y-1">
                <div><strong>Inquiry:</strong> {APP_CONFIG.branding.inquiryEmail}</div>
                <div><strong>Direct Line:</strong> {APP_CONFIG.branding.phone}</div>
                <div><strong>Office:</strong> {APP_CONFIG.branding.officeAddress}</div>
              </div>
            </div>

            {/* Column 2: Core Practice Areas */}
            <div className="space-y-3">
              <div className="text-xs uppercase font-bold tracking-wider text-white">Practice Areas</div>
              <ul className="text-xs space-y-2 text-slate-400">
                {APP_CONFIG.services.slice(0, 5).map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => {
                        setActiveTab('services');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white transition-colors text-left"
                    >
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Quick Navigation */}
            <div className="space-y-3">
              <div className="text-xs uppercase font-bold tracking-wider text-white">Quick Portals</div>
              <ul className="text-xs space-y-2 text-slate-400">
                <li>
                  <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                    Firm Home
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('outsourcing')} className="hover:text-white transition-colors">
                    B2B Outsourcing Pods
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('calculators')} className="hover:text-white transition-colors">
                    GST &amp; TDS Calculators
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('insights')} className="hover:text-white transition-colors">
                    Tax Insights &amp; Calendar
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('why-us')} className="hover:text-white transition-colors">
                    Why Market Leaders Choose Us
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('contact')} className="hover:text-white transition-colors">
                    Schedule Consultation
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter / Statutory Alerts */}
            <div className="space-y-3">
              <div className="text-xs uppercase font-bold tracking-wider text-white">Statutory Alerts</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive key GST and Income Tax deadline notifications and Union Budget statutory circular summaries.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('✅ Subscribed to Statutory Tax Alerts!');
                }}
                className="space-y-2"
              >
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white py-2 rounded-lg text-xs font-bold transition-all"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* ICAI Regulatory Disclaimer */}
          <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed space-y-3">
            <p>
              <strong>ICAI Disclaimer:</strong> As per the rules of the Institute of Chartered Accountants of India (ICAI), Chartered Accountants are not permitted to solicit work or advertise. The user acknowledges that the information provided on this website is solely available for informational purposes and should not be construed as an advertisement or personal solicitation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 pt-2">
              <div>
                &copy; {new Date().getFullYear()} {APP_CONFIG.branding.name}. All rights reserved.
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span>ISO 27001 Data Security Certified</span>
                <span>•</span>
                <span>Confidentiality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
