import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, KeyRound, RefreshCw, Search, Users, FileText } from 'lucide-react';
import { auth, signInWithGoogle, logOutUser, getInquiries, getScopeAssessments } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AdminInquiriesTab } from './AdminInquiriesTab';
import { AdminAssessmentsTab } from './AdminAssessmentsTab';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [passcode, setPasscode] = useState('');
  const [isPasscodeAuthenticated, setIsPasscodeAuthenticated] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'inquiries' | 'assessments'>('inquiries');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const [inqData, scopeData] = await Promise.all([
        getInquiries(),
        getScopeAssessments()
      ]);
      setInquiries(inqData.reverse());
      setAssessments(scopeData.reverse());
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen && (currentUser || isPasscodeAuthenticated)) {
      fetchData();
    }
  }, [isOpen, currentUser, isPasscodeAuthenticated]);

  if (!isOpen) return null;

  const isAdminLoggedIn = !!currentUser || isPasscodeAuthenticated;

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'RishiJha@Admin2026!Secure') {
      setIsPasscodeAuthenticated(true);
      setPasscodeError('');
      fetchData();
    } else {
      setPasscodeError('Invalid Admin Passcode. Access Denied.');
    }
  };

  const handleGoogleAdminLogin = async () => {
    try {
      await signInWithGoogle();
      fetchData();
    } catch (err) {
      console.error('Google Admin Sign In Error:', err);
    }
  };

  const handleLogout = async () => {
    setIsPasscodeAuthenticated(false);
    await logOutUser();
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const csvContent = [
      keys.join(','),
      ...data.map(row => keys.map(k => `"${String(row[k] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-[#070D1F]/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative bg-[#0B1F3A] text-slate-100 rounded-3xl shadow-soft-lg border border-[#162D4F] w-full max-w-5xl overflow-hidden z-10 my-auto">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-[#132D52] border-b border-[#162D4F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] font-extrabold font-mono text-lg shadow-soft-sm">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#10B981]">
                  Jha Accounting Solutions
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 rounded-full">
                  Admin Control Desk
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight font-display">
                Executive Partner &amp; Lead Management Workspace
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-[#071528] hover:bg-[#132D52] text-slate-300 text-xs font-mono border border-[#162D4F] transition-colors cursor-pointer"
              >
                Log Out
              </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isAdminLoggedIn ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto space-y-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] mx-auto shadow-soft-sm">
              <KeyRound className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white font-display">Admin Authentication</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Enter your Admin Access Passcode or Sign In with Google to access real-time leads, inquiries, and scope submissions.
              </p>
            </div>

            <form onSubmit={handlePasscodeSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode..."
                  className="w-full bg-[#071528] border border-[#162D4F] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] font-mono"
                  autoFocus
                />
                {passcodeError && (
                  <p className="text-xs text-red-400 mt-1 font-mono">{passcodeError}</p>
                )}
              </div>

              <button type="submit" className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer">
                Verify &amp; Enter Admin Desk
              </button>
            </form>

            <button onClick={handleGoogleAdminLogin} className="w-full py-3 px-4 bg-[#132D52] hover:bg-[#1A3A6B] text-white rounded-xl border border-[#162D4F] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Sign In with Admin Google Account</span>
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#071528] p-4 rounded-2xl border border-[#162D4F]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'inquiries' ? 'bg-[#10B981] text-white shadow-soft-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Lead Consultation Inquiries ({inquiries.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('assessments')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'assessments' ? 'bg-[#10B981] text-white shadow-soft-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Scope Submissions ({assessments.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter records..."
                    className="bg-[#0B1F3A] border border-[#162D4F] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] font-mono"
                  />
                </div>
                <button onClick={fetchData} className="p-2 bg-[#132D52] hover:bg-[#1A3A6B] text-slate-300 hover:text-white rounded-xl border border-[#162D4F] cursor-pointer" title="Refresh Data">
                  <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-[#10B981]' : ''}`} />
                </button>
              </div>
            </div>

            {activeTab === 'inquiries' ? (
              <AdminInquiriesTab
                inquiries={inquiries}
                isLoading={isLoadingData}
                searchQuery={searchQuery}
                onExport={() => exportToCSV(inquiries, 'JAS_Lead_Inquiries')}
              />
            ) : (
              <AdminAssessmentsTab
                assessments={assessments}
                isLoading={isLoadingData}
                searchQuery={searchQuery}
                onExport={() => exportToCSV(assessments, 'JAS_Scope_Assessments')}
              />
            )}
          </div>
        )}

      </div>
    </div>
  );
};
