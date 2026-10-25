import {
  LeadInquiry,
  ScopeAssessment,
  UnifiedRecord,
  CrmMeta,
  LeadStatus,
  defaultCrmMeta,
  assessmentEntityType,
  assessmentTurnover
} from '../types/admin';
import type { ClientUserRecord, AccessRequestRecord } from './firebase';
import { db } from './firebase';

/**
 * CRM engine for the Admin Workspace.
 *
 * 1. `buildUnifiedRecords` flattens the four Firestore collections into
 *    one row shape the table / pipeline board / drawer all render.
 * 2. The meta store persists pipeline status, priority, tags, notes and
 *    follow-ups. LocalStorage is the instant, always-available layer
 *    (works in passcode mode); when a Google admin is signed in, every
 *    change also syncs to the `crmMeta` Firestore collection and cloud
 *    values win on load by `updatedAt`.
 */

const LOCAL_META_KEY = 'jas-crm-meta-v1';
const DEMO_META_KEY = 'jas-crm-meta-demo-v1';

// ---------------------------------------------------------------------------
// Record building
// ---------------------------------------------------------------------------

export function buildUnifiedRecords(input: {
  users: ClientUserRecord[];
  inquiries: LeadInquiry[];
  assessments: ScopeAssessment[];
  accessRequests: AccessRequestRecord[];
}): UnifiedRecord[] {
  const records: UnifiedRecord[] = [];

  for (const u of input.users) {
    const name = u.name || u.displayName || 'Unnamed Client';
    records.push({
      key: `client:${u.uid}`,
      source: 'client',
      id: u.uid,
      name,
      company: u.company || '—',
      email: u.email || '',
      phone: u.phone || '',
      service: u.desiredService || (u.requirements?.[0] ?? 'Client Account'),
      city: '',
      createdAt: u.createdAt || '',
      plan: u.plan || 'Standard',
      unlockedSoftware: u.unlockedSoftware || [],
      onboardingComplete: !!(u.onboardingComplete ?? u.onboardingCompleted),
      clientUid: u.uid,
      message: u.notes,
      details: [
        { label: 'Plan', value: u.plan || 'Standard' },
        { label: 'Onboarding', value: (u.onboardingComplete ?? u.onboardingCompleted) ? 'Complete' : 'Incomplete' },
        { label: 'Software Unlocked', value: (u.unlockedSoftware || []).join(', ') || 'None' },
        { label: 'Requirements', value: (u.requirements || []).join(' · ') || '—' }
      ]
    });
  }

  for (const i of input.inquiries) {
    records.push({
      key: `inquiry:${i.id}`,
      source: 'inquiry',
      id: i.id,
      name: i.fullName || 'Anonymous Lead',
      company: i.company || '—',
      email: i.email || '',
      phone: i.phone || '',
      service: i.service || 'General Consultation',
      city: i.city || '',
      createdAt: i.createdAt || '',
      message: i.message,
      details: [
        { label: 'Company / Stage', value: i.company || '—' },
        { label: 'City', value: i.city || '—' }
      ]
    });
  }

  for (const a of input.assessments) {
    records.push({
      key: `assessment:${a.id}`,
      source: 'assessment',
      id: a.id,
      name: a.contactName || 'Assessment Contact',
      company: a.companyName || '—',
      email: a.contactEmail || '',
      phone: a.contactPhone || '',
      service: a.selectedService || 'Scope Assessment',
      city: a.preferredCity || '',
      createdAt: a.createdAt || '',
      message: a.notes,
      details: [
        { label: 'Entity Type', value: assessmentEntityType(a) },
        { label: 'Annual Turnover', value: assessmentTurnover(a) },
        { label: 'GST States', value: a.gstStateCount ? String(a.gstStateCount) : '—' },
        { label: 'Employees', value: a.employeeCount ? String(a.employeeCount) : '—' },
        { label: 'Preferred City', value: a.preferredCity || '—' }
      ]
    });
  }

  const userByUid = new Map(input.users.map(u => [u.uid, u]));
  for (const r of input.accessRequests) {
    const owner = userByUid.get(r.uid);
    records.push({
      key: `access:${r.id}`,
      source: 'access',
      id: r.id,
      name: owner?.name || owner?.displayName || r.email || 'Software Request',
      company: owner?.company || '—',
      email: r.email || owner?.email || '',
      phone: owner?.phone || '',
      service: `Unlock: ${r.softwareName}`,
      city: '',
      createdAt: r.createdAt || '',
      requestStatus: r.status || 'pending',
      softwareName: r.softwareName,
      clientUid: r.uid,
      details: [
        { label: 'Software', value: r.softwareName },
        { label: 'Software ID', value: r.softwareId },
        { label: 'Request Status', value: r.status || 'pending' }
      ]
    });
  }

  return records.sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
}

/** Sensible starting status before any meta exists. */
export function defaultStatusFor(record: UnifiedRecord): LeadStatus {
  if (record.source === 'client') return 'onboarded';
  return 'new';
}

// ---------------------------------------------------------------------------
// Meta store (local-first, cloud-synced when signed in)
// ---------------------------------------------------------------------------

export type MetaMap = Record<string, CrmMeta>;

function readLocal(storageKey: string): MetaMap {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as MetaMap) : {};
  } catch {
    return {};
  }
}

function writeLocal(storageKey: string, map: MetaMap): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(map));
  } catch {
    // Storage full / private mode — CRM still works for the session.
  }
}

export interface MetaStore {
  load: () => Promise<MetaMap>;
  save: (key: string, meta: CrmMeta) => Promise<boolean>; // true if cloud-synced
  syncedToCloud: boolean;
}

export function createMetaStore(isSignedIn: boolean, demoMode: boolean): MetaStore {
  const storageKey = demoMode ? DEMO_META_KEY : LOCAL_META_KEY;

  return {
    syncedToCloud: isSignedIn && !demoMode,

    load: async () => {
      const local = readLocal(storageKey);
      if (!isSignedIn || demoMode) return local;
      try {
        const { getDocs, collection } = await import('firebase/firestore');
        const snap = await getDocs(collection(db, 'crmMeta'));
        const merged: MetaMap = { ...local };
        snap.forEach(docSnap => {
          const cloud = docSnap.data() as CrmMeta & { recordKey?: string };
          const key = cloud.recordKey || docSnap.id.replace(/__/, ':');
          const existing = merged[key];
          if (!existing || (cloud.updatedAt || '') >= (existing.updatedAt || '')) {
            merged[key] = cloud;
          }
        });
        writeLocal(storageKey, merged);
        return merged;
      } catch {
        return local; // Offline / rules not yet deployed — local layer keeps working.
      }
    },

    save: async (key, meta) => {
      const map = readLocal(storageKey);
      map[key] = meta;
      writeLocal(storageKey, map);

      if (!isSignedIn || demoMode) return false;
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        // Firestore doc ids cannot contain ':' safely in paths — encode once.
        await setDoc(doc(db, 'crmMeta', key.replace(/:/, '__')), { ...meta, recordKey: key });
        return true;
      } catch {
        return false;
      }
    }
  };
}

export function getMeta(map: MetaMap, record: UnifiedRecord): CrmMeta {
  return map[record.key] ?? defaultCrmMeta(defaultStatusFor(record));
}

// ---------------------------------------------------------------------------
// Presentation helpers
// ---------------------------------------------------------------------------

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]!.toUpperCase())
    .join('') || '?';
}

export function relativeTime(iso?: string): string {
  if (!iso) return '—';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export type FollowUpState = 'none' | 'overdue' | 'today' | 'upcoming';

export function followUpState(meta: CrmMeta): FollowUpState {
  if (!meta.followUpDate) return 'none';
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  if (meta.followUpDate < todayStr) return 'overdue';
  if (meta.followUpDate === todayStr) return 'today';
  return 'upcoming';
}

export function formatDateIN(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function whatsappLink(record: UnifiedRecord): string {
  const first = record.name.split(/\s+/)[0] || 'there';
  const text = encodeURIComponent(
    `Hi ${first}, this is Jha Accounting Solutions regarding your enquiry about ${record.service}. How can we help you today?`
  );
  const digits = record.phone.replace(/\D/g, '');
  const target = digits.length >= 10 ? digits : '918882860226';
  return `https://wa.me/${target}?text=${text}`;
}

export function exportRecordsCSV(records: UnifiedRecord[], metaMap: MetaMap, filename: string): void {
  const headers = ['Name', 'Company', 'Email', 'Phone', 'Service', 'City', 'Source', 'Status', 'Priority', 'Tags', 'Follow-up', 'Created'];
  const rows = records.map(r => {
    const m = getMeta(metaMap, r);
    return [
      r.name, r.company, r.email, r.phone, r.service, r.city, r.source,
      m.status, m.priority, m.tags.join(' | '), m.followUpDate || '', r.createdAt
    ];
  });
  const csv = [headers.join(','), ...rows.map(row => row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
