/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { ComplianceDeadlineBanner } from './components/ComplianceDeadlineBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsBar } from './components/StatsBar';
import { ServicesSection } from './components/ServicesSection';
import { ContactConsultationModal } from './components/ContactConsultationModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { ClientPortalModal } from './components/ClientPortalModal';
import { PushNotificationManager } from './components/PushNotificationManager';
import { WhatsAppFloatingWidget } from './components/WhatsAppFloatingWidget';
import { Footer } from './components/Footer';
import { PageTransition } from './components/PageTransition';
import { Skeleton } from './components/SkeletonLoader';
import { NotFoundPage } from './components/NotFoundPage';
import { SeoManager } from './components/SeoManager';
import { LoginRedirectModal } from './components/LoginRedirectModal';
import { BackToTopButton } from './components/BackToTopButton';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { testFirestoreConnection, auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

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
const FreeToolsSection = lazy(() => import('./components/FreeToolsSection').then(m => ({ default: m.FreeToolsSection })));
const TestimonialsCtaFaqContact = lazy(() => import('./components/TestimonialsCtaFaqContact').then(m => ({ default: m.TestimonialsCtaFaqContact })));

type ViewType = 'home' | 'blog' | 'analytics' | 'dashboard' | 'setup' | '404';

// Registered home page section anchor IDs
const KNOWN_SECTIONS = new Set([
  'services',
  'process',
  'industries',
  'gst-map',
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
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
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
    // Validate connection to Firestore on initial boot
    testFirestoreConnection();

    // Listen to Auth State
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    evaluateRoute();

    window.addEventListener('hashchange', evaluateRoute);
    window.addEventListener('popstate', evaluateRoute);

    return () => {
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
    <div className="min-h-screen max-w-full overflow-x-hidden bg-white text-slate-700 flex flex-col font-sans selection:bg-[#10B981] selection:text-white">
      {/* Dynamic SEO Meta Manager */}
      <SeoManager currentView={currentView} />
      
      {/* Splash Screen */}
      <SplashScreen />

      {/* Statutory Compliance Deadline Countdown Banner */}
      <ComplianceDeadlineBanner
        onOpenBookingModal={handleOpenBookingModal}
      />

      {/* Reading Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* Header Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenBookingModal={handleOpenBookingModal}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
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
            <NotFoundPage
              attemptedPath={attemptedPath}
              onNavigateHome={handleNavigateHome}
              onNavigateToSection={handleNavigateToSection}
              onNavigateToBlog={() => handleNavigate('blog')}
              onOpenBookingModal={handleOpenBookingModal}
            />
          )}
        </PageTransition>
      </main>

      {/* 4-Column Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBookingModal={handleOpenBookingModal}
        onOpenClientPortal={() => setIsLoginRedirectOpen(true)}
      />

      {/* Consultation Modal */}
      <ContactConsultationModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedService={modalPreselectedService}
      />

      {/* Admin Control Desk Modal */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />

      {/* Client Portal Onboarding & Dashboard Modal */}
      <ClientPortalModal
        isOpen={isClientPortalOpen}
        onClose={() => setIsClientPortalOpen(false)}
        currentUser={currentUser}
        onOpenBookingModal={handleOpenBookingModal}
      />

      {/* Client Login Security Handshake & Redirection Gateway Animation */}
      <LoginRedirectModal
        isOpen={isLoginRedirectOpen}
        onClose={() => setIsLoginRedirectOpen(false)}
      />

      {/* Floating Back-to-Top Button */}
      <BackToTopButton />

      {/* PWA / Web Push Notification Manager */}
      <PushNotificationManager />

      {/* Floating WhatsApp Launcher */}
      <WhatsAppFloatingWidget />

    </div>
  );
}

export default App;
