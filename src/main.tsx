import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initGA } from './lib/analytics.ts';
import { AuthProvider } from './context/AuthContext.tsx';

// Initialize Google Analytics 4
initGA();

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
