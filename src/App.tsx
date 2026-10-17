/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WebsiteLoader } from './components/WebsiteLoader';
import { ComplianceDeadlineBanner } from './components/ComplianceDeadlineBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InteractiveServices } from './components/InteractiveServices';
import { ServiceComparisonTable } from './components/ServiceComparisonTable';
import { IndiaGstMap } from './components/IndiaGstMap';
import { Calculators } from './components/Calculators';
import { TaxCalendar } from './components/TaxCalendar';
import { TrustProof } from './components/TrustProof';
import { FAQSection } from './components/FAQSection';
import { BlogInsightsEngine } from './components/BlogInsightsEngine';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ContactConsultationModal } from './components/ContactConsultationModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { ClientPortalModal } from './components/ClientPortalModal';
import { PushNotificationManager } from './components/PushNotificationManager';
import { WhatsAppFloatingWidget } from './components/WhatsAppFloatingWidget';
import { Footer } from './components/Footer';
import { testFirestoreConnection, auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'blog' | 'analytics'>('home');
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

    // Basic hash routing support (#blog, #analytics)
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#blog' || hash.startsWith('#blog/')) {
        setCurrentView('blog');
      } else if (hash === '#analytics' || hash === '#admin/analytics') {
        setCurrentView('analytics');
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Executive Initial Website Loading Screen */}
      <WebsiteLoader />

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

      {/* Main View Body */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            {/* High-Impact Hero Section */}
            <HeroSection
              onOpenBookingModal={handleOpenBookingModal}
              onExploreServices={() => handleNavigate('home', 'services')}
            />

            {/* Interactive Services Grid */}
            <InteractiveServices
              onOpenBookingModal={handleOpenBookingModal}
            />

            {/* Service Comparison Matrix: Standard vs Virtual CFO */}
            <ServiceComparisonTable
              onOpenBookingModal={handleOpenBookingModal}
            />

            {/* Calculators, Interactive India GST Map & Statutory Tools */}
            <section id="solutions" className="bg-slate-50">
              <IndiaGstMap
                onOpenBookingModal={handleOpenBookingModal}
              />

              <div className="py-16">
                <Calculators
                  onOpenScopeModal={handleOpenBookingModal}
                />
              </div>
            </section>

            {/* Statutory Compliance Calendar */}
            <TaxCalendar
              onOpenScopeModal={handleOpenBookingModal}
            />

            {/* Social Proof & Outcomes */}
            <TrustProof
              onOpenBookingModal={handleOpenBookingModal}
            />

            {/* Knowledge Base & Searchable FAQ Section */}
            <FAQSection
              onOpenBookingModal={handleOpenBookingModal}
            />
          </>
        )}

        {currentView === 'blog' && (
          <BlogInsightsEngine
            onOpenBookingModal={handleOpenBookingModal}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsDashboard />
        )}
      </main>

      {/* Deep Navy Slate Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBookingModal={handleOpenBookingModal}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
      />

      {/* Intuitive Multi-Step Contact & Lead Capture Modal */}
      <ContactConsultationModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedService={modalPreselectedService}
      />

      {/* Executive Admin Portal & Lead Management Desk Modal */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />

      {/* Interactive First-Time Client Onboarding & Dashboard Portal */}
      <ClientPortalModal
        isOpen={isClientPortalOpen}
        onClose={() => setIsClientPortalOpen(false)}
        currentUser={currentUser}
        onOpenBookingModal={handleOpenBookingModal}
      />

      {/* Web Push Notification Opt-In Banner & Preference Manager */}
      <PushNotificationManager />

      {/* Floating Priority WhatsApp Quick-Chat Trigger */}
      <WhatsAppFloatingWidget />

    </div>
  );
}

export default App;
