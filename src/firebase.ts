export {
  app,
  db,
  auth,
  signInAdminWithEmailPassword,
  sendAdminVerificationEmail,
  logOut,
  logOutUser,
  getUserProfile,
  saveUserProfile,
  saveInquiry,
  saveScopeAssessment,
  getInquiries,
  getScopeAssessments,
  getAccessRequests,
  handleFirestoreError,
  testFirestoreConnection,
  OperationType
} from './lib/firebase';
