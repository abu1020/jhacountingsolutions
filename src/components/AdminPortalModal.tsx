import React, { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import {
  auth,
  signInAdminWithEmailPassword,
  sendAdminVerificationEmail,
  logOutUser
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { isAuthorizedAdmin } from '../types/admin';
import { useDialog } from '../hooks/useDialog';
import { BrandedAuthLoader } from './BrandedAuthLoader';
import { EASE_OUT_EXPO } from '../lib/motion';

// Admin-only code: split out of the public bundle, fetched after login.
const AdminWorkspace = lazy(() =>
  import('./admin/AdminWorkspace').then(m => ({ default: m.AdminWorkspace }))
);
const ClientDirectory = lazy(() => import('./clients/ClientDirectory').then(m => ({ default: m.ClientDirectory })));

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Error message to display on mount (e.g. a denied sign-in attempt). */
  initialError?: string;
  workspace?: 'admin' | 'clients';
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose, initialError, workspace = 'admin' }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [authError, setAuthError] = useState<string>(initialError || '');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialError !== undefined) {
      setAuthError(initialError);
    }
  }, [initialError]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!isAuthorizedAdmin(user.email)) {
          logOutUser();
          setCurrentUser(null);
          setEmailVerified(false);
          setAuthError('Access Denied: This email address is not authorized for Admin CMS access.');
        } else {
          setCurrentUser(user);
          setEmailVerified(Boolean(user.emailVerified));
          setAuthError('');
        }
      } else {
        setCurrentUser(null);
        setEmailVerified(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const isAdminAuthenticated = useMemo(() => {
    if (!currentUser) return false;
    return isAuthorizedAdmin(currentUser.email);
  }, [currentUser]);

  const isWorkspaceReady = isAdminAuthenticated && emailVerified;

  useEffect(() => {
    if (!isOpen || isWorkspaceReady) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.focus();
    return () => { previous?.focus(); };
  }, [isOpen, isWorkspaceReady]);

  // Esc/scroll-lock for the login / verification card only — the workspace manages its own.
  useDialog(isOpen && !isWorkspaceReady, onClose);

  if (!isOpen) return null;

  const handleEmailAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setAuthError('Please enter both your administrator email ID and password.');
      return;
    }

    setAuthError('');
    setIsSigningIn(true);

    try {
      const user = await signInAdminWithEmailPassword(trimmedEmail, password);
      setCurrentUser(user);
      setEmailVerified(Boolean(user.emailVerified));
      setPassword('');
      setAuthError('');
    } catch (err: any) {
      console.error('Admin Email Sign-In Error:', err);
      if (err?.code === 'auth/unauthorized-admin') {
        setAuthError('Access Denied: This email address is not authorized for Admin CMS access.');
      } else if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/user-not-found'
      ) {
        setAuthError('Invalid email ID or password. Please verify your administrator credentials.');
      } else if (err?.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid administrator email address.');
      } else if (err?.code === 'auth/too-many-requests') {
        setAuthError('Too many failed sign-in attempts. Please wait a few minutes and try again.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setAuthError(
          'Email/Password sign-in is not yet enabled in Firebase Console (Authentication → Sign-in method → Email/Password).'
        );
      } else if (err?.code === 'auth/user-disabled') {
        setAuthError('This administrator account has been disabled.');
      } else if (err?.code === 'auth/network-request-failed') {
        setAuthError('Network error. Please check your internet connection and try again.');
      } else {
        setAuthError('Authentication error. Please check your network and credentials.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSendVerification = async () => {
    if (!currentUser) return;
    setAuthError('');
    setIsCheckingVerification(true);
    try {
      await sendAdminVerificationEmail(currentUser);
      setVerificationSent(true);
    } catch (err: any) {
      if (err?.code === 'auth/too-many-requests') {
        setAuthError('A verification email was just sent. Please check your inbox and spam folder.');
      } else {
        setAuthError('Could not send verification email right now. Please try again in a moment.');
      }
    } finally {
      setIsCheckingVerification(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!currentUser) return;
    setAuthError('');
    setIsCheckingVerification(true);
    try {
      await currentUser.reload();
      await currentUser.getIdToken(true);
      const refreshed = auth.currentUser;
      const verified = Boolean(refreshed?.emailVerified);
      setEmailVerified(verified);
      if (!verified) {
        setAuthError('Email is not verified yet. Please click the verification link sent to your inbox, then try again.');
      }
    } catch {
      setAuthError('Could not verify status right now. Please check your connection and try again.');
    } finally {
      setIsCheckingVerification(false);
    }
  };

  const handleLogout = async () => {
    await logOutUser();
    setCurrentUser(null);
    setEmailVerified(false);
    setVerificationSent(false);
    setPassword('');
    setAuthError('');
  };

  // Authorized and email-verified: full-screen Client Management System.
  if (isWorkspaceReady) {
    return (
      <Suspense fallback={<BrandedAuthLoader />}>
        {workspace === 'clients' ? <ClientDirectory onClose={onClose} onLogout={handleLogout} /> : <AdminWorkspace
          currentUser={currentUser}
          authMode="email"
          onClose={onClose}
          onLogout={handleLogout}
        />}
      </Suspense>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
        className="fixed inset-0 bg-navy-950/90 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
        tabIndex={-1}
        onKeyDown={event => {
          if (event.key !== 'Tab') return;
          const elements = panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]');
          if (!elements?.length) return;
          const first = elements[0], last = elements[elements.length - 1];
          if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }}
        initial={{ opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
        className="jas-dark relative bg-navy-850 text-slate-100 rounded-3xl shadow-2xl border border-navy-600 w-full max-w-xl overflow-hidden z-10 my-auto flex flex-col"
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 bg-navy-700 border-b border-navy-600 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-teal-hover to-brand-teal text-white flex items-center justify-center font-extrabold text-xl shadow-soft shrink-0">
              JAS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                  JHA WORKSPACE
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-brand-teal/20 text-brand-teal border border-brand-teal/40 rounded-full">
                  Admin Only
                </span>
              </div>
              <h3 id="admin-login-title" className="text-base sm:text-xl font-bold text-white tracking-tight">
                Administrator Login
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Close Portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Either Email Verification Prompt or Email & Password Login Form */}
        <div className="p-6 sm:p-10 max-w-md mx-auto w-full space-y-6 my-auto">
          <AnimatePresence mode="wait">
            {isAdminAuthenticated && !emailVerified ? (
              <motion.div
                key="verify-email"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                className="space-y-5 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 mx-auto">
                  <Mail className="w-8 h-8" aria-hidden="true" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl font-bold text-white">
                    Verify Administrator Email
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Signed in as <strong className="text-white">{currentUser?.email}</strong>. Firestore security rules require a verified email address before opening practice records.
                  </p>
                </div>

                {verificationSent && (
                  <div role="status" className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3.5 text-left flex items-start gap-2.5 text-xs text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Verification link sent. Open your inbox, confirm your address, and then click &ldquo;I&rsquo;ve Verified — Continue&rdquo;.</span>
                  </div>
                )}

                {authError && (
                  <div role="alert" className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-4 text-left flex items-start gap-3 text-xs text-rose-300">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="leading-relaxed">{authError}</p>
                  </div>
                )}

                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleCheckVerification}
                    disabled={isCheckingVerification}
                    className="w-full py-3.5 px-5 bg-brand-teal hover:bg-brand-teal-hover text-white rounded-2xl font-bold text-sm shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isCheckingVerification ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Checking status...</span>
                      </>
                    ) : (
                      <span>I&rsquo;ve Verified — Continue</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendVerification}
                    disabled={isCheckingVerification}
                    className="w-full py-3 px-5 bg-navy-700 hover:bg-navy-600 text-slate-100 border border-navy-500 rounded-2xl font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {verificationSent ? 'Resend Verification Email' : 'Send Verification Email'}
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2.5 px-4 text-slate-400 hover:text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Sign out and use another email</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="email-login"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-teal-hover to-brand-teal flex items-center justify-center text-white mx-auto shadow-soft">
                    <ShieldCheck className="w-8 h-8" aria-hidden="true" />
                  </div>

                  <h4 className="text-2xl font-bold text-white pt-1">
                    Welcome back
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Sign in with your administrator account to access the practice workspace.
                  </p>
                </div>

                {authError && (
                  <div role="alert" className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-4 text-left flex items-start gap-3 text-xs text-rose-300">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="space-y-1">
                      <span className="font-bold uppercase block text-rose-200">Authentication Notice</span>
                      <p className="leading-relaxed">{authError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleEmailAdminLogin} className="space-y-4 text-left" noValidate>
                  <div className="space-y-1.5">
                    <label htmlFor="admin-email-input" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Administrator Email ID
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                      <input
                        id="admin-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        placeholder="admin@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900 border border-navy-500 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="admin-password-input" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                      <input
                        id="admin-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        placeholder="Enter administrator password"
                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-navy-900 border border-navy-500 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/30 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSigningIn}
                    className="w-full mt-2 py-3.5 px-5 bg-brand-teal hover:bg-brand-teal-hover text-white rounded-2xl font-bold text-sm shadow-soft transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                  >
                    {isSigningIn ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign in to workspace</span>
                    )}
                  </button>
                </form>

                <p className="text-xs text-slate-400 text-center leading-relaxed pt-1">
                  Authorized administrator login only. Account registration is disabled on this website.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
