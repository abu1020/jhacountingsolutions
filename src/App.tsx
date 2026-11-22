/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
// Modals & floating widgets are interaction-triggered: code-split them out
// of the initial bundle (fetched on first open / after first paint).
const ContactConsultationModal = lazy(() => import('./components/ContactConsultationModal').then(m => ({ default: m.ContactConsultationModal })));
const AdminPortalModal = lazy(() => import('./components/AdminPortalModal').then(m => ({ default: m.AdminPortalModal })));
const LoginRedirectModal = lazy(() => import('./components/LoginRedirectModal').then(m => ({ default: m.LoginRedirectModal })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const WhatsAppFloatingWidget = lazy(() => import('./components/WhatsAppFloatingWidget').then(m => ({ default: m.WhatsAppFloatingWidget })));
const MobileBottomBar = lazy(() => import('./components/MobileBottomBar').then(m => ({ default: m.MobileBottomBar })));
import { Footer } from './components/Footer';
import { PageTransition } from './components/PageTransition';
import { Skeleton } from './components/SkeletonLoader';
import { SeoManager } from './components/SeoManager';
import { BackToTopButton } from './components/BackToTopButton';
import { SectionErrorBoundary } from './components/SectionErrorBoundary';
// Firebase is dynamically imported (below) so ~150 kB gzip stays off the critical path.
import { isAuthorizedAdmin } from './types/admin';
import { useAuth } from './context/AuthContext';

// Lazy loaded secondary views for instant initial bundle loading
const BlogInsightsEngine = lazy(() =>
  import('./components/BlogInsightsEngine').then(m => ({ default: m.BlogInsightsEngine }))
);
const AnalyticsDashboard = lazy(() =>
  import('./components/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard }))
);
const VirtualCfoSpotlight = lazy(() => import('./components/VirtualCfoSpotlight').then(m => ({ default: m.VirtualCfoSpotlight })));
const TestimonialsCarousel = lazy(() => import('./components/TestimonialsCarousel').then(m => ({ default: m.TestimonialsCarousel })));
const SupportingTools = lazy(() => import('./components/SupportingTools').then(m => ({ default: m.SupportingTools })));
const ContactFormAndOffices = lazy(() => import('./components/ContactFormAndOffices').then(m => ({ default: m.ContactFormAndOffices })));
const SupportingResources = lazy(() => import('./components/SupportingResources').then(m => ({ default: m.SupportingResources })));

type ViewType = 'home' | 'blog' | 'analytics' | '404';

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
  // Reuse the existing provider's auth subscription instead of opening another listener.
  const { user: currentUser } = useAuth();

  const pendingScroll = useRef<(() => void) | null>(null);
  const scrollToSection = useCallback((id: string) => {
    pendingScroll.current?.();
    const target = id === 'documents' ? 'required-documents' : id;
    let observer: MutationObserver | undefined;
    let timer: number | undefined;
    const cleanup = () => { observer?.disconnect(); if (timer) window.clearTimeout(timer); pendingScroll.current = null; };
    const findAndScroll = () => {
      const element = document.getElementById(target);
      if (!element) return false;
      cleanup();
      element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      return true;
    };
    if (findAndScroll()) return;
    observer = new MutationObserver(findAndScroll);
    observer.observe(document.body, { childList: true, subtree: true });
    timer = window.setTimeout(cleanup, 5000);
    pendingScroll.current = cleanup;
  }, []);

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
      if (hash === 'dashboard' || hash.startsWith('dashboard') || hash === 'client-portal' || hash === 'setup' || hash.startsWith('setup')) {
        setCurrentView('home');
        setAttemptedPath('');
        setIsLoginRedirectOpen(true);
        document.title = DEFAULT_PAGE_TITLE;
        return;
      }
      if (hash === 'admin' || hash === 'admin-cms' || hash === 'cms') {
        setCurrentView('home');
        setAttemptedPath('');
        setIsAdminPortalOpen(true);
        return;
      }
      if (KNOWN_SECTIONS.has(hash)) {
        setCurrentView('home');
        setAttemptedPath('');
        scrollToSection(hash);
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
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard') || pathname === '/client-portal' || pathname === '/setup' || pathname.startsWith('/setup')) {
      setCurrentView('home');
      setAttemptedPath('');
      setIsLoginRedirectOpen(true);
      document.title = DEFAULT_PAGE_TITLE;
      return;
    }
    if (pathname === '/admin' || pathname === '/admin-cms' || pathname === '/cms') {
      setCurrentView('home');
      setAttemptedPath('');
      setIsAdminPortalOpen(true);
      return;
    }

    // 3. Any other pathname is a 404
    setCurrentView('404');
    setAttemptedPath(window.location.pathname + window.location.hash);
    document.title = '404: Page Not Found | Jha Accounting Solutions';
  }, [scrollToSection]);

  useEffect(() => {
    evaluateRoute();

    window.addEventListener('hashchange', evaluateRoute);
    window.addEventListener('popstate', evaluateRoute);

    return () => {
      window.removeEventListener('hashchange', evaluateRoute);
      window.removeEventListener('popstate', evaluateRoute);
      pendingScroll.current?.();
    };
  }, [evaluateRoute]);

  const handleNavigateHome = () => {
    if (window.location.pathname !== '/' && window.location.pathname !== '/home') {
      window.history.pushState(null, '', '/');
    }
    window.location.hash = '';
    setCurrentView('home');
    setAttemptedPath('');
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  const handleNavigateToSection = (sectionId: string) => {
    if (window.location.pathname !== '/' && window.location.pathname !== '/home') {
      window.history.pushState(null, '', `/#${sectionId}`);
    } else if (window.location.hash === `#${sectionId}`) {
      // Reopen a supporting resource even when its hash is already selected.
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      window.location.hash = sectionId;
    }
    setCurrentView('home');
    setAttemptedPath('');

    if (sectionId) {
      scrollToSection(sectionId);
    } else {
      pendingScroll.current?.();
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
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
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } else if (view === 'analytics') {
      if (window.location.pathname !== '/' && window.location.pathname !== '/home') {
        window.history.pushState(null, '', '/');
      }
      window.location.hash = 'analytics';
      setCurrentView('analytics');
      setAttemptedPath('');
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } else if (view === '404') {
      setCurrentView('404');
      setAttemptedPath(window.location.pathname + window.location.hash);
    }
  };

  const handleOpenBookingModal = (service?: string) => {
    setModalPreselectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleOpenAdminPortal = () => {
    if (currentUser && !isAuthorizedAdmin(currentUser.email)) {
      setAdminPortalError('Access Denied: This email address is not authorized for Admin CMS access.');
    } else {
      setAdminPortalError(undefined);
    }
    setIsAdminPortalOpen(true);
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-white text-slate-700 flex flex-col font-sans selection:bg-brand-teal selection:text-white pb-16 md:pb-0">
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


              {/* 4 Approved Services Section */}
              <ServicesSection
                onOpenBookingModal={handleOpenBookingModal}
              />

              {/* Independent boundaries prevent one slow section delaying the rest. */}
              <SectionErrorBoundary><Suspense fallback={<Skeleton className="h-64 w-full" />}><TestimonialsCarousel /></Suspense></SectionErrorBoundary>
              <SectionErrorBoundary><Suspense fallback={<Skeleton className="h-64 w-full" />}><VirtualCfoSpotlight onOpenBookingModal={handleOpenBookingModal} /></Suspense></SectionErrorBoundary>
              <SectionErrorBoundary><Suspense fallback={<Skeleton className="h-64 w-full" />}><SupportingTools onOpenBookingModal={handleOpenBookingModal} /></Suspense></SectionErrorBoundary>
              <SectionErrorBoundary><Suspense fallback={<Skeleton className="h-64 w-full" />}><ContactFormAndOffices onOpenBookingModal={handleOpenBookingModal} /></Suspense></SectionErrorBoundary>
              <SectionErrorBoundary><Suspense fallback={<Skeleton className="h-64 w-full" />}><SupportingResources onOpenBookingModal={handleOpenBookingModal} /></Suspense></SectionErrorBoundary>
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
                onOpenClientPortal={() => setIsLoginRedirectOpen(true)}
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
