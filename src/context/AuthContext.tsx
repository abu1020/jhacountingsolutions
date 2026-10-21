import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, signInWithGooglePopup } from '../firebase';

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
  signInWithGoogle: () => Promise<void>;
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
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Real-time listener for user profile document
        const userRef = doc(db, 'users', currentUser.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            setUserProfile(data);
          } else {
            setUserProfile(null);
          }
          setLoading(false);
        }, (err) => {
          console.error('Snapshot error on users doc:', err);
          setLoading(false);
        });
      } else {
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  const refreshUserProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
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

  const signInWithGoogle = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const loggedUser = await signInWithGooglePopup();
      if (loggedUser) {
        // Fetch or check profile doc
        const userRef = doc(db, 'users', loggedUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setUserProfile(snap.data() as UserProfile);
        }
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled: The login popup was closed before completing.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('Sign-in blocked: Your browser blocked the Google login popup. Please allow popups for this site.');
      } else if (err.code === 'auth/network-request-failed') {
        setAuthError('Network error: Please check your internet connection and try again.');
      } else {
        setAuthError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    try {
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
        signInWithGoogle,
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
