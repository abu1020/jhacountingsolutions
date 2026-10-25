/**
 * Admin data contracts — mirrors the shapes returned by
 * `getInquiries()` / `getScopeAssessments()` in src/lib/firebase.ts.
 *
 * These replace `any[]` in the Admin Portal. Typing them immediately
 * surfaced a real schema drift: the Assessments tab was rendering
 * `businessType` / `turnoverBand` / `gstStateCount` / `employeeCount`,
 * none of which exist on the Firestore document (which stores
 * `entityType` / `annualTurnover`). With `any`, every real record
 * silently fell back to placeholder text ("Pvt Ltd", "Unspecified").
 * Optional legacy aliases are kept so older documents still render.
 */

export interface LeadInquiry {
  id: string;
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  service: string;
  city?: string;
  message?: string;
  createdAt: string;
}

export interface ScopeAssessment {
  id: string;
  contactName: string;
  companyName?: string;
  contactEmail: string;
  contactPhone: string;
  selectedService: string;
  entityType?: string;
  annualTurnover?: string;
  preferredCity?: string;
  notes?: string;
  createdAt: string;
  // Legacy aliases present on some older documents / earlier UI code
  businessType?: string;
  turnoverBand?: string;
  gstStateCount?: string | number;
  employeeCount?: string | number;
}

/** Normalised accessors — one place absorbs the schema drift. */
export const assessmentEntityType = (a: ScopeAssessment): string =>
  a.entityType || a.businessType || 'Pvt Ltd';

export const assessmentTurnover = (a: ScopeAssessment): string =>
  a.annualTurnover || a.turnoverBand || 'Unspecified';

/** Safe date descending sort key (unknown dates sort last). */
export const createdAtTime = (createdAt?: string): number => {
  if (!createdAt) return 0;
  const t = new Date(createdAt).getTime();
  return Number.isNaN(t) ? 0 : t;
};

export const formatCreatedAt = (createdAt?: string): string => {
  if (!createdAt) return 'Recent';
  const d = new Date(createdAt);
  return Number.isNaN(d.getTime()) ? 'Recent' : d.toLocaleString('en-IN');
};

// ---------------------------------------------------------------------------
// Client Management System (CRM) domain model
//
// Firestore source collections (inquiries, scopeAssessments, users,
// accessRequests) stay as the system of record. Everything the admin
// *manages* — pipeline status, priority, tags, notes, follow-ups —
// lives in a CRM metadata overlay keyed by `${source}:${id}` so the
// original submissions are never mutated.
// ---------------------------------------------------------------------------

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'quoted'
  | 'negotiation'
  | 'onboarded'
  | 'lost';

export const LEAD_STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'quoted',
  'negotiation',
  'onboarded',
  'lost'
];

export interface StatusMeta {
  label: string;
  /** Tailwind classes for chips (text/bg/border). */
  chip: string;
  /** Hex used by charts/SVG. */
  color: string;
}

export const STATUS_META: Record<LeadStatus, StatusMeta> = {
  new:         { label: 'New',         chip: 'text-sky-400 bg-sky-400/10 border-sky-400/30',          color: '#38BDF8' },
  contacted:   { label: 'Contacted',   chip: 'text-indigo-300 bg-indigo-400/10 border-indigo-400/30', color: '#818CF8' },
  qualified:   { label: 'Qualified',   chip: 'text-violet-300 bg-violet-400/10 border-violet-400/30', color: '#A78BFA' },
  quoted:      { label: 'Quoted',      chip: 'text-amber-400 bg-amber-400/10 border-amber-400/30',    color: '#FBBF24' },
  negotiation: { label: 'Negotiation', chip: 'text-orange-400 bg-orange-400/10 border-orange-400/30', color: '#FB923C' },
  onboarded:   { label: 'Onboarded',   chip: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30', color: '#10B981' },
  lost:        { label: 'Lost',        chip: 'text-rose-400 bg-rose-400/10 border-rose-400/30',       color: '#FB7185' }
};

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent'];

export const PRIORITY_META: Record<Priority, { label: string; dot: string }> = {
  low:    { label: 'Low',    dot: 'bg-slate-400' },
  medium: { label: 'Medium', dot: 'bg-sky-400' },
  high:   { label: 'High',   dot: 'bg-amber-400' },
  urgent: { label: 'Urgent', dot: 'bg-rose-500' }
};

export interface CrmNote {
  id: string;
  text: string;
  author: string;
  createdAt: string; // ISO
}

export interface CrmMeta {
  status: LeadStatus;
  priority: Priority;
  owner?: string;
  tags: string[];
  notes: CrmNote[];
  followUpDate?: string; // ISO date (yyyy-mm-dd) or ''
  lastContactedAt?: string; // ISO
  updatedAt: string; // ISO
}

export const defaultCrmMeta = (status: LeadStatus = 'new'): CrmMeta => ({
  status,
  priority: 'medium',
  tags: [],
  notes: [],
  updatedAt: new Date().toISOString()
});

export type RecordSource = 'client' | 'inquiry' | 'assessment' | 'access';

export const SOURCE_META: Record<RecordSource, { label: string; plural: string; chip: string }> = {
  client:     { label: 'Client',     plural: 'Clients',          chip: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
  inquiry:    { label: 'Lead',       plural: 'Leads',            chip: 'text-sky-400 bg-sky-400/10 border-sky-400/30' },
  assessment: { label: 'Assessment', plural: 'Assessments',      chip: 'text-violet-300 bg-violet-400/10 border-violet-400/30' },
  access:     { label: 'Access Req', plural: 'Access Requests',  chip: 'text-amber-400 bg-amber-400/10 border-amber-400/30' }
};

/** One flattened row the whole workspace (table, board, drawer) renders. */
export interface UnifiedRecord {
  /** `${source}:${id}` — also the CRM meta key. */
  key: string;
  source: RecordSource;
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  city: string;
  createdAt: string;
  /** Source-specific labelled facts shown in the detail drawer. */
  details: { label: string; value: string }[];
  message?: string;
  /** Client accounts only. */
  plan?: string;
  unlockedSoftware?: string[];
  onboardingComplete?: boolean;
  /** Access requests only. */
  requestStatus?: string;
  softwareName?: string;
  clientUid?: string;
  isDemo?: boolean;
}
