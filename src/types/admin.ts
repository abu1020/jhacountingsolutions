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
