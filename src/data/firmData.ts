export interface PracticePillar {
  id: string;
  pillarNumber: string;
  title: string;
  tagline: string;
  summary: string;
  keyDeliverables: string[];
  scopePreselect: string;
}

export interface FirmLeader {
  name: string;
  role: string;
  qualifications: string;
  bio: string;
  specialization: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'GST Compliance' | 'Income Tax' | 'TDS & TCS' | 'Bookkeeping';
  readTime: string;
  publishDate: string;
  author: {
    name: string;
    role: string;
  };
  toc: { id: string; text: string }[];
  content: {
    sectionId: string;
    heading: string;
    paragraphs: string[];
  }[];
  keyTakeaway: string;
  relatedSlugs: string[];
}

export interface AnalyticsData {
  overview: {
    totalVisitors: string;
    visitorsTrend: string;
    conversionRate: string;
    conversionTrend: string;
    totalLeads: string;
    leadsTrend: string;
    avgSessionDuration: string;
    webVitals: {
      score: number;
      lcp: string;
      inp: string;
      cls: string;
    };
  };
  trafficHistory: {
    days7: { date: string; visits: number }[];
    days30: { date: string; visits: number }[];
    days90: { date: string; visits: number }[];
  };
  conversionFunnel: { step: string; count: number; percentage: number }[];
  trafficSources: { name: string; percentage: number; count: string; leads: number }[];
  topArticles: { title: string; views: string; readRate: string; leadsGenerated: number }[];
  deviceDistribution: { device: string; percentage: number; label: string }[];
  locationDistribution: { region: string; percentage: number; count: string }[];
}

export const JHA_ACCOUNTING_DATA = {
  firm: {
    name: "Jha Accounting Solutions",
    shortName: "JAS",
    designation: "GST & Tax Consultant",
    tagline: "Professional GST Compliance, Income Tax Computation & Accounting Solutions",
    primaryPhone: "+91 88828 60226",
    primaryPhoneRaw: "+918882860226",
    directMobile: "+91 88828 60226",
    directMobileRaw: "+918882860226",
    primaryEmail: "rishijha@tuta.io",
    whatsappLink: "https://wa.me/918882860226?text=Hello%20Jha%20Accounting%20Solutions%2C%20I%20would%20like%20to%20consult%20regarding%20accounting%20and%20tax%20compliance%20services.",
    operatingHours: "Monday – Saturday: 09:30 AM – 06:30 PM IST"
  },

  leaders: [
    {
      name: "Rishi Jha",
      role: "Lead Partner · GST & Tax Consultant",
      qualifications: "MBA (Finance), B.Com (Hons)",
      bio: "Lead Partner at Jha Accounting Solutions. Specializes in GST compliance, income tax computation, quarterly TDS/TCS filings, and corporate bookkeeping. Dedicated to delivering reliable, timely statutory services for businesses across India.",
      specialization: ["GST Compliance & Returns", "Income Tax Computations & Returns", "TDS/TCS Chapter XVII-B Filings", "Corporate Bookkeeping & Finalisation"]
    }
  ] as FirmLeader[],

  practicePillars: [
    {
      id: "gst-compliance",
      pillarNumber: "01",
      title: "GST Compliance Services",
      tagline: "Accurate monthly & quarterly return preparation and comprehensive ITC reconciliation.",
      summary: "End-to-end Indirect Tax support covering regular return filings and annual reconciliations, as applicable to each client's specific business operations.",
      keyDeliverables: [
        "Preparation and filing of monthly/quarterly GSTR-1 and GSTR-3B, as applicable to the client",
        "Monthly Input Tax Credit (ITC) reconciliation between GSTR-2B and the Purchase Register",
        "Preparation of annual GSTR-9 returns and GSTR-9C reconciliation statements"
      ],
      scopePreselect: "GST Compliance Services"
    },
    {
      id: "income-tax",
      pillarNumber: "02",
      title: "Income Tax Return and Computation",
      tagline: "Statutory direct tax filings under Section 139 and quarterly advance tax calculations.",
      summary: "Complete income computation and advance tax scheduling to ensure statutory compliance with the Income-tax Act, 1961.",
      keyDeliverables: [
        "Preparation and filing of annual Income Tax Returns under Section 139 of the Income-tax Act, 1961",
        "Computation of total income and quarterly advance tax liability calculations"
      ],
      scopePreselect: "Income Tax Return and Computation"
    },
    {
      id: "tds-tcs",
      pillarNumber: "03",
      title: "TDS/TCS Quarterly Returns",
      tagline: "Withholding tax deduction applicability under Chapter XVII-B and quarterly portal filings.",
      summary: "Verification of deductee details, computation of withholding taxes, timely submission of quarterly statements, and TRACES certificate assistance.",
      keyDeliverables: [
        "Verification of deductee details and applicability of tax deduction under Chapter XVII-B",
        "Preparation and filing of quarterly TDS/TCS returns using Forms 24Q, 26Q, 27Q and 27EQ, as applicable",
        "Assistance with downloading Form 16 and Form 16A from TRACES"
      ],
      scopePreselect: "TDS/TCS Quarterly Returns"
    },
    {
      id: "bookkeeping-accounting",
      pillarNumber: "04",
      title: "Bookkeeping and Accounting",
      tagline: "Systematic ledger entry reviews, trial balance finalisation, and financial statements.",
      summary: "Structured bookkeeping solutions ensuring consistent ledger integrity and finalized Balance Sheet and Profit and Loss statements.",
      keyDeliverables: [
        "Periodic ledger review and accounting-entry verification",
        "Trial balance review and finalisation",
        "Finalisation of the Balance Sheet, Profit and Loss Account, and Cash Flow Statement"
      ],
      scopePreselect: "Bookkeeping and Accounting"
    }
  ] as PracticePillar[],

  taxCalendar: [
    {
      day: "7th",
      period: "Every Month",
      title: "Monthly TDS / TCS Deposit Due Date",
      act: "Chapter XVII-B, Income-tax Act, 1961",
      desc: "Deposit of tax deducted or collected at source for preceding month via Challan ITNS 281.",
      urgency: "critical"
    },
    {
      day: "11th",
      period: "Every Month",
      title: "GSTR-1 Outward Supplies (Monthly)",
      act: "CGST Rules, 2017",
      desc: "Filing of outward supplies return for regular taxpayers as applicable.",
      urgency: "critical"
    },
    {
      day: "20th",
      period: "Every Month",
      title: "GSTR-3B Summary Return & Tax Settlement",
      act: "Section 39, CGST Act, 2017",
      desc: "Monthly return and payment of net tax liability after eligible GSTR-2B ITC reconciliation.",
      urgency: "critical"
    },
    {
      day: "15th",
      period: "June · Sept · Dec · March",
      title: "Quarterly Advance Tax Installments",
      act: "Sections 208-211, Income-tax Act, 1961",
      desc: "Computation and payment of quarterly advance tax installments (15%, 45%, 75%, 100%).",
      urgency: "upcoming"
    },
    {
      day: "31st",
      period: "Quarterly (July, Oct, Jan, May)",
      title: "Quarterly TDS/TCS Returns (24Q / 26Q / 27Q / 27EQ)",
      act: "Chapter XVII-B & Income Tax Rules",
      desc: "Filing of quarterly withholding tax returns using Forms 24Q, 26Q, 27Q and 27EQ, as applicable.",
      urgency: "upcoming"
    },
    {
      day: "31st Dec",
      period: "Annual Return",
      title: "Annual GSTR-9 Returns & GSTR-9C",
      act: "Section 44, CGST Act, 2017",
      desc: "Preparation of annual GSTR-9 returns and GSTR-9C reconciliation statements, as applicable.",
      urgency: "upcoming"
    }
  ],

  blogArticles: [
    {
      id: "blog-1",
      slug: "gstr-2b-reconciliation-guide",
      title: "Monthly GSTR-2B & Purchase Register Reconciliation: Key Procedures",
      excerpt: "How matching your purchase register with GSTR-2B ensures accurate Input Tax Credit claims under current GST regulations.",
      category: "GST Compliance",
      readTime: "5 min read",
      publishDate: "October 2026",
      author: {
        name: "Rishi Jha",
        role: "GST & Tax Consultant · Lead Partner"
      },
      toc: [
        { id: "gstr2b-importance", text: "1. Importance of GSTR-2B Matching" },
        { id: "common-mismatches", text: "2. Common Invoice Mismatches" },
        { id: "reconciliation-workflow", text: "3. Monthly ITC Reconciliation Cadence" }
      ],
      content: [
        {
          sectionId: "gstr2b-importance",
          heading: "1. Importance of GSTR-2B Matching",
          paragraphs: [
            "Under Section 16(2)(aa) of the CGST Act, Input Tax Credit (ITC) may only be availed if invoice details are furnished by the supplier in their GSTR-1 and communicated in auto-drafted GSTR-2B.",
            "Timely monthly reconciliation ensures that credits claimed in GSTR-3B match eligible amounts reflecting on the GST portal."
          ]
        },
        {
          sectionId: "common-mismatches",
          heading: "2. Common Invoice Mismatches",
          paragraphs: [
            "Discrepancies often arise from typographical errors in invoice numbering, incorrect GSTINs, or timing differences when suppliers file returns later in the cycle.",
            "Maintaining a disciplined comparison between the Purchase Register and GSTR-2B isolates unmatched records for prompt vendor follow-up."
          ]
        },
        {
          sectionId: "reconciliation-workflow",
          heading: "3. Monthly ITC Reconciliation Cadence",
          paragraphs: [
            "We recommend reviewing GSTR-2B statements promptly after the 14th of each month, ensuring all eligible entries are verified prior to finalising GSTR-3B filings by the 20th."
          ]
        }
      ],
      keyTakeaway: "Disciplined monthly reconciliation between GSTR-2B and the Purchase Register prevents mismatched credit claims and maintains statutory compliance.",
      relatedSlugs: ["advance-tax-computation-guide", "tds-compliance-chapter-xvii-b"]
    },
    {
      id: "blog-2",
      slug: "advance-tax-computation-guide",
      title: "Quarterly Advance Tax Liability Calculations: Principles and Due Dates",
      excerpt: "Understanding the statutory requirements for estimating total income and scheduling quarterly advance tax payments under Sections 208-211.",
      category: "Income Tax",
      readTime: "5 min read",
      publishDate: "September 2026",
      author: {
        name: "Rishi Jha",
        role: "GST & Tax Consultant · Lead Partner"
      },
      toc: [
        { id: "advance-tax-basics", text: "1. Applicability and Thresholds" },
        { id: "installment-schedule", text: "2. Quarterly Installment Schedule" },
        { id: "computation-method", text: "3. Calculating Estimated Total Income" }
      ],
      content: [
        {
          sectionId: "advance-tax-basics",
          heading: "1. Applicability and Thresholds",
          paragraphs: [
            "Under Section 208 of the Income-tax Act, 1961, advance tax is payable during a financial year where the estimated tax liability of the assessee for that year is ₹10,000 or more.",
            "Proactive estimation helps businesses allocate working capital and comply with statutory deadlines."
          ]
        },
        {
          sectionId: "installment-schedule",
          heading: "2. Quarterly Installment Schedule",
          paragraphs: [
            "Corporate and business taxpayers pay advance tax in four installments: 15% on or before June 15, 45% on or before September 15, 75% on or before December 15, and 100% on or before March 15."
          ]
        },
        {
          sectionId: "computation-method",
          heading: "3. Calculating Estimated Total Income",
          paragraphs: [
            "Estimated income involves reviewing gross revenue, deducting allowable operational expenditures, and applying the applicable tax rate net of TDS/TCS credits."
          ]
        }
      ],
      keyTakeaway: "Timely quarterly estimation of total income ensures appropriate advance tax payments under the Income-tax Act, 1961.",
      relatedSlugs: ["gstr-2b-reconciliation-guide", "tds-compliance-chapter-xvii-b"]
    },
    {
      id: "blog-3",
      slug: "tds-compliance-chapter-xvii-b",
      title: "TDS/TCS Deductee Verification and Quarterly Forms 24Q, 26Q & 27Q",
      excerpt: "Essential steps for verifying deductee details under Chapter XVII-B and submitting quarterly returns on TRACES.",
      category: "TDS & TCS",
      readTime: "6 min read",
      publishDate: "August 2026",
      author: {
        name: "Rishi Jha",
        role: "GST & Tax Consultant · Lead Partner"
      },
      toc: [
        { id: "chapter-xvii-b", text: "1. Scope of Chapter XVII-B" },
        { id: "quarterly-forms", text: "2. Form Applicability: 24Q, 26Q, 27Q, 27EQ" },
        { id: "traces-support", text: "3. Downloading Form 16 and 16A" }
      ],
      content: [
        {
          sectionId: "chapter-xvii-b",
          heading: "1. Scope of Chapter XVII-B",
          paragraphs: [
            "Chapter XVII-B of the Income-tax Act, 1961 outlines the statutory obligation of deductors to deduct tax at source on specified payments, including salaries, contractor payouts, and professional fees.",
            "Accurate PAN verification and rate determination are fundamental to prevent incorrect deductions."
          ]
        },
        {
          sectionId: "quarterly-forms",
          heading: "2. Form Applicability: 24Q, 26Q, 27Q, 27EQ",
          paragraphs: [
            "Quarterly statements are submitted using Form 24Q for salaries, Form 26Q for domestic payments to resident non-salary payees, Form 27Q for non-resident payments, and Form 27EQ for tax collected at source (TCS)."
          ]
        },
        {
          sectionId: "traces-support",
          heading: "3. Downloading Form 16 and 16A",
          paragraphs: [
            "Following successful return processing on the TRACES portal, deductors must download digitally signed Form 16 (for employees) or Form 16A (for vendors) for distribution to deductees."
          ]
        }
      ],
      keyTakeaway: "Validating deductee details and adhering to quarterly filing schedules ensures compliant withholding tax management.",
      relatedSlugs: ["gstr-2b-reconciliation-guide", "advance-tax-computation-guide"]
    },
    {
      id: "blog-4",
      slug: "trial-balance-and-financial-finalisation",
      title: "Periodic Ledger Review, Trial Balance & Balance Sheet Finalisation",
      excerpt: "The step-by-step workflow for verifying journal entries, trial balance balancing, and final financial statements.",
      category: "Bookkeeping",
      readTime: "5 min read",
      publishDate: "July 2026",
      author: {
        name: "Rishi Jha",
        role: "GST & Tax Consultant · Lead Partner"
      },
      toc: [
        { id: "ledger-verification", text: "1. Periodic Ledger Entry Verification" },
        { id: "trial-balance", text: "2. Trial Balance Balancing & Review" },
        { id: "final-statements", text: "3. Finalising Balance Sheet & P&L" }
      ],
      content: [
        {
          sectionId: "ledger-verification",
          heading: "1. Periodic Ledger Entry Verification",
          paragraphs: [
            "Regular ledger reviews involve verifying invoice entries against source vouchers, validating tax components, and cross-checking bank and ledger balances.",
            "Consistent reviews prevent year-end accounting backlogs and maintain clear documentation."
          ]
        },
        {
          sectionId: "trial-balance",
          heading: "2. Trial Balance Balancing & Review",
          paragraphs: [
            "The trial balance aggregates debit and credit balances across all ledger accounts. Any imbalances or unclassified entries are identified and adjusted through appropriate closing entries."
          ]
        },
        {
          sectionId: "final-statements",
          heading: "3. Finalising Balance Sheet & P&L",
          paragraphs: [
            "Once trial balance finalisation is complete, the financial statements—comprising the Balance Sheet, Profit and Loss Account, and Cash Flow Statement—are finalized reflecting accurate business operations."
          ]
        }
      ],
      keyTakeaway: "Structured ledger review and periodic trial balance finalisation ensure dependable, audit-ready financial statements.",
      relatedSlugs: ["gstr-2b-reconciliation-guide", "advance-tax-computation-guide"]
    }
  ] as BlogPost[],

  analyticsData: {
    overview: {
      totalVisitors: "2,480",
      visitorsTrend: "+12.4%",
      conversionRate: "3.8%",
      conversionTrend: "+0.8%",
      totalLeads: "94",
      leadsTrend: "+14.2%",
      avgSessionDuration: "2m 55s",
      webVitals: {
        score: 100,
        lcp: "0.8s",
        inp: "35ms",
        cls: "0.00"
      }
    },
    trafficHistory: {
      days7: [
        { date: "Day 1", visits: 320 },
        { date: "Day 2", visits: 345 },
        { date: "Day 3", visits: 380 },
        { date: "Day 4", visits: 360 },
        { date: "Day 5", visits: 410 },
        { date: "Day 6", visits: 395 },
        { date: "Day 7", visits: 420 }
      ],
      days30: [
        { date: "Week 1", visits: 2100 },
        { date: "Week 2", visits: 2280 },
        { date: "Week 3", visits: 2390 },
        { date: "Week 4", visits: 2480 }
      ],
      days90: [
        { date: "Month 1", visits: 6100 },
        { date: "Month 2", visits: 6800 },
        { date: "Month 3", visits: 7250 }
      ]
    },
    conversionFunnel: [
      { step: "1. Unique Site Visitors", count: 2480, percentage: 100 },
      { step: "2. GST Calculator / Calendar Engaged", count: 1120, percentage: 45.2 },
      { step: "3. Service Scope Inquiries Opened", count: 310, percentage: 12.5 },
      { step: "4. Consultation Submitted", count: 94, percentage: 3.8 }
    ],
    trafficSources: [
      { name: "Organic Search", percentage: 55, count: "1,364", leads: 52 },
      { name: "Direct", percentage: 30, count: "744", leads: 28 },
      { name: "Referrals", percentage: 15, count: "372", leads: 14 }
    ],
    topArticles: [
      { title: "Monthly GSTR-2B & Purchase Register Reconciliation", views: "1,420", readRate: "78%", leadsGenerated: 38 },
      { title: "Quarterly Advance Tax Liability Calculations", views: "1,180", readRate: "72%", leadsGenerated: 26 },
      { title: "TDS/TCS Deductee Verification & Forms 24Q, 26Q", views: "980", readRate: "69%", leadsGenerated: 18 },
      { title: "Periodic Ledger Review & Balance Sheet Finalisation", views: "820", readRate: "74%", leadsGenerated: 12 }
    ],
    deviceDistribution: [
      { device: "Mobile", percentage: 56, label: "1,389 visits" },
      { device: "Desktop", percentage: 38, label: "942 visits" },
      { device: "Tablet", percentage: 6, label: "149 visits" }
    ],
    locationDistribution: [
      { region: "Delhi NCR", percentage: 48, count: "1,190" },
      { region: "Maharashtra", percentage: 22, count: "545" },
      { region: "Karnataka", percentage: 16, count: "397" },
      { region: "Other States & UTs", percentage: 14, count: "348" }
    ]
  } as AnalyticsData,

  faqs: [
    {
      id: "faq-1",
      category: "GST Compliance",
      question: "Which GST returns do you prepare and file?",
      answer: "We assist with the preparation and filing of monthly or quarterly GSTR-1 and GSTR-3B returns, as applicable to the client. In addition, we prepare annual GSTR-9 returns and GSTR-9C reconciliation statements.",
      tags: ["GSTR-1", "GSTR-3B", "GSTR-9", "GSTR-9C", "GST Compliance"]
    },
    {
      id: "faq-2",
      category: "GST Compliance",
      question: "How does the monthly GSTR-2B Input Tax Credit (ITC) reconciliation work?",
      answer: "We perform periodic reconciliation between your purchase register and the auto-drafted GSTR-2B on the GST portal to verify eligible input credits and identify missing vendor invoices.",
      tags: ["GSTR-2B", "ITC Reconciliation", "Purchase Register", "Tax Credit"]
    },
    {
      id: "faq-3",
      category: "Income Tax",
      question: "What income tax return services are offered under Section 139?",
      answer: "We handle the preparation and filing of annual Income Tax Returns under Section 139 of the Income-tax Act, 1961, tailored to the applicable form for the taxpayer entity.",
      tags: ["Section 139", "Income Tax Return", "ITR Filing", "Direct Tax"]
    },
    {
      id: "faq-4",
      category: "Income Tax",
      question: "How do you calculate advance tax liabilities?",
      answer: "We calculate quarterly advance tax liability based on the computation of total income and estimated revenues/expenses, adhering to the statutory installments outlined under Sections 208-211 of the Income-tax Act, 1961.",
      tags: ["Advance Tax", "Quarterly Tax", "Section 208", "Computation"]
    },
    {
      id: "faq-5",
      category: "TDS & TCS",
      question: "Which TDS and TCS quarterly returns do you prepare and file?",
      answer: "We verify deductee details and applicability under Chapter XVII-B, and prepare quarterly returns using Forms 24Q, 26Q, 27Q, and 27EQ, as applicable. We also assist with downloading Form 16 and Form 16A from TRACES.",
      tags: ["Chapter XVII-B", "Form 24Q", "Form 26Q", "Form 27Q", "Form 27EQ", "TRACES"]
    },
    {
      id: "faq-6",
      category: "Bookkeeping & Accounting",
      question: "What is included in your bookkeeping and accounting services?",
      answer: "Our bookkeeping and accounting service includes periodic ledger review and accounting-entry verification, trial balance review and finalisation, and finalisation of the Balance Sheet, Profit and Loss Account, and Cash Flow Statement.",
      tags: ["Ledger Review", "Trial Balance", "Balance Sheet", "P&L", "Cash Flow"]
    }
  ]
};
