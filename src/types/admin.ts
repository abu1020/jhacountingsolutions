/**
 * Admin data contracts — mirrors the shapes returned by
 * `getInquiries()`, `getScopeAssessments()`, and `getAccessRequests()`.
 */

export const ALLOWED_ADMIN_EMAILS = [
  'abu01510866@gmail.com',
  'ramkj1804@gmail.com'
] as const;

export const isAuthorizedAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase().trim() as any);
};

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
  businessType?: string;
  turnoverBand?: string;
  gstStateCount?: string | number;
  employeeCount?: string | number;
}

export interface AccessRequestItem {
  id: string;
  uid?: string;
  email: string;
  softwareId?: string;
  softwareName: string;
  createdAt: string;
  status?: string;
}

export interface UnifiedFormSubmission {
  id: string;
  formType: 'Consultation Inquiry' | 'Scope Assessment' | 'Software Access Request';
  primaryName: string;
  company?: string;
  email: string;
  phone?: string;
  serviceOrItem: string;
  details?: string;
  createdAt: string;
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
