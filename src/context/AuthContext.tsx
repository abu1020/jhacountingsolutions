import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { User } from 'firebase/auth';

/**
 * High-concurrency Auth context.
 *
 * Scaling design for 10,000+ simultaneous visitors:
 * - Public visitors NEVER download the Firebase Auth/Firestore SDK (~150 kB gzip)
 *   and NEVER open a Firestore WebSocket/onSnapshot listener on page load.
 * - Firebase Auth is loaded strictly on-demand: either when a returning
 *   administrator already has `jas_admin_session_hint` set in localStorage,
 *   when visiting an `/admin` route, or when `signInWithEmail` is invoked.
 */

const ADMIN_SESSION_HINT_KEY = 'jas_admin_session_hint';

function shouldBootstrapAuthOnMount(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem(ADMIN_SESSION_HINT_KEY) === '1') return true;
  } catch {
    // Ignore storage restriction in sandboxed/private browsing
  }
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' ||
    path === '/admin-cms' ||
    path === '/cms' ||
    hash === '#admin' ||
    hash === '#admin-cms' ||
    hash === '#cms'
  );
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  requirements: string[];
  notes?: string;
  createdAt?: string;
  onboardingComplete: boolean;
  plan: string;
  unlockedSoftware: string[];
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authLoading: boolean;
  authError: string | null;
  toastMessage: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
  clearToast: () => void;
  setToastMessage: (msg: string | null) => void;
  refreshUserProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(() => shouldBootstrapAuthOnMount());
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const authUnsubRef = useRef<(() => void) | null>(null);
  const subscribedRef = useRef<boolean>(false);

  const ensureAuthSubscribed = useCallback(async () => {
    if (subscribedRef.current) return;
    subscribedRef.current = true;
    try {
      const [{ auth }, { onAuthStateChanged }] = await Promise.all([
        import('../firebase'),
        import('firebase/auth')
      ]);

      authUnsubRef.current = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (!currentUser) {
          setUserProfile(null);
          try { localStorage.removeItem(ADMIN_SESSION_HINT_KEY); } catch { /* ignore */ }
        }
        setLoading(false);
      });
    } catch (err) {
      subscribedRef.current = false;
      console.error('Deferred auth init failed:', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (shouldBootstrapAuthOnMount()) {
      ensureAuthSubscribed();
    } else {
      setLoading(false);
    }

    return () => {
      if (authUnsubRef.current) {
        authUnsubRef.current();
        authUnsubRef.current = null;
        subscribedRef.current = false;
      }
    };
  }, [ensureAuthSubscribed]);

  const refreshUserProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    try {
      const [{ db }, { doc, getDoc }] = await Promise.all([
        import('../firebase'),
        import('firebase/firestore')
      ]);
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setUserProfile(data);
        return data;
      }
    } catch (e) {
      console.error('Error refreshing profile:', e);
    }
    return null;
  };

  const signInWithEmail = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await ensureAuthSubscribed();
      const [{ signInAdminWithEmailPassword }] = await Promise.all([
        import('../firebase')
      ]);
      await signInAdminWithEmailPassword(email, password);
    } catch (err: any) {
      console.error('Admin Email Sign-In Error:', err);
      if (err?.code === 'auth/unauthorized-admin') {
        setAuthError(err.message);
      } else if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/user-not-found'
      ) {
        setAuthError('Invalid email address or password. Please verify your administrator credentials.');
      } else if (err?.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid administrator email address.');
      } else if (err?.code === 'auth/too-many-requests') {
        setAuthError('Too many failed sign-in attempts. Please wait a few minutes and try again.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setAuthError('Email/Password sign-in is not enabled in Firebase Authentication.');
      } else if (err?.code === 'auth/network-request-failed') {
        setAuthError('Network error: Please check your internet connection and try again.');
      } else {
        setAuthError(err?.message || 'Sign-in failed. Please try again.');
      }
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    try {
      try { localStorage.removeItem(ADMIN_SESSION_HINT_KEY); } catch { /* ignore */ }
      const [{ auth }, { signOut: firebaseSignOut }] = await Promise.all([
        import('../firebase'),
        import('firebase/auth')
      ]);
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
      setToastMessage('You have been logged out');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const clearAuthError = () => setAuthError(null);
  const clearToast = () => setToastMessage(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authLoading,
        authError,
        toastMessage,
        signInWithEmail,
        signOut,
        clearAuthError,
        clearToast,
        setToastMessage,
        refreshUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
