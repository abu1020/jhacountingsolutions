/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsBar } from './components/StatsBar';
import { ServicesSection } from './components/ServicesSection';
// Modals & floating widgets are interaction-triggered: code-split them out
// of the initial bundle (fetched on first open / after first paint).
const ContactConsultationModal = lazy(() => import('./components/ContactConsultationModal').then(m => ({ default: m.ContactConsultationModal })));
const AdminPortalModal = lazy(() => import('./components/AdminPortalModal').then(m => ({ default: m.AdminPortalModal })));
const LoginRedirectModal = lazy(() => import('./components/LoginRedirectModal').then(m => ({ default: m.LoginRedirectModal })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const PushNotificationManager = lazy(() => import('./components/PushNotificationManager').then(m => ({ default: m.PushNotificationManager })));
const WhatsAppFloatingWidget = lazy(() => import('./components/WhatsAppFloatingWidget').then(m => ({ default: m.WhatsAppFloatingWidget })));
const MobileBottomBar = lazy(() => import('./components/MobileBottomBar').then(m => ({ default: m.MobileBottomBar })));
import { Footer } from './components/Footer';
import { PageTransition } from './components/PageTransition';
import { Skeleton } from './components/SkeletonLoader';
import { SeoManager } from './components/SeoManager';
import { BackToTopButton } from './components/BackToTopButton';
// Firebase is dynamically imported (below) so ~150 kB gzip stays off the critical path.
import { isAuthorizedAdmin } from './types/admin';
import type { User } from 'firebase/auth';

// Lazy loaded secondary views for instant initial bundle loading
const BlogInsightsEngine = lazy(() =>
  import('./components/BlogInsightsEngine').then(m => ({ default: m.BlogInsightsEngine }))
);
const AnalyticsDashboard = lazy(() =>
  import('./components/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard }))
);
const ClientDashboardPage = lazy(() =>
  import('./pages/ClientDashboardPage').then(m => ({ default: m.ClientDashboardPage }))
);
const SetupPage = lazy(() =>
  import('./pages/SetupPage').then(m => ({ default: m.SetupPage }))
);
const VirtualCfoSpotlight = lazy(() => import('./components/VirtualCfoSpotlight').then(m => ({ default: m.VirtualCfoSpotlight })));
const IndustriesAndOutsourcing = lazy(() => import('./components/IndustriesAndOutsourcing').then(m => ({ default: m.IndustriesAndOutsourcing })));
const IndiaGstMap = lazy(() => import('./components/IndiaGstMap').then(m => ({ default: m.IndiaGstMap })));
const RequiredDocumentsSection = lazy(() => import('./components/RequiredDocumentsSection').then(m => ({ default: m.RequiredDocumentsSection })));
const FreeToolsSection = lazy(() => import('./components/FreeToolsSection').then(m => ({ default: m.FreeToolsSection })));
const TestimonialsCtaFaqContact = lazy(() => import('./components/TestimonialsCtaFaqContact').then(m => ({ default: m.TestimonialsCtaFaqContact })));

type ViewType = 'home' | 'blog' | 'analytics' | 'dashboard' | 'setup' | '404';

// Registered home page section anchor IDs
const KNOWN_SECTIONS = new Set([
  'services',
  'process',
  'industries',
  'gst-map',
  'required-documents',
  'documents',
  'free-tools',
  'contact',
  'faq',
  'about'
]);

const DEFAULT_PAGE_TITLE = 'Jha Accounting Solutions | GST Compliance, Income Tax & Bookkeeping';

export function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [attemptedPath, setAttemptedPath] = useState<string>('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalPreselectedService, setModalPreselectedService] = useState<string | undefined>(undefined);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [adminPortalError, setAdminPortalError] = useState<string | undefined>(undefined);
  const [isLoginRedirectOpen, setIsLoginRedirectOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Route evaluator supporting both pathname (Vercel SPA) and hash routing
  const evaluateRoute = useCallback(() => {
    const rawPathname = window.location.pathname.toLowerCase().trim();
    // Strip trailing slashes
    const pathname = rawPathname.replace(/\/+$/, '') || '/';
    const rawHash = window.location.hash.toLowerCase().trim();
    const hash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;

    // 1. Root or /home pathname
    if (pathname === '/' || pathname === '/home' || pathname === '') {
      if (!hash || hash === '' || hash === '/' || hash === 'home') {
        setCurrentView('home');
        setAttemptedPath('');
        document.title = DEFAULT_PAGE_TITLE;
        return;
      }
      if (hash === 'blog' || hash.startsWith('blog/')) {
        setCurrentView('blog');
        setAttemptedPath('');
        document.title = 'Regulatory Insights & Tax Updates | Jha Accounting Solutions';
        return;
      }
      if (hash === 'analytics' || hash === 'admin/analytics') {
        setCurrentView('analytics');
        setAttemptedPath('');
        document.title = 'Practice Analytics | Jha Accounting Solutions';
        return;
      }
      if (hash === 'dashboard' || hash.startsWith('dashboard') || hash === 'client-portal') {
        setCurrentView('dashboard');
        setAttemptedPath('');
        document.title = 'Client Portal Desk | Jha Accounting Solutions';
        return;
      }
      if (hash === 'admin' || hash === 'admin-cms' || hash === 'cms') {
        setCurrentView('home');
        setAttemptedPath('');
        setIsAdminPortalOpen(true);
        return;
      }
      if (hash === 'setup' || hash.startsWith('setup')) {
        setCurrentView('setup');
        setAttemptedPath('');
        return;
      }
      if (KNOWN_SECTIONS.has(hash)) {
        setCurrentView('home');
        setAttemptedPath('');
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return;
      }
      // If user typed an unknown hash
      setCurrentView('404');
      setAttemptedPath(window.location.hash || '#unknown');
      document.title = '404: Page Not Found | Jha Accounting Solutions';
      return;
    }

    // 2. Direct pathnames
    if (pathname === '/blog' || pathname.startsWith('/blog/')) {
      setCurrentView('blog');
      setAttemptedPath('');
      document.title = 'Regulatory Insights & Tax Updates | Jha Accounting Solutions';
      return;
    }
    if (pathname === '/analytics' || pathname === '/admin/analytics') {
      setCurrentView('analytics');
      setAttemptedPath('');
      document.title = 'Practice Analytics | Jha Accounting Solutions';
      return;
    }
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard') || pathname === '/client-portal') {
      setCurrentView('dashboard');
      setAttemptedPath('');
      document.title = 'Client Portal Desk | Jha Accounting Solutions';
      return;
    }
    if (pathname === '/admin' || pathname === '/admin-cms' || pathname === '/cms') {
      setCurrentView('home');
      setAttemptedPath('');
      setIsAdminPortalOpen(true);
      return;
    }
    if (pathname === '/setup' || pathname.startsWith('/setup')) {
      setCurrentView('setup');
      setAttemptedPath('');
      return;
    }

    // 3. Any other pathname is a 404
    setCurrentView('404');
    setAttemptedPath(window.location.pathname + window.location.hash);
    document.title = '404: Page Not Found | Jha Accounting Solutions';
  }, []);

  useEffect(() => {
    // Firebase loads lazily after first paint — auth state still resolves
    // within the same tick for returning users, without blocking LCP.
    let unsubscribeAuth: () => void = () => {};
    let cancelled = false;
    (async () => {
      try {
        const [{ testFirestoreConnection, auth }, { onAuthStateChanged }] = await Promise.all([
          import('./lib/firebase'),
          import('firebase/auth')
        ]);
        if (cancelled) return;
        testFirestoreConnection();
        unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
        });
      } catch (err) {
        console.error('Deferred Firebase init failed:', err);
      }
    })();

    evaluateRoute();

    window.addEventListener('hashchange', evaluateRoute);
    window.addEventListener('popstate', evaluateRoute);

    return () => {
      cancelled = true;
      window.removeEventListener('hashchange', evaluateRoute);
      window.removeEventListener('popstate', evaluateRoute);
      unsubscribeAuth();
    };
  }, [evaluateRoute]);

  const handleNavigateHome = () => {
    if (window.location.pathname !== '/' && window.location.pathname !== '/home') {
      window.history.pushState(null, '', '/');
    }
    window.location.hash = '';
    setCurrentView('home');
    setAttemptedPath('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToSection = (sectionId: string) => {
    if (window.location.pathname !== '/' && window.location.pathname !== '/home') {
      window.history.pushState(null, '', `/#${sectionId}`);
    } else {
      window.location.hash = sectionId;
    }
    setCurrentView('home');
    setAttemptedPath('');

    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigate = (view: 'home' | 'blog' | 'analytics' | '404', sectionId?: string) => {
    if (view === 'home') {
      handleNavigateToSection(sectionId || '');
    } else if (view === 'blog') {
      if (window.location.pathname !== '/' && window.location.pathname !== '/home') {
        window.history.pushState(null, '', '/');
      }
      window.location.hash = 'blog';
      setCurrentView('blog');
      setAttemptedPath('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'analytics') {
      if (window.location.pathname !== '/' && window.location.pathname !== '/home') {
        window.history.pushState(null, '', '/');
      }
      window.location.hash = 'analytics';
      setCurrentView('analytics');
      setAttemptedPath('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === '404') {
      setCurrentView('404');
      setAttemptedPath(window.location.pathname + window.location.hash);
    }
  };

  const handleOpenBookingModal = (service?: string) => {
    setModalPreselectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleOpenAdminPortal = async () => {
    // If already authenticated as an authorized admin, open CMS software directly
    if (currentUser && isAuthorizedAdmin(currentUser.email)) {
      setIsAdminPortalOpen(true);
      return;
    }

    // Direct Google Login process immediately upon click
    try {
      const { signInWithGoogle, logOutUser } = await import('./lib/firebase');
      const user = await signInWithGoogle();
      if (!user) return;

      if (isAuthorizedAdmin(user.email)) {
        setAdminPortalError(undefined);
        setIsAdminPortalOpen(true);
      } else {
        await logOutUser();
        // No alert(): the denial is shown inside the portal modal's own
        // security-notice UI, and the message never enumerates the
        // authorized administrator accounts.
        setAdminPortalError(
          `Access Denied: the Google account "${user.email}" is not authorized for Admin CMS access.`
        );
        setIsAdminPortalOpen(true);
      }
    } catch (err: any) {
      console.error('Google Admin Sign In Error:', err);
      if (err?.code === 'auth/unauthorized-domain') {
        setAdminPortalError(
          'Firebase Domain Notice: this preview origin is not registered in Firebase Console (Authentication → Settings → Authorized Domains). Admin sign-in is available on the production domain.'
        );
      } else if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        setAdminPortalError('Authentication error. Please check your network and try again.');
      } else {
        setAdminPortalError(undefined);
      }
      setIsAdminPortalOpen(true);
    }
  };

  if (currentView === 'dashboard') {
    return (
      <>
        <SeoManager currentView={currentView} />
        <Suspense fallback={
          <div className="min-h-screen bg-[#070D1F] p-8 flex items-center justify-center">
            <Skeleton className="h-64 w-full max-w-xl rounded-2xl" />
          </div>
        }>
          <ClientDashboardPage />
        </Suspense>
      </>
    );
  }

  if (currentView === 'setup') {
    return (
      <>
        <SeoManager currentView={currentView} />
        <Suspense fallback={
          <div className="min-h-screen bg-[#0B1F3A] p-8 flex items-center justify-center">
            <Skeleton className="h-64 w-full max-w-xl rounded-2xl" />
          </div>
        }>
          <SetupPage />
        </Suspense>
      </>
    );
  }

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-white text-slate-700 flex flex-col font-sans selection:bg-[#10B981] selection:text-white pb-16 md:pb-0">
      {/* Dynamic SEO Meta Manager */}
      <SeoManager currentView={currentView} />
      
      {/* Compliance dates live in dedicated tabs now (Client Dashboard →
          Compliance Dates, Admin CMS → Compliance Dates). No forced splash,
          countdown banner or scroll-progress decoration on the public site. */}

      {/* Header Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenBookingModal={handleOpenBookingModal}
        onOpenAdminPortal={handleOpenAdminPortal}
        onOpenClientPortal={() => setIsLoginRedirectOpen(true)}
      />

      {/* Main View Body with Smooth Page Transition */}
      <main className="flex-grow">
        <PageTransition activeKey={currentView}>
          {currentView === 'home' && (
            <>
              {/* Hero Section */}
              <HeroSection
                onOpenBookingModal={handleOpenBookingModal}
                onExploreServices={() => handleNavigate('home', 'services')}
              />

              {/* Verified Practice Pillars Bar */}
              <StatsBar />

              {/* 4 Approved Services Section */}
              <ServicesSection
                onOpenBookingModal={handleOpenBookingModal}
              />

              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                {/* Structured Compliance Process Workflow */}
                <VirtualCfoSpotlight
                  onOpenBookingModal={handleOpenBookingModal}
                />

                {/* Sector Applicability */}
                <IndustriesAndOutsourcing
                  onOpenBookingModal={handleOpenBookingModal}
                />

                {/* Interactive India GST Map */}
                <IndiaGstMap
                  onOpenBookingModal={handleOpenBookingModal}
                />

                {/* Categorized Required Documents Checklist Helper */}
                <RequiredDocumentsSection
                  onOpenBookingModal={handleOpenBookingModal}
                />

                {/* GST Calculator & Compliance Calendar */}
                <FreeToolsSection
                  onOpenBookingModal={handleOpenBookingModal}
                />

                {/* Professional Standards, FAQ Accordion, Final CTA & Contact Form */}
                <TestimonialsCtaFaqContact
                  onOpenBookingModal={handleOpenBookingModal}
                />
              </Suspense>
            </>
          )}

          {currentView === 'blog' && (
            <Suspense fallback={
              <div className="max-w-[1200px] mx-auto p-12 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            }>
              <BlogInsightsEngine
                onOpenBookingModal={handleOpenBookingModal}
              />
            </Suspense>
          )}

          {currentView === 'analytics' && (
            <Suspense fallback={
              <div className="max-w-[1200px] mx-auto p-12 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            }>
              <AnalyticsDashboard />
            </Suspense>
          )}

          {currentView === '404' && (
            <Suspense fallback={
              <div className="max-w-[1200px] mx-auto p-12 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            }>
              <NotFoundPage
                attemptedPath={attemptedPath}
                onNavigateHome={handleNavigateHome}
                onNavigateToSection={handleNavigateToSection}
                onNavigateToBlog={() => handleNavigate('blog')}
                onOpenBookingModal={handleOpenBookingModal}
              />
            </Suspense>
          )}
        </PageTransition>
      </main>

      {/* 4-Column Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBookingModal={handleOpenBookingModal}
        onOpenClientPortal={() => setIsLoginRedirectOpen(true)}
        onOpenAdminPortal={handleOpenAdminPortal}
      />

      {/* Consultation Modal (lazy — mounted only when opened) */}
      {isBookingModalOpen && (
        <Suspense fallback={null}>
          <ContactConsultationModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            preselectedService={modalPreselectedService}
          />
        </Suspense>
      )}

      {/* Admin CMS (lazy). Denial/domain errors are rendered by the modal's
          own security-notice UI — never window.alert(), and never listing
          the authorized admin accounts in public copy. */}
      {isAdminPortalOpen && (
        <Suspense fallback={null}>
          <AdminPortalModal
            isOpen={isAdminPortalOpen}
            initialError={adminPortalError}
            onClose={() => {
              setIsAdminPortalOpen(false);
              setAdminPortalError(undefined);
            }}
          />
        </Suspense>
      )}

      {/* Client Login Redirect (lazy) */}
      {isLoginRedirectOpen && (
        <Suspense fallback={null}>
          <LoginRedirectModal
            isOpen={isLoginRedirectOpen}
            onClose={() => setIsLoginRedirectOpen(false)}
          />
        </Suspense>
      )}

      {/* Floating Back-to-Top Button */}
      <BackToTopButton />

      {/* Non-critical floating UI (lazy chunks, fetched after first paint) */}
      <Suspense fallback={null}>
        <PushNotificationManager />
        <WhatsAppFloatingWidget />
        <MobileBottomBar
          onOpenBookingModal={handleOpenBookingModal}
          onOpenClientPortal={() => setIsLoginRedirectOpen(true)}
          onOpenAdminPortal={handleOpenAdminPortal}
          onNavigateToSection={handleNavigateToSection}
        />
      </Suspense>

    </div>
  );
}

export default App;
