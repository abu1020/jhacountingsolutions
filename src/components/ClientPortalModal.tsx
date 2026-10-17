import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User as UserIcon,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Receipt,
  FileCheck,
  TrendingUp,
  Building,
  Layers,
  Clock,
  MessageSquare,
  Edit3,
  LogOut,
  UploadCloud,
  ChevronRight,
  Calendar,
  Check
} from 'lucide-react';
import { User } from 'firebase/auth';
import { auth, getUserProfile, saveUserProfile, saveInquiry, logOutUser } from '../lib/firebase';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onOpenBookingModal: (service?: string) => void;
}

const SERVICE_OPTIONS = [
  {
    id: 'gst',
    title: 'GST Compliance & GSTR-2B Recovery',
    desc: 'Monthly GSTR-1, 3B filings, vendor 2B matching & notice replies.',
    icon: FileCheck,
    badge: '100% Zero Penalty'
  },
  {
    id: 'bookkeeping',
    title: 'Corporate Accounting & Cloud Bookkeeping',
    desc: 'Daily ledger posting on Tally/Zoho, bank reconciliations & P&L statements.',
    icon: Receipt,
    badge: 'Audit-Ready Ledgers'
  },
  {
    id: 'payroll',
    title: 'TDS Returns & Statutory Payroll',
    desc: 'Confidential salary processing, EPF/ESIC filings & quarterly 24Q/26Q returns.',
    icon: Layers,
    badge: 'Penalty-Free SLA'
  },
  {
    id: 'cfo',
    title: 'Virtual CFO & Strategic Advisory',
    desc: '13-week rolling runway forecasts, Board MIS decks & investor diligence support.',
    icon: TrendingUp,
    badge: 'Executive Advisory'
  },
  {
    id: 'incorporation',
    title: 'Company Incorporation & Corporate Setup',
    desc: 'Pvt Ltd / LLP incorporation, MCA filings & free GST registration.',
    icon: Building,
    badge: 'Fast Incorporation'
  }
];

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenBookingModal
}) => {
  // Onboarding Step State: 1 = Name, 2 = Phone, 3 = Email, 4 = Service Wanted, 0 = Completed (Show Dashboard)
  const [step, setStep] = useState<number>(1);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

  // Form Fields
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [desiredService, setDesiredService] = useState<string>(SERVICE_OPTIONS[0].title);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Load user profile on open or user change
  useEffect(() => {
    async function loadProfile() {
      if (!currentUser) {
        setIsLoadingProfile(false);
        return;
      }
      setIsLoadingProfile(true);
      const profile = await getUserProfile(currentUser.uid);
      
      if (profile && profile.onboardingCompleted) {
        setName(profile.name || profile.displayName || currentUser.displayName || '');
        setPhone(profile.phone || '');
        setEmail(profile.email || currentUser.email || '');
        setDesiredService(profile.desiredService || SERVICE_OPTIONS[0].title);
        setStep(0); // Jump directly to Dashboard!
      } else {
        // First-time login: initialize defaults & start Step 1
        setName(currentUser.displayName || '');
        setEmail(currentUser.email || '');
        setStep(1);
      }
      setIsLoadingProfile(false);
    }

    if (isOpen && currentUser) {
      loadProfile();
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  // Step Handlers
  const handleNextToPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep(2);
  };

  const handleNextToEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setStep(3);
  };

  const handleNextToService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStep(4);
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save Profile in Firestore
      await saveUserProfile(currentUser.uid, {
        name,
        displayName: name,
        phone,
        email,
        desiredService,
        onboardingCompleted: true
      });

      // 2. Save automatic consultation inquiry in Firestore for Admin
      await saveInquiry({
        fullName: name,
        company: 'Client Portal User',
        email,
        phone,
        service: desiredService,
        message: `Client completed first-time login onboarding for ${desiredService}.`
      });

      setIsSubmitting(false);
      setIsEditingProfile(false);
      setStep(0); // Jump directly into Client Dashboard!
    } catch (err) {
      console.error('Error saving onboarding data:', err);
      setIsSubmitting(false);
      setStep(0);
    }
  };

  const handleSignOut = async () => {
    await logOutUser();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto select-none">
      {/* Dim backdrop */}
      <div
        className="fixed inset-0 bg-[#070D1F]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#0A1128] text-slate-100 rounded-3xl shadow-2xl border border-[#1E2B52] w-full max-w-3xl overflow-hidden z-10 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0D1838] via-[#0A1128] to-[#0D1838] border-b border-[#1E2B52] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                Jha Accounting Solutions
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-none mt-0.5">
                {step === 0 ? 'Client Accounting Dashboard' : 'Client Onboarding Setup'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSignOut}
              className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-white/5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Close portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingProfile ? (
          <div className="p-12 text-center text-slate-400 font-mono text-xs animate-pulse">
            Loading your profile and accounting dashboard...
          </div>
        ) : (
          <div>
            {/* FIRST TIME ONBOARDING FLOW (STEP 1 - 4) */}
            {step > 0 && !isEditingProfile && (
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Onboarding Progress Indicator */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-emerald-400 font-bold uppercase">First-Time Setup</span>
                  </div>
                  <span className="text-slate-400">Step {step} of 4</span>
                </div>

                {/* STEP 1: ASK NAME */}
                {step === 1 && (
                  <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleNextToPhone}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-mono font-bold uppercase tracking-wider inline-block">
                        Step 1: Your Identity
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        What is your Full Name?
                      </h4>
                      <p className="text-xs text-slate-400">
                        Please enter your full legal or corporate name so we can address your accounting file correctly.
                      </p>
                    </div>

                    <div className="relative">
                      <UserIcon className="w-5 h-5 text-emerald-400 absolute left-4 top-3.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Amit Sharma or Apex Pvt Ltd"
                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!name.trim()}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      <span>Next: Enter Phone Number</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.form>
                )}

                {/* STEP 2: ASK PHONE NO */}
                {step === 2 && (
                  <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleNextToEmail}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-mono font-bold uppercase tracking-wider inline-block">
                        Step 2: Direct Contact
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        What is your Phone Number?
                      </h4>
                      <p className="text-xs text-slate-400">
                        We use this to connect your dedicated lead tax consultant on WhatsApp for instant updates.
                      </p>
                    </div>

                    <div className="relative">
                      <Phone className="w-5 h-5 text-emerald-400 absolute left-4 top-3.5" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                        autoFocus
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={!phone.trim()}
                        className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        <span>Next: Enter Email Address</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* STEP 3: ASK EMAIL ID */}
                {step === 3 && (
                  <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleNextToService}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-mono font-bold uppercase tracking-wider inline-block">
                        Step 3: Official Correspondence
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        What is your Email ID?
                      </h4>
                      <p className="text-xs text-slate-400">
                        Official tax statements, monthly P&amp;L reports, and GST acknowledgements will be sent here.
                      </p>
                    </div>

                    <div className="relative">
                      <Mail className="w-5 h-5 text-emerald-400 absolute left-4 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. contact@yourfirm.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                        autoFocus
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={!email.trim()}
                        className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        <span>Next: Select Desired Service</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* STEP 4: ASK WHAT SERVICE THEY WANTED */}
                {step === 4 && (
                  <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleCompleteOnboarding}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-mono font-bold uppercase tracking-wider inline-block">
                        Step 4: Primary Service Requirement
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        What service are you looking for?
                      </h4>
                      <p className="text-xs text-slate-400">
                        Select your primary focus area so we can customize your client dashboard and partner assignment.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 max-h-[40vh] overflow-y-auto pr-1">
                      {SERVICE_OPTIONS.map((srv) => {
                        const IconComp = srv.icon;
                        const isSelected = desiredService === srv.title;
                        return (
                          <button
                            key={srv.id}
                            type="button"
                            onClick={() => setDesiredService(srv.title)}
                            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-emerald-950/90 border-emerald-500 text-white shadow-md'
                                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400'}`}>
                                <IconComp className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="font-bold text-xs sm:text-sm text-white">{srv.title}</h5>
                                <p className="text-[11px] text-slate-400 leading-snug">{srv.desc}</p>
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              <span className="text-[9px] font-mono uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 hidden sm:inline-block">
                                {srv.badge}
                              </span>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700'}`}>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>Setting Up Dashboard...</span>
                        ) : (
                          <>
                            <span>Complete Onboarding &amp; Enter Dashboard</span>
                            <Sparkles className="w-4 h-4 text-emerald-300" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}

              </div>
            )}

            {/* MAIN CLIENT DASHBOARD VIEW (STEP 0) */}
            {step === 0 && (
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Greeting & Active Service Banner */}
                <div className="bg-gradient-to-r from-[#0D1838] via-[#111C3D] to-[#0D1838] p-5 sm:p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                        Client Account Active
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ID: {currentUser.uid.slice(0, 8)}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Welcome back, {name || 'Valued Client'} 👋
                    </h2>
                    <p className="text-xs text-slate-300">
                      Your files are managed under our guaranteed <span className="text-emerald-400 font-semibold font-mono">24-Hour Query Response SLA</span>.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-start md:self-center"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile Details</span>
                  </button>
                </div>

                {/* 3-Grid Quick Account Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Card 1: Selected Primary Service */}
                  <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Primary Service</span>
                      <Receipt className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-sm font-bold text-white leading-snug">
                      {desiredService}
                    </p>
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Dedicated Pod Allocated</span>
                    </div>
                  </div>

                  {/* Card 2: Contact Records */}
                  <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Account Info</span>
                      <UserIcon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xs space-y-0.5 font-mono">
                      <p className="text-white font-bold truncate">{name}</p>
                      <p className="text-slate-400 truncate">{phone || 'No phone set'}</p>
                      <p className="text-slate-400 truncate">{email}</p>
                    </div>
                  </div>

                  {/* Card 3: Lead Consultant */}
                  <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Lead Tax Partner</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-sm font-bold text-white">
                      Rishi Jha
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      GST &amp; Tax Consultant
                    </p>
                  </div>

                </div>

                {/* Service Execution Workflow Steps */}
                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                      Monthly Accounting &amp; Compliance Cadence
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      Live Status Tracker
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-emerald-400 font-mono text-[10px] font-bold">
                        <span>STEP 01</span>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-white block">Account Onboarding</span>
                      <p className="text-[11px] text-slate-300">Contact details and service requirements captured.</p>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-amber-400 font-mono text-[10px] font-bold">
                        <span>STEP 02</span>
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-white block">Document Review</span>
                      <p className="text-[11px] text-slate-400">Ledger vouchers, GSTR-2B purchase &amp; bank feeds sync.</p>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-slate-400 font-mono text-[10px] font-bold">
                        <span>STEP 03</span>
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-white block">Filing &amp; Closing</span>
                      <p className="text-[11px] text-slate-400">GSTR-1, 3B, TDS return submission &amp; P&amp;L closure.</p>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <a
                    href={`https://wa.me/918882860226?text=${encodeURIComponent(`Hello Jha Accounting Team, I am ${name} (${email}, ${phone}). I am logged in to the Client Portal for ${desiredService} and would like to discuss my accounting documents.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Connect with Lead Consultant on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenBookingModal(desiredService);
                    }}
                    className="w-full sm:w-auto py-3 px-5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Book Custom Scope Consultation</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-[#0D1838] border-t border-[#1E2B52] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Client Desk · Jha Accounting Solutions</span>
          <button onClick={onClose} className="text-emerald-400 font-bold hover:underline">
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
};
