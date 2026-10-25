import React, { useState, useEffect, lazy, Suspense } from 'react';
import { X, ShieldCheck, KeyRound } from 'lucide-react';
import { auth, signInWithGoogle, logOutUser } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useDialog } from '../hooks/useDialog';
import { BrandedAuthLoader } from './BrandedAuthLoader';

// Admin-only code: split out of the public bundle, fetched after login.
const AdminWorkspace = lazy(() =>
  import('./admin/AdminWorkspace').then(m => ({ default: m.AdminWorkspace }))
);

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Admin entry point. Pre-login: authentication card.
 * Post-login: hands off to the full-screen Client Management System
 * (`AdminWorkspace`) — pipeline, data grid, client drawer, follow-up
 * tasks and access approvals. The previous two-tab modal body
 * (AdminInquiriesTab/AdminAssessmentsTab) is superseded by the
 * workspace's unified records grid.
 */
export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [passcode, setPasscode] = useState('');
  const [isPasscodeAuthenticated, setIsPasscodeAuthenticated] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isAdminLoggedIn = !!currentUser || isPasscodeAuthenticated;

  // Esc/scroll-lock for the login card only — the workspace manages its own.
  useDialog(isOpen && !isAdminLoggedIn, onClose);

  if (!isOpen) return null;

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    // ⚠️ P0 SECURITY (docs/UI_UX_ENTERPRISE_REVIEW.md §0): this passcode is
    // compiled into the public JS bundle — anyone can read it via View
    // Source. It only "works" because firestore.rules allows public reads
    // on inquiries/scopeAssessments. Replace BOTH together: Firebase Auth
    // admin custom claim + rules `allow read: if request.auth.token.admin`.
    // Note: passcode mode stores CRM metadata locally; Google sign-in
    // syncs it to Firestore (crmMeta collection).
    e.preventDefault();
    if (passcode.trim() === 'RishiJha@Admin2026!Secure') {
      setIsPasscodeAuthenticated(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid Admin Passcode. Access Denied.');
    }
  };

  const handleGoogleAdminLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Admin Sign In Error:', err);
    }
  };

  const handleLogout = async () => {
    setIsPasscodeAuthenticated(false);
    setPasscode('');
    await logOutUser();
  };

  // Post-login: full-screen Client Management System.
  if (isAdminLoggedIn) {
    return (
      <Suspense fallback={<BrandedAuthLoader />}>
        <AdminWorkspace
          currentUser={currentUser}
          authMode={currentUser ? 'google' : 'passcode'}
          onClose={onClose}
          onLogout={handleLogout}
        />
      </Suspense>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-[#070D1F]/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div role="dialog" aria-modal="true" aria-label="Admin Control Desk" className="relative bg-[#0B1F3A] text-slate-100 rounded-3xl shadow-soft-lg border border-[#162D4F] w-full max-w-xl overflow-hidden z-10 my-auto">

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
                  Client Management System
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight font-display">
                Executive Partner Workspace
              </h3>
            </div>
          </div>

          <button onClick={onClose} aria-label="Close" className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Login Body */}
        <div className="p-8 sm:p-10 max-w-md mx-auto space-y-7 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] mx-auto shadow-soft-sm">
            <KeyRound className="w-8 h-8" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h4 className="text-xl font-bold text-white font-display">Admin Authentication</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Sign in to open the Client Management System — pipeline board, client database,
              follow-up tasks and software approvals. Google sign-in syncs your CRM data to
              the cloud; passcode mode keeps it in this browser.
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4 text-left">
            <div>
              <label htmlFor="admin-passcode" className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                Admin Passcode
              </label>
              <input
                id="admin-passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode..."
                className="w-full bg-[#071528] border border-[#162D4F] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] font-mono"
                autoFocus
              />
              {passcodeError && (
                <p role="alert" className="text-xs text-red-400 mt-1 font-mono">{passcodeError}</p>
              )}
            </div>

            <button type="submit" className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer">
              Verify &amp; Open Workspace
            </button>
          </form>

          <button onClick={handleGoogleAdminLogin} className="w-full py-3 px-4 bg-[#132D52] hover:bg-[#1A3A6B] text-white rounded-xl border border-[#162D4F] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" aria-hidden="true" />
            <span>Sign In with Admin Google Account (Recommended)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
