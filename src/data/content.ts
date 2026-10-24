/**
 * Centralized Firm Content & Business Data
 * Single Source of Truth for Jha Accounting Solutions
 * STRICT RULE: Advertises ONLY the 4 approved services:
 * 1. GST Compliance Services
 * 2. Income Tax Return and Computation
 * 3. TDS/TCS Quarterly Returns
 * 4. Bookkeeping and Accounting
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
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const COMPANY_CONTENT = {
  brand: {
    name: "Jha Accounting Solutions",
    shortName: "JAS",
    tagline: "Professional GST Compliance, Income Tax & Corporate Accounting",
    leadPartner: "Rishi Jha",
    leadPartnerTitle: "GST & Tax Consultant · Lead Partner",
    primaryPhone: "+91 88828 60226",
    directMobileRaw: "+918882860226",
    primaryEmail: "rishijha@tuta.io",
    whatsappLink: "https://wa.me/918882860226?text=Hi%20Jha%20Accounting%20Solutions%2C%20I%20would%20like%20to%20consult%20on%20accounting%20and%20tax%20compliance%20services.",
    addressSummary: "Online & Remote Accounting Practice Across India"
  },

  officeLocations: [
    {
      city: "Advisory & Practice Desk",
      badge: "Online & Remote",
      address: "Serving corporate and business clients across India with secure digital workflows.",
      phone: "+91 88828 60226",
      email: "rishijha@tuta.io",
      timing: "Mon - Sat: 9:30 AM - 6:30 PM (IST)"
    }
  ] as OfficeAddress[],

  /**
   * STRICT APPROVED SERVICES LIST - SINGLE SOURCE OF TRUTH
   */
  services: [
    {
      id: "gst-compliance",
      title: "GST Compliance Services",
      shortDesc: "Comprehensive periodic GST return filing, input credit reconciliation, and annual statements as applicable.",
      fullDesc: "Complete indirect tax compliance including monthly or quarterly return preparation and filing, purchase register matching with GSTR-2B, and annual statutory reconciliation statements.",
      iconName: "Globe",
      features: [
        "Preparation and filing of monthly/quarterly GSTR-1 and GSTR-3B, as applicable to the client",
        "Monthly Input Tax Credit (ITC) reconciliation between GSTR-2B and the Purchase Register",
        "Preparation of annual GSTR-9 returns and GSTR-9C reconciliation statements"
      ]
    },
    {
      id: "income-tax",
      title: "Income Tax Return and Computation",
      shortDesc: "Annual statutory return filings under Section 139 and quarterly advance tax calculations.",
      fullDesc: "Accurate computation of total income, evaluation of applicable deductions, quarterly advance tax estimations, and statutory annual ITR preparation and filing.",
      iconName: "Calculator",
      features: [
        "Preparation and filing of annual Income Tax Returns under Section 139 of the Income-tax Act, 1961",
        "Computation of total income and quarterly advance tax liability calculations"
      ]
    },
    {
      id: "tds-tcs",
      title: "TDS/TCS Quarterly Returns",
      shortDesc: "Withholding tax compliance under Chapter XVII-B, quarterly return preparation, and TRACES certificate download support.",
      fullDesc: "End-to-end withholding tax compliance including deductee detail verification, quarterly filing of Forms 24Q, 26Q, 27Q, and 27EQ as applicable, and assistance downloading Form 16/16A from TRACES.",
      iconName: "ReceiptText",
      features: [
        "Verification of deductee details and applicability of tax deduction under Chapter XVII-B",
        "Preparation and filing of quarterly TDS/TCS returns using Forms 24Q, 26Q, 27Q and 27EQ, as applicable",
        "Assistance with downloading Form 16 and Form 16A from TRACES"
      ]
    },
    {
      id: "bookkeeping-accounting",
      title: "Bookkeeping and Accounting",
      shortDesc: "Systematic ledger verification, periodic trial balance finalisation, and statutory financial statements.",
      fullDesc: "Professional accounting solutions ensuring clean books of accounts, regular ledger entry reviews, trial balance balancing, and preparation of final financial statements.",
      iconName: "ShieldCheck",
      features: [
        "Periodic ledger review and accounting-entry verification",
        "Trial balance review and finalisation",
        "Finalisation of the Balance Sheet, Profit and Loss Account, and Cash Flow Statement"
      ]
    }
  ] as ServiceItem[],

  industries: [
    {
      title: "E-Commerce & Retail",
      description: "Regular purchase-to-GSTR-2B reconciliation, state-wise GST returns, and periodic ledger balancing for high-volume sales.",
      iconName: "ShoppingBag"
    },
    {
      title: "Technology & Software",
      description: "Quarterly TDS filings (Form 26Q/24Q), advance tax liability computation, and annual Income Tax return filing under Section 139.",
      iconName: "Rocket"
    },
    {
      title: "Manufacturing & Trading",
      description: "Vendor ledger reviews, Input Tax Credit verification between GSTR-2B and Purchase Registers, and annual GSTR-9/9C.",
      iconName: "Factory"
    },
    {
      title: "Professional Services",
      description: "TDS verification under Chapter XVII-B, annual ITR filing under Section 139, and finalisation of P&L and Balance Sheet.",
      iconName: "Briefcase"
    }
  ],

  faqs: [
    {
      question: "Which GST returns are prepared and filed for clients?",
      answer: "We handle the preparation and filing of monthly or quarterly GSTR-1 and GSTR-3B returns, as applicable to the client's turnover and scheme. In addition, we assist with annual GSTR-9 returns and GSTR-9C reconciliation statements."
    },
    {
      question: "How is Input Tax Credit (ITC) reconciliation performed?",
      answer: "We perform periodic reconciliation matching your Purchase Register with auto-populated GSTR-2B statements. This identifies missing vendor invoices, invoice mismatches, and timing differences to maintain accurate credit claims."
    },
    {
      question: "What income tax filing and computation services do you provide?",
      answer: "We handle the computation of total income, quarterly advance tax liability calculations under the Income-tax Act, 1961, and the preparation and filing of annual Income Tax Returns under Section 139."
    },
    {
      question: "Which TDS and TCS quarterly return forms are supported?",
      answer: "We verify deductee details and applicability under Chapter XVII-B and prepare quarterly TDS/TCS returns using Forms 24Q (salaries), 26Q (domestic payments), 27Q (non-resident payments), and 27EQ (TCS), as applicable. We also assist with downloading Form 16 and Form 16A certificates from TRACES."
    },
    {
      question: "What does the bookkeeping and accounting service entail?",
      answer: "Our bookkeeping service includes periodic ledger reviews and accounting-entry verification, trial balance review and finalisation, and the finalisation of the Balance Sheet, Profit and Loss Account, and Cash Flow Statement."
    },
    {
      question: "How do we get started with your accounting and compliance services?",
      answer: "You can schedule a consultation or contact our lead partner, Rishi Jha, directly at +91 88828 60226 or via rishijha@tuta.io. The scope of deliverables is customized based on mutually agreed professional terms and your applicable requirements."
    }
  ] as FaqItem[]
};
