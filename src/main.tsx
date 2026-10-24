import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import App from './App.tsx';
import './index.css';
import { initGA } from './lib/analytics.ts';
import { AuthProvider } from './context/AuthContext.tsx';

// Initialize Google Analytics 4
initGA();

createRoot(document.getElementById('root')!).render(
  // reducedMotion="user": every framer-motion transform animation in the
  // app automatically respects the OS-level reduced-motion preference.
  <MotionConfig reducedMotion="user">
    <AuthProvider>
      <App />
    </AuthProvider>
  </MotionConfig>
);
