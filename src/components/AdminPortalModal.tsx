import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Search,
  Users,
  FileText,
  KeyRound,
  Download,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  Layers,
  Clock,
  LogOut,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  auth,
  signInWithGoogle,
  logOutUser,
  getInquiries,
  getScopeAssessments,
  getAccessRequests
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  LeadInquiry,
  ScopeAssessment,
  AccessRequestItem,
  UnifiedFormSubmission,
  ALLOWED_ADMIN_EMAILS,
  isAuthorizedAdmin,
  formatCreatedAt,
  createdAtTime,
  assessmentEntityType,
  assessmentTurnover
} from '../types/admin';
import { useDialog } from '../hooks/useDialog';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string>('');
  
  // CMS View State
  const [activeTab, setActiveTab] = useState<'all' | 'inquiries' | 'assessments' | 'access'>('all');
  const [inquiries, setInquiries] = useState<LeadInquiry[]>([]);
  const [assessments, setAssessments] = useState<ScopeAssessment[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequestItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<UnifiedFormSubmission | null>(null);

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        if (isAuthorizedAdmin(user.email)) {
          setAuthError('');
        } else {
          // Non-whitelisted user logged in — reject admin access
          setAuthError(
            `Access Denied: The Google account "${user.email}" is not authorized for Admin CMS access. Only allowed administrators (${ALLOWED_ADMIN_EMAILS.join(', ')}) can log in.`
          );
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const isAdminAuthenticated = useMemo(() => {
    if (!currentUser) return false;
    return isAuthorizedAdmin(currentUser.email);
  }, [currentUser]);

  // Fetch all application form submissions from Firestore
  const fetchAllData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [inqData, scopeData, accessData] = await Promise.all([
        getInquiries(),
        getScopeAssessments(),
        getAccessRequests()
      ]);
      setInquiries(inqData.sort((a, b) => createdAtTime(b.createdAt) - createdAtTime(a.createdAt)));
      setAssessments(scopeData.sort((a, b) => createdAtTime(b.createdAt) - createdAtTime(a.createdAt)));
      setAccessRequests(accessData.sort((a, b) => createdAtTime(b.createdAt) - createdAtTime(a.createdAt)));
    } catch (err) {
      console.error('Admin CMS data fetch error:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && isAdminAuthenticated) {
      fetchAllData();
    }
  }, [isOpen, isAdminAuthenticated, fetchAllData]);

  useDialog(isOpen, onClose);

  // Google Sign-In with strict email whitelist
  const handleGoogleAdminLogin = async () => {
    setAuthError('');
    setIsSigningIn(true);
    try {
      const user = await signInWithGoogle();
      if (!user) {
        setIsSigningIn(false);
        return;
      }

      if (!isAuthorizedAdmin(user.email)) {
        await logOutUser();
        setAuthError(
          `Access Denied: The Google account "${user.email}" is not authorized for Admin CMS access. Only allowed administrators (${ALLOWED_ADMIN_EMAILS.join(', ')}) are permitted to log in.`
        );
      } else {
        setAuthError('');
        fetchAllData();
      }
    } catch (err: any) {
      console.error('Google Admin Sign In Error:', err);
      setAuthError('Sign-in cancelled or popup closed. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await logOutUser();
    setCurrentUser(null);
    setAuthError('');
  };

  // Build unified feed across all application forms
  const unifiedSubmissions: UnifiedFormSubmission[] = useMemo(() => {
    const list: UnifiedFormSubmission[] = [];

    inquiries.forEach((inq) => {
      list.push({
        id: `inq-${inq.id}`,
        formType: 'Consultation Inquiry',
        primaryName: inq.fullName,
        company: inq.company,
        email: inq.email,
        phone: inq.phone,
        serviceOrItem: inq.service || 'GST Compliance Services',
        details: inq.message || inq.city ? `City: ${inq.city || 'N/A'} · Note: ${inq.message || 'None'}` : undefined,
        createdAt: inq.createdAt
      });
    });

    assessments.forEach((asc) => {
      list.push({
        id: `scope-${asc.id}`,
        formType: 'Scope Assessment',
        primaryName: asc.contactName,
        company: asc.companyName,
        email: asc.contactEmail,
        phone: asc.contactPhone,
        serviceOrItem: asc.selectedService || 'Statutory Scope Assessment',
        details: `Turnover: ${assessmentTurnover(asc)} · Entity: ${assessmentEntityType(asc)} · Notes: ${asc.notes || 'None'}`,
        createdAt: asc.createdAt
      });
    });

    accessRequests.forEach((acc) => {
      list.push({
        id: `access-${acc.id}`,
        formType: 'Software Access Request',
        primaryName: acc.email.split('@')[0],
        email: acc.email,
        serviceOrItem: acc.softwareName || 'Software Unlock',
        details: `Status: ${acc.status || 'Pending Review'}`,
        createdAt: acc.createdAt
      });
    });

    return list.sort((a, b) => createdAtTime(b.createdAt) - createdAtTime(a.createdAt));
  }, [inquiries, assessments, accessRequests]);

  // Filter based on active tab and search query
  const filteredSubmissions = useMemo(() => {
    let result = unifiedSubmissions;
    if (activeTab === 'inquiries') {
      result = unifiedSubmissions.filter((s) => s.formType === 'Consultation Inquiry');
    } else if (activeTab === 'assessments') {
      result = unifiedSubmissions.filter((s) => s.formType === 'Scope Assessment');
    } else if (activeTab === 'access') {
      result = unifiedSubmissions.filter((s) => s.formType === 'Software Access Request');
    }

    if (!searchQuery.trim()) return result;
    const q = searchQuery.toLowerCase().trim();

    return result.filter(
      (s) =>
        s.primaryName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone && s.phone.toLowerCase().includes(q)) ||
        (s.company && s.company.toLowerCase().includes(q)) ||
        s.serviceOrItem.toLowerCase().includes(q)
    );
  }, [unifiedSubmissions, activeTab, searchQuery]);

  // Export to CSV utility
  const exportToCSV = () => {
    if (!filteredSubmissions.length) return;
    const headers = ['ID', 'Form Type', 'Applicant Name', 'Company', 'Email', 'Phone', 'Service / Scope', 'Details', 'Submission Date'];
    const rows = filteredSubmissions.map((s) => [
      `"${s.id}"`,
      `"${s.formType}"`,
      `"${s.primaryName}"`,
      `"${s.company || ''}"`,
      `"${s.email}"`,
      `"${s.phone || ''}"`,
      `"${s.serviceOrItem}"`,
      `"${(s.details || '').replace(/"/g, '""')}"`,
      `"${formatCreatedAt(s.createdAt)}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JAS_CMS_Submissions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-[#070D1F]/90 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Executive Admin CMS Workspace"
        className="relative bg-[#0B1F3A] text-slate-100 rounded-3xl shadow-2xl border border-[#162D4F] w-full max-w-6xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]"
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 bg-[#132D52] border-b border-[#162D4F] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#10B981] text-white flex items-center justify-center font-extrabold font-mono text-xl shadow-soft">
              JAS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#10B981]">
                  Executive Admin CMS
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 rounded-full">
                  All Forms Hub
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight font-display">
                Client Forms &amp; Inquiries Management Software
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isAdminAuthenticated && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1F3A] border border-[#162D4F] text-xs font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="truncate max-w-[180px]">{currentUser?.email}</span>
              </div>
            )}

            {isAdminAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-[#071528] hover:bg-[#132D52] text-slate-300 hover:text-white text-xs font-mono border border-[#162D4F] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title="Close CMS Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Container */}
        {!isAdminAuthenticated ? (
          /* Minimal direct Google Login Trigger */
          <div className="p-8 sm:p-14 max-w-md mx-auto space-y-6 text-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center text-white mx-auto shadow-soft">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-extrabold text-white font-display">
                Admin CMS Sign-In
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Sign in with an authorized Google account (<span className="text-[#10B981] font-mono font-semibold">abu01510866@gmail.com</span> or <span className="text-[#10B981] font-mono font-semibold">ramkj1804@gmail.com</span>) to access the Executive CMS software.
              </p>
            </div>

            {/* Error Message if unauthorized Google account attempted */}
            {authError && (
              <div className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-4 text-left flex items-start gap-3 text-xs text-rose-300 animate-in fade-in">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold font-mono uppercase block text-rose-200">Access Denied</span>
                  <p className="leading-relaxed font-sans">{authError}</p>
                </div>
              </div>
            )}

            {/* Sign In With Google Button */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleGoogleAdminLogin}
                disabled={isSigningIn}
                className="w-full py-3.5 px-5 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-bold text-sm shadow-soft transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 active:scale-[0.99] group"
              >
                {isSigningIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-[#10B981] animate-spin" />
                    <span>Signing in with Google...</span>
                  </>
                ) : (
                  <>
                    {/* Google SVG Icon */}
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="font-display">Continue with Google Admin</span>
                  </>
                )}
              </button>

              <p className="text-[11px] font-mono text-slate-400">
                Authorized accounts: <span className="text-[#10B981]">abu01510866@gmail.com</span> &amp; <span className="text-[#10B981]">ramkj1804@gmail.com</span>
              </p>
            </div>
          </div>
        ) : (
          /* Authenticated CMS Software View */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-4 sm:p-6 space-y-5">
            
            {/* Top CMS Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
              <div className="bg-[#071528] rounded-2xl p-4 border border-[#162D4F] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Submissions</span>
                <div className="text-2xl font-extrabold font-mono text-white flex items-center justify-between">
                  <span>{unifiedSubmissions.length}</span>
                  <Layers className="w-5 h-5 text-[#10B981]" />
                </div>
                <span className="text-[10px] text-slate-500 font-sans block">All application forms</span>
              </div>

              <div className="bg-[#071528] rounded-2xl p-4 border border-[#162D4F] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Consultation Inquiries</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-400 flex items-center justify-between">
                  <span>{inquiries.length}</span>
                  <Users className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-500 font-sans block">Contact &amp; booking modals</span>
              </div>

              <div className="bg-[#071528] rounded-2xl p-4 border border-[#162D4F] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Scope Assessments</span>
                <div className="text-2xl font-extrabold font-mono text-blue-400 flex items-center justify-between">
                  <span>{assessments.length}</span>
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-[10px] text-slate-500 font-sans block">Turnover &amp; scope filings</span>
              </div>

              <div className="bg-[#071528] rounded-2xl p-4 border border-[#162D4F] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Software Access Requests</span>
                <div className="text-2xl font-extrabold font-mono text-amber-400 flex items-center justify-between">
                  <span>{accessRequests.length}</span>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-[10px] text-slate-500 font-sans block">Client workspace unlocks</span>
              </div>
            </div>

            {/* Filter Tabs & Search Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#071528] p-3 rounded-2xl border border-[#162D4F] shrink-0">
              
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-[#10B981] text-white shadow-soft-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[#132D52]'
                  }`}
                >
                  All Forms ({unifiedSubmissions.length})
                </button>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === 'inquiries'
                      ? 'bg-[#10B981] text-white shadow-soft-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[#132D52]'
                  }`}
                >
                  Inquiries ({inquiries.length})
                </button>
                <button
                  onClick={() => setActiveTab('assessments')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === 'assessments'
                      ? 'bg-[#10B981] text-white shadow-soft-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[#132D52]'
                  }`}
                >
                  Assessments ({assessments.length})
                </button>
                <button
                  onClick={() => setActiveTab('access')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === 'access'
                      ? 'bg-[#10B981] text-white shadow-soft-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[#132D52]'
                  }`}
                >
                  Software Requests ({accessRequests.length})
                </button>
              </div>

              {/* Search, Refresh, Export Cluster */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search applicant, phone..."
                    className="w-full bg-[#0B1F3A] border border-[#162D4F] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] font-mono"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                <button
                  onClick={fetchAllData}
                  className="p-2 bg-[#132D52] hover:bg-[#1A3A6B] text-slate-300 hover:text-white rounded-xl border border-[#162D4F] cursor-pointer"
                  title="Refresh Live Data"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-[#10B981]' : ''}`} />
                </button>

                <button
                  onClick={exportToCSV}
                  className="px-3 py-1.5 bg-[#132D52] hover:bg-[#1A3A6B] text-slate-300 hover:text-white rounded-xl border border-[#162D4F] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Export records to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>

            </div>

            {/* Submissions Feed List / Table */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
              {isLoadingData && filteredSubmissions.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#10B981] animate-spin mx-auto" />
                  <p className="text-sm font-mono text-slate-400">Loading form submissions from database...</p>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="p-12 text-center bg-[#071528] rounded-2xl border border-[#162D4F] space-y-2">
                  <p className="text-sm font-bold text-white">No form submissions found.</p>
                  <p className="text-xs text-slate-400 font-sans">
                    {searchQuery ? 'Try clearing your search query.' : 'New submissions from your website forms will appear here automatically.'}
                  </p>
                </div>
              ) : (
                filteredSubmissions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#071528] rounded-2xl p-4 sm:p-5 border border-[#162D4F] hover:border-[#10B981]/50 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 group"
                  >
                    {/* Left Column: Form Type & Applicant Info */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                            item.formType === 'Consultation Inquiry'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                              : item.formType === 'Scope Assessment'
                              ? 'bg-blue-950/60 text-blue-400 border-blue-500/40'
                              : 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                          }`}
                        >
                          {item.formType}
                        </span>

                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatCreatedAt(item.createdAt)}</span>
                        </span>

                        {item.company && (
                          <span className="text-[11px] font-mono text-slate-400 bg-[#0B1F3A] px-2 py-0.5 rounded border border-[#162D4F]">
                            {item.company}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h4 className="text-base font-bold text-white font-display">
                          {item.primaryName}
                        </h4>
                        <span className="text-xs font-mono text-[#10B981] font-bold">
                          {item.serviceOrItem}
                        </span>
                      </div>

                      {/* Contact Channels */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <a href={`mailto:${item.email}`} className="hover:text-[#10B981] hover:underline">
                            {item.email}
                          </a>
                        </span>

                        {item.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <a href={`tel:${item.phone}`} className="hover:text-[#10B981] hover:underline">
                              {item.phone}
                            </a>
                          </span>
                        )}
                      </div>

                      {item.details && (
                        <p className="text-xs text-slate-400 font-sans line-clamp-2 pt-0.5">
                          {item.details}
                        </p>
                      )}
                    </div>

                    {/* Right Column: Direct Communication Action Cluster */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-[#162D4F]">
                      {item.phone && (
                        <a
                          href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${item.primaryName}, this is Rishi Jha from Jha Accounting Solutions regarding your ${item.formType} submission for ${item.serviceOrItem}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-3 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Message Applicant on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#10B981]" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {item.phone && (
                        <a
                          href={`tel:${item.phone}`}
                          className="py-2 px-3 bg-[#0B1F3A] hover:bg-[#132D52] text-slate-300 hover:text-white border border-[#162D4F] rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Call Applicant"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>Call</span>
                        </a>
                      )}

                      <a
                        href={`mailto:${item.email}?subject=${encodeURIComponent(
                          `Jha Accounting Solutions — Regarding your ${item.serviceOrItem} inquiry`
                        )}`}
                        className="py-2 px-3 bg-[#0B1F3A] hover:bg-[#132D52] text-slate-300 hover:text-white border border-[#162D4F] rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Send Email"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>Email</span>
                      </a>

                      <button
                        onClick={() => setSelectedRecord(item)}
                        className="py-2 px-3 bg-[#132D52] hover:bg-[#1A3A6B] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="View Full Submission Data"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#10B981]" />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Bottom Footer info bar */}
            <div className="pt-3 border-t border-[#162D4F] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400 shrink-0">
              <span>
                Authorized Administrator: <strong className="text-white">{currentUser?.email}</strong>
              </span>
              <span className="text-[#10B981]">
                Live Firestore Database: Connected &amp; Synced
              </span>
            </div>

          </div>
        )}

      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs" onClick={() => setSelectedRecord(null)} />
          <div className="relative bg-[#0B1F3A] text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#162D4F] space-y-5 z-10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#162D4F] pb-3">
              <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider">
                {selectedRecord.formType}
              </span>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Applicant Name</span>
                <span className="text-base font-bold text-white font-display">{selectedRecord.primaryName}</span>
              </div>

              {selectedRecord.company && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Company / Entity</span>
                  <span className="text-white font-bold">{selectedRecord.company}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Email</span>
                  <span className="text-white break-all">{selectedRecord.email}</span>
                </div>
                {selectedRecord.phone && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Phone</span>
                    <span className="text-white">{selectedRecord.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Service Requested</span>
                <span className="text-[#10B981] font-bold">{selectedRecord.serviceOrItem}</span>
              </div>

              {selectedRecord.details && (
                <div className="bg-[#071528] rounded-xl p-3 border border-[#162D4F]">
                  <span className="text-slate-400 block text-[10px] uppercase mb-1">Scope &amp; Message Notes</span>
                  <p className="text-slate-200 font-sans text-xs leading-relaxed whitespace-pre-wrap">
                    {selectedRecord.details}
                  </p>
                </div>
              )}

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Submitted At</span>
                <span className="text-slate-300">{formatCreatedAt(selectedRecord.createdAt)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedRecord(null)}
              className="w-full py-2.5 bg-[#132D52] hover:bg-[#1A3A6B] text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
            >
              Close Record
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
