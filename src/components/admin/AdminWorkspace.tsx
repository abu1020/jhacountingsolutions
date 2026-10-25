import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard, KanbanSquare, Database, Users, UserPlus, FileText,
  KeyRound, CalendarCheck2, CalendarDays, Search, RefreshCw, X, LogOut, Menu,
  CloudUpload, HardDrive, Sparkles, ArrowLeft, CheckCircle2
} from 'lucide-react';
import type { User } from 'firebase/auth';
import {
  LeadInquiry, ScopeAssessment, UnifiedRecord, CrmMeta
} from '../../types/admin';
import {
  buildUnifiedRecords, createMetaStore, getMeta, type MetaMap
} from '../../lib/crm';
import {
  getAllClientUsers, getAccessRequests, updateAccessRequestStatus,
  type ClientUserRecord, type AccessRequestRecord
} from '../../lib/firebase';
import { getInquiries, getScopeAssessments } from '../../lib/firebase';
import { getDemoCrmData } from '../../data/demoCrm';
import { OverviewView } from './OverviewView';
import { RecordsTable } from './RecordsTable';
import { PipelineBoard } from './PipelineBoard';
import { TasksView, AccessRequestsView } from './AdminQueues';
import { ClientDetailDrawer } from './ClientDetailDrawer';
import { ComplianceView } from './ComplianceView';
import { crossfadePanel, springPill } from '../../lib/motion';

export type AdminView = 'overview' | 'pipeline' | 'records' | 'clients' | 'leads' | 'assessments' | 'access' | 'tasks' | 'compliance';

interface AdminWorkspaceProps {
  currentUser: User | null;
  authMode: 'google' | 'passcode';
  onClose: () => void;
  onLogout: () => void;
}

const VIEW_TITLES: Record<AdminView, { title: string; sub: string }> = {
  overview: { title: 'Overview', sub: 'Practice health at a glance' },
  pipeline: { title: 'Pipeline', sub: 'Drag cards to move stages' },
  records: { title: 'All Records', sub: 'Every client, lead & request in one grid' },
  clients: { title: 'Clients', sub: 'Registered portal accounts' },
  leads: { title: 'Leads', sub: 'Consultation inquiries from the website' },
  assessments: { title: 'Assessments', sub: 'Detailed scope submissions' },
  access: { title: 'Access Requests', sub: 'Software unlock approvals' },
  tasks: { title: 'Tasks & Follow-ups', sub: 'What needs attention today' },
  compliance: { title: 'Compliance Dates', sub: 'Statutory calendar — GST · TDS · Advance Tax' }
};

/**
 * JAS Client Management System — full-screen admin workspace.
 * Replaces the old two-tab modal body after login. Source data comes
 * from Firestore collections; all management state (status, priority,
 * tags, notes, follow-ups) lives in the CRM meta overlay (src/lib/crm).
 */
export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({ currentUser, authMode, onClose, onLogout }) => {
  const [view, setView] = useState<AdminView>('overview');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const autoDemoChecked = useRef(false);
  const [raw, setRaw] = useState<{ users: ClientUserRecord[]; inquiries: LeadInquiry[]; assessments: ScopeAssessment[]; accessRequests: AccessRequestRecord[] }>({
    users: [], inquiries: [], assessments: [], accessRequests: []
  });
  const [metaMap, setMetaMap] = useState<MetaMap>({});
  const [accessOverrides, setAccessOverrides] = useState<Record<string, string>>({});
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [cloudSynced, setCloudSynced] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const signedIn = !!currentUser;
  const authorName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Admin (passcode)';
  const metaStore = useMemo(() => createMetaStore(signedIn, demoMode), [signedIn, demoMode]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [users, inquiries, assessments, accessRequests] = await Promise.all([
        getAllClientUsers(), getInquiries(), getScopeAssessments(), getAccessRequests()
      ]);
      setRaw({ users, inquiries, assessments, accessRequests });
    } catch (err) {
      console.error('Admin workspace fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Lock body scroll while the workspace owns the screen.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Load CRM meta (seed demo bucket on first demo entry).
  useEffect(() => {
    let cancelled = false;
    metaStore.load().then(loaded => {
      if (cancelled) return;
      if (demoMode && Object.keys(loaded).length === 0) {
        const { meta } = getDemoCrmData();
        setMetaMap(meta);
        Object.entries(meta).forEach(([key, m]) => { metaStore.save(key, m); });
      } else {
        setMetaMap(loaded);
      }
      setCloudSynced(metaStore.syncedToCloud);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode, signedIn]);

  const demoData = useMemo(() => getDemoCrmData(), []);
  const realRecords = useMemo(() => buildUnifiedRecords(raw), [raw]);

  // First-run experience: empty database → showcase with demo data (badge stays visible).
  useEffect(() => {
    if (!isLoading && !autoDemoChecked.current) {
      autoDemoChecked.current = true;
      if (realRecords.length === 0) setDemoMode(true);
    }
  }, [isLoading, realRecords.length]);

  const records = useMemo(() => {
    const base = demoMode ? demoData.records : realRecords;
    return base.map(r => (accessOverrides[r.key] ? { ...r, requestStatus: accessOverrides[r.key] } : r));
  }, [demoMode, demoData.records, realRecords, accessOverrides]);

  const counts = useMemo(() => ({
    all: records.length,
    clients: records.filter(r => r.source === 'client').length,
    leads: records.filter(r => r.source === 'inquiry').length,
    assessments: records.filter(r => r.source === 'assessment').length,
    access: records.filter(r => r.source === 'access' && (r.requestStatus || 'pending') === 'pending').length,
    tasks: records.filter(r => {
      const m = getMeta(metaMap, r);
      return m.followUpDate && m.status !== 'lost' && m.status !== 'onboarded';
    }).length
  }), [records, metaMap]);

  const updateMeta = (key: string, patch: Partial<CrmMeta>) => {
    setMetaMap(prev => {
      const record = records.find(r => r.key === key);
      const current = record ? getMeta(prev, record) : (prev[key] ?? { status: 'new', priority: 'medium', tags: [], notes: [], updatedAt: '' } as CrmMeta);
      const next: CrmMeta = { ...current, ...patch, updatedAt: new Date().toISOString() };
      metaStore.save(key, next).then(synced => { if (synced) setCloudSynced(true); });
      return { ...prev, [key]: next };
    });
  };

  const reviewAccess = async (record: UnifiedRecord, decision: 'approved' | 'rejected') => {
    setAccessOverrides(prev => ({ ...prev, [record.key]: decision }));
    const meta = getMeta(metaMap, record);
    updateMeta(record.key, {
      status: decision === 'approved' ? 'onboarded' : 'lost',
      notes: [
        { id: `note-${Date.now()}`, text: `Software access ${decision}: ${record.softwareName || record.service}`, author: authorName, createdAt: new Date().toISOString() },
        ...meta.notes
      ]
    });
    if (!demoMode && signedIn) {
      const ok = await updateAccessRequestStatus(record.id, decision);
      showToast(ok ? `Request ${decision} & saved to Firestore` : `Marked ${decision} locally (cloud write needs rules deploy)`);
    } else {
      showToast(`Request ${decision}${demoMode ? ' (demo)' : ' (local — sign in with Google to sync)'}`);
    }
  };

  // Keyboard: '/' or ⌘K focuses search; Escape closes drawer.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = /INPUT|TEXTAREA|SELECT/.test(target.tagName) || target.isContentEditable;
      if (e.key === 'Escape' && selectedKey) { setSelectedKey(null); return; }
      if (!typing && (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'))) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selectedKey]);

  const navItems: { id: AdminView; label: string; icon: React.ElementType; count?: number; alert?: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline', icon: KanbanSquare, count: counts.all },
    { id: 'records', label: 'All Records', icon: Database, count: counts.all },
    { id: 'clients', label: 'Clients', icon: Users, count: counts.clients },
    { id: 'leads', label: 'Leads', icon: UserPlus, count: counts.leads },
    { id: 'assessments', label: 'Assessments', icon: FileText, count: counts.assessments },
    { id: 'access', label: 'Access Requests', icon: KeyRound, count: counts.access, alert: counts.access > 0 },
    { id: 'tasks', label: 'Tasks & Follow-ups', icon: CalendarCheck2, count: counts.tasks, alert: counts.tasks > 0 },
    { id: 'compliance', label: 'Compliance Dates', icon: CalendarDays }
  ];

  const selectedRecord = selectedKey ? records.find(r => r.key === selectedKey) ?? null : null;

  const renderNav = () => (
    <nav aria-label="Admin workspace" className="space-y-1 font-mono text-xs">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = view === item.id;
        return (
          <button key={item.id} type="button" aria-current={isActive ? 'page' : undefined}
            onClick={() => { setView(item.id); setMobileNavOpen(false); }}
            className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-colors cursor-pointer ${isActive ? 'text-white' : 'text-slate-300 hover:bg-navy-700 hover:text-white'}`}>
            {isActive && <motion.span layoutId="admin-nav-pill" transition={springPill} className="absolute inset-0 bg-corporate-emerald rounded-xl" aria-hidden="true" />}
            <span className="relative z-10 flex items-center gap-3 flex-1 min-w-0">
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </span>
            {item.count !== undefined && (
              <span className={`relative z-10 text-[10px] tabular-nums px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : item.alert ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30' : 'bg-navy-700 text-slate-300'}`}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  const sidebarFooter = (
    <div className="space-y-3">
      <div className={`rounded-2xl border p-3.5 ${cloudSynced && !demoMode ? 'border-corporate-emerald/30 bg-corporate-emerald/[0.06]' : 'border-navy-600 bg-navy-800/70'}`}>
        <p className="flex items-center gap-2 text-[11px] font-mono font-bold text-white">
          {cloudSynced && !demoMode ? <CloudUpload className="w-3.5 h-3.5 text-corporate-emerald" aria-hidden="true" /> : <HardDrive className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />}
          {demoMode ? 'Demo workspace' : cloudSynced ? 'Synced to Firestore' : 'Local mode'}
        </p>
        <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
          {demoMode
            ? 'Sample clients for evaluation. Edits stay in this browser.'
            : cloudSynced
              ? 'Statuses, notes & follow-ups sync to the crmMeta collection.'
              : 'Passcode login saves CRM data in this browser only. Sign in with Google to sync to Firestore.'}
        </p>
        <button type="button" role="switch" aria-checked={demoMode} onClick={() => setDemoMode(d => !d)}
          className="mt-3 w-full flex items-center justify-between rounded-xl bg-navy-900 border border-navy-600 px-3 py-2 cursor-pointer">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-200"><Sparkles className="w-3.5 h-3.5 text-fuchsia-300" aria-hidden="true" /> Demo data</span>
          <span className={`w-9 h-5 rounded-full p-0.5 transition-colors ${demoMode ? 'bg-fuchsia-500/80' : 'bg-navy-600'}`}>
            <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${demoMode ? 'translate-x-4' : ''}`} />
          </span>
        </button>
      </div>
      <div className="flex items-center gap-2.5 px-1">
        <span className="w-8 h-8 rounded-full bg-corporate-emerald/15 border border-corporate-emerald/40 text-corporate-emerald text-[11px] font-bold font-mono flex items-center justify-center shrink-0">
          {(currentUser?.displayName || currentUser?.email || 'A')[0].toUpperCase()}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[11px] font-bold text-white truncate">{authorName}</span>
          <span className="block text-[10px] font-mono text-slate-500 truncate">{authMode === 'google' ? currentUser?.email : 'Passcode session'}</span>
        </span>
        <button type="button" onClick={onLogout} aria-label="Log out" className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"><LogOut className="w-4 h-4" /></button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-navy-950 text-slate-100 flex font-sans" role="region" aria-label="Client Management System">
      {/* Mobile nav scrim */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.button type="button" aria-label="Close menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileNavOpen(false)} className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-30 lg:hidden cursor-pointer" />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-[272px] shrink-0 bg-navy-850 border-r border-navy-600 p-5 flex flex-col justify-between gap-6 transition-transform duration-300 overflow-y-auto ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-navy-600">
            <span className="w-10 h-10 rounded-2xl bg-corporate-emerald/15 border border-corporate-emerald/40 text-corporate-emerald font-extrabold font-mono flex items-center justify-center shrink-0">JAS</span>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-white font-display leading-tight">Client Management</p>
              <p className="text-[10px] font-mono text-corporate-emerald">Jha Accounting Solutions</p>
            </div>
          </div>
          {renderNav()}
          <button type="button" onClick={onClose} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold text-slate-300 hover:bg-navy-700 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4 text-corporate-emerald" aria-hidden="true" /> Back to Website
          </button>
        </div>
        {sidebarFooter}
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-navy-850/95 backdrop-blur-md border-b border-navy-600 px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <button type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open menu" className="lg:hidden p-2 rounded-xl bg-navy-800 border border-navy-600 text-slate-300 cursor-pointer shrink-0"><Menu className="w-5 h-5" /></button>
          <div className="min-w-0 shrink-0">
            <h2 className="text-base sm:text-lg font-extrabold text-white font-display leading-tight flex items-center gap-2">
              {VIEW_TITLES[view].title}
              {demoMode && <span className="text-[9px] font-mono font-bold text-fuchsia-300 bg-fuchsia-400/10 border border-fuchsia-400/30 px-2 py-0.5 rounded-md">DEMO</span>}
            </h2>
            <p className="text-[11px] font-mono text-slate-500 hidden sm:block">{VIEW_TITLES[view].sub}</p>
          </div>
          <div className="relative flex-1 max-w-md ml-auto">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            <input ref={searchRef} type="search" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search name, company, email, service…"
              aria-label="Search records"
              className="w-full bg-navy-900 border border-navy-600 rounded-xl pl-10 pr-12 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-corporate-emerald focus:ring-1 focus:ring-corporate-emerald" />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 border border-navy-600 rounded px-1.5 py-0.5 hidden sm:block">/</kbd>
          </div>
          <button type="button" onClick={fetchAll} aria-label="Refresh data" title="Refresh data"
            className="p-2.5 rounded-xl bg-navy-800 border border-navy-600 text-slate-300 hover:text-white cursor-pointer shrink-0">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-corporate-emerald' : ''}`} />
          </button>
          <button type="button" onClick={onClose} aria-label="Close admin workspace" className="p-2.5 rounded-xl bg-navy-800 border border-navy-600 text-slate-300 hover:text-white cursor-pointer shrink-0"><X className="w-4 h-4" /></button>
        </header>

        <main className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`${view}-${demoMode}`} variants={crossfadePanel} initial="hidden" animate="visible" exit="exit">
              {view === 'overview' && <OverviewView records={records} metaMap={metaMap} onOpenRecord={r => setSelectedKey(r.key)} onNavigate={setView} />}
              {view === 'pipeline' && <PipelineBoard records={records} metaMap={metaMap} query={query} onOpenRecord={r => setSelectedKey(r.key)} onUpdateMeta={updateMeta} />}
              {view === 'records' && <RecordsTable title="All Records" records={records} metaMap={metaMap} query={query} showSourceFilter isLoading={isLoading && !demoMode} onOpenRecord={r => setSelectedKey(r.key)} onUpdateMeta={updateMeta} onClearQuery={() => setQuery('')} />}
              {view === 'clients' && <RecordsTable title="Clients" records={records.filter(r => r.source === 'client')} metaMap={metaMap} query={query} isLoading={isLoading && !demoMode} onOpenRecord={r => setSelectedKey(r.key)} onUpdateMeta={updateMeta} onClearQuery={() => setQuery('')} />}
              {view === 'leads' && <RecordsTable title="Leads" records={records.filter(r => r.source === 'inquiry')} metaMap={metaMap} query={query} isLoading={isLoading && !demoMode} onOpenRecord={r => setSelectedKey(r.key)} onUpdateMeta={updateMeta} onClearQuery={() => setQuery('')} />}
              {view === 'assessments' && <RecordsTable title="Assessments" records={records.filter(r => r.source === 'assessment')} metaMap={metaMap} query={query} isLoading={isLoading && !demoMode} onOpenRecord={r => setSelectedKey(r.key)} onUpdateMeta={updateMeta} onClearQuery={() => setQuery('')} />}
              {view === 'access' && <AccessRequestsView records={records} metaMap={metaMap} onOpenRecord={r => setSelectedKey(r.key)} onUpdateMeta={updateMeta} onReviewAccess={reviewAccess} />}
              {view === 'tasks' && <TasksView records={records} metaMap={metaMap} onOpenRecord={r => setSelectedKey(r.key)} onUpdateMeta={updateMeta} />}
              {view === 'compliance' && <ComplianceView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedRecord && (
          <ClientDetailDrawer
            key={selectedRecord.key}
            record={selectedRecord}
            meta={getMeta(metaMap, selectedRecord)}
            authorName={authorName}
            onClose={() => setSelectedKey(null)}
            onUpdateMeta={updateMeta}
            onReviewAccess={reviewAccess}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}
            role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 bg-navy-800 border border-corporate-emerald/40 text-white text-xs font-mono font-bold px-4 py-3 rounded-2xl shadow-2xl">
            <CheckCircle2 className="w-4 h-4 text-corporate-emerald" aria-hidden="true" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
