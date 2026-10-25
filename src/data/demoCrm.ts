import { UnifiedRecord, CrmMeta, LeadStatus, Priority } from '../types/admin';
import type { MetaMap } from '../lib/crm';

/**
 * Presentation-only sample workspace ("Demo mode").
 * Dates are computed relative to *today* so KPIs, charts and follow-up
 * states always look alive. Nothing here is written to Firestore;
 * edits persist to a demo-only localStorage bucket.
 */

const daysAgo = (d: number, h = 10): string => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  t.setHours(h, 15, 0, 0);
  return t.toISOString();
};

const inDays = (d: number): string => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
};

interface Seed {
  record: UnifiedRecord;
  status: LeadStatus;
  priority: Priority;
  tags?: string[];
  followUpInDays?: number;
  note?: string;
}

const seed = (s: Seed) => s;

const SEEDS: Seed[] = [
  seed({
    record: { key: 'inquiry:demo-1', source: 'inquiry', id: 'demo-1', name: 'Aarav Mehta', company: 'Northbeam Logistics Pvt Ltd', email: 'aarav@northbeam.in', phone: '+91 98110 44231', service: 'Multi-State GST Filing & ITC Reconciliation', city: 'New Delhi', createdAt: daysAgo(0, 9), message: 'We ship to 9 states and our GSTR-2B mismatches crossed ₹6L last quarter. Need urgent cleanup before the 20th.', details: [{ label: 'Company / Stage', value: 'SMB' }, { label: 'City', value: 'New Delhi' }], isDemo: true },
    status: 'new', priority: 'urgent', tags: ['GST', '2B Mismatch'], followUpInDays: 0
  }),
  seed({
    record: { key: 'assessment:demo-2', source: 'assessment', id: 'demo-2', name: 'Priya Nair', company: 'Kaveri Cloud Systems LLP', email: 'priya@kavericloud.com', phone: '+91 98861 90234', service: 'Virtual CFO Advisory & MIS Reports', city: 'Bengaluru', createdAt: daysAgo(1), message: 'Raising seed in Q1. Investors want monthly MIS + runway dashboard.', details: [{ label: 'Entity Type', value: 'LLP' }, { label: 'Annual Turnover', value: '₹2–5 Cr' }, { label: 'GST States', value: '2' }, { label: 'Employees', value: '38' }, { label: 'Preferred City', value: 'Bengaluru' }], isDemo: true },
    status: 'contacted', priority: 'high', tags: ['Virtual CFO', 'Startup'], followUpInDays: 1, note: 'Discovery call done. Send MIS sample pack + CFO pod pricing.'
  }),
  seed({
    record: { key: 'client:demo-3', source: 'client', id: 'demo-3', name: 'Rohan Sharma', company: 'Vanguard Retail India Pvt Ltd', email: 'rohan@vanguardretail.in', phone: '+91 99201 77845', service: 'Corporate Accounting & Bookkeeping', city: '', createdAt: daysAgo(64), plan: 'Corporate', unlockedSoftware: ['osflex'], onboardingComplete: true, clientUid: 'demo-3', details: [{ label: 'Plan', value: 'Corporate' }, { label: 'Onboarding', value: 'Complete' }, { label: 'Software Unlocked', value: 'osflex' }, { label: 'Requirements', value: 'GST · TDS · Payroll' }], isDemo: true },
    status: 'onboarded', priority: 'medium', tags: ['Retainer', 'Retail'], note: 'GSTR-3B filed on 18th. Q2 TDS 26Q draft shared for review.'
  }),
  seed({
    record: { key: 'inquiry:demo-4', source: 'inquiry', id: 'demo-4', name: 'Sneha Kulkarni', company: 'Aurelia D2C Brands', email: 'sneha@aurelia.shop', phone: '+91 98200 33120', service: 'B2B White-Label Accounting Outsourcing', city: 'Mumbai', createdAt: daysAgo(2), message: 'CA firm partner here — exploring white-label pods for 12 D2C clients.', details: [{ label: 'Company / Stage', value: 'Enterprise' }, { label: 'City', value: 'Mumbai' }], isDemo: true },
    status: 'quoted', priority: 'high', tags: ['B2B', 'White-Label'], followUpInDays: -1, note: 'Quote v2 sent (talkable band). Partner review meeting pending.'
  }),
  seed({
    record: { key: 'assessment:demo-5', source: 'assessment', id: 'demo-5', name: 'Imran Sheikh', company: 'Deccan Auto Components', email: 'imran@deccanauto.in', phone: '+91 98230 65471', service: 'TDS Compliance & Payroll Operations', city: 'Pune', createdAt: daysAgo(3), details: [{ label: 'Entity Type', value: 'Pvt Ltd' }, { label: 'Annual Turnover', value: '₹10–25 Cr' }, { label: 'GST States', value: '3' }, { label: 'Employees', value: '210' }, { label: 'Preferred City', value: 'Pune' }], isDemo: true },
    status: 'qualified', priority: 'medium', tags: ['Payroll', 'Manufacturing'], followUpInDays: 3
  }),
  seed({
    record: { key: 'client:demo-6', source: 'client', id: 'demo-6', name: 'Meera Iyer', company: 'Iyer & Cross Consulting', email: 'meera@iyercross.com', phone: '+91 98450 22198', service: 'TDS Compliance & Payroll Operations', city: '', createdAt: daysAgo(120), plan: 'Growth', unlockedSoftware: ['osflex', 'quickrooms'], onboardingComplete: true, clientUid: 'demo-6', details: [{ label: 'Plan', value: 'Growth' }, { label: 'Onboarding', value: 'Complete' }, { label: 'Software Unlocked', value: 'osflex, quickrooms' }, { label: 'Requirements', value: 'TDS · Payroll' }], isDemo: true },
    status: 'onboarded', priority: 'low', tags: ['Retainer'], note: 'Form 16/16A issued. Advance tax Q3 reminder scheduled.'
  }),
  seed({
    record: { key: 'access:demo-7', source: 'access', id: 'demo-7', name: 'Rohan Sharma', company: 'Vanguard Retail India Pvt Ltd', email: 'rohan@vanguardretail.in', phone: '+91 99201 77845', service: 'Unlock: QuickRooms', city: '', createdAt: daysAgo(0, 12), requestStatus: 'pending', softwareName: 'QuickRooms', clientUid: 'demo-3', details: [{ label: 'Software', value: 'QuickRooms' }, { label: 'Software ID', value: 'quickrooms' }, { label: 'Request Status', value: 'pending' }], isDemo: true },
    status: 'new', priority: 'medium', tags: ['Software']
  }),
  seed({
    record: { key: 'inquiry:demo-8', source: 'inquiry', id: 'demo-8', name: 'Vikram Singh', company: 'Himalaya Foods Export', email: 'vikram@himalayafoods.in', phone: '+91 94180 55213', service: 'Audit Support & Tax Scrutiny', city: 'Gurugram', createdAt: daysAgo(4), message: 'Received ASMT-10 notice for FY 2022-23 ITC difference. Need representation support.', details: [{ label: 'Company / Stage', value: 'SMB' }, { label: 'City', value: 'Gurugram' }], isDemo: true },
    status: 'negotiation', priority: 'urgent', tags: ['Notice', 'ASMT-10'], followUpInDays: 0, note: 'Draft reply ready. Awaiting client DSC for filing.'
  }),
  seed({
    record: { key: 'assessment:demo-9', source: 'assessment', id: 'demo-9', name: 'Ananya Desai', company: 'Lotus EdTech Pvt Ltd', email: 'ananya@lotusedtech.com', phone: '+91 90040 88127', service: 'Corporate Accounting & Bookkeeping', city: 'Mumbai', createdAt: daysAgo(6), details: [{ label: 'Entity Type', value: 'Pvt Ltd' }, { label: 'Annual Turnover', value: '₹1–2 Cr' }, { label: 'GST States', value: '1' }, { label: 'Employees', value: '24' }, { label: 'Preferred City', value: 'Mumbai' }], isDemo: true },
    status: 'contacted', priority: 'medium', tags: ['EdTech'], followUpInDays: 2
  }),
  seed({
    record: { key: 'inquiry:demo-10', source: 'inquiry', id: 'demo-10', name: 'Kunal Kapoor', company: 'KK Hospitality Group', email: 'kunal@kkhosp.in', phone: '+91 98185 11902', service: 'Multi-State GST Filing & ITC Reconciliation', city: 'New Delhi', createdAt: daysAgo(8), message: '4 hotel properties, 3 GSTINs. Current CA filing late every month.', details: [{ label: 'Company / Stage', value: 'SMB' }, { label: 'City', value: 'New Delhi' }], isDemo: true },
    status: 'lost', priority: 'low', tags: ['Hospitality'], note: 'Went with incumbent CA on price. Re-engage after FY close.'
  }),
  seed({
    record: { key: 'client:demo-11', source: 'client', id: 'demo-11', name: 'Farah Khan', company: 'Studio Farah Interiors', email: 'farah@studiofarah.design', phone: '+91 99300 45671', service: 'GST Registration & Monthly Filing', city: '', createdAt: daysAgo(5), plan: 'Starter', unlockedSoftware: ['osflex'], onboardingComplete: false, clientUid: 'demo-11', details: [{ label: 'Plan', value: 'Starter' }, { label: 'Onboarding', value: 'Incomplete' }, { label: 'Software Unlocked', value: 'osflex' }, { label: 'Requirements', value: 'GST Registration' }], isDemo: true },
    status: 'contacted', priority: 'high', tags: ['Onboarding'], followUpInDays: -2, note: 'KYC docs pending: PAN + address proof for GST REG-01.'
  }),
  seed({
    record: { key: 'inquiry:demo-12', source: 'inquiry', id: 'demo-12', name: 'Deepak Verma', company: 'Verma Textiles', email: 'deepak@vermatextiles.com', phone: '+91 94141 77654', service: 'White-Label CA Partnership', city: 'Jaipur', createdAt: daysAgo(10), details: [{ label: 'Company / Stage', value: 'SMB' }, { label: 'City', value: 'Jaipur' }], isDemo: true },
    status: 'qualified', priority: 'medium', tags: ['B2B'], followUpInDays: 5
  }),
  seed({
    record: { key: 'assessment:demo-13', source: 'assessment', id: 'demo-13', name: 'Lakshmi Prasad', company: 'GreenKart Organics', email: 'lakshmi@greenkart.in', phone: '+91 97030 44321', service: 'Multi-State GST Filing & ITC Reconciliation', city: 'Hyderabad', createdAt: daysAgo(12), details: [{ label: 'Entity Type', value: 'Pvt Ltd' }, { label: 'Annual Turnover', value: '₹5–10 Cr' }, { label: 'GST States', value: '6' }, { label: 'Employees', value: '57' }, { label: 'Preferred City', value: 'Hyderabad' }], isDemo: true },
    status: 'quoted', priority: 'high', tags: ['GST', 'E-commerce'], followUpInDays: 1
  }),
  seed({
    record: { key: 'access:demo-14', source: 'access', id: 'demo-14', name: 'Meera Iyer', company: 'Iyer & Cross Consulting', email: 'meera@iyercross.com', phone: '+91 98450 22198', service: 'Unlock: QuickRooms', city: '', createdAt: daysAgo(9), requestStatus: 'approved', softwareName: 'QuickRooms', clientUid: 'demo-6', details: [{ label: 'Software', value: 'QuickRooms' }, { label: 'Software ID', value: 'quickrooms' }, { label: 'Request Status', value: 'approved' }], isDemo: true },
    status: 'onboarded', priority: 'low', tags: ['Software']
  }),
  seed({
    record: { key: 'inquiry:demo-15', source: 'inquiry', id: 'demo-15', name: 'Arjun Patel', company: 'Patel Pharma Distributors', email: 'arjun@patelpharma.in', phone: '+91 98980 12345', service: 'Corporate Accounting & Bookkeeping', city: 'Ahmedabad', createdAt: daysAgo(13), details: [{ label: 'Company / Stage', value: 'SMB' }, { label: 'City', value: 'Ahmedabad' }], isDemo: true },
    status: 'new', priority: 'medium', tags: ['Pharma']
  })
];

export function getDemoCrmData(): { records: UnifiedRecord[]; meta: MetaMap } {
  const records = SEEDS.map(s => s.record);
  const meta: MetaMap = {};
  for (const s of SEEDS) {
    const m: CrmMeta = {
      status: s.status,
      priority: s.priority,
      owner: 'Rishi Jha',
      tags: s.tags || [],
      notes: s.note
        ? [{ id: `note-${s.record.id}`, text: s.note, author: 'Rishi Jha', createdAt: daysAgo(0, 8) }]
        : [],
      followUpDate: s.followUpInDays !== undefined ? inDays(s.followUpInDays) : '',
      updatedAt: new Date().toISOString()
    };
    meta[s.record.key] = m;
  }
  return { records, meta };
}
