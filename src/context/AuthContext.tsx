import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from 'firebase/auth';

/**
 * Auth context.
 *
 * Performance: Firebase Auth + Firestore (~150 kB gzip) are loaded via
 * dynamic import() after first paint instead of shipping in the entry
 * bundle — public visitors render instantly, and auth state still
 * resolves moments later. The public API of this context is unchanged.
 */

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
  const [loading, setLoading] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeAuth: () => void = () => {};
    let unsubscribeSnapshot: (() => void) | null = null;
    let cancelled = false;

    (async () => {
      try {
        const [{ auth, db }, { onAuthStateChanged }, { doc, onSnapshot }] = await Promise.all([
          import('../firebase'),
          import('firebase/auth'),
          import('firebase/firestore')
        ]);
        if (cancelled) return;

        unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
          // Detach the previous user's listener before subscribing to another account.
          if (unsubscribeSnapshot) { unsubscribeSnapshot(); unsubscribeSnapshot = null; }
          setUserProfile(null);
          setUser(currentUser);

          if (currentUser) {
            const userRef = doc(db, 'users', currentUser.uid);
            unsubscribeSnapshot = onSnapshot(
              userRef,
              (snapshot) => {
                setUserProfile(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
                setLoading(false);
              },
              (err) => {
                console.error('Snapshot error on users doc:', err);
                setLoading(false);
              }
            );
          } else {
            setLoading(false);
          }
        });
      } catch (err) {
        console.error('Deferred auth init failed:', err);
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

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
