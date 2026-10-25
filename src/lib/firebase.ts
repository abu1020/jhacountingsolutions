import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  browserLocalPersistence,
  setPersistence,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  addDoc,
  collection,
  serverTimestamp
} from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId
};

const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || appletConfig.firestoreDatabaseId;

// Ensure Firebase App is initialized safely once across the entire application
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Must pass firestoreDatabaseId
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Enforce browserLocalPersistence
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase persistence setting error:', err);
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on load
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// SECURITY: the former "email verification fallback" (createAuthorizedAdminUser +
// a mock admin user persisted in sessionStorage) was an authentication bypass —
// typing an admin email with no credential granted the full CMS. It has been
// removed. Google sign-in is the only path into the admin workspace, and
// firestore.rules independently enforce admin-only data access, so even a
// client-side bypass could no longer read a single record.

// Sign in with Google Popup
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Save or update user profile document in Firestore
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(
          userRef,
          {
            uid: user.uid,
            displayName: user.displayName || 'Client User',
            email: user.email || '',
            photoURL: user.photoURL || '',
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch (profileErr) {
        console.warn('Profile sync warning:', profileErr);
      }
    }
    return user;
  } catch (error: any) {
    if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/popup-closed-by-user') {
      console.warn('Popup blocked/closed. Fallback to signInWithRedirect...');
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectErr) {
        console.warn('Redirect failed:', redirectErr);
      }
      return null;
    }

    // Handle unauthorized-domain gracefully in dev & preview environments
    if (error?.code === 'auth/unauthorized-domain') {
      console.warn(
        `[Firebase Auth] Origin "${window.location.origin}" is not in Firebase Console -> Authentication -> Settings -> Authorized Domains.`
      );
      // Do NOT grant any fallback session. Re-throw so the caller can explain.
      throw error;
    }

    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export const signInWithGooglePopup = signInWithGoogle;

// Sign Out
export async function logOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
  }
}

export const logOut = logOutUser;

// Get User Profile from Firestore
export async function getUserProfile(uid: string) {
  const path = `users/${uid}`;
  try {
    const { getDoc } = await import('firebase/firestore');
    const userSnap = await getDoc(doc(db, 'users', uid));
    if (userSnap.exists()) {
      return userSnap.data() as {
        uid: string;
        displayName?: string;
        name?: string;
        phone?: string;
        email?: string;
        desiredService?: string;
        onboardingCompleted?: boolean;
        photoURL?: string;
        createdAt?: string;
        updatedAt?: string;
      };
    }
    return null;
  } catch (error) {
    console.error('Error reading user profile:', error);
    return null;
  }
}

// Save or Update User Profile in Firestore
export async function saveUserProfile(uid: string, profileData: {
  name?: string;
  phone?: string;
  email?: string;
  desiredService?: string;
  onboardingCompleted?: boolean;
  displayName?: string;
}) {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      uid,
      ...profileData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Save Consultation Inquiry
export async function saveInquiry(inquiryData: {
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  service: string;
  city?: string;
  message?: string;
}) {
  const path = 'inquiries';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...inquiryData,
      userId: auth.currentUser?.uid || 'anonymous',
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Save Scope Assessment
export async function saveScopeAssessment(assessmentData: {
  contactName: string;
  companyName?: string;
  contactEmail: string;
  contactPhone: string;
  selectedService: string;
  entityType?: string;
  annualTurnover?: string;
  preferredCity?: string;
  notes?: string;
}) {
  const path = 'scopeAssessments';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...assessmentData,
      userId: auth.currentUser?.uid || 'anonymous',
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Get Inquiries (Admin Portal)
export async function getInquiries() {
  const path = 'inquiries';
  try {
    const { getDocs } = await import('firebase/firestore');
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Array<{
      id: string;
      fullName: string;
      company?: string;
      email: string;
      phone: string;
      service: string;
      city?: string;
      message?: string;
      createdAt: string;
    }>;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Get Scope Assessments (Admin Portal)
export async function getScopeAssessments() {
  const path = 'scopeAssessments';
  try {
    const { getDocs } = await import('firebase/firestore');
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Array<{
      id: string;
      contactName: string;
      companyName?: string;
      contactEmail: string;
      contactPhone: string;
      selectedService: string;
      entityType?: string;
      annualTurnover?: string;
      preferredCity?: string;
      notes?: string;
      createdAt: string;
    }>;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Client Management System (Admin Workspace) data access
// ---------------------------------------------------------------------------

export interface ClientUserRecord {
  uid: string;
  name?: string;
  displayName?: string;
  email: string;
  phone?: string;
  company?: string;
  requirements?: string[];
  desiredService?: string;
  notes?: string;
  plan?: string;
  unlockedSoftware?: string[];
  onboardingComplete?: boolean;
  onboardingCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccessRequestRecord {
  id: string;
  uid: string;
  email: string;
  softwareId: string;
  softwareName: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  createdAt: string;
}

/** All registered client accounts (Admin Workspace → Clients). */
export async function getAllClientUsers(): Promise<ClientUserRecord[]> {
  const path = 'users';
  try {
    const { getDocs } = await import('firebase/firestore');
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(d => ({
      uid: d.id,
      ...(d.data() as Omit<ClientUserRecord, 'uid'>)
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/** Software unlock requests (Admin Workspace → Access Requests). */
export async function getAccessRequests(): Promise<AccessRequestRecord[]> {
  const path = 'accessRequests';
  try {
    const { getDocs } = await import('firebase/firestore');
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<AccessRequestRecord, 'id'>)
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Approve/reject a software access request. Requires a signed-in admin
 * (see firestore.rules `accessRequests` update rule). Returns false when
 * the write was rejected so the UI can fall back to local CRM state.
 */
export async function updateAccessRequestStatus(
  requestId: string,
  status: 'approved' | 'rejected' | 'pending'
): Promise<boolean> {
  const path = `accessRequests/${requestId}`;
  try {
    const { updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'accessRequests', requestId), {
      status,
      reviewedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}
