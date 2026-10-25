export interface DocumentItem {
  id: string;
  name: string;
  category: 'gst' | 'itr' | 'tds' | 'bookkeeping';
  recommendedFormat: string;
  isMandatory: boolean;
  statutoryReason: string;
  description: string;
  tips?: string;
}

export interface DocumentCategoryInfo {
  id: 'gst' | 'itr' | 'tds' | 'bookkeeping';
  title: string;
  shortTitle: string;
  badge: string;
  description: string;
  serviceBookingName: string;
  iconName: 'ReceiptText' | 'Calculator' | 'ShieldCheck' | 'BookOpen';
  frequency: string;
  leadTimeNotice: string;
}

export const DOCUMENT_CATEGORIES: DocumentCategoryInfo[] = [
  {
    id: 'gst',
    title: 'GST Compliance Services',
    shortTitle: 'GST Filings',
    badge: 'Monthly / Quarterly',
    description: 'Documentation required for monthly GSTR-1 outward filing, GSTR-3B tax settlement, and GSTR-2B purchase reconciliation.',
    serviceBookingName: 'GST Compliance Services',
    iconName: 'ReceiptText',
    frequency: 'Monthly (by 11th & 20th) or Quarterly QRMP',
    leadTimeNotice: 'Provide records by 5th of each month for seamless GSTR-2B matching.'
  },
  {
    id: 'itr',
    title: 'Income Tax Return & Computation',
    shortTitle: 'Income Tax & ITR',
    badge: 'Annual / Advance Tax',
    description: 'Annual verification records for Section 139 ITR filing, Total Income computation, and quarterly advance tax liability calculation.',
    serviceBookingName: 'Income Tax Return and Computation',
    iconName: 'Calculator',
    frequency: 'Annual filing & Quarterly Advance Tax (15 Jun, 15 Sep, 15 Dec, 15 Mar)',
    leadTimeNotice: 'AIS/TIS statements should be downloaded post-reconciliation for the full assessment year.'
  },
  {
    id: 'tds',
    title: 'TDS / TCS Quarterly Returns',
    shortTitle: 'TDS/TCS Filings',
    badge: 'Quarterly Deadlines',
    description: 'Statutory schedules for Chapter XVII-B withholding tax filings (Forms 24Q, 26Q, 27Q, 27EQ) and TRACES Form 16/16A generation.',
    serviceBookingName: 'TDS/TCS Quarterly Returns',
    iconName: 'ShieldCheck',
    frequency: 'Quarterly (31st July, 31st Oct, 31st Jan, 31st May)',
    leadTimeNotice: 'Ensure all tax challans are deposited by the 7th of the following month.'
  },
  {
    id: 'bookkeeping',
    title: 'Bookkeeping & Financial Accounts',
    shortTitle: 'Bookkeeping',
    badge: 'Monthly / Periodic',
    description: 'Primary financial records required for periodic ledger review, trial balance finalisation, and Balance Sheet / P&L compilation.',
    serviceBookingName: 'Bookkeeping and Accounting',
    iconName: 'BookOpen',
    frequency: 'Monthly / Quarterly Close',
    leadTimeNotice: 'Submit bank statements in Excel or searchable PDF for expedited categorization.'
  }
];

export const REQUIRED_DOCUMENTS: DocumentItem[] = [
  // --- GST COMPLIANCE DOCUMENTS ---
  {
    id: 'gst-sales-register',
    category: 'gst',
    name: 'Outward Sales Register & Invoices',
    recommendedFormat: 'Excel (.xlsx) / CSV / Accounting Export',
    isMandatory: true,
    statutoryReason: 'Mandatory for filing monthly GSTR-1 outward supply statements.',
    description: 'Complete list of tax invoices, export invoices, debit/credit notes, and B2C sales summary with HSN codes, taxable values, and IGST/CGST/SGST tax rates.',
    tips: 'Include customer GSTIN, place of supply, and invoice date for seamless invoice upload.'
  },
  {
    id: 'gst-purchase-register',
    category: 'gst',
    name: 'Purchase Register & Inward Vendor Bills',
    recommendedFormat: 'Excel (.xlsx) / Searchable PDF',
    isMandatory: true,
    statutoryReason: 'Required to reconcile against auto-drafted GSTR-2B to maximize Input Tax Credit (ITC).',
    description: 'Detailed purchase ledger containing vendor GSTIN, invoice number, invoice date, taxable value, and tax paid on inward supplies and capital equipment.',
    tips: 'Flag reverse charge mechanism (RCM) inward supplies separately for correct GSTR-3B table 3.1(d) reporting.'
  },
  {
    id: 'gst-bank-statements',
    category: 'gst',
    name: 'Bank Account Statements for Tax Period',
    recommendedFormat: 'Searchable PDF / Netbanking CSV',
    isMandatory: true,
    statutoryReason: 'Verification of inward customer receipts and outward statutory GST challan payments.',
    description: 'Bank statements for all active business current accounts and cash credit (CC/OD) accounts for the month/quarter under review.',
    tips: 'Helps ensure no unreported sales or advance payments are left out of GST liability.'
  },
  {
    id: 'gst-eway-bills',
    category: 'gst',
    name: 'E-Way Bill Summary & Delivery Challans',
    recommendedFormat: 'PDF / E-Way Bill Portal Log (.xlsx)',
    isMandatory: false,
    statutoryReason: 'Statutory verification where consignment value exceeded ₹50,000 threshold.',
    description: 'Summary of active e-way bills generated for interstate or intrastate movement of goods, matched with corresponding tax invoices.',
    tips: 'Verify active vs cancelled e-way bills to prevent discrepancies during GSTR-1 preparation.'
  },
  {
    id: 'gst-portal-credentials',
    category: 'gst',
    name: 'GST Common Portal Access / Authorisation',
    recommendedFormat: 'Secure Verification / OTP Confirmation',
    isMandatory: true,
    statutoryReason: 'Access to GSTIN profile, Electronic Cash/Credit Ledgers, and GSTR-2B JSON reports.',
    description: 'Authorized access to the GST portal (www.gst.gov.in) or prompt OTP coordination with the registered authorized signatory.',
    tips: 'Credentials are treated with strict confidentiality under professional non-disclosure.'
  },
  {
    id: 'gst-previous-returns',
    category: 'gst',
    name: 'Previous Period Return Acknowledgments (GSTR-1 & 3B)',
    recommendedFormat: 'PDF (Filed Acknowledgment Receipts)',
    isMandatory: true,
    statutoryReason: 'Carrying forward accurate closing balances and verifying sequential filing continuity.',
    description: 'ARN receipts and filing summaries of the preceding month or quarter to check ITC carryover and pending interest/late fee liabilities.',
    tips: 'Vital when onboarding or transitioning filings to ensure zero gap in compliance.'
  },

  // --- INCOME TAX RETURN & COMPUTATION DOCUMENTS ---
  {
    id: 'itr-ais-tis',
    category: 'itr',
    name: 'Annual Information Statement (AIS) & TIS',
    recommendedFormat: 'PDF / JSON (Downloaded from e-Filing Portal)',
    isMandatory: true,
    statutoryReason: 'Statutory benchmark used by the Income Tax Department to cross-verify all declared income.',
    description: 'Comprehensive report of high-value transactions, share trading, mutual fund transactions, dividend income, and foreign remittances recorded under your PAN.',
    tips: 'Download the latest version after June 15 to capture all late Q4 TDS deductions by counterparties.'
  },
  {
    id: 'itr-form-26as',
    category: 'itr',
    name: 'Form 26AS (Tax Credit Statement)',
    recommendedFormat: 'Searchable PDF (Downloaded from TRACES)',
    isMandatory: true,
    statutoryReason: 'Verifies tax deducted at source (TDS), TCS collected, and advance tax payments credited against your PAN.',
    description: 'Complete 26AS showing Part A (TDS), Part B (TCS), and Part C (Direct Tax Paid challans including Self-Assessment and Advance Tax).',
    tips: 'Ensures full tax credit is claimed in the ITR, preventing unnecessary tax demand notices.'
  },
  {
    id: 'itr-bank-statements',
    category: 'itr',
    name: 'Annual Bank Statements & Interest Certificates',
    recommendedFormat: 'Searchable PDF / Excel (1st April – 31st March)',
    isMandatory: true,
    statutoryReason: 'Mandatory disclosure of all active bank accounts under Section 139.',
    description: 'Statements for all operational savings, current, and fixed deposit accounts held during the financial year, plus bank interest certificates (SB & FD interest).',
    tips: 'Include accounts closed during the year as well, as mandated by CBDT filing instructions.'
  },
  {
    id: 'itr-financial-statements',
    category: 'itr',
    name: 'Financial Statements / Balance Sheet & P&L',
    recommendedFormat: 'Excel (.xlsx) / Finalised PDF',
    isMandatory: true,
    statutoryReason: 'Required for reporting business or professional income under ITR-3, ITR-5, or ITR-6.',
    description: 'Draft or finalised Balance Sheet, Profit & Loss statement, schedules of debtors/creditors, and gross turnover summary (or presumptive computation under Sec 44AD/44ADA).',
    tips: 'If opting for presumptive taxation, provide total gross receipts received via banking channels vs cash.'
  },
  {
    id: 'itr-capital-gains',
    category: 'itr',
    name: 'Capital Gains Statements & Property Sale Deeds',
    recommendedFormat: 'Consolidated Tax P&L (.xlsx/PDF from Broker)',
    isMandatory: false,
    statutoryReason: 'Accurate computation of Short-Term and Long-Term Capital Gains under Sections 111A, 112, and 112A.',
    description: 'Tax P&L statements from stockbrokers (Zerodha, Groww, ICICI Direct, etc.), CAMS/KFintech mutual fund statements, or purchase & sale deeds for real estate.',
    tips: 'Provides grandfathering NAV as of 31st Jan 2018 for equity shares and indexation verification.'
  },
  {
    id: 'itr-deduction-proofs',
    category: 'itr',
    name: 'Chapter VI-A Deduction Receipts & Exemption Proofs',
    recommendedFormat: 'PDF / Scanned Receipts',
    isMandatory: false,
    statutoryReason: 'Substantiating tax deductions under Old Tax Regime (Sections 80C, 80D, 80G, etc.).',
    description: 'Life insurance premium receipts, PPF passbook, ELSS certificates, Mediclaim policy schedules, tuition fee receipts, and housing loan interest certificates (Sec 24b).',
    tips: 'We calculate tax under both Old and New Tax Regimes (Section 115BAC) to determine your optimal tax-saving outcome.'
  },
  {
    id: 'itr-prior-acknowledgment',
    category: 'itr',
    name: 'Previous Year ITR-V & Tax Computation',
    recommendedFormat: 'PDF (ITR-V Acknowledgment & Form)',
    isMandatory: true,
    statutoryReason: 'Checking brought forward business or capital losses eligible for set-off in current year.',
    description: 'Copy of preceding assessment year’s filed ITR acknowledgment and detailed computation sheet showing unabsorbed depreciation or carryover losses.',
    tips: 'Allows setting off prior losses against current profits to legally minimize tax payout.'
  },

  // --- TDS / TCS QUARTERLY RETURNS DOCUMENTS ---
  {
    id: 'tds-payment-ledgers',
    category: 'tds',
    name: 'Monthly Payment Ledgers with Deduction Details',
    recommendedFormat: 'Excel (.xlsx) / Accounting Ledger Export',
    isMandatory: true,
    statutoryReason: 'Statutory basis for drafting quarterly Form 24Q (Salary) or Form 26Q (Non-Salary).',
    description: 'Detailed ledgers showing date of credit/payment, gross amount, applicable section (194C, 194J, 194I, 194H, 194Q), rate of deduction, and net payment.',
    tips: 'Ensure billing date matches payment or credit date (whichever is earlier) as per Chapter XVII-B.'
  },
  {
    id: 'tds-pan-database',
    category: 'tds',
    name: 'Deductee Master with Verified PANs & Addresses',
    recommendedFormat: 'Excel (.xlsx) / CSV',
    isMandatory: true,
    statutoryReason: 'Prevention of short deduction notices under Section 206AA (invalid/inoperative PANs attract 20% TDS).',
    description: 'PAN numbers, legal names, addresses, and tax residency status of all contractors, professionals, landlords, and employees from whom tax was withheld.',
    tips: 'We verify PAN validity to ensure deductees receive seamless credit on their Form 26AS.'
  },
  {
    id: 'tds-challan-receipts',
    category: 'tds',
    name: 'ITNS 281 Tax Paid Challan Receipts',
    recommendedFormat: 'PDF / Challan Receipts with BSR & Serial',
    isMandatory: true,
    statutoryReason: 'Matching Challan CIN with NSDL / OLTAS tax accounting database.',
    description: 'Official deposit receipts showing the 7-digit BSR code of the bank branch, deposit date, 5-digit Challan serial number, and major/minor head split (200 / 400).',
    tips: 'Ensure all tax withheld in a calendar month was paid by the 7th of the following month.'
  },
  {
    id: 'tds-traces-credentials',
    category: 'tds',
    name: 'TRACES Portal Login Credentials',
    recommendedFormat: 'Secure User ID & Password (www.tdscpc.gov.in)',
    isMandatory: true,
    statutoryReason: 'Downloading consolidated (.conso) files for quarterly revisions and generating Form 16 / 16A.',
    description: 'Deductor login credentials for the TRACES portal, TAN registration verification, and authorized person contact details.',
    tips: 'Enables prompt generation and digital signing of quarterly TDS certificates for vendors.'
  },
  {
    id: 'tds-lower-deduction-certs',
    category: 'tds',
    name: 'Section 197 Lower / Nil Deduction Certificates',
    recommendedFormat: 'PDF (Certificate issued by Assessing Officer)',
    isMandatory: false,
    statutoryReason: 'Justification for deducting tax at rates below the standard statutory rates.',
    description: 'Valid Section 197 or 197A certificates issued by the Income Tax Department to vendors, quoting specific certificate numbers and validity dates.',
    tips: 'Must be verified before making payments without standard TDS to avoid default penalties.'
  },
  {
    id: 'tds-previous-acknowledgment',
    category: 'tds',
    name: 'Previous Quarter PRN / Token Receipts',
    recommendedFormat: 'PDF (Provisional Receipt Number)',
    isMandatory: true,
    statutoryReason: 'Ensuring sequential quarterly linking on the TIN-NSDL central processing system.',
    description: 'Provisional Receipt Number (PRN) token of the last filed return for Form 24Q / 26Q / 27Q.',
    tips: 'Crucial for filing subsequent quarter returns or filing correction statements.'
  },

  // --- BOOKKEEPING & FINANCIAL ACCOUNTS DOCUMENTS ---
  {
    id: 'bk-bank-statements',
    category: 'bookkeeping',
    name: 'Complete Financial Year Bank & CC Statements',
    recommendedFormat: 'Excel (.xlsx) / CSV / Searchable PDF',
    isMandatory: true,
    statutoryReason: 'Primary source of truth for bank reconciliation statements (BRS).',
    description: 'Unedited monthly bank statements for all active business current accounts, overdraft/cash credit facilities, and corporate credit cards.',
    tips: 'Providing Excel or CSV exports speeds up ledger import and automated transaction classification.'
  },
  {
    id: 'bk-invoices-vouchers',
    category: 'bookkeeping',
    name: 'Sales Invoices & Purchase Bills Repository',
    recommendedFormat: 'PDF / Scanned Bills / Accounting Software Backup',
    isMandatory: true,
    statutoryReason: 'Documentary evidence supporting all revenues, direct expenses, and capital acquisitions.',
    description: 'Copies of customer invoices issued, vendor bills received, utility bills, rent receipts, and office expenditure vouchers.',
    tips: 'Organized folders by month or vendor accelerate ledger finalisation.'
  },
  {
    id: 'bk-petty-cash',
    category: 'bookkeeping',
    name: 'Petty Cash Log & Imprest Expense Slips',
    recommendedFormat: 'Excel (.xlsx) / Physical Cash Book Record',
    isMandatory: false,
    statutoryReason: 'Reconciling cash balances and verifying cash expenditure within Section 40A(3) limits.',
    description: 'Summary of daily or weekly cash disbursements for office refreshments, courier, local conveyance, and miscellaneous minor expenses.',
    tips: 'Ensure single cash payments exceeding ₹10,000 are avoided as per Income Tax provisions.'
  },
  {
    id: 'bk-loan-statements',
    category: 'bookkeeping',
    name: 'Loan Sanction Letters & Amortisation Schedules',
    recommendedFormat: 'PDF (Bank Letters & Interest Certificates)',
    isMandatory: false,
    statutoryReason: 'Correct bifurcation between loan principal repayment and finance/interest expenses.',
    description: 'Sanction letters for business loans, vehicle loans, machinery financing, along with annual bank interest certificates.',
    tips: 'Ensures correct interest deduction under the Profit and Loss Account and accurate Balance Sheet liability.'
  },
  {
    id: 'bk-fixed-assets',
    category: 'bookkeeping',
    name: 'Fixed Asset Invoices & Installation Proofs',
    recommendedFormat: 'PDF / Tax Invoices',
    isMandatory: false,
    statutoryReason: 'Calculating accurate depreciation under Companies Act & Income Tax Act (Put to use > 180 days rule).',
    description: 'Invoices for purchase of computers, furniture, machinery, or office equipment, including delivery dates and installation sign-offs.',
    tips: 'Important for claiming 50% or 100% statutory depreciation based on the 180-day threshold.'
  }
];
