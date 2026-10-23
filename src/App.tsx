/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
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
import { testFirestoreConnection, auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// Lazy loaded secondary views
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
const ServiceComparisonTable = lazy(() => import('./components/ServiceComparisonTable').then(m => ({ default: m.ServiceComparisonTable })));
const IndiaGstMap = lazy(() => import('./components/IndiaGstMap').then(m => ({ default: m.IndiaGstMap })));
const FreeToolsSection = lazy(() => import('./components/FreeToolsSection').then(m => ({ default: m.FreeToolsSection })));
const TestimonialsCtaFaqContact = lazy(() => import('./components/TestimonialsCtaFaqContact').then(m => ({ default: m.TestimonialsCtaFaqContact })));


export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'blog' | 'analytics' | 'dashboard' | 'setup'>('home');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalPreselectedService, setModalPreselectedService] = useState<string | undefined>(undefined);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Validate connection to Firestore on initial boot
    testFirestoreConnection();

    // Listen to Auth State
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Hash routing support (#blog, #analytics, #dashboard, #setup)
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#blog' || hash.startsWith('#blog/')) {
        setCurrentView('blog');
      } else if (hash === '#analytics' || hash === '#admin/analytics') {
        setCurrentView('analytics');
      } else if (hash === '#dashboard' || hash.startsWith('#dashboard')) {
        setCurrentView('dashboard');
      } else if (hash === '#setup' || hash.startsWith('#setup')) {
        setCurrentView('setup');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      unsubscribeAuth();
    };
  }, []);

  const handleNavigate = (view: 'home' | 'blog' | 'analytics', sectionId?: string) => {
    setCurrentView(view);

    if (view === 'blog') {
      window.location.hash = 'blog';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'analytics') {
      window.location.hash = 'analytics';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '';
      if (sectionId) {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleOpenBookingModal = (service?: string) => {
    setModalPreselectedService(service);
    setIsBookingModalOpen(true);
  };

  if (currentView === 'dashboard') {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-[#070D1F] p-8 flex items-center justify-center">
          <Skeleton className="h-64 w-full max-w-xl rounded-2xl" />
        </div>
      }>
        <ClientDashboardPage />
      </Suspense>
    );
  }

  if (currentView === 'setup') {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-[#0B1F3A] p-8 flex items-center justify-center">
          <Skeleton className="h-64 w-full max-w-xl rounded-2xl" />
        </div>
      }>
        <SetupPage />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-700 flex flex-col font-sans selection:bg-[#10B981] selection:text-white">
      
      {/* Premium 1.8s Splash Screen (Once per page load, max 2.0s safeguard) */}
      <SplashScreen />

      {/* Urgent Statutory Compliance Deadline Countdown Banner */}
      <ComplianceDeadlineBanner
        onOpenBookingModal={handleOpenBookingModal}
      />

      {/* Sticky Glassmorphic Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenBookingModal={handleOpenBookingModal}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        onOpenClientPortal={() => setIsClientPortalOpen(true)}
      />

      {/* Main View Body with 300ms GPU Page Transition */}
      <main className="flex-grow">
        <PageTransition activeKey={currentView}>
          {currentView === 'home' && (
            <>
              {/* High-Impact Hero Section */}
              <HeroSection
                onOpenBookingModal={handleOpenBookingModal}
                onExploreServices={() => handleNavigate('home', 'services')}
              />

              {/* Stats Bar with 4 Animated Counters */}
              <StatsBar />

              {/* 6-Card Services Section */}
              <ServicesSection
                onOpenBookingModal={handleOpenBookingModal}
              />

              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                {/* Virtual CFO Spotlight Section & How We Work */}
                <VirtualCfoSpotlight
                  onOpenBookingModal={handleOpenBookingModal}
                />

                {/* Industries We Serve & White-Label CA Section */}
                <IndustriesAndOutsourcing
                  onOpenBookingModal={handleOpenBookingModal}
                />

                {/* Service Comparison Matrix */}
                <ServiceComparisonTable
                  onOpenBookingModal={handleOpenBookingModal}
                />

                {/* Interactive India GST Map */}
                <IndiaGstMap
                  onOpenBookingModal={handleOpenBookingModal}
                />

                {/* Free GST Calculator & Compliance Calendar */}
                <FreeToolsSection
                  onOpenBookingModal={handleOpenBookingModal}
                />

                {/* Testimonials, FAQ Accordion, Final CTA & Contact Section */}
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
        </PageTransition>
      </main>

      {/* 4-Column Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBookingModal={handleOpenBookingModal}
        onOpenClientPortal={() => setIsClientPortalOpen(true)}
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

      {/* PWA / Web Push Notification Manager */}
      <PushNotificationManager />

      {/* Floating WhatsApp Launcher */}
      <WhatsAppFloatingWidget />

    </div>
  );
}

export default App;
