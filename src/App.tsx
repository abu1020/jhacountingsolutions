/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WebsiteLoader } from './components/WebsiteLoader';
import { ComplianceDeadlineBanner } from './components/ComplianceDeadlineBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsBar } from './components/StatsBar';
import { ServicesSection } from './components/ServicesSection';
import { VirtualCfoSpotlight } from './components/VirtualCfoSpotlight';
import { IndustriesAndOutsourcing } from './components/IndustriesAndOutsourcing';
import { ServiceComparisonTable } from './components/ServiceComparisonTable';
import { IndiaGstMap } from './components/IndiaGstMap';
import { FreeToolsSection } from './components/FreeToolsSection';
import { Calculators } from './components/Calculators';
import { TaxCalendar } from './components/TaxCalendar';
import { TrustProof } from './components/TrustProof';
import { FAQSection } from './components/FAQSection';
import { TestimonialsCtaFaqContact } from './components/TestimonialsCtaFaqContact';
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
    <div className="min-h-screen bg-white text-slate-700 flex flex-col font-sans selection:bg-[#10B981] selection:text-white">
      
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

            {/* Stats Bar with 4 Animated Counters */}
            <StatsBar />

            {/* 6-Card Services Section with Hover Lift & Learn More */}
            <ServicesSection
              onOpenBookingModal={handleOpenBookingModal}
            />

            {/* Virtual CFO Spotlight Section & How We Work Section */}
            <VirtualCfoSpotlight
              onOpenBookingModal={handleOpenBookingModal}
            />

            {/* Industries We Serve Grid & White-Label CA Outsourcing Section */}
            <IndustriesAndOutsourcing
              onOpenBookingModal={handleOpenBookingModal}
            />

            {/* Service Comparison Matrix: Standard vs Virtual CFO */}
            <ServiceComparisonTable
              onOpenBookingModal={handleOpenBookingModal}
            />

            {/* Interactive India GST Map */}
            <IndiaGstMap
              onOpenBookingModal={handleOpenBookingModal}
            />

            {/* Free GST Calculator & Compliance Calendar Section */}
            <FreeToolsSection
              onOpenBookingModal={handleOpenBookingModal}
            />

            {/* Testimonials, FAQ Accordion, Final CTA Banner & Contact Section with 4 Office Addresses */}
            <TestimonialsCtaFaqContact
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
        onOpenClientPortal={() => setIsClientPortalOpen(true)}
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
