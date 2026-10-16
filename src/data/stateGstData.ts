export interface StateGstProfile {
  id: string;
  name: string;
  code: string; // GST State Code (e.g., '27')
  capital: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Central';
  ewayBillThresholdIntraState: string; // Intra-state e-Way Bill Threshold
  ewayBillExemptions: string;
  professionalTaxRules: string; // PT rules (PTRC/PTEC)
  ptReturnDeadline: string;
  keyComplianceNuances: string[];
  localTaxOffice: string;
  deliveryHub: string;
  svgPath: string; // Path coordinates or map center coordinates
  mapPosition: { x: number; y: number }; // SVG map center pin coordinates
}

export const INDIA_STATE_GST_DATA: StateGstProfile[] = [
  {
    id: "delhi",
    name: "Delhi NCR",
    code: "07",
    capital: "New Delhi",
    region: "North",
    ewayBillThresholdIntraState: "₹50,000",
    ewayBillExemptions: "Exempted for goods transported within same revenue district up to ₹1,000,000 for job-work.",
    professionalTaxRules: "Nil (No Professional Tax levied in Union Territory of Delhi).",
    ptReturnDeadline: "N/A - Exempt",
    keyComplianceNuances: [
      "High-frequency automated GSTR-2B scrutiny for multi-state HQ entities.",
      "Strict e-Invoicing verification under Section 122 for B2B transactions.",
      "Fast-track GST refund desk for SEZ & IT export liaison offices in NSP/Gurugram."
    ],
    localTaxOffice: "Department of Trade & Taxes, Vyapar Bhawan, IP Estate, New Delhi",
    deliveryHub: "Netaji Subhash Place Corporate HQ",
    svgPath: "M 255 180 L 265 180 L 265 190 L 255 190 Z",
    mapPosition: { x: 260, y: 185 }
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    code: "27",
    capital: "Mumbai",
    region: "West",
    ewayBillThresholdIntraState: "₹1,000,000 (₹10 Lakhs)",
    ewayBillExemptions: "Higher ₹10 Lakhs intra-state limit for non-prohibited goods within Maharashtra.",
    professionalTaxRules: "Mandatory PTRC (Employer) & PTEC (Enrolment). PTRC ₹2,500/yr max; PTEC ₹2,500/yr.",
    ptReturnDeadline: "PTRC Monthly return by last day of subsequent month (Form III-B).",
    keyComplianceNuances: [
      "PTRC monthly return mandatory for employers with > 20 staff.",
      "Works Contract SGST audit scrutinies under Maharashtra GST Act 2017.",
      "Port & SEZ export IGST refund processing at JNPT / BKC Special Tax Desk."
    ],
    localTaxOffice: "GST Bhavan, Mazgaon, Mumbai, Maharashtra 400010",
    deliveryHub: "Bandra Kurla Complex (BKC) Delivery Center",
    svgPath: "M 180 320 L 240 310 L 260 370 L 200 410 L 170 360 Z",
    mapPosition: { x: 215, y: 350 }
  },
  {
    id: "karnataka",
    name: "Karnataka",
    code: "29",
    capital: "Bengaluru",
    region: "South",
    ewayBillThresholdIntraState: "₹50,000",
    ewayBillExemptions: "No e-Way bill required for intra-state movement of job-work textiles within same district.",
    professionalTaxRules: "KPT Act: ₹200/month for employees earning ≥ ₹15,000/month.",
    ptReturnDeadline: "Monthly PT return filed by 20th of the following month (Form 5A).",
    keyComplianceNuances: [
      "Strict LUT export verification for SaaS, IT, & R&D exporters in Electronic City.",
      "Automated SGST notices for ITC mismatch between GSTR-3B and GSTR-2B.",
      "Mandatory e-Invoicing compliance audit for tech startups with turnover > ₹5 Cr."
    ],
    localTaxOffice: "VTK-1, KPTCL Building, Gandhinagar, Bengaluru, Karnataka 560009",
    deliveryHub: "Bengaluru Tech Hub Desk",
    svgPath: "M 200 430 L 240 420 L 250 490 L 210 500 Z",
    mapPosition: { x: 225, y: 460 }
  },
  {
    id: "haryana",
    name: "Haryana",
    code: "06",
    capital: "Chandigarh",
    region: "North",
    ewayBillThresholdIntraState: "₹50,000",
    ewayBillExemptions: "Exempted for intra-state movement of agricultural produce and exempted goods.",
    professionalTaxRules: "Nil (No Professional Tax in Haryana).",
    ptReturnDeadline: "N/A - Exempt",
    keyComplianceNuances: [
      "Heavy automobile & manufacturing supply chain ITC 04 job-work audits.",
      "Gurugram Special Commercial Tax Cell for MNC liaison offices & GCCs.",
      "Quarterly e-Way Bill barcode verification on NH-48 logistics corridors."
    ],
    localTaxOffice: "Excise & Taxation Complex, Sector 32, Gurugram, Haryana 122001",
    deliveryHub: "Gurugram Sector 44 Delivery Hub",
    svgPath: "M 230 170 L 260 160 L 260 190 L 230 190 Z",
    mapPosition: { x: 245, y: 175 }
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    code: "33",
    capital: "Chennai",
    region: "South",
    ewayBillThresholdIntraState: "₹1,000,000 (₹10 Lakhs)",
    ewayBillExemptions: "Higher ₹10 Lakhs intra-state threshold for non-prohibited goods within Tamil Nadu.",
    professionalTaxRules: "Municipal PT levied semi-annually by Greater Chennai Corp / local bodies.",
    ptReturnDeadline: "Half-yearly filing due September 30 & March 31.",
    keyComplianceNuances: [
      "Specialized manufacturing SGST audits for auto & textile industrial clusters.",
      "GSTR-2B input credit reconciliation desk for Sriperumbudur & Hosur hubs.",
      "Export IGST refund acceleration desk at Chennai Port Customs."
    ],
    localTaxOffice: "Ezhilagam, Chepauk, Chennai, Tamil Nadu 600005",
    deliveryHub: "Chennai Industrial & Tech Desk",
    svgPath: "M 240 490 L 280 480 L 270 560 L 230 530 Z",
    mapPosition: { x: 255, y: 520 }
  },
  {
    id: "gujarat",
    name: "Gujarat",
    code: "24",
    capital: "Gandhinagar",
    region: "West",
    ewayBillThresholdIntraState: "₹50,000",
    ewayBillExemptions: "Specific exemptions for cotton yarn, brass parts, and diamond industry job-work.",
    professionalTaxRules: "Gujarat State PT: ₹200/mo for salaries > ₹12,000; PTEC ₹2,400/year.",
    ptReturnDeadline: "Monthly return by 15th of next month (Form 8).",
    keyComplianceNuances: [
      "GIFT City IFSC tax exemption structure for global financial services.",
      "Chemical & pharma supply chain e-Way Bill tracking & Section 129 physical inspections.",
      "Speedy IGST export refund processing at Hazira & Mundra ports."
    ],
    localTaxOffice: "Rajya Kar Bhavan, Ashram Road, Ahmedabad, Gujarat 380009",
    deliveryHub: "Ahmedabad & GIFT City Desk",
    svgPath: "M 130 250 L 190 240 L 190 310 L 120 310 Z",
    mapPosition: { x: 160, y: 275 }
  },
  {
    id: "telangana",
    name: "Telangana",
    code: "36",
    capital: "Hyderabad",
    region: "South",
    ewayBillThresholdIntraState: "₹50,000",
    ewayBillExemptions: "Exempted for IT hardware move within HITEC City SEZ zones.",
    professionalTaxRules: "TS PT Act: ₹200/month for salary > ₹20,000/month; PTEC ₹2,500/year.",
    ptReturnDeadline: "Monthly PT return due by 10th of following month (Form V).",
    keyComplianceNuances: [
      "Specialized LUT export filing desk for HITEC City & Gachibowli IT exporters.",
      "Pharma sector input tax credit (ITC) reconciliation & inverted duty structure refunds.",
      "Automated SGST portal scrutiny for multi-state service GST registration."
    ],
    localTaxOffice: "CT Complex, Nampally, Hyderabad, Telangana 500001",
    deliveryHub: "Hyderabad IT & Pharma Desk",
    svgPath: "M 230 380 L 280 370 L 280 430 L 230 420 Z",
    mapPosition: { x: 255, y: 400 }
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    code: "09",
    capital: "Lucknow",
    region: "North",
    ewayBillThresholdIntraState: "₹50,000",
    ewayBillExemptions: "Exempted for handicraft & local MSME movement under ₹1 Lakh within same district.",
    professionalTaxRules: "Nil (No Professional Tax in Uttar Pradesh).",
    ptReturnDeadline: "N/A - Exempt",
    keyComplianceNuances: [
      "Noida & Greater Noida E-Commerce logistics hub e-Way Bill verification.",
      "High-volume GSTR-1 & 3B GST compliance for D2C warehousing centers.",
      "Inverted tax structure refund filing for manufacturing plants in NCR."
    ],
    localTaxOffice: "Commercial Tax Building, Vibhuti Khand, Gomti Nagar, Lucknow, UP 226010",
    deliveryHub: "Noida / Greater Noida NCR Desk",
    svgPath: "M 270 180 L 350 190 L 330 260 L 270 240 Z",
    mapPosition: { x: 310, y: 220 }
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    code: "19",
    capital: "Kolkata",
    region: "East",
    ewayBillThresholdIntraState: "₹50,000",
    ewayBillExemptions: "Exempted for intra-city tea & jute transport under specified conditions.",
    professionalTaxRules: "WB PT Act: Slab up to ₹200/month for salary > ₹25,000; PTEC ₹2,500/year.",
    ptReturnDeadline: "Quarterly or Annual PT returns filed electronically (Form IX).",
    keyComplianceNuances: [
      "Kolkata port export IGST refund processing & tea industry GST concessions.",
      "Cross-border Nepal/Bhutan transit cargo e-Way Bill compliance.",
      "Strict GSTR-2B input tax credit mismatch notices under WB SGST rules."
    ],
    localTaxOffice: "Beliaghata Sales Tax Building, 14 Beliaghata Road, Kolkata, WB 700015",
    deliveryHub: "Kolkata Eastern Regional Desk",
    svgPath: "M 360 260 L 400 250 L 390 320 L 350 310 Z",
    mapPosition: { x: 375, y: 285 }
  },
  {
    id: "punjab",
    name: "Punjab",
    code: "03",
    capital: "Chandigarh",
    region: "North",
    ewayBillThresholdIntraState: "₹50,000",
    ewayBillExemptions: "Agriculture produce & food grains exempted from e-Way bill.",
    professionalTaxRules: "Punjab Development Tax (PDT): ₹200/month flat for taxable income earners.",
    ptReturnDeadline: "Quarterly PDT return filed electronically by end of month following quarter.",
    keyComplianceNuances: [
      "Textile & sports goods export GST refund & LUT filing in Ludhiana & Jalandhar.",
      "PDT (Punjab Development Tax) monthly deduction & quarterly return compliance.",
      "Mandatory e-Invoicing for auto-parts manufacturing SMEs."
    ],
    localTaxOffice: "Excise & Taxation Bhawan, Sector 17, Chandigarh 160017",
    deliveryHub: "Ludhiana & Mohali Tech Desk",
    svgPath: "M 220 120 L 250 110 L 250 150 L 220 150 Z",
    mapPosition: { x: 235, y: 130 }
  },
  {
    id: "kerala",
    name: "Kerala",
    code: "32",
    capital: "Thiruvananthapuram",
    region: "South",
    ewayBillThresholdIntraState: "₹50,000",
    ewayBillExemptions: "Exempted for spices & plantation produce transport within district.",
    professionalTaxRules: "Half-yearly municipal PT collected by Panchayats/Corporations (up to ₹1,250/half-year).",
    ptReturnDeadline: "Half-yearly return due August 31 & February 28.",
    keyComplianceNuances: [
      "Cochin Port SEZ export IGST refund filing & spice export LUT compliance.",
      "Flood Cess audit reconciliation for historic returns (2019-2021).",
      "Kochi Infopark SaaS & IT services export GST advisory."
    ],
    localTaxOffice: "Tax Towers, Karamana, Thiruvananthapuram, Kerala 695002",
    deliveryHub: "Kochi Infopark & Commercial Desk",
    svgPath: "M 220 540 L 240 540 L 230 610 L 210 590 Z",
    mapPosition: { x: 225, y: 570 }
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    code: "08",
    capital: "Jaipur",
    region: "North",
    ewayBillThresholdIntraState: "₹50,000",
    ewayBillExemptions: "Exempted for handicraft, marble, and gems job-work under specified limits.",
    professionalTaxRules: "Nil (No Professional Tax in Rajasthan).",
    ptReturnDeadline: "N/A - Exempt",
    keyComplianceNuances: [
      "Jaipur SEZ gems & jewelry export GST refund speed-desk.",
      "Solar power plant equipment & EPC project GST rate reconciliation.",
      "Mining & marble industry Section 129 e-Way Bill inspection defense."
    ],
    localTaxOffice: "Kar Bhawan, Ambedkar Circle, Jaipur, Rajasthan 302005",
    deliveryHub: "Jaipur & NCR Expansion Desk",
    svgPath: "M 160 190 L 230 180 L 230 260 L 150 250 Z",
    mapPosition: { x: 190, y: 220 }
  }
];
