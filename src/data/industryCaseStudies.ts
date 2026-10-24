export interface IndustryCaseStudy {
  id: string;
  category: 'retail' | 'saas' | 'manufacturing' | 'services';
  categoryLabel: string;
  title: string;
  subtitle: string;
  clientProfile: string;
  iconName: 'ShoppingBag' | 'Rocket' | 'Factory' | 'Briefcase';
  challenge: string;
  appliedDeliverables: string[];
  keyOutcome: string;
  approvedServices: string[];
}

export const INDUSTRY_CASE_STUDIES: IndustryCaseStudy[] = [
  {
    id: 'retail-case-study',
    category: 'retail',
    categoryLabel: 'Retail & E-Commerce',
    title: 'Multi-Store Retail & High-Volume GST Reconciliation',
    subtitle: 'Point-of-Sale Inward Supply Reconciliations & Monthly GST Return Filings',
    clientProfile: 'Omnichannel Retailer with 4 Outlets & Marketplace Sales',
    iconName: 'ShoppingBag',
    challenge:
      'High monthly volume of inward vendor invoices across multiple distributor states resulted in unclaimed Input Tax Credits and frequent discrepancies with auto-drafted GSTR-2B records.',
    appliedDeliverables: [
      'Monthly line-by-line reconciliation between Purchase Register and auto-drafted GSTR-2B',
      'Timely preparation and filing of monthly GSTR-1 outward supplies and GSTR-3B summary returns',
      'Periodic ledger review and monthly trial balance finalisation in Tally Prime'
    ],
    keyOutcome: 'Zero GSTR-2B credit lapses, reconciled purchase registers, and on-time statutory GST settlement before the 20th of every month.',
    approvedServices: ['GST Compliance Services', 'Bookkeeping and Accounting']
  },
  {
    id: 'saas-case-study',
    category: 'saas',
    categoryLabel: 'SaaS & Technology',
    title: 'Recurring Revenue Direct Tax & Withholding Compliance',
    subtitle: 'Section 139 ITR Computation, Advance Tax Estimations & TDS Returns',
    clientProfile: 'B2B Software Entity with Subscription & Vendor Contracts',
    iconName: 'Rocket',
    challenge:
      'Rapid quarter-over-quarter expansion led to fluctuating advance tax liabilities and heavy professional and contract payments requiring strict Chapter XVII-B withholding compliance.',
    appliedDeliverables: [
      'Quarterly advance tax liability estimations and total income computation under Section 139',
      'Verification of deductee details under Section 194J and 194C, with timely filing of Form 26Q and Form 24Q returns',
      'Assistance with TRACES quarterly Form 16 and Form 16A generation and vendor certificate dispatch'
    ],
    keyOutcome: 'Accurate quarterly advance tax payments avoiding interest under Section 234B/234C, alongside clean TRACES reconciliation.',
    approvedServices: ['Income Tax Return and Computation', 'TDS/TCS Quarterly Returns']
  },
  {
    id: 'manufacturing-case-study',
    category: 'manufacturing',
    categoryLabel: 'Manufacturing & Trading',
    title: 'Capital Goods ITC & Annual Statutory Finalisation',
    subtitle: 'Raw Material Inward ITC Verification, Balance Sheet Finalisation & GSTR-9',
    clientProfile: 'Precision Component Fabricator with Raw Material Supply Chains',
    iconName: 'Factory',
    challenge:
      'Complex raw material procurement, job work transactions, and capital equipment purchases required rigorous ITC tracking and periodic trial balance review for year-end audit readiness.',
    appliedDeliverables: [
      'Input Tax Credit reconciliation between GSTR-2B and Purchase Register for capital goods and inputs',
      'Periodic accounting-entry verification and trial balance review and finalisation',
      'Finalisation of Balance Sheet, Profit and Loss Account, and preparation of annual GSTR-9 / GSTR-9C statements'
    ],
    keyOutcome: 'Comprehensive input credit verification, fully reconciled balance sheet schedules, and error-free annual GSTR-9 return submission.',
    approvedServices: ['GST Compliance Services', 'Bookkeeping and Accounting']
  },
  {
    id: 'services-case-study',
    category: 'services',
    categoryLabel: 'Professional Services',
    title: 'Client Billing Reconciliation & Direct Tax Filing',
    subtitle: 'Section 194J Withholding Reconciliation, Ledger Verification & Advance Tax',
    clientProfile: 'Consulting & Design Firm with Retainer Client Contracts',
    iconName: 'Briefcase',
    challenge:
      'Clients deducted TDS under Section 194J at varying rates, requiring rigorous matching between Form 26AS/AIS records, ledger entries, and final ITR tax credit claims.',
    appliedDeliverables: [
      'Quarterly advance tax liability calculations and annual Section 139 Income Tax Return filing',
      'Verification of deductee details and quarterly TDS returns using Forms 24Q and 26Q',
      'Periodic ledger review, trial balance finalisation, and completion of Profit & Loss Statement'
    ],
    keyOutcome: 'Seamless credit claiming of all TDS deducted by corporate clients, prompt advance tax compliance, and balanced financial statements.',
    approvedServices: ['Income Tax Return and Computation', 'TDS/TCS Quarterly Returns', 'Bookkeeping and Accounting']
  }
];

export const INDUSTRY_CATEGORIES = [
  { id: 'all', label: 'All Sectors' },
  { id: 'retail', label: 'Retail & E-Commerce' },
  { id: 'saas', label: 'SaaS & Technology' },
  { id: 'manufacturing', label: 'Manufacturing & Trading' },
  { id: 'services', label: 'Professional Services' }
] as const;

export type IndustryCategory = typeof INDUSTRY_CATEGORIES[number]['id'];
