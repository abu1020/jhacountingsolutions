import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
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
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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

// Sign in with Google Popup
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save or update user profile document in Firestore
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || 'Client User',
        email: user.email || '',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    return user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// Sign Out
export async function logOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
  }
}

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
