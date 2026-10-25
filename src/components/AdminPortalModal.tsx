import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { X, ShieldCheck, ShieldAlert, RefreshCw } from 'lucide-react';
import { auth, signInWithGoogle, logOutUser } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ALLOWED_ADMIN_EMAILS, isAuthorizedAdmin } from '../types/admin';
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
 * Admin entry point.
 *
 * Auth (from main's streamlined access work): Google sign-in only,
 * gated by the ALLOWED_ADMIN_EMAILS allowlist. The old client-side
 * passcode is gone. NOTE: the allowlist is a UI gate — real data
 * protection still requires tightened firestore.rules / admin custom
 * claims (docs/UI_UX_ENTERPRISE_REVIEW.md §0).
 *
 * Post-login: hands off to the full-screen Client Management System
 * (AdminWorkspace) — overview, pipeline board, unified records grid,
 * client drawer, follow-up tasks and access approvals.
 */
export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && !isAuthorizedAdmin(user.email)) {
        setAuthError(
          `Access Denied: The Google account "${user.email}" is not authorized for Admin CMS access. Only allowed administrators (${ALLOWED_ADMIN_EMAILS.join(', ')}) can log in.`
        );
      } else if (user) {
        setAuthError('');
      }
    });
    return () => unsubscribe();
  }, []);

  const isAdminAuthenticated = useMemo(() => {
    if (!currentUser) return false;
    return isAuthorizedAdmin(currentUser.email);
  }, [currentUser]);

  // Esc/scroll-lock for the login card only — the workspace manages its own.
  useDialog(isOpen && !isAdminAuthenticated, onClose);

  if (!isOpen) return null;

  const handleGoogleAdminLogin = async () => {
    setAuthError('');
    setIsSigningIn(true);
    try {
      const user = await signInWithGoogle();
      if (!user) return;
      if (!isAuthorizedAdmin(user.email)) {
        await logOutUser();
        setAuthError(
          `Access Denied: The Google account "${user.email}" is not authorized for Admin CMS access. Only allowed administrators (${ALLOWED_ADMIN_EMAILS.join(', ')}) are permitted to log in.`
        );
      } else {
        setAuthError('');
      }
    } catch (err) {
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

  // Authorized: full-screen Client Management System.
  if (isAdminAuthenticated) {
    return (
      <Suspense fallback={<BrandedAuthLoader />}>
        <AdminWorkspace
          currentUser={currentUser}
          authMode="google"
          onClose={onClose}
          onLogout={handleLogout}
        />
      </Suspense>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-[#070D1F]/90 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Executive Admin CMS Workspace"
        className="relative bg-[#0B1F3A] text-slate-100 rounded-3xl shadow-2xl border border-[#162D4F] w-full max-w-xl overflow-hidden z-10 my-auto flex flex-col"
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 bg-[#132D52] border-b border-[#162D4F] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#10B981] text-white flex items-center justify-center font-extrabold font-mono text-xl shadow-soft shrink-0">
              JAS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#10B981]">
                  Executive Admin CMS
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 rounded-full">
                  Client Management
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight font-display">
                Client Management System
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Close CMS"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimal direct Google Login (from main's streamlined access) */}
        <div className="p-8 sm:p-12 max-w-md mx-auto w-full space-y-6 text-center my-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center text-white mx-auto shadow-soft">
            <ShieldCheck className="w-8 h-8" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl font-extrabold text-white font-display">
              Admin CMS Sign-In
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Sign in with an authorized Google account (<span className="text-[#10B981] font-mono font-semibold">abu01510866@gmail.com</span> or <span className="text-[#10B981] font-mono font-semibold">ramkj1804@gmail.com</span>) to open the workspace — pipeline, client database, follow-ups and approvals, synced to Firestore.
            </p>
          </div>

          {authError && (
            <div role="alert" className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-4 text-left flex items-start gap-3 text-xs text-rose-300">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <span className="font-bold font-mono uppercase block text-rose-200">Access Denied</span>
                <p className="leading-relaxed font-sans">{authError}</p>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleGoogleAdminLogin}
              disabled={isSigningIn}
              className="w-full py-3.5 px-5 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-bold text-sm shadow-soft transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 active:scale-[0.99] group"
            >
              {isSigningIn ? (
                <>
                  <RefreshCw className="w-4 h-4 text-[#10B981] animate-spin" aria-hidden="true" />
                  <span>Signing in with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
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

      </div>
    </div>
  );
};
