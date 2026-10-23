/**
 * Centralized Firm Content & Business Data
 * Edit company text, contact information, services, office addresses,
 * stats, FAQs, and testimonials here without touching layout code.
 */

export interface OfficeAddress {
  city: string;
  badge: string;
  address: string;
  phone: string;
  email: string;
  timing: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  features: string[];
  isFlagship?: boolean;
  discountBadge?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  company: string;
  role: string;
  quote: string;
  metric: string;
  location: string;
}

export interface StatutoryMilestone {
  number: string;
  numericVal: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
  desc: string;
}

export const COMPANY_CONTENT = {
  brand: {
    name: "Jha Accounting Solutions",
    shortName: "JAS",
    tagline: "100% Online Corporate Accounting, GST & Virtual CFO",
    leadPartner: "Rishi Jha",
    leadPartnerTitle: "GST & Tax Consultant · Lead Partner",
    foundedYear: 2022,
    experienceYears: "10+",
    activeClientsCount: 450,
    gstReturnsFiled: "12,500+",
    primaryPhone: "+91 88828 60226",
    directMobileRaw: "+918882860226",
    primaryEmail: "rishijha@tuta.io",
    whatsappLink: "https://wa.me/918882860226?text=Hi%20Jha%20Accounting%20Solutions%2C%20I%20would%20like%20to%20consult%20on%20corporate%20accounting%20services.",
    addressSummary: "100% Online & Remote Operations Across India"
  },

  statutoryMilestones: [
    {
      number: "10+",
      numericVal: 10,
      suffix: "+",
      label: "Years Experience",
      desc: "Delivering audit-grade precision since inception."
    },
    {
      number: "100%",
      numericVal: 100,
      suffix: "%",
      label: "Online Operations",
      desc: "Seamless digital compliance and virtual CFO services."
    },
    {
      number: "450+",
      numericVal: 450,
      suffix: "+",
      label: "Active Enterprise Clients",
      desc: "Trusted across E-commerce, SaaS, Manufacturing & Pharma."
    },
    {
      number: "12,500+",
      numericVal: 12500,
      suffix: "+",
      label: "GST Returns Filed",
      desc: "Zero-penalty SLA across 28 States & 8 UTs."
    }
  ] as StatutoryMilestone[],

  officeLocations: [
    {
      city: "Digital Head Office",
      badge: "100% Remote",
      address: "Serving clients Pan-India with secure, cloud-based digital infrastructure.",
      phone: "+91 88828 60226",
      email: "support@jhaaccounting.com",
      timing: "Mon - Sat: 9:30 AM - 7:00 PM (IST)"
    }
  ] as OfficeAddress[],

  outsourcingTiers: [
    {
      name: "Starter Pod",
      range: "3 – 5 Client Accounts",
      discount: "25% OFF",
      discountBadge: "SAVE 25%",
      desc: "Perfect for independent CA practitioners and boutique agencies scaling their first client accounts with zero hiring overhead.",
      features: [
        "Dedicated Associate Accountant",
        "Tally Prime & Zoho Books Sync",
        "GSTR-1 & 3B Monthly Preparation",
        "Form 24Q / 26Q TDS Filing",
        "48-Hour Standard SLA Turnaround",
        "100% Confidential White-Label (NDA)"
      ],
      popular: false
    },
    {
      name: "Growth Pod",
      range: "6 – 15 Client Accounts",
      discount: "35% OFF",
      discountBadge: "MOST POPULAR · SAVE 35%",
      desc: "Engineered for established CA firms, CPAs & agencies aiming for high profit margins without payroll or training bloat.",
      features: [
        "Dedicated Senior CA + Junior Pod",
        "Real-Time Bank & Gateway Recons",
        "Multi-State GST Compliance (2B Rec)",
        "Statutory Payroll & PF/ESI Filing",
        "Guaranteed 24-Hour SLA Turnaround",
        "Branded Monthly Client MIS Reports"
      ],
      popular: true
    },
    {
      name: "Enterprise Agency",
      range: "16+ Client Accounts",
      discount: "UP TO 40% OFF",
      discountBadge: "MAX VOLUME DISCOUNT · 40% OFF",
      desc: "Comprehensive outsourced back-office operation with dedicated infrastructure, priority turnaround, and lead partner oversight.",
      features: [
        "Dedicated Practice Manager + Full CA Team",
        "Direct Lead Partner Oversight (Rishi Jha)",
        "Custom ERP, SAP & Cloud Data Pipelines",
        "Priority Statutory Scrutiny Defense",
        "Guaranteed Same-Day Rush Turnaround",
        "Dedicated WhatsApp & Slack Channels"
      ],
      popular: false
    }
  ],

  services: [
    {
      id: "b2b-outsourcing",
      title: "B2B White-Label Accounting Outsourcing",
      shortDesc: "Our #1 Core Business: Dedicated offshore accounting pods for CA firms, CPAs, agency owners & enterprises. All fees are 100% talkable & negotiable, higher custom discounts are possible, and up to 100% free pilot accounts are available.",
      fullDesc: "Complete back-office accounting, multi-state GST filing, TDS, and payroll delivered under your brand. Outsource owners enjoy talkable, negotiable fees, extra custom discounts, and risk-free trial pilots.",
      iconName: "Briefcase",
      features: [
        "100% Talkable & Negotiable Fees",
        "Higher Custom Discounts Possible",
        "Up to 100% Free Trial Pilot Account",
        "100% White-Label (Strict NDA)",
        "Guaranteed 24-Hour Turnaround SLA"
      ],
      isFlagship: true,
      discountBadge: "TALKABLE FEES · UP TO FREE TRIAL"
    },
    {
      id: "corporate-accounting",
      title: "Corporate Accounting & Bookkeeping",
      shortDesc: "End-to-end cloud bookkeeping, ledger maintenance, daily transaction tagging, and month-end closing.",
      fullDesc: "Complete outsourced accounting tailored for Indian companies using Tally Prime, Zoho Books, or QuickBooks.",
      iconName: "ReceiptText",
      features: ["Daily Transaction Entry", "Bank & Gateway Reconciliation", "Monthly Financial Statements", "Vendor Payables Management"]
    },
    {
      id: "gst-filing",
      title: "Multi-State GST Filing & ITC",
      shortDesc: "Timely GSTR-1 & 3B filings, automated GSTR-2B ITC reconciliation, and multi-state compliance.",
      fullDesc: "Comprehensive GST advisory and return filing across all 28 states with 100% ITC recovery assurance.",
      iconName: "Globe",
      features: ["GSTR-1 & 3B Returns", "2B vs Purchase Reconciliation", "E-Way Bill Generation", "GST Notice Assistance"]
    },
    {
      id: "tds-compliance",
      title: "TDS Compliance & Returns",
      shortDesc: "Computation of statutory TDS deductions, monthly challan deposits (Form 281), and quarterly Form 26Q returns.",
      fullDesc: "End-to-end withholding tax compliance ensuring zero interest penalties and timely Form 16A generation.",
      iconName: "Calculator",
      features: ["TDS Section Applicability", "Challan 281 Payment", "26Q & 24Q Quarterly Returns", "Lower Deduction Certificate (197)"]
    },
    {
      id: "payroll-operations",
      title: "Payroll Operations & Statutory Dues",
      shortDesc: "Monthly salary slip processing, PF/ESIC statutory calculations, Professional Tax, and Form 16 issuing.",
      fullDesc: "Hassle-free employee payroll outsourcing compliant with Indian labor laws and Income Tax Act.",
      iconName: "Users2",
      features: ["Monthly Pay Slips", "EPF & ESIC Filing", "Professional Tax Compliance", "Annual Form 16 Generation"]
    },
    {
      id: "virtual-cfo",
      title: "Virtual CFO Advisory",
      shortDesc: "Strategic cashflow modeling, 13-week runway forecasts, budgeting, and board-level MIS decks.",
      fullDesc: "Fractional CFO leadership by Rishi Jha for scale-ups seeking venture capital and margin expansion.",
      iconName: "TrendingUp",
      features: ["Monthly MIS Dashboards", "Cash Flow Forecasting", "Budget Variance Analysis", "Investor Board Decks"]
    },
    {
      id: "audit-support",
      title: "Audit Support & Tax Scrutiny",
      shortDesc: "Audit schedule preparation, statutory auditor liaison, and tax scrutiny representation.",
      fullDesc: "Comprehensive audit readiness ensuring seamless statutory, internal, and GST audit completions.",
      iconName: "ShieldCheck",
      features: ["Audit Schedule Compilation", "Statutory Auditor Coordination", "Income Tax Scrutiny Notice Reply", "Tax Audit Form 3CD Preparation"]
    }
  ] as ServiceItem[],

  industries: [
    {
      title: "E-commerce & D2C",
      description: "Multi-state GST marketplace reconciliation (Amazon, Flipkart, Shopify), TCS/TDS tracking, and gateway accounting.",
      metrics: "120+ Active Stores",
      iconName: "ShoppingBag"
    },
    {
      title: "SaaS & Startups",
      description: "VC-ready financial modeling, R&D expense tracking, 13-week cash runway, and ESOP accounting advisory.",
      metrics: "Funded Scale-ups",
      iconName: "Rocket"
    },
    {
      title: "Manufacturing",
      description: "Inventory valuation (FIFO/Weighted Average), BOM costing, e-way bill compliance, and fixed asset registers.",
      metrics: "ERP Integrated",
      iconName: "Factory"
    },
    {
      title: "Real Estate & Infrastructure",
      description: "RERA compliance accounting, escrow account reconciliation, vendor TDS, and milestone billing tracking.",
      metrics: "Multi-Project",
      iconName: "Building2"
    },
    {
      title: "Healthcare & Pharma",
      description: "GST exemption tracking, medical equipment depreciation, regulatory compliance, and payroll management.",
      metrics: "Strict Data Security",
      iconName: "Stethoscope"
    },
    {
      title: "Logistics & Supply Chain",
      description: "Fleet expense tracking, interstate transit GST compliance, driver payroll, and toll reconciliation.",
      metrics: "Pan-India Operations",
      iconName: "Truck"
    },
    {
      title: "Education & EdTech",
      description: "GST compliance on digital courses, fee collection reconciliation, TDS on instructor payouts, and trust audits.",
      metrics: "Institution Grade",
      iconName: "GraduationCap"
    },
    {
      title: "Professional Services",
      description: "Time-billing revenue recognition, professional fee TDS (194J), GST reverse charge (RCM), and partner payouts.",
      metrics: "Consultants & Agencies",
      iconName: "Briefcase"
    }
  ],

  faqs: [
    {
      question: "How is your pricing structured for corporate accounting and GST?",
      answer: "Our pricing is transparent, predictable, and based on monthly transaction volume, employee count, and active GST registrations. We offer fixed monthly retainers starting from ₹15,000/month with zero hidden fees, covering full bookkeeping, GST filings, and monthly MIS."
    },
    {
      question: "What is the process for switching our current accountant or CA firm to you?",
      answer: "Switching is entirely seamless. Our onboarding team handles communication with your previous accountant, requests and secures all opening balances, Tally/ERP backups, and historical GST returns (GSTR-1 & 3B) with zero operational downtime."
    },
    {
      question: "How do you ensure enterprise-grade data security and client confidentiality?",
      answer: "We employ 256-bit SSL encryption, role-based cloud access controls, restricted server environments, and strict Non-Disclosure Agreements (NDAs) signed by all lead accountants and partners. Your financial data never leaves secure compliant servers."
    },
    {
      question: "How do you handle multi-state GST registrations and interstate compliance?",
      answer: "We manage centralized as well as multi-state GST registrations across all 28 states and union territories. Our automated reconciliation engine matches GSTR-2B with purchase registers state-by-state to prevent mismatched ITC and notices."
    },
    {
      question: "What is your typical turnaround time for monthly book closing and GST filing?",
      answer: "We guarantee monthly book closing within 5 days of month-end, followed by GSTR-1 and 3B filings well before statutory deadlines (typically by the 10th and 18th of the month) to ensure zero penalty and absolute peace of mind."
    },
    {
      question: "What are the terms for White-Label Accounting partnerships for CA firms?",
      answer: "Practicing Chartered Accountants can outsource compliance, TDS computation, and bookkeeping to us. We operate 100% invisibly under your firm letterhead and brand guidelines with dedicated SLA support and confidential B2B retainers."
    }
  ] as FaqItem[],

  testimonials: [
    {
      id: "1",
      name: "Vikram Malhotra",
      company: "Zenith Logistics & Supply Chain Pvt Ltd",
      role: "Chief Financial Officer",
      quote: "Jha Accounting Solutions transformed our multi-state GST filing and ITC reconciliation. We saved over ₹42L in eligible tax credits that our previous CA firm missed, with zero late penalties over 3 years.",
      metric: "₹42L+ ITC Recovered",
      location: "New Delhi HQ"
    },
    {
      id: "2",
      name: "Ananya Sharma",
      company: "Vanguard SaaS Solutions",
      role: "Founder & CEO",
      quote: "Their Virtual CFO advisory gave us institutional-grade MIS reports and 13-week cash runway models that helped us successfully close our Series A round with top-tier venture funds.",
      metric: "Series A Funded",
      location: "Bengaluru Office"
    },
    {
      id: "3",
      name: "CA Rajesh Singhania",
      company: "Singhania & Associates Chartered Accountants",
      role: "Senior Partner",
      quote: "We outsource our bulk corporate compliance and bookkeeping to Rishi Jha’s team under our own firm brand. Their white-label precision allows our firm to scale without hiring overshoots.",
      metric: "100% Confidential White-Label",
      location: "Mumbai Office"
    }
  ] as TestimonialItem[]
};
